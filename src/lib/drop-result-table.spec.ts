import { describe, expect, it } from 'vitest';
import { calculateDrops, simulateKills, type DropData, type DropResult, type DropSource } from './drop-calculator';
import { filterDropResults, formatDropChance, hasPositiveChance, NEAR_CERTAIN_CHANCE, summarizeDropChances } from './drop-result-summary';
import { DROP_RESULT_COLUMNS, DROP_RESULTS_PAGE_SIZE, dropResultColumns, dropResultsPage, dropResultsPageCount, presentDropRow } from './drop-result-table';
import exported from '../../static/data/keyed/drop-calculator.json';

const data = exported as DropData;
const translate = (key: string) => key;
const noFilters = { treasureClass: '', minLevel: 1, maxLevel: 9999, filter: '' };
let next = 0;
function row(chance: number | null, source: Partial<DropSource> = {}, extra: Partial<DropResult> = {}): DropResult {
  next++;
  return { source: { Id: `mob${next}`, NameKey: 'Monster', AreaKey: 'Area', Difficulty: 2, Kind: 'unique', Level: 85, TreasureClass: 'tc', ...source }, chance, ...extra };
}
const labels = (detailed: boolean) => dropResultColumns(detailed).map(column => column.label);
/** The header of the table before compact and detailed views existed. */
const legacyHeader = ['Monster', 'Area', 'Difficulty', 'Level', 'Treasure class', 'Chance / kill', 'Average kills', 'Simulated successful kills', 'Expected successful kills', 'Chance of at least one success'];

describe('result table views', () => {
  it('compact view keeps the player-facing columns, with monster level in the monster cell', () => {
    expect(labels(false)).toEqual(['Monster', 'Area', 'Difficulty', 'Chance / kill', 'Odds (average kills)']);
    const view = presentDropRow(row(0.25, { NameKey: 'Bishibosh', AreaKey: 'Cold Plains', Difficulty: 1, Kind: 'superunique', Level: 42 }), translate);
    expect(view).toMatchObject({ monster: 'Bishibosh', kind: 'Superunique', level: 'Level 42', area: 'Cold Plains', difficulty: 'Nightmare', chance: '25%', odds: '1 in 4' });
  });
  it('detailed view exposes every original column in the original order', () => {
    expect(dropResultColumns(true)).toEqual([...DROP_RESULT_COLUMNS]);
    expect(labels(true)).toEqual(legacyHeader.map(label => label === 'Average kills' ? 'Odds (average kills)' : label));
    for (const column of dropResultColumns(false)) expect(dropResultColumns(true)).toContainEqual(column);
  });
  it('formats every original statistic from the calculated row', () => {
    const calculated = row(0.001, { Level: 77, TreasureClass: 'Act 5 Champ C' }, { treasureClass: 'Act 5 Champ C (H)', simulation: { kills: 1000, successes: 2, expected: 1, atLeastOne: 0.6323045752290363 } });
    expect(presentDropRow(calculated, translate)).toMatchObject({
      levelNumber: '77', treasureClass: 'Act 5 Champ C (H)', chance: '0.1%', odds: '1 in 1,000',
      simulated: '2', expected: '1', atLeastOne: '63.23%'
    });
    expect(presentDropRow(row(0.5), translate)).toMatchObject({ simulated: '—', expected: '—', atLeastOne: '—' });
  });
  it('keeps distinct variants and long names intact', () => {
    const long = 'A Very Long Monster Name That Would Previously Need Horizontal Scrolling To Read';
    const champion = presentDropRow(row(0.1, { NameKey: long, Kind: 'champion', AreaKey: 'The Ancients\u2019 Way Through The Frozen Summit Of Arreat' }), translate);
    const unique = presentDropRow(row(0.1, { NameKey: long, Kind: 'unique' }), translate);
    expect(champion.monster).toBe(long);
    expect(champion.area).toBe('The Ancients\u2019 Way Through The Frozen Summit Of Arreat');
    expect(champion.kind).not.toBe(unique.kind);
    expect(presentDropRow(row(0.1, { AreaKey: '' }), translate).area).toBe('Fixed / summoned spawn');
  });
});

describe('switching views', () => {
  const rune = data.Items.find(item => item.Quality === 'rune')!;
  // Bosses across all difficulties: several table pages without recalculating every exported source.
  const bosses: DropData = { ...data, Sources: data.Sources.filter(s => s.Kind === 'boss') };
  const results = calculateDrops(bosses, rune, { players: 1, party: 1, magicFind: 0, difficulty: -1, kind: 'all' });
  for (const r of results) if (r.chance !== null) r.simulation = simulateKills(r.chance, 1000, () => 0.5);
  const snapshot = JSON.stringify(results);
  it('presents rows without modifying calculated values', () => {
    const views = JSON.stringify(results.map(r => presentDropRow(r, translate)));
    expect(JSON.stringify(results)).toBe(snapshot);
    expect(JSON.stringify(results.map(r => presentDropRow(r, translate)))).toBe(views);
  });
  it('keeps filters, pagination, result count and order independent of the view', () => {
    const visible = filterDropResults(results, noFilters, translate).filter(hasPositiveChance);
    expect(visible.length).toBeGreaterThan(DROP_RESULTS_PAGE_SIZE);
    for (const page of [0, 1]) expect(dropResultsPage(visible, page)).toEqual(visible.slice(page * 50, (page + 1) * 50));
    expect(dropResultsPageCount(visible.length)).toBe(Math.ceil(visible.length / 50));
    // The view only selects columns; the rows on a page and their order are the same input either way.
    const compact = dropResultsPage(visible, 1).map(r => presentDropRow(r, translate));
    const detailed = dropResultsPage(visible, 1).map(r => presentDropRow(r, translate));
    expect(compact).toEqual(detailed);
  });
  it('keeps the calculated highest-chance-first order', () => {
    const chances = dropResultsPage(results, 0).map(r => r.chance ?? -1);
    expect(chances).toEqual([...chances].sort((a, b) => b - a));
  });
  it('formats the same probability identically in the summary and the table', () => {
    const { top } = summarizeDropChances(results);
    const table = dropResultsPage(results.filter(hasPositiveChance), 0);
    expect(top.length).toBeGreaterThan(0);
    for (const entry of top) {
      const inTable = table.find(r => r.source.Id === entry.source.Id)!;
      expect(presentDropRow(entry, translate).chance).toBe(presentDropRow(inTable, translate).chance);
      expect(presentDropRow(entry, translate).odds).toBe(presentDropRow(inTable, translate).odds);
    }
  });
});

describe('zero, unavailable and near-certain results', () => {
  it('keeps calculated zero distinguishable from positive chances', () => {
    const zero = presentDropRow(row(0, {}, { simulation: simulateKills(0, 1000) }), translate);
    expect(zero).toMatchObject({ state: 'zero', chance: '0%', odds: 'No drop chance', simulated: '0', atLeastOne: '0%' });
    expect(zero.reason).toBeUndefined();
  });
  it('never represents an unsupported result as zero or impossible', () => {
    const view = presentDropRow(row(null, {}, { reason: 'Conditional treasure class is not supported for this item' }), translate);
    expect(view).toMatchObject({ state: 'unavailable', chance: 'Unavailable', odds: 'Not calculated', reason: 'Conditional treasure class is not supported for this item' });
    expect(Object.values(view)).not.toContain('0%');
    expect(Object.values(view).join(' ')).not.toMatch(/impossible|no drop chance/i);
  });
  it('shows exact 100% as 100%', () => {
    expect(formatDropChance(1)).toBe('100%');
    const certain = presentDropRow(row(1, {}, { simulation: simulateKills(1, 1000) }), translate);
    expect(certain).toMatchObject({ chance: '100%', odds: '1 in 1', atLeastOne: '100%' });
  });
  it('does not show a probability below 100% as a guaranteed 100%', () => {
    expect(formatDropChance(0.9999999)).toBe(NEAR_CERTAIN_CHANCE);
    expect(formatDropChance(0.999995)).toBe(NEAR_CERTAIN_CHANCE);
    expect(formatDropChance(0.99999)).toBe('99.999%');
    expect(formatDropChance(0.99994)).toBe('99.994%');
    // The cumulative chance of 100,000 kills at 1% per kill is 1 in floating point, but not certain.
    const simulation = simulateKills(0.01, 100000);
    expect(simulation.atLeastOne).toBe(1);
    expect(presentDropRow(row(0.01, {}, { simulation }), translate).atLeastOne).toBe(NEAR_CERTAIN_CHANCE);
    expect(presentDropRow(row(0.9999999), translate).chance).toBe(NEAR_CERTAIN_CHANCE);
  });
  it('keeps tiny positive chances visibly above zero', () => {
    expect(formatDropChance(1e-9)).toBe('0.0000001%');
  });
});
