import type { DropItem } from './drop-calculator';
import { categoryAllows, isDropCategory, type DropCategory } from './drop-item-search';
import { DEFAULT_MIN_LEVEL, KILL_LIMIT, MAGIC_FIND_LIMIT, UNRESTRICTED_MAX_LEVEL, type LevelRange } from './drop-calculator-form';

const difficulties = ['normal', 'nightmare', 'hell'];
const kinds = ['all', 'normal', 'champion', 'unique', 'superunique', 'boss', 'quest'];
const params = ['item', 'type', 'difficulty', 'players', 'party', 'mf', 'monster', 'filter', 'zero', 'tc', 'minLevel', 'maxLevel', 'kills'];
export interface DropUrlState {
  selected: DropItem | null;
  /** Optional search filter; legacy `type=` links select it, and `all` is the default. */
  category: DropCategory;
  difficulty: number;
  players: number;
  party: number;
  magicFind: number;
  kind: string;
  filter: string;
  showZero: boolean;
  treasureClass: string;
  minLevel: number;
  maxLevel: number;
  kills: number;
}

function integer(value: string | null, fallback: number, min: number, max: number) {
  if (!value || !/^\d+$/.test(value)) return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
}

/** Without exported data, only the legacy bounds apply. */
const legacyLevels: LevelRange = { min: DEFAULT_MIN_LEVEL, max: UNRESTRICTED_MAX_LEVEL };

/** Bookmarked levels normalize into the supported range. A maximum beyond the highest exported
 * level (such as the legacy 999), or one below the minimum, means no maximum rather than an
 * accidental restriction that would hide every monster. */
function readLevels(p: URLSearchParams, levels: LevelRange) {
  const minLevel = integer(p.get('minLevel'), DEFAULT_MIN_LEVEL, levels.min, levels.max);
  const max = integer(p.get('maxLevel'), UNRESTRICTED_MAX_LEVEL, levels.min, UNRESTRICTED_MAX_LEVEL);
  const maxLevel = max > levels.max || max < minLevel ? UNRESTRICTED_MAX_LEVEL : max;
  return { minLevel, maxLevel };
}

export function readDropUrl(url: URL, items: DropItem[], levels: LevelRange = legacyLevels): DropUrlState {
  const p = url.searchParams;
  const selected = items.find(item => item.Id === p.get('item')) ?? null;
  const type = p.get('type');
  const filtered = type !== 'all' && isDropCategory(type) ? type : 'all';
  const players = integer(p.get('players'), 1, 1, 8);
  const difficulty = p.get('difficulty');
  return {
    selected,
    category: selected && !categoryAllows(filtered, selected) ? 'all' : filtered,
    difficulty: difficulty === 'all' ? -1 : difficulties.includes(difficulty ?? '') ? difficulties.indexOf(difficulty!) : 2,
    players,
    party: integer(p.get('party'), 1, 1, players),
    magicFind: integer(p.get('mf'), 0, 0, MAGIC_FIND_LIMIT),
    kind: kinds.includes(p.get('monster') ?? '') ? p.get('monster')! : 'all',
    filter: p.get('filter') ?? '',
    showZero: p.get('zero') === '1',
    treasureClass: p.get('tc') ?? '',
    ...readLevels(p, levels),
    kills: integer(p.get('kills'), KILL_LIMIT, 1, KILL_LIMIT)
  };
}

/** Settings shown in the collapsible advanced section of the item lookup form. */
export const advancedDropSettings = ['kind', 'party', 'treasureClass', 'minLevel', 'maxLevel', 'kills'] as const;
// Defaults come from the parser itself so the indicator always agrees with what an empty URL means.
const defaults = readDropUrl(new URL('https://defaults.invalid/'), []);

/** Counts advanced settings that differ from the defaults an empty URL would produce. */
export function countAdvancedDropFilters(state: Pick<DropUrlState, (typeof advancedDropSettings)[number]>) {
  return advancedDropSettings.filter(key => state[key] !== defaults[key]).length;
}

export type DropMode = 'item' | 'simulate';
export const readDropMode = (url: URL): DropMode => url.searchParams.get('mode') === 'simulate' ? 'simulate' : 'item';

/** Changes only the mode, so every other parameter keeps the value from `current`; pass the
 * address-bar URL, never a snapshot from before the latest selection changes. */
export function writeDropMode(current: URL, mode: DropMode): URL {
  const url = new URL(current);
  if (mode === 'simulate') url.searchParams.set('mode', mode); else url.searchParams.delete('mode');
  return url;
}

const whole = (value: number, min: number, max: number) => Number.isSafeInteger(value) && value >= min && value <= max;

/** Keeps unrelated query parameters and fragments intact; omits default settings and never
 * writes a value the reader would reject (non-integers, NaN, or out-of-range numbers). */
export function writeDropUrl(current: URL, state: DropUrlState): URL {
  const url = new URL(current);
  for (const param of params) url.searchParams.delete(param);
  const p = url.searchParams;
  if (state.selected) p.set('item', state.selected.Id);
  if (state.category !== 'all') p.set('type', state.category);
  if (state.difficulty !== 2) p.set('difficulty', state.difficulty === -1 ? 'all' : difficulties[state.difficulty]);
  if (state.players !== 1 && whole(state.players, 1, 8)) p.set('players', String(state.players));
  if (state.party !== 1 && whole(state.party, 1, 8)) p.set('party', String(state.party));
  if (state.magicFind && whole(state.magicFind, 0, MAGIC_FIND_LIMIT)) p.set('mf', String(state.magicFind));
  if (state.kind !== 'all') p.set('monster', state.kind);
  if (state.filter) p.set('filter', state.filter);
  if (state.showZero) p.set('zero', '1');
  if (state.treasureClass) p.set('tc', state.treasureClass);
  if (state.minLevel !== DEFAULT_MIN_LEVEL && whole(state.minLevel, 1, UNRESTRICTED_MAX_LEVEL)) p.set('minLevel', String(state.minLevel));
  if (state.maxLevel !== UNRESTRICTED_MAX_LEVEL && whole(state.maxLevel, 1, UNRESTRICTED_MAX_LEVEL)) p.set('maxLevel', String(state.maxLevel));
  if (state.kills !== KILL_LIMIT && whole(state.kills, 1, KILL_LIMIT)) p.set('kills', String(state.kills));
  return url;
}
