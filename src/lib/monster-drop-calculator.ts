import { adjustedNoDrop, qualityChance, type DropData, type DropItem, type DropSettings, type DropSource } from './drop-calculator';

export interface MonsterDropRow {
  id: string; nameKey: string; code: string; quality: string;
  chance: number; expected: number; count: number; successfulKills: number;
}
export interface MonsterDropReport {
  rows: MonsterDropRow[]; kills: number; seed: number; simulated: boolean;
  totalDrops: number; emptyKills: number; treasureClass: string;
}
type Node = { id: number; picks: number; ordered: boolean; entries: { node: Node; weight: number }[]; noDrop: number; outcomes?: { id: string; weight: number }[] };
const lower = (s: string) => s.toLowerCase();
const integer = (n: number, min: number, max: number) => Math.max(min, Math.min(max, Number.isFinite(n) ? Math.trunc(n) : min));

/** One shared loot graph drives exact per-item odds and complete, correlated kills.
 * Non-named equipment is grouped by base; affixes, gold amounts and stack sizes
 * are not generated. Each kill starts a fresh game for unique-item eligibility.
 */
export function monsterDrops(data: DropData, source: DropSource, settings: DropSettings, requestedKills: number, seed: number, simulate: boolean): MonsterDropReport {
  const kills = integer(requestedKills, 1, 100000);
  seed = integer(seed, 0, 4294967295);
  const players = integer(settings.players, 1, 8), party = integer(settings.party, 1, players), mf = integer(settings.magicFind, 0, 10000);
  const classes = new Map(data.TreasureClasses.map(tc => [lower(tc.Code), tc]));
  const bases = new Map(data.Bases.map(b => [lower(b.Code), b]));
  const named = data.Items.filter(i => i.Quality === 'unique' || i.Quality === 'set');
  const namedByKey = new Map(named.map(i => [lower(i.NameKey), i]));
  const directItems = new Map(data.Items.filter(i => i.Quality === 'rune' || i.Quality === 'misc').map(i => [lower(i.Code), i]));
  const rows = new Map<string, MonsterDropRow>();
  const memo = new Map<string, Node>(), active = new Set<string>();
  let nodeId = 0;
  function register(id: string, nameKey: string, code: string, quality: string) {
    if (!rows.has(id)) rows.set(id, { id, nameKey, code, quality, chance: 0, expected: 0, count: 0, successfulKills: 0 });
    return id;
  }
  function namedOutcome(item: DropItem, weight: number) {
    return { id: register(item.Id, item.NameKey, item.Code, item.Quality), weight };
  }
  function compile(code: string, unique: number, set: number): Node {
    const memoKey = `${lower(code)}:${unique}:${set}`;
    const cached = memo.get(memoKey); if (cached) return cached;
    if (active.has(lower(code))) throw new Error('Cyclic treasure class; this monster cannot be simulated.');
    active.add(lower(code));
    try {
      const node: Node = { id: nodeId++, picks: 1, ordered: false, entries: [], noDrop: 0 };
      const tc = classes.get(lower(code));
      if (tc) {
        const condition = tc.Condition.trim().replace(/^"|"$/g, '');
        const hellOnly = /^cond\('Difficulty',\s*hell\)$/.test(condition);
        if (hellOnly && source.Difficulty !== 2) node.picks = 0;
        else {
          if ((condition && !hellOnly) || tc.QuestFlag || tc.QuestFlagEx) throw new Error(`Conditional treasure class ${tc.Code} is not supported for a complete loot run.`);
          node.picks = Math.abs(tc.Picks); node.ordered = tc.Picks < 0;
          unique = Math.max(unique, tc.Unique); set = Math.max(set, tc.Set);
          let remaining = node.picks;
          for (const entry of tc.Entries) {
            const weight = node.ordered ? Math.min(remaining, entry.Weight) : entry.Weight;
            if (weight <= 0 || node.picks === 0) continue;
            node.entries.push({ node: compile(entry.Code, unique, set), weight });
            if (node.ordered) remaining -= weight;
          }
          if (!node.ordered) node.noDrop = adjustedNoDrop(tc.NoDrop, node.entries.reduce((sum, e) => sum + e.weight, 0), players, party);
        }
      } else {
        const [raw, ...mods] = code.split(',');
        const explicit = namedByKey.get(lower(raw));
        const base = bases.get(lower(explicit?.Code ?? raw));
        if (!base) throw new Error(`Unresolved drop reference: ${raw}`);
        if (mods.some(m => !/^(mul|cu|cs|cr|cm|ce|qty)=\d+$/.test(m))) throw new Error(`Unsupported item modifier: ${code}`);
        if (explicit) node.outcomes = [namedOutcome(explicit, 1)];
        else {
          const direct = directItems.get(lower(base.Code));
          const peers = named.filter(i => lower(i.Code) === lower(base.Code) && i.Random && i.Level <= source.Level && i.Rarity > 0);
          if (peers.some(i => i.Condition)) throw new Error(`Conditional item eligibility: ${base.Code}`);
          node.outcomes = [];
          if (!direct && !base.Quest && peers.length) {
            const ratio = data.Ratios.find(r => r.Uber === Number(base.Uber) && r.ClassSpecific === Number(base.ClassSpecific));
            if (!ratio) throw new Error(`Missing item ratio: ${base.Code}`);
            unique = Math.max(unique, Number(mods.find(m => m.startsWith('cu='))?.slice(3) ?? 0));
            set = Math.max(set, Number(mods.find(m => m.startsWith('cs='))?.slice(3) ?? 0));
            const u = qualityChance(ratio.Unique, ratio.UniqueDivisor, ratio.UniqueMin, source.Level - base.Level, mf, 250, unique);
            const s = (1 - u) * qualityChance(ratio.Set, ratio.SetDivisor, ratio.SetMin, source.Level - base.Level, mf, 500, set);
            for (const quality of ['unique', 'set']) {
              const eligible = peers.filter(i => i.Quality === quality);
              const total = eligible.reduce((sum, i) => sum + i.Rarity, 0);
              for (const item of eligible) node.outcomes.push(namedOutcome(item, (quality === 'unique' ? u : s) * item.Rarity / total));
            }
          }
          const remainder = Math.max(0, 1 - node.outcomes.reduce((sum, o) => sum + o.weight, 0));
          if (remainder > 0) node.outcomes.push({ id: register(direct?.Id ?? `base:${base.Code}`, direct?.NameKey ?? base.NameKey ?? base.Code, base.Code, direct?.Quality ?? (base.Equipment || peers.length ? 'other equipment' : 'misc')), weight: remainder });
        }
        node.outcomes = node.outcomes.filter(o => o.weight > 0);
      }
      memo.set(memoKey, node); return node;
    } finally { active.delete(lower(code)); }
  }
  let rootClass = classes.get(lower(source.TreasureClass));
  if (!rootClass) throw new Error('Missing monster treasure class');
  if (source.Difficulty > 0 && rootClass.Group && rootClass.Group !== '0') {
    rootClass = data.TreasureClasses.filter(t => t.Group === rootClass!.Group && t.Level >= rootClass!.Level && t.Level <= source.Level).sort((a,b) => a.Level-b.Level).at(-1) ?? rootClass;
  }
  const root = compile(rootClass.Code, 0, 0);
  // Joint distribution of consumed slots and misses for each item. Evaluate
  // child graphs with remaining capacity to preserve ordered negative picks.
  function distribution(target: string | null): number[] {
    const cache = new Map<string, number[]>();
    function walk(node: Node, capacity: number): number[] {
      if (!capacity) return [1];
      const id = `${node.id}:${capacity}`;
      const cached = cache.get(id); if (cached) return cached;
      if (node.outcomes) return [0, node.outcomes.reduce((sum, o) => sum + (o.id === target ? 0 : o.weight), 0)];
      let state = [1];
      function append(roll: (capacity: number) => number[]) {
        const next = Array(capacity + 1).fill(0);
        for (let n = 0; n < state.length; n++) {
          if (!state[n]) continue;
          if (n === capacity) { next[n] += state[n]; continue; }
          const child = roll(capacity - n);
          for (let j = 0; j < child.length; j++) next[n+j] += state[n] * child[j];
        }
        state = next;
      }
      if (node.ordered) {
        for (const e of node.entries) for (let n = 0; n < e.weight; n++) append(cap => walk(e.node, cap));
      } else {
        const total = node.noDrop + node.entries.reduce((sum, e) => sum + e.weight, 0);
        for (let n = 0; n < node.picks && total > 0; n++) append(cap => {
          const mix = Array(cap + 1).fill(0); mix[0] = node.noDrop / total;
          for (const e of node.entries) {
            const child = walk(e.node, cap);
            for (let j = 0; j < child.length; j++) mix[j] += child[j] * e.weight / total;
          }
          return mix;
        });
      }
      cache.set(id, state); return state;
    }
    return walk(root, 6);
  }
  // Expected copies use expected node visits with the remaining-slot distribution.
  const slotCache = new Map<string, number[]>();
  function slots(node: Node, cap: number): number[] {
    if (!cap) return [1];
    if (node.outcomes) return [0,1];
    const id = `${node.id}:${cap}`; const known = slotCache.get(id); if (known) return known;
    let state = [1];
    function append(child: Node | null) {
      const next = Array(cap+1).fill(0);
      for (let n=0;n<state.length;n++) {
        if (n===cap) { next[n]+=state[n]; continue; }
        if (child) { const d=slots(child,cap-n); for(let j=0;j<d.length;j++) next[n+j]+=state[n]*d[j]; }
        else {
          const total=node.noDrop+node.entries.reduce((s,e)=>s+e.weight,0);
          if (!total) { next[n]+=state[n]; continue; }
          next[n]+=state[n]*node.noDrop/total;
          for(const e of node.entries) { const d=slots(e.node,cap-n); for(let j=0;j<d.length;j++) next[n+j]+=state[n]*e.weight/total*d[j]; }
        }
      }
      state=next;
    }
    if(node.ordered) for(const e of node.entries) for(let n=0;n<e.weight;n++) append(e.node);
    else for(let n=0;n<node.picks;n++) append(null);
    slotCache.set(id,state); return state;
  }
  // A direct recursive expectation is memoized as a sparse per-item map.
  const expectations = new Map<string, Map<string,number>>();
  function expected(node:Node,cap:number):Map<string,number> {
    if(!cap) return new Map();
    const id=`${node.id}:${cap}`; const cached=expectations.get(id); if(cached)return cached;
    const out=new Map<string,number>();
    if(node.outcomes) { for(const o of node.outcomes) out.set(o.id,(out.get(o.id)??0)+o.weight); return out; }
    let state=[1];
    function append(choices:{node:Node;weight:number}[],noDrop:number) {
      const total=noDrop+choices.reduce((s,e)=>s+e.weight,0); if(!total)return;
      const next=Array(cap+1).fill(0);
      for(let n=0;n<state.length;n++) {
        if(!state[n])continue;
        if(n===cap){next[n]+=state[n];continue;}
        next[n]+=state[n]*noDrop/total;
        for(const e of choices){
          const weight=state[n]*e.weight/total;
          for(const [item,amount] of expected(e.node,cap-n))out.set(item,(out.get(item)??0)+weight*amount);
          const d=slots(e.node,cap-n);for(let j=0;j<d.length;j++)next[n+j]+=weight*d[j];
        }
      }
      state=next;
    }
    if(node.ordered)for(const e of node.entries)for(let n=0;n<e.weight;n++)append([{node:e.node,weight:1}],0);
    else for(let n=0;n<node.picks;n++)append(node.entries,node.noDrop);
    expectations.set(id,out);return out;
  }
  const amounts=expected(root,6);
  for(const row of rows.values()) {
    row.expected=(amounts.get(row.id)??0)*kills;
    if(row.expected>0) row.chance=Math.max(0,Math.min(1,1-distribution(row.id).reduce((a,b)=>a+b,0)));
  }
  let state=seed;
  function random(){state=(state+0x6D2B79F5)>>>0;let t=state;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;}
  let totalDrops=0,emptyKills=0;
  if(simulate)for(let kill=0;kill<kills;kill++) {
    let count=0;const hit=new Set<string>();
    function roll(node:Node) {
      if(count===6)return;
      if(node.outcomes){
        let value=random();let chosen=node.outcomes.at(-1)!;
        for(const o of node.outcomes){value-=o.weight;if(value<0){chosen=o;break;}}
        rows.get(chosen.id)!.count++;hit.add(chosen.id);count++;return;
      }
      if(node.ordered){for(const e of node.entries)for(let n=0;n<e.weight&&count<6;n++)roll(e.node);}
      else {
        const total=node.noDrop+node.entries.reduce((s,e)=>s+e.weight,0);
        for(let n=0;n<node.picks&&count<6&&total>0;n++){
          let value=random()*total-node.noDrop;if(value<0)continue;
          for(const e of node.entries){value-=e.weight;if(value<0){roll(e.node);break;}}
        }
      }
    }
    roll(root);totalDrops+=count;if(!count)emptyKills++;
    for(const id of hit)rows.get(id)!.successfulKills++;
  }
  return {rows:[...rows.values()].filter(r=>r.expected>0).sort((a,b)=>b.chance-a.chance),kills,seed,simulated:simulate,totalDrops,emptyKills,treasureClass:rootClass.Code};
}
