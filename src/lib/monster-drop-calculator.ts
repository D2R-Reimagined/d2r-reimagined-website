import { adjustedNoDrop, conditionState, gatedOff, qualityChance, unsupportedGate, type DropData, type DropItem, type DropSettings, type DropSource } from './drop-calculator';

export interface MonsterDropRow {
  id: string; nameKey: string; code: string; quality: string;
  chance: number; expected: number; count: number;
}
export interface MonsterDropReport {
  rows: MonsterDropRow[]; kills: number; seed: number; simulated: boolean;
  /** All table results, including NoDrop and Void picks; itemDrops counts real items only. */
  totalDrops: number; itemDrops: number; treasureClass: string;
}
type Node = { id: number; picks: number; ordered: boolean; entries: { node: Node; weight: number }[]; noDrop: number; void?: boolean; outcomes?: { id: string; weight: number }[] };
const lower = (s: string) => s.toLowerCase();
const integer = (n: number, min: number, max: number) => Math.max(min, Math.min(max, Number.isFinite(n) ? Math.trunc(n) : min));
/** collapse groups similar items; leaves reports each item as the nearest enclosing
 * positive-pick treasure class that rolled it (Jewelry A instead of Ring). */
export interface MonsterDropOptions { collapse?: boolean; leaves?: boolean }
export const LEAF_QUALITY = 'treasure class';
/** Source kind for a treasure class chosen directly instead of through a monster. */
export const TREASURE_CLASS_KIND = 'treasure class';
export function treasureClassSource(code: string, difficulty: number, level: number): DropSource {
  return { Id: `tc:${code}`, NameKey: code, AreaKey: '', Difficulty: integer(difficulty, 0, 2), Kind: TREASURE_CLASS_KIND, Level: integer(level, 1, 120), TreasureClass: code };
}
/** Collapsed row groups: random armor and weapon bases, then all uniques and all sets. */
export const COLLAPSED_GROUPS = {
  armor: { id: 'group:armor', nameKey: 'Armor (random bases)', quality: 'other equipment' },
  weapon: { id: 'group:weapon', nameKey: 'Weapons (random bases)', quality: 'other equipment' },
  unique: { id: 'group:unique', nameKey: 'Unique items', quality: 'unique' },
  set: { id: 'group:set', nameKey: 'Set items', quality: 'set' },
} as const;
/** Collapsed treasure class leaf rows: every armoN class, then every weapN class. */
export const COLLAPSED_LEAF_GROUPS = {
  armor: { id: 'tc:group:armo', nameKey: 'Armor (all armo classes)', code: 'armo*' },
  weapon: { id: 'tc:group:weap', nameKey: 'Weapons (all weap classes)', code: 'weap*' },
} as const;
const leafKind = (code: string) => /^armo\d+$/i.test(code) ? 'armor' : /^weap\d+$/i.test(code) ? 'weapon' : null;
/** Picks that produce nothing: a NoDrop roll, or landing on an empty class such as Void.
 * They are reported like drops but never use one of the six item slots. */
export const NO_DROP_ROW = { id: 'nodrop', nameKey: 'NoDrop', quality: 'no drop' } as const;
export const VOID_ROW = { id: 'void', nameKey: 'Void', quality: 'no drop' } as const;

/** One shared loot graph drives exact per-item odds and complete, correlated kills.
 * Non-named equipment is grouped by base; affixes, gold amounts and stack sizes
 * are not generated. Each kill starts a fresh game for unique-item eligibility.
 */
export function monsterDrops(data: DropData, source: DropSource, settings: DropSettings, requestedKills: number, seed: number, simulate: boolean, options: MonsterDropOptions = {}): MonsterDropReport {
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
  // The generated armoN/weapN classes define which bases are armor or weapons.
  const baseKinds = new Map<string, 'armor' | 'weapon'>();
  for (const tc of data.TreasureClasses) {
    const kind = leafKind(tc.Code);
    if (kind) for (const entry of tc.Entries) baseKinds.set(lower(entry.Code.split(',')[0]), kind);
  }
  let nodeId = 0;
  // Collapsing only renames outcomes, so the graph and seeded rolls stay identical
  // and grouped odds remain at-least-one-of-the-group rather than summed chances.
  function register(id: string, nameKey: string, code: string, quality: string) {
    if (options.collapse && quality === LEAF_QUALITY) {
      const kind = leafKind(code);
      if (kind) { const group = COLLAPSED_LEAF_GROUPS[kind]; id = group.id; nameKey = group.nameKey; code = group.code; }
    } else if (options.collapse) {
      const kind = quality === 'unique' || quality === 'set' ? quality : quality === 'other equipment' ? baseKinds.get(lower(code)) : undefined;
      if (kind) { const group = COLLAPSED_GROUPS[kind]; id = group.id; nameKey = group.nameKey; code = ''; quality = group.quality; }
    }
    if (!rows.has(id)) rows.set(id, { id, nameKey, code, quality, chance: 0, expected: 0, count: 0 });
    return id;
  }
  function namedOutcome(item: DropItem, weight: number) {
    return { id: register(item.Id, item.NameKey, item.Code, item.Quality), weight };
  }
  function compile(code: string, unique: number, set: number, leaf = ''): Node {
    const tc = classes.get(lower(code));
    // Only items and pick-limited classes depend on the enclosing leaf class.
    if (!options.leaves || (tc && tc.Picks > 0)) leaf = '';
    const memoKey = `${lower(code)}:${unique}:${set}:${leaf}`;
    const cached = memo.get(memoKey); if (cached) return cached;
    if (active.has(lower(code))) throw new Error('Cyclic treasure class; this monster cannot be simulated.');
    active.add(lower(code));
    try {
      const node: Node = { id: nodeId++, picks: 1, ordered: false, entries: [], noDrop: 0 };
      if (tc) {
        if (gatedOff(tc, source.Difficulty)) node.picks = 0;
        else {
          if (unsupportedGate(tc)) throw new Error(`Conditional treasure class ${tc.Code} is not supported for a complete loot run.`);
          node.picks = Math.abs(tc.Picks); node.ordered = tc.Picks < 0;
          unique = Math.max(unique, tc.Unique); set = Math.max(set, tc.Set);
          let remaining = node.picks;
          for (const entry of tc.Entries) {
            const weight = node.ordered ? Math.min(remaining, entry.Weight) : entry.Weight;
            if (weight <= 0 || node.picks === 0) continue;
            node.entries.push({ node: compile(entry.Code, unique, set, tc.Picks > 0 ? tc.Code : leaf), weight });
            if (node.ordered) remaining -= weight;
          }
          const weight = node.entries.reduce((sum, e) => sum + e.weight, 0);
          if (!node.ordered) node.noDrop = weight ? adjustedNoDrop(tc.NoDrop, weight, players, party) : Math.max(0, tc.NoDrop);
        }
        if (!node.picks || (!node.entries.length && !node.noDrop)) { node.void = true; register(VOID_ROW.id, VOID_ROW.nameKey, '', VOID_ROW.quality); }
        else if (node.noDrop) register(NO_DROP_ROW.id, NO_DROP_ROW.nameKey, '', NO_DROP_ROW.quality);
      } else {
        const [raw, ...mods] = code.split(',');
        const explicit = namedByKey.get(lower(raw));
        const base = bases.get(lower(explicit?.Code ?? raw));
        if (!base) throw new Error(`Unresolved drop reference: ${raw}`);
        if (mods.some(m => !/^(mul|cu|cs|cr|cm|ce|qty)=\d+$/.test(m))) throw new Error(`Unsupported item modifier: ${code}`);
        if (explicit) node.outcomes = [namedOutcome(explicit, 1)];
        else {
          const direct = directItems.get(lower(base.Code));
          const peers = named.filter(i => lower(i.Code) === lower(base.Code) && i.Random && i.Level <= source.Level && i.Rarity > 0 && conditionState(i, source.Difficulty) !== 'unmet');
          if (peers.some(i => conditionState(i, source.Difficulty) === 'unsupported')) throw new Error(`Conditional item eligibility: ${base.Code}`);
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
        // One merged outcome keeps the single roll per item, so seeded runs are unchanged.
        if (leaf && node.outcomes.length) node.outcomes = [{ id: register(`tc:${leaf}`, leaf, leaf, LEAF_QUALITY), weight: node.outcomes.reduce((sum, o) => sum + o.weight, 0) }];
      }
      memo.set(memoKey, node); return node;
    } finally { active.delete(lower(code)); }
  }
  let rootClass = classes.get(lower(source.TreasureClass));
  if (!rootClass) throw new Error(`Missing treasure class ${source.TreasureClass}`);
  // A directly chosen class is used as-is; monsters upgrade grouped classes by level.
  if (source.Kind !== TREASURE_CLASS_KIND && source.Difficulty > 0 && rootClass.Group && rootClass.Group !== '0') {
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
      if (node.void) return target === VOID_ROW.id ? [0] : [1];
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
          const mix = Array(cap + 1).fill(0); mix[0] = target === NO_DROP_ROW.id ? 0 : node.noDrop / total;
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
    if(node.void) { out.set(VOID_ROW.id,1); expectations.set(id,out); return out; }
    if(node.outcomes) { for(const o of node.outcomes) out.set(o.id,(out.get(o.id)??0)+o.weight); return out; }
    let state=[1];
    function append(choices:{node:Node;weight:number}[],noDrop:number) {
      const total=noDrop+choices.reduce((s,e)=>s+e.weight,0); if(!total)return;
      const next=Array(cap+1).fill(0);
      for(let n=0;n<state.length;n++) {
        if(!state[n])continue;
        if(n===cap){next[n]+=state[n];continue;}
        next[n]+=state[n]*noDrop/total;
        if(noDrop)out.set(NO_DROP_ROW.id,(out.get(NO_DROP_ROW.id)??0)+state[n]*noDrop/total);
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
  let totalDrops=0,itemDrops=0;
  if(simulate)for(let kill=0;kill<kills;kill++) {
    let count=0,empty=0;
    // NoDrop and Void results are tallied without consuming item slots or extra rolls.
    function nothing(id:string){rows.get(id)!.count++;empty++;}
    function roll(node:Node) {
      if(count===6)return;
      if(node.void){nothing(VOID_ROW.id);return;}
      if(node.outcomes){
        let value=random();let chosen=node.outcomes.at(-1)!;
        for(const o of node.outcomes){value-=o.weight;if(value<0){chosen=o;break;}}
        rows.get(chosen.id)!.count++;count++;return;
      }
      if(node.ordered){for(const e of node.entries)for(let n=0;n<e.weight&&count<6;n++)roll(e.node);}
      else {
        const total=node.noDrop+node.entries.reduce((s,e)=>s+e.weight,0);
        for(let n=0;n<node.picks&&count<6&&total>0;n++){
          if(!node.entries.length){nothing(NO_DROP_ROW.id);continue;}
          let value=random()*total-node.noDrop;if(value<0){nothing(NO_DROP_ROW.id);continue;}
          for(const e of node.entries){value-=e.weight;if(value<0){roll(e.node);break;}}
        }
      }
    }
    roll(root);itemDrops+=count;totalDrops+=count+empty;
  }
  return {rows:[...rows.values()].filter(r=>r.expected>0).sort((a,b)=>b.chance-a.chance),kills,seed,simulated:simulate,totalDrops,itemDrops,treasureClass:rootClass.Code};
}
