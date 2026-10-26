import { NO_DROP_ROW, VOID_ROW, type MonsterDropReport, type MonsterDropRow } from './monster-drop-calculator';

/** Disjoint split of every drop result: NoDrop + Void + successful outcomes = total. */
export interface DropTally { noDrop: number; void: number; successful: number; total: number }
export interface DropDistribution {
  /** Theoretical counts across all kills; the denominator of every expected share. */
  expected: DropTally;
  /** Seeded run counts; the denominator is the reported total roll count. */
  simulated: DropTally | null;
  /** False if the row counts do not add up to the reported simulated total. */
  reconciled: boolean;
}

function tally(rows: MonsterDropRow[], value: (row: MonsterDropRow) => number): DropTally {
  const out = { noDrop: 0, void: 0, successful: 0, total: 0 };
  for (const row of rows) {
    const amount = value(row);
    if (row.id === NO_DROP_ROW.id) out.noDrop += amount;
    else if (row.id === VOID_ROW.id) out.void += amount;
    else out.successful += amount;
    out.total += amount;
  }
  return out;
}

/** Always built from every report row, so table filters never change the denominators. */
export function dropDistribution(report: MonsterDropReport): DropDistribution {
  const expected = tally(report.rows, row => row.expected);
  if (!report.simulated) return { expected, simulated: null, reconciled: true };
  const counted = tally(report.rows, row => row.count);
  return { expected, simulated: { ...counted, total: report.totalDrops }, reconciled: counted.total === report.totalDrops };
}

/** Fraction of a distribution; null when the denominator is empty. */
export const share = (value: number, total: number): number | null => total > 0 && Number.isFinite(value) ? value / total : null;

export function rowShares(row: MonsterDropRow, distribution: DropDistribution) {
  return {
    expected: share(row.expected, distribution.expected.total),
    simulated: distribution.simulated ? share(row.count, distribution.simulated.total) : null,
  };
}

/** Share of all results covered by a filtered subset of rows, against the full denominators. */
export function coverage(rows: MonsterDropRow[], distribution: DropDistribution) {
  return {
    expected: share(rows.reduce((n, r) => n + r.expected, 0), distribution.expected.total),
    simulated: distribution.simulated ? share(rows.reduce((n, r) => n + r.count, 0), distribution.simulated.total) : null,
  };
}

/** Percent text that keeps rare nonzero results visible: two decimals from 1%,
 * three significant digits below that, scientific notation below 0.0001%. */
export function formatPercent(fraction: number | null): string {
  if (fraction === null || !Number.isFinite(fraction)) return '—';
  const percent = fraction * 100;
  if (percent === 0) return '0%';
  if (percent >= 1) return `${percent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
  if (percent >= 1e-4) return `${percent.toLocaleString('en-US', { maximumSignificantDigits: 3 })}%`;
  return `${percent.toExponential(2)}%`;
}
