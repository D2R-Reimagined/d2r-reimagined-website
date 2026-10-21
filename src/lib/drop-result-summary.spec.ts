import { describe, expect, it } from 'vitest';
import { calculateDrops, matchesDropSource, type DropData, type DropResult, type DropSource } from './drop-calculator';
import { filterDropResults, formatDropChance, formatOneIn, hasPositiveChance, summarizeDropChances, TOP_DROP_CHANCES } from './drop-result-summary';
import exported from '../../static/data/keyed/drop-calculator.json';

const data = exported as DropData;
const translate = (key: string) => key;
const noFilters = { treasureClass: '', minLevel: 1, maxLevel: 9999, filter: '' };
let next = 0;
function row(chance: number | null, source: Partial<DropSource> = {}, extra: Partial<DropResult> = {}): DropResult {
  next++;
  return { source: { Id: `mob${String(next).padStart(4, '0')}`, NameKey: 'Monster', AreaKey: 'Area', Difficulty: 2, Kind: 'normal', Level: 80, TreasureClass: 'tc', ...source }, chance, ...extra };
}
const ids = (rows: DropResult[]) => rows.map(r => r.source.Id);
/** The detailed table filter before this summary existed, kept as a regression oracle. */
function legacyVisible(results: DropResult[], f: typeof noFilters, showZero: boolean) {
  return results.filter(r => matchesDropSource(r, f.treasureClass, f.minLevel, f.maxLevel) &&
    (showZero || (r.chance !== null && r.chance > 0)) &&
    `${translate(r.source.NameKey)} ${translate(r.source.AreaKey)}`.toLocaleLowerCase().includes(f.filter.toLocaleLowerCase()));
}

describe('top drop chances', () => {
  it('ranks by descending chance per kill', () => {
    const rows = [row(0.01), row(0.5), row(0.2), row(0.3), row(0.05), row(0.4)];
    const { top } = summarizeDropChances(rows);
    expect(top.map(r => r.chance)).toEqual([0.5, 0.4, 0.3, 0.2, 0.05]);
  });
  it('keeps tied chances in result order, the order the detailed table uses', () => {
    const a = row(0.1, { Id: 'b:2' }), b = row(0.1, { Id: 'a:2' }), c = row(0.1, { Id: 'z:0', Difficulty: 0 }), high = row(0.2);
    const rows = [a, b, high, c];
    expect(ids(summarizeDropChances(rows).top)).toEqual([high.source.Id, 'b:2', 'a:2', 'z:0']);
    expect(ids(summarizeDropChances(rows).top)).toEqual(ids(summarizeDropChances([...rows]).top));
    expect(ids(summarizeDropChances([c, b, a]).top)).toEqual(['z:0', 'a:2', 'b:2']);
  });
  it('selects from every row, not only the first page', () => {
    const rows = Array.from({ length: 180 }, (_, i) => row(0.001 + i / 100000));
    const { top, positive } = summarizeDropChances(rows);
    expect(positive).toBe(180);
    expect(top).toHaveLength(TOP_DROP_CHANCES);
    expect(top[0]).toBe(rows[179]);
    expect(top.map(r => r.chance)).toEqual(rows.slice(-5).reverse().map(r => r.chance));
  });
  it('returns fewer entries when fewer are eligible, and none for empty results', () => {
    expect(summarizeDropChances([row(0.2), row(0), row(0.1)]).top.map(r => r.chance)).toEqual([0.2, 0.1]);
    expect(summarizeDropChances([])).toEqual({ top: [], positive: 0, zero: 0, unavailable: 0 });
  });
  it('excludes true zero chances and counts them separately', () => {
    const summary = summarizeDropChances([row(0), row(0), row(0.3)]);
    expect(summary.top.map(r => r.chance)).toEqual([0.3]);
    expect(summary.zero).toBe(2);
  });
  it('excludes unavailable results without reclassifying them as zero', () => {
    const unavailable = row(null, {}, { reason: 'Conditional treasure class is not supported for this item' });
    const summary = summarizeDropChances([unavailable, row(0)]);
    expect(summary).toMatchObject({ top: [], positive: 0, zero: 1, unavailable: 1 });
    expect(unavailable.chance).toBeNull();
    expect(hasPositiveChance(unavailable)).toBe(false);
  });
  it('keeps distinct sources with identical labels and lists a repeated source id once', () => {
    const normal = row(0.1, { Id: 'skeleton1:3:0:normal', Kind: 'normal' });
    const champion = row(0.1, { Id: 'skeleton1:3:0:champion', Kind: 'champion' });
    const nightmare = row(0.1, { Id: 'skeleton1:3:1:normal', Difficulty: 1 });
    const repeat = { ...normal };
    const { top, positive } = summarizeDropChances([normal, champion, repeat, nightmare]);
    expect(positive).toBe(3);
    expect(ids(top)).toEqual(['skeleton1:3:0:normal', 'skeleton1:3:0:champion', 'skeleton1:3:1:normal']);
  });
  it('never changes the calculated chances it ranks', () => {
    const rows = [row(0.123456789), row(1 / 3)];
    const before = rows.map(r => r.chance);
    const { top } = summarizeDropChances(rows);
    expect(rows.map(r => r.chance)).toEqual(before);
    expect(top[0].chance).toBe(1 / 3);
  });
});

describe('result filters', () => {
  const rows = [
    row(0.3, { NameKey: 'Andariel', AreaKey: 'Catacombs Level 4', TreasureClass: 'Andariel', Level: 75 }),
    row(0.2, { NameKey: 'Fallen', AreaKey: 'Blood Moor', TreasureClass: 'Act 1 H2H A', Level: 5 }),
    row(0.4, { NameKey: 'Fallen Shaman', AreaKey: 'Blood Moor', Level: 6 }, { treasureClass: 'Act 1 H2H B' }),
    row(0, { NameKey: 'Fallen', AreaKey: 'Den of Evil', TreasureClass: 'Act 1 H2H A', Level: 5 }),
    row(null, { NameKey: 'Fallen', AreaKey: 'Cold Plains', TreasureClass: 'Act 1 H2H A', Level: 5 })
  ];
  const top = (filters: Partial<typeof noFilters>) => summarizeDropChances(filterDropResults(rows, { ...noFilters, ...filters }, translate));
  it('respects treasure class and monster level filters', () => {
    expect(top({ treasureClass: 'Act 1 H2H A' }).top.map(r => r.source.NameKey)).toEqual(['Fallen']);
    expect(top({ treasureClass: 'Act 1 H2H B' }).top.map(r => r.source.NameKey)).toEqual(['Fallen Shaman']);
    expect(top({ minLevel: 70 }).top.map(r => r.source.NameKey)).toEqual(['Andariel']);
    expect(top({ maxLevel: 5 })).toMatchObject({ positive: 1, zero: 1, unavailable: 1 });
  });
  it('respects the monster or area search text', () => {
    expect(top({ filter: 'blood' }).top.map(r => r.chance)).toEqual([0.4, 0.2]);
    expect(top({ filter: 'COLD' })).toMatchObject({ top: [], unavailable: 1 });
    expect(top({ filter: 'no such monster' })).toEqual({ top: [], positive: 0, zero: 0, unavailable: 0 });
  });
  it('matches the existing table filter for every zero / unavailable setting', () => {
    for (const filters of [noFilters, { ...noFilters, filter: 'fallen' }, { ...noFilters, maxLevel: 5 }, { ...noFilters, treasureClass: 'Andariel' }]) {
      const matched = filterDropResults(rows, filters, translate);
      expect(matched).toEqual(legacyVisible(rows, filters, true));
      expect(matched.filter(hasPositiveChance)).toEqual(legacyVisible(rows, filters, false));
    }
  });
});

describe('formatting', () => {
  it('uses the detailed table formats for chance and 1 in N', () => {
    expect(formatDropChance(0)).toBe('0%');
    expect(formatDropChance(1)).toBe('100%');
    expect(formatDropChance(0.9999999)).toBe('>99.999%');
    expect(formatDropChance(1, false)).toBe('>99.999%');
    expect(formatDropChance(0.000123456789)).toBe('0.012346%');
    expect(formatDropChance(0.25)).toBe('25%');
    expect(formatOneIn(0.25)).toBe('1 in 4');
    expect(formatOneIn(1 / 12345.6)).toBe('1 in 12,346');
    expect(formatOneIn(0)).toBe('—');
    expect(formatOneIn(null)).toBe('—');
  });
});

describe('exported data', () => {
  const rune = data.Items.find(item => item.Quality === 'rune')!;
  const settings = { players: 1, party: 1, magicFind: 0, difficulty: 2, kind: 'boss' };
  const bosses: DropData = { ...data, Sources: data.Sources.filter(s => s.Kind === 'boss') };
  const results = calculateDrops(bosses, rune, settings);
  it('ranks only rows produced for the selected difficulty and monster type', () => {
    const { top, positive } = summarizeDropChances(results);
    expect(positive).toBeGreaterThan(0);
    for (const r of top) expect(r.source).toMatchObject({ Difficulty: 2, Kind: 'boss' });
    const nightmare = summarizeDropChances(calculateDrops(bosses, rune, { ...settings, difficulty: 1 })).top;
    for (const r of nightmare) expect(r.source.Difficulty).toBe(1);
  });
  it('matches the highest calculated chances and leaves the table rows and pages unchanged', () => {
    const { top } = summarizeDropChances(results);
    const best = results.filter(hasPositiveChance).map(r => r.chance).sort((a, b) => b - a).slice(0, top.length);
    expect(top.map(r => r.chance)).toEqual(best);
    const matched = filterDropResults(results, noFilters, translate);
    expect(matched.filter(hasPositiveChance)).toEqual(legacyVisible(results, noFilters, false));
    expect(matched).toEqual(results);
  });
  it('agrees with the first table rows when many chances tie', () => {
    const eye = data.Items.find(item => item.Id === "set:Tal Rasha's Lidless Eye")!;
    const normal = calculateDrops(bosses, eye, { ...settings, difficulty: 0 });
    const table = filterDropResults(normal, noFilters, translate).filter(hasPositiveChance);
    const { top } = summarizeDropChances(normal);
    expect(new Set(table.slice(0, 6).map(r => r.chance)).size).toBe(1);
    expect(top).toEqual(table.slice(0, TOP_DROP_CHANCES));
  });
});
