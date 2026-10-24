import { NO_DROP_ROW, VOID_ROW, LEAF_QUALITY, type MonsterDropReport, type MonsterDropRow } from './monster-drop-calculator';
import { formatDropChance, formatOneIn } from './drop-result-summary';
import { dropDistribution } from './monster-drop-stats';

/** Presentation model for the Monster drops & simulation results. Every value shown comes
 * straight from `monsterDrops` and `dropDistribution`; nothing is recalculated, rescaled or
 * renormalized here. Hiding NoDrop and Void only removes rows from the player-facing list. */

/** Sort keys keep their original meaning; several columns may share one key, but only the
 * clicked column shows the active sort indicator. */
export type MonsterSortKey = 'name' | 'quality' | 'expected' | 'count' | 'chance';
export type MonsterColumnId = 'name' | 'quality' | 'chance' | 'odds' | 'count' | 'expected' | 'expectedShare' | 'simulatedShare';
export interface MonsterColumn {
  id: MonsterColumnId; label: string; title: string;
  /** Null for a column derived from another one (odds mirror chance per kill). */
  sort: MonsterSortKey | null;
  numeric: boolean; detailedOnly: boolean; simulatedOnly: boolean;
  /** Folded into the first columns on narrow screens instead of a column of its own. */
  secondary: boolean;
}

export const MONSTER_RESULT_COLUMNS: readonly MonsterColumn[] = [
  { id: 'name', label: 'Item', title: 'Item, group or treasure class', sort: 'name', numeric: false, detailedOnly: false, simulatedOnly: false, secondary: false },
  { id: 'quality', label: 'Category', title: 'Item category', sort: 'quality', numeric: false, detailedOnly: false, simulatedOnly: false, secondary: true },
  { id: 'chance', label: 'Chance per kill', title: 'Probability that one kill drops this result at least once', sort: 'chance', numeric: true, detailedOnly: false, simulatedOnly: false, secondary: false },
  { id: 'odds', label: 'Odds', title: 'Average kills for at least one, from the chance per kill', sort: null, numeric: true, detailedOnly: false, simulatedOnly: false, secondary: true },
  { id: 'count', label: 'Dropped this run', title: 'Times this result came up in the seeded simulation; a gold pile or stack counts once', sort: 'count', numeric: true, detailedOnly: false, simulatedOnly: true, secondary: false },
  { id: 'expected', label: 'Expected count', title: 'Theoretical average count across all kills; one kill can give a result more than once', sort: 'expected', numeric: true, detailedOnly: true, simulatedOnly: false, secondary: false },
  { id: 'expectedShare', label: 'Expected share of outcomes', title: 'Expected events for this row divided by expected events across all terminal outcomes, including NoDrop and Void', sort: 'expected', numeric: true, detailedOnly: true, simulatedOnly: false, secondary: false },
  { id: 'simulatedShare', label: 'Simulated share of outcomes', title: 'Events for this row divided by all terminal outcomes of this run, including NoDrop and Void', sort: 'count', numeric: true, detailedOnly: true, simulatedOnly: true, secondary: false },
];

export const monsterResultColumns = (simulated: boolean, detailed: boolean): MonsterColumn[] =>
  MONSTER_RESULT_COLUMNS.filter(column => (detailed || !column.detailedOnly) && (simulated || !column.simulatedOnly));

export const DEFAULT_MONSTER_SORT: { column: MonsterColumnId; desc: boolean } = { column: 'chance', desc: true };
/** Text columns start ascending, numbers descending. */
export const defaultSortDesc = (key: MonsterSortKey) => key !== 'name' && key !== 'quality';

/** NoDrop and Void are real treasure-class outcomes that never produce a physical item. */
export const isInternalOutcome = (row: Pick<MonsterDropRow, 'id'>) => row.id === NO_DROP_ROW.id || row.id === VOID_ROW.id;
/** Collapsed rows stand for several items; their chance is for any one of them. */
export const isGroupRow = (row: Pick<MonsterDropRow, 'id'>) => row.id.startsWith('group:') || row.id.startsWith('tc:group:');
export const isLeafRow = (row: Pick<MonsterDropRow, 'quality'>) => row.quality === LEAF_QUALITY;

export const MONSTER_CATEGORY_LABELS: Record<string, string> = {
  'treasure class': 'Treasure class', unique: 'Unique', set: 'Set', rune: 'Rune', misc: 'Miscellaneous',
  'other equipment': 'Base equipment', 'no drop': 'No item (internal outcome)',
};
export const categoryLabel = (quality: string) => MONSTER_CATEGORY_LABELS[quality] ?? quality;
/** Presentation-only filter combining the existing unique, set and rune categories. It is not a
 * rarity or value ranking: miscellaneous items such as orbs keep their own category. */
export const NOTABLE_CATEGORY = 'unique-set-rune';
export const NOTABLE_QUALITIES: readonly string[] = ['unique', 'set', 'rune'];
export const NOTABLE_CATEGORY_LABEL = 'Uniques, sets & runes';
/** Label of a category filter value, including the combined filter and "all". */
export const categoryFilterLabel = (value: string) => value === 'all' ? 'All item types' : value === NOTABLE_CATEGORY ? NOTABLE_CATEGORY_LABEL : categoryLabel(value);
/** Category filter values; the internal "no drop" category is only offered with detailed statistics. */
export const monsterCategories = (detailed: boolean) => ['all', NOTABLE_CATEGORY, ...Object.keys(MONSTER_CATEGORY_LABELS).filter(value => detailed || value !== 'no drop')];
const matchesCategory = (row: Pick<MonsterDropRow, 'quality'>, category: string) =>
  category === 'all' || (category === NOTABLE_CATEGORY ? NOTABLE_QUALITIES.includes(row.quality) : row.quality === category);

/** What a row's chance per kill means, for the label next to it. */
export function chanceScope(row: MonsterDropRow): string | undefined {
  if (isInternalOutcome(row)) return 'Chance of at least one such event per kill, not an item';
  if (isGroupRow(row)) return 'Chance of at least one member of this group';
  if (isLeafRow(row)) return 'Chance of at least one item from this class';
  return undefined;
}

export interface MonsterRowView { name: string; code: string; category: string; chance: string; odds: string; scope?: string; internal: boolean }
export function presentMonsterRow(row: MonsterDropRow, translate: (key: string) => string): MonsterRowView {
  return {
    name: translate(row.nameKey), code: row.code, category: categoryLabel(row.quality),
    chance: formatDropChance(row.chance), odds: formatOneIn(row.chance), scope: chanceScope(row), internal: isInternalOutcome(row),
  };
}

export interface MonsterRowFilters { category: string; search: string; droppedOnly: boolean; detailed: boolean }
/** Case-insensitive substring match on the displayed (translated) name; surrounding spaces are ignored. */
export const matchesMonsterSearch = (row: Pick<MonsterDropRow, 'nameKey'>, search: string, translate: (key: string) => string) =>
  translate(row.nameKey).toLocaleLowerCase().includes(search.trim().toLocaleLowerCase());
/** Filters only choose rows from the whole report (never one page); shares keep dividing by the whole run. */
export function filterMonsterRows(report: MonsterDropReport, filters: MonsterRowFilters, translate: (key: string) => string): MonsterDropRow[] {
  return report.rows.filter(row => (filters.detailed || !isInternalOutcome(row)) &&
    matchesCategory(row, filters.category) &&
    (!filters.droppedOnly || !report.simulated || row.count > 0) &&
    matchesMonsterSearch(row, filters.search, translate));
}

export const NOTABLE_DROPS_LIMIT = 5;
/** Why individual unique and set results may be missing from the notable summary. */
export type NotableLimitation = 'collapsed' | 'leaves' | null;
export interface NotableDrops { top: MonsterDropRow[]; eligible: number; limitation: NotableLimitation }
/** An individual unique, set or rune row with a confirmed positive chance per kill. Group rows,
 * treasure class leaves, NoDrop and Void never qualify: their chance is not one item's. */
export const isNotableRow = (row: MonsterDropRow) => NOTABLE_QUALITIES.includes(row.quality) && !isGroupRow(row) && !isLeafRow(row) &&
  !isInternalOutcome(row) && Number.isFinite(row.chance) && row.chance > 0 && row.chance <= 1;
/** Highest calculated chances per kill among individual unique, set and rune rows of the whole
 * report, independent of table filters. Ties fall back to expected count, then id, so the order
 * never depends on input order. The rows are returned as-is; nothing is rescaled or inferred. */
export function notableDrops(report: MonsterDropReport, limit = NOTABLE_DROPS_LIMIT): NotableDrops {
  const eligible = report.rows.filter(isNotableRow);
  const top = [...eligible].sort((a, b) => b.chance - a.chance || b.expected - a.expected || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)).slice(0, limit);
  const limitation: NotableLimitation = report.rows.some(isLeafRow) ? 'leaves'
    : report.rows.some(row => isGroupRow(row) && (row.quality === 'unique' || row.quality === 'set')) ? 'collapsed' : null;
  return { top, eligible: eligible.length, limitation };
}

/** Sorts by one key; ties fall back to chance per kill, expected count, then id, so the order never depends on input order. */
export function sortMonsterRows(rows: readonly MonsterDropRow[], key: MonsterSortKey, desc: boolean, simulated: boolean, translate: (key: string) => string): MonsterDropRow[] {
  const used = key === 'count' && !simulated ? 'expected' : key;
  const value = (row: MonsterDropRow) => used === 'name' ? translate(row.nameKey) : used === 'quality' ? categoryLabel(row.quality) : row[used];
  return [...rows].sort((a, b) => {
    const x = value(a), y = value(b);
    const order = typeof x === 'string' ? x.localeCompare(String(y)) : x - Number(y);
    return (desc ? -order : order) || b.chance - a.chance || b.expected - a.expected || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  });
}

/** Physical drops are generated items (equipment, gold, potions, ammunition, ...), one per pile or
 * stack. Terminal outcomes add NoDrop and Void and are reported separately for diagnostics. */
export interface PhysicalDropSummary {
  kills: number;
  /** Seeded run only; null when nothing was simulated. */
  observed: { drops: number; perKill: number } | null;
  /** Sum of the expected counts of item rows per kill. Rows are disjoint outcomes (collapsing only
   * renames them), so this sum counts every generated item once. */
  expectedPerKill: number | null;
  terminal: { expectedPerKill: number | null; observed: number | null; observedPerKill: number | null };
}
export function physicalDropSummary(report: MonsterDropReport): PhysicalDropSummary {
  const distribution = dropDistribution(report), kills = report.kills;
  const perKill = (value: number) => kills > 0 ? value / kills : null;
  // Duplicate row ids would mean the rows are not disjoint, so their sum could double-count.
  const disjoint = new Set(report.rows.map(row => row.id)).size === report.rows.length;
  return {
    kills,
    observed: report.simulated && kills > 0 ? { drops: report.itemDrops, perKill: report.itemDrops / kills } : null,
    expectedPerKill: disjoint ? perKill(distribution.expected.successful) : null,
    terminal: { expectedPerKill: perKill(distribution.expected.total), observed: report.simulated ? report.totalDrops : null,
      observedPerKill: report.simulated ? perKill(report.totalDrops) : null },
  };
}

/** Distinguishes why the item list can be empty or look empty. */
export type MonsterResultsState = 'items' | 'no-items-possible' | 'none-dropped' | 'filtered-empty';
export function monsterResultsState(report: MonsterDropReport, visible: readonly MonsterDropRow[]): MonsterResultsState {
  if (!report.rows.some(row => !isInternalOutcome(row))) return 'no-items-possible';
  if (!visible.length) return 'filtered-empty';
  if (report.simulated && report.itemDrops === 0) return 'none-dropped';
  return 'items';
}
