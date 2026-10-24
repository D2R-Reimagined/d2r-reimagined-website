import type { MonsterDropReport, MonsterDropRow } from './monster-drop-calculator';
import { coverage, dropDistribution, rowShares, share, type DropTally } from './monster-drop-stats';

const cell = (value: string | number) => String(value).replace(/[\t\r\n]+/g, ' ').trim();
const number = (value: number) => value.toLocaleString('en-US', { maximumSignificantDigits: 6, useGrouping: false });
const percent = (fraction: number | null) => fraction === null ? '' : number(fraction * 100);
// Expected counts scale with kills, so they keep more digits than percentages.
const count = (value: number) => value.toLocaleString('en-US', { maximumSignificantDigits: 10, useGrouping: false });

/** Tab-separated loot table for spreadsheets and AI tools: `#` lines hold run settings and
 * the overall distribution, then one header row and one row per result with plain numbers.
 * Shares use every result of the run as the denominator, exactly like the on-page table. */
export function monsterDropTsv(report: MonsterDropReport, rows: MonsterDropRow[], settings: [string, string | number][], name: (key: string) => string): string {
  const distribution = dropDistribution(report), simulated = distribution.simulated;
  const lines = settings.map(([label, value]) => `# ${cell(label)}\t${cell(value)}`);
  lines.push(`# Kills\t${report.kills}`, `# Root treasure class\t${cell(report.treasureClass)}`);
  if (simulated) lines.push(`# Seed\t${report.seed}`, `# Total simulated rolls\t${report.totalDrops}`, `# Item drops\t${report.itemDrops}`);
  lines.push(`# Expected rolls\t${count(distribution.expected.total)}`);
  lines.push('# Percent denominator\tall results of the run, including NoDrop and Void; filters do not renormalize');
  const summary = (label: string, key: keyof DropTally) => {
    const values = [label, percent(share(distribution.expected[key], distribution.expected.total))];
    if (simulated) values.push(percent(share(simulated[key], simulated.total)));
    values.push(count(distribution.expected[key]));
    if (simulated) values.push(String(simulated[key]));
    lines.push(`# ${values.join('\t')}`);
  };
  lines.push(`# Distribution\tExpected %${simulated ? '\tSimulated %' : ''}\tExpected count${simulated ? '\tSimulated count' : ''}`);
  summary('NoDrop', 'noDrop'); summary('Void', 'void'); summary('Successful outcomes', 'successful'); summary('All results', 'total');
  const covered = coverage(rows, distribution);
  lines.push(`# Rows exported\t${rows.length} of ${report.rows.length}`,
    `# Exported rows cover %\texpected ${percent(covered.expected)}${simulated ? `; simulated ${percent(covered.simulated)}` : ''}`);
  const header = ['Result', 'Code', 'Type', 'Expected %'];
  if (simulated) header.push('Simulated %');
  header.push('Expected count');
  if (simulated) header.push('Simulated count');
  header.push('Chance of at least one per kill %');
  lines.push(header.join('\t'));
  for (const row of rows) {
    const shares = rowShares(row, distribution);
    const values = [cell(name(row.nameKey)), cell(row.code), cell(row.quality), percent(shares.expected)];
    if (simulated) values.push(percent(shares.simulated));
    values.push(count(row.expected));
    if (simulated) values.push(String(row.count));
    values.push(number(row.chance * 100));
    lines.push(values.join('\t'));
  }
  return `${lines.join('\n')}\n`;
}
