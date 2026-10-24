import { matchesDropSource, type DropResult } from './drop-calculator';

/** Presentation helpers for Find an item results. They only filter, order, and format
 * rows produced by `calculateDrops`; no probability is derived or recalculated here. */
export interface DropResultFilters { treasureClass: string; minLevel: number; maxLevel: number; filter: string }

export const TOP_DROP_CHANCES = 5;

/** Source and text filters shared by the detailed table and the summary, independent of
 * the zero / unavailable toggle, so both always describe the same filtered result set. */
export function filterDropResults(results: readonly DropResult[], filters: DropResultFilters, translate: (key: string) => string): DropResult[] {
  const text = filters.filter.toLocaleLowerCase();
  return results.filter(row => matchesDropSource(row, filters.treasureClass, filters.minLevel, filters.maxLevel) &&
    `${translate(row.source.NameKey)} ${translate(row.source.AreaKey)}`.toLocaleLowerCase().includes(text));
}

/** A confirmed, positive calculated chance. Unavailable (`null`) is not zero and is never ranked. */
export function hasPositiveChance(row: DropResult): row is DropResult & { chance: number } {
  return typeof row.chance === 'number' && row.chance > 0;
}

type Ranked = DropResult & { chance: number };

export interface DropChanceSummary { top: Ranked[]; positive: number; zero: number; unavailable: number }

/** Picks the highest positive chances from the whole filtered set (not one table page),
 * by descending chance per kill. Equal chances keep their order in `rows`, which for
 * calculator output is the exported source order the detailed table also uses, so ties
 * never reorder and the summary agrees with the table's first rows.
 * Rows repeating an exported source id are the same result and are listed once; distinct
 * ids with identical labels (e.g. champion and unique variants) are kept apart. */
export function summarizeDropChances(rows: readonly DropResult[], limit = TOP_DROP_CHANCES): DropChanceSummary {
  const seen = new Set<string>();
  const positive: { row: Ranked; index: number }[] = [];
  let zero = 0, unavailable = 0;
  for (const row of rows) {
    if (row.chance === null) { unavailable++; continue; }
    if (!hasPositiveChance(row)) { zero++; continue; }
    if (seen.has(row.source.Id)) continue;
    seen.add(row.source.Id);
    positive.push({ row, index: positive.length });
  }
  const top = positive.sort((a, b) => b.row.chance - a.row.chance || a.index - b.index).slice(0, limit).map(entry => entry.row);
  return { top, positive: positive.length, zero, unavailable };
}

/** Shown instead of 100% for a probability below 100% that rounds up at five significant digits.
 * Rounding to "100" needs at least 99.9995%, so the bound is always true. */
export const NEAR_CERTAIN_CHANCE = '>99.999%';
// Reused formatters produce the same text as `toLocaleString` with these options, without rebuilding one per value.
const percentFormat = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 5 });
const killsFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
/** A probability as shown in the results table and summary. Only an exact 100% (or a value the
 * caller knows is certain, e.g. the cumulative chance of a 100%-per-kill drop) reads "100%"; a
 * floating-point value that merely reaches 1 or rounds up to 100% reads `NEAR_CERTAIN_CHANCE`. */
export function formatDropChance(chance: number, certain = chance === 1): string {
  if (chance === 0) return '0%';
  if (certain) return '100%';
  const text = percentFormat.format(chance * 100);
  return text === '100' ? NEAR_CERTAIN_CHANCE : `${text}%`;
}
/** Average kills per success as shown in the detailed table; a dash when there is no positive chance. */
export const formatOneIn = (chance: number | null) => chance ? `1 in ${killsFormat.format(1 / chance)}` : '—';
