export type DropQuality = 'unique' | 'set' | 'rune';
export interface DropItem { Id: string; NameKey: string; Code: string; Quality: DropQuality; Level: number; Rarity: number; Random: boolean; Condition: string }
export interface DropSource { Id: string; NameKey: string; AreaKey: string; Difficulty: number; Kind: string; Level: number; TreasureClass: string }
export interface DropClass { Code: string; Group: string; Level: number; Picks: number; Unique: number; Set: number; NoDrop: number; Entries: { Code: string; Weight: number }[]; Condition: string; QuestFlag: string; QuestFlagEx: string }
export interface DropRatio { Version: number; Uber: number; ClassSpecific: number; Unique: number; UniqueDivisor: number; UniqueMin: number; Set: number; SetDivisor: number; SetMin: number }
export interface DropData {
  Items: DropItem[];
  Bases: { Code: string; Level: number; Uber: boolean; ClassSpecific: boolean; Quest: boolean }[];
  Ratios: DropRatio[];
  TreasureClasses: DropClass[];
  Sources: DropSource[];
}
export interface DropSettings { players: number; party: number; magicFind: number; difficulty: number; kind: string }
export interface DropResult { source: DropSource; chance: number | null; reason?: string }
const key = (value: string) => value.toLowerCase();
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(n) ? Math.trunc(n) : min));

export function adjustedNoDrop(noDrop: number, weight: number, players: number, party: number): number {
  if (noDrop <= 0 || weight <= 0) return 0;
  const exponent = 1 + Math.floor((players - 1) / 2 + (party - 1) / 2);
  if (exponent === 1) return noDrop;
  const chance = (noDrop / (weight + noDrop)) ** exponent;
  return Math.floor(weight * chance / (1 - chance));
}

/** Integer arithmetic follows the quality roll: MF, minimum, then TC modifier. */
export function qualityChance(base: number, divisor: number, minimum: number, levelDifference: number, mf: number, diminishing: number, modifier: number): number {
  if (divisor <= 0) throw new Error('Invalid item ratio divisor');
  let denominator = (base - Math.trunc(levelDifference / divisor)) * 128;
  const effective = Math.floor(mf * diminishing / (mf + diminishing));
  denominator = Math.max(minimum, Math.floor(denominator * 100 / (100 + effective)));
  denominator -= Math.floor(denominator * modifier / 1024);
  return denominator <= 128 ? 1 : 128 / denominator;
}

/** Exact probability of at least one selected item, with an ordered six-drop cap.
 * Each vector stores P(no target AND n generated items). Missing mass is a hit.
 * Child graphs are evaluated with the remaining capacity, so a late Countess rune
 * cannot count once earlier equipment has filled every slot.
 */
export function calculateDrops(data: DropData, target: DropItem, input: DropSettings): DropResult[] {
  const players = clamp(input.players, 1, 8);
  const party = clamp(input.party, 1, players);
  const mf = clamp(input.magicFind, 0, 10000);
  const classes = new Map(data.TreasureClasses.map(tc => [key(tc.Code), tc]));
  const bases = new Map(data.Bases.map(base => [key(base.Code), base]));
  const named = new Map(data.Items.filter(i => i.Quality !== 'rune').map(i => [key(i.NameKey), i]));
  const peers = data.Items.filter(i => i.Quality === target.Quality && key(i.Code) === key(target.Code));
  const groups = new Map<string, DropClass[]>();
  for (const tc of data.TreasureClasses) {
    if (!tc.Group || tc.Group === '0') continue;
    const group = groups.get(tc.Group) ?? [];
    group.push(tc); groups.set(tc.Group, group);
  }
  for (const group of groups.values()) group.sort((a, b) => a.Level - b.Level);
  const results: DropResult[] = [];
  const shared = new Map<string, number[]>();
  const conditionalReach = new Map<string, boolean>();
  function canContainTarget(code: string, seen = new Set<string>()): boolean {
    const id = key(code);
    if (seen.has(id)) return false;
    seen.add(id);
    const tc = classes.get(id);
    if (tc) return tc.Entries.some(e => canContainTarget(e.Code, seen));
    const raw = code.split(',')[0];
    return key(named.get(key(raw))?.Code ?? raw) === key(target.Code);
  }
  for (const source of data.Sources) {
    if (input.difficulty !== -1 && source.Difficulty !== input.difficulty) continue;
    if (input.kind !== 'all' && source.Kind !== input.kind) continue;
    const active = new Set<string>();
    let suppressConditional = true;
    function leaf(code: string, unique: number, set: number): number[] {
      const [raw, ...modifiers] = code.split(',');
      const explicit = named.get(key(raw));
      const baseCode = explicit?.Code ?? raw;
      if (!bases.has(key(baseCode))) throw new Error(`Unresolved drop reference: ${raw}`);
      if (key(baseCode) !== key(target.Code)) return [0, 1];
      if (explicit) return [0, explicit.Id === target.Id ? 0 : 1];
      if (target.Quality === 'rune') return [0, 0];
      if (!target.Random || source.Level < target.Level) return [0, 1];
      const base = bases.get(key(baseCode))!;
      if (base.Quest) return [0, 1];
      const forced = modifiers.find(m => m.startsWith('cu='));
      if (modifiers.some(m => !/^(mul|cu|cs|cr|cm|ce|qty)=\d+$/.test(m))) throw new Error('Unsupported item modifier');
      unique = Math.max(unique, Number(forced?.slice(3) ?? 0));
      set = Math.max(set, Number(modifiers.find(m => m.startsWith('cs='))?.slice(3) ?? 0));
      const ratio = data.Ratios.find(r => r.Uber === Number(base.Uber) && r.ClassSpecific === Number(base.ClassSpecific));
      if (!ratio) throw new Error('Missing item ratio');
      const eligible = peers.filter(i => i.Random && i.Level <= source.Level && i.Rarity > 0);
      if (eligible.some(i => i.Condition)) throw new Error('Conditional item eligibility is not supported');
      const weight = eligible.reduce((total, i) => total + i.Rarity, 0);
      if (weight === 0) return [0, 1];
      const u = qualityChance(ratio.Unique, ratio.UniqueDivisor, ratio.UniqueMin, source.Level - base.Level, mf, 250, unique);
      const chance = target.Quality === 'unique' ? u : (1 - u) * qualityChance(ratio.Set, ratio.SetDivisor, ratio.SetMin, source.Level - base.Level, mf, 500, set);
      return [0, 1 - chance * target.Rarity / weight];
    }
    function walk(code: string, capacity: number, unique: number, set: number): number[] {
      if (capacity === 0) return [1];
      const tc = classes.get(key(code));
      if (!tc) return leaf(code, unique, set);
      // Recognize the source's difficulty gate without evaluating arbitrary expressions.
      const condition = tc.Condition.trim().replace(/^"|"$/g, '');
      const hellOnly = /^cond\('Difficulty',\s*hell\)$/.test(condition);
      if (hellOnly && source.Difficulty !== 2) return [1];
      if (condition && !hellOnly || tc.QuestFlag || tc.QuestFlagEx) {
        let relevant = conditionalReach.get(key(code));
        if (relevant === undefined) { relevant = canContainTarget(code); conditionalReach.set(key(code), relevant); }
        if (relevant) throw new Error('Conditional treasure class is not supported for this item');
        // Optional unrelated drops can only consume capacity, never create a target.
        // Evaluate both extremes below; report odds only when the gate cannot matter.
        if (suppressConditional) return [1];
      }
      unique = Math.max(unique, tc.Unique); set = Math.max(set, tc.Set);
      const memoKey = `${suppressConditional}:${source.Level}:${source.Difficulty}:${key(code)}:${capacity}:${unique}:${set}`;
      const cached = shared.get(memoKey); if (cached) return cached;
      if (active.has(key(code))) throw new Error('Cyclic treasure class');
      active.add(key(code));
      try {
        let state = [1];
        function append(roll: (remaining: number) => number[]) {
          const next = Array(capacity + 1).fill(0) as number[];
          for (let count = 0; count < state.length; count++) {
            if (!state[count]) continue;
            if (count === capacity) { next[count] += state[count]; continue; }
            const child = roll(capacity - count);
            for (let added = 0; added < child.length; added++) next[count + added] += state[count] * child[added];
          }
          state = next;
        }
        if (tc.Picks < 0) {
          let remaining = -tc.Picks;
          for (const entry of tc.Entries) {
            const count = Math.min(remaining, entry.Weight);
            for (let i = 0; i < count; i++) append(cap => walk(entry.Code, cap, unique, set));
            remaining -= count;
            if (remaining <= 0) break;
          }
        } else {
          const weight = tc.Entries.reduce((sum, e) => sum + e.Weight, 0);
          const noDrop = adjustedNoDrop(tc.NoDrop, weight, players, party);
          const total = weight + noDrop;
          for (let i = 0; i < tc.Picks && total > 0; i++) append(cap => {
            const mix = Array(cap + 1).fill(0) as number[];
            mix[0] = noDrop / total;
            for (const entry of tc.Entries) {
              const child = walk(entry.Code, cap, unique, set);
              for (let j = 0; j < child.length; j++) mix[j] += entry.Weight / total * child[j];
            }
            return mix;
          });
        }
        shared.set(memoKey, state);
        return state;
      } finally { active.delete(key(code)); }
    }
    try {
      let root = classes.get(key(source.TreasureClass));
      if (!root) throw new Error('Missing monster treasure class');
      if (source.Difficulty > 0 && root.Group && root.Group !== '0') {
        root = groups.get(root.Group)?.filter(tc => tc.Level >= root!.Level && tc.Level <= source.Level).at(-1) ?? root;
      }
      const misses = walk(root.Code, 6, 0, 0).reduce((sum, n) => sum + n, 0);
      suppressConditional = false;
      const gatedMisses = walk(root.Code, 6, 0, 0).reduce((sum, n) => sum + n, 0);
      if (Math.abs(misses - gatedMisses) > 1e-12) throw new Error('Conditional drops affect the six-item limit');
      results.push({ source, chance: Math.min(1, Math.max(0, 1 - misses)) });
    } catch (error) {
      results.push({ source, chance: null, reason: error instanceof Error ? error.message : 'Unsupported drop data' });
    }
  }
  return results.sort((a, b) => (b.chance ?? -1) - (a.chance ?? -1));
}

export function itemSuggestions(items: DropItem[], query: string, quality: DropQuality, translate: (key: string) => string): DropItem[] {
  const text = query.trim().toLocaleLowerCase();
  if (text.length < 3) return [];
  return items.filter(i => i.Quality === quality && translate(i.NameKey).toLocaleLowerCase().includes(text))
    .sort((a, b) => translate(a.NameKey).localeCompare(translate(b.NameKey)));
}
