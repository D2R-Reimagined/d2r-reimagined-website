import type { DropResult } from './drop-calculator';
import { formatDropChance, formatOneIn } from './drop-result-summary';

/** Presentation model for the Find an item results table. Compact and detailed views read the
 * same calculated rows and only choose which formatted cells to show; nothing is recalculated. */
export type DropColumnId = 'monster' | 'area' | 'difficulty' | 'level' | 'treasureClass' | 'chance' | 'odds' | 'simulated' | 'expected' | 'atLeastOne';
export interface DropColumn { id: DropColumnId; label: string; numeric: boolean; detailedOnly: boolean }

/** Every column in its original table order. Detailed view shows all of them. */
export const DROP_RESULT_COLUMNS: readonly DropColumn[] = [
  { id: 'monster', label: 'Monster', numeric: false, detailedOnly: false },
  { id: 'area', label: 'Area', numeric: false, detailedOnly: false },
  { id: 'difficulty', label: 'Difficulty', numeric: false, detailedOnly: false },
  { id: 'level', label: 'Level', numeric: false, detailedOnly: true },
  { id: 'treasureClass', label: 'Treasure class', numeric: false, detailedOnly: true },
  { id: 'chance', label: 'Chance / kill', numeric: true, detailedOnly: false },
  { id: 'odds', label: 'Odds (average kills)', numeric: true, detailedOnly: false },
  { id: 'simulated', label: 'Simulated successful kills', numeric: true, detailedOnly: true },
  { id: 'expected', label: 'Expected successful kills', numeric: true, detailedOnly: true },
  { id: 'atLeastOne', label: 'Chance of at least one success', numeric: true, detailedOnly: true }
];

export const dropResultColumns = (detailed: boolean): DropColumn[] => DROP_RESULT_COLUMNS.filter(column => detailed || !column.detailedOnly);

export const DROP_DIFFICULTY_LABELS = ['Normal', 'Nightmare', 'Hell'];
export const DROP_KIND_LABELS: Record<string, string> = { all: 'All monsters', normal: 'Normal', champion: 'Champion', unique: 'Unique', superunique: 'Superunique', boss: 'Boss', quest: 'Quest boss' };

/** Positive and zero are calculated chances; unavailable rows could not be evaluated and are not zero. */
export type DropRowState = 'positive' | 'zero' | 'unavailable';
export interface DropRowView {
  state: DropRowState;
  monster: string; kind: string; level: string; levelNumber: string; area: string; difficulty: string; treasureClass: string;
  chance: string; odds: string; reason?: string;
  simulated: string; expected: string; atLeastOne: string;
}

const countFormat = new Intl.NumberFormat();
const expectedFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

export const dropRowState = (row: DropResult): DropRowState => row.chance === null ? 'unavailable' : row.chance > 0 ? 'positive' : 'zero';

/** Formats one calculated row for either view. Values come straight from `calculateDrops` and the worker's simulation. */
export function presentDropRow(row: DropResult, translate: (key: string) => string): DropRowView {
  const state = dropRowState(row);
  const { source, simulation } = row;
  return {
    state,
    monster: translate(source.NameKey),
    kind: DROP_KIND_LABELS[source.Kind] ?? source.Kind,
    level: `Level ${source.Level}`,
    levelNumber: String(source.Level),
    area: source.AreaKey ? translate(source.AreaKey) : 'Fixed / summoned spawn',
    difficulty: DROP_DIFFICULTY_LABELS[source.Difficulty] ?? String(source.Difficulty),
    treasureClass: row.treasureClass ?? source.TreasureClass,
    chance: row.chance === null ? 'Unavailable' : formatDropChance(row.chance),
    odds: state === 'positive' ? formatOneIn(row.chance) : state === 'zero' ? 'No drop chance' : 'Not calculated',
    reason: state === 'unavailable' ? row.reason ?? 'Unsupported drop data' : undefined,
    simulated: simulation ? countFormat.format(simulation.successes) : '—',
    expected: simulation ? expectedFormat.format(simulation.expected) : '—',
    atLeastOne: simulation ? formatDropChance(simulation.atLeastOne, row.chance === 1) : '—'
  };
}

export const DROP_RESULTS_PAGE_SIZE = 50;
export const dropResultsPage = <T>(rows: readonly T[], page: number, size = DROP_RESULTS_PAGE_SIZE): T[] => rows.slice(page * size, (page + 1) * size);
export const dropResultsPageCount = (count: number, size = DROP_RESULTS_PAGE_SIZE) => Math.ceil(count / size);
