import { beforeAll, describe, expect, it } from 'vitest';
import { monsterDrops, type MonsterDropReport, type MonsterDropRow } from './monster-drop-calculator';
import { dropDistribution, formatPercent, rowShares } from './monster-drop-stats';
import { monsterDropTsv } from './monster-drop-export';
import { formatDropChance, NEAR_CERTAIN_CHANCE } from './drop-result-summary';
import { dropResultsPage, DROP_RESULTS_PAGE_SIZE } from './drop-result-table';
import {
  DEFAULT_MONSTER_SORT, MONSTER_RESULT_COLUMNS, NOTABLE_CATEGORY, categoryFilterLabel, categoryLabel, chanceScope, filterMonsterRows, isInternalOutcome, isNotableRow,
  monsterCategories, monsterResultColumns, monsterResultsState, notableDrops, physicalDropSummary, presentMonsterRow, sortMonsterRows
} from './monster-drop-results';
import { readFileSync } from 'node:fs';
import type { DropData } from './drop-calculator';
import exported from '../../static/data/keyed/drop-calculator.json';

const data = exported as DropData;
const t = (key: string) => key;
const source = (id: string) => data.Sources.find(s => s.Id === id)!;
const run = (id: string, players = 1, options = {}, kills = 100, seed = 1, simulate = true) =>
  monsterDrops(data, source(id), { players, party: 1, magicFind: 0, difficulty: 2, kind: 'all' }, kills, seed, simulate, options);
const shown = (report: MonsterDropReport, detailed = false, filters: Partial<{ category: string; search: string; droppedOnly: boolean }> = {}) =>
  sortMonsterRows(filterMonsterRows(report, { category: 'all', search: '', droppedOnly: false, detailed, ...filters }, t), 'chance', true, report.simulated, t);
const row = (id: string, chance: number, expected = chance, count = 0, quality = 'misc'): MonsterDropRow => ({ id, nameKey: id, code: id, quality, chance, expected, count });

// The established 100-kill, seed 1 scenarios from the investigation.
let baal: MonsterDropReport, champion: MonsterDropReport, champion8: MonsterDropReport, normal: MonsterDropReport;
beforeAll(() => {
  baal = run('baalcrab:132:2:quest');
  champion = run('fallen5:0:2:champion');
  champion8 = run('fallen5:0:2:champion', 8);
  normal = run('fallen5:0:2:normal');
}, 120000);

describe('Hell Baal quest drop', () => {
  it('shows the guaranteed Forsaken Token as 100% per kill, not its 14.39% outcome share', () => {
    const token = baal.rows.find(r => r.id === 'base:lab')!;
    expect(token.chance).toBe(1);
    expect(presentMonsterRow(token, t)).toMatchObject({ chance: '100%', odds: '1 in 1', internal: false });
    const d = dropDistribution(baal);
    expect(formatPercent(rowShares(token, d).expected)).toBe('14.39%');
    expect(token.count).toBe(100);
    expect(shown(baal)[0].id).toBe('base:lab');
  });
  it('keeps the original terminal-outcome share and counts available in detailed statistics', () => {
    const before = structuredClone(baal);
    const detailed = shown(baal, true);
    expect(detailed.some(r => r.id === 'nodrop')).toBe(true);
    const token = detailed.find(r => r.id === 'base:lab')!;
    expect(rowShares(token, dropDistribution(baal)).simulated).toBeCloseTo(100 / 688, 12);
    expect(baal).toEqual(before);
  });
});

describe('Hell Warped One champion', () => {
  it('reports physical drops per kill separately from terminal outcomes per kill', () => {
    const summary = physicalDropSummary(champion);
    expect(summary.observed).toEqual({ drops: 141, perKill: 1.41 });
    expect(summary.terminal).toMatchObject({ observed: 400, observedPerKill: 4 });
    expect(summary.terminal.expectedPerKill).toBeCloseTo(4, 10);
    expect(summary.observed!.drops).toBe(champion.itemDrops);
    // NoDrop and Void never count as physical drops.
    const items = champion.rows.filter(r => !isInternalOutcome(r));
    expect(items.reduce((n, r) => n + r.count, 0)).toBe(141);
    expect(summary.expectedPerKill).toBeCloseTo(items.reduce((n, r) => n + r.expected, 0) / champion.kills, 12);
    expect(summary.expectedPerKill).toBeCloseTo(dropDistribution(champion).expected.successful / 100, 12);
  });
  it('hides NoDrop and Void from the default list without renormalizing anything', () => {
    for (const report of [champion, champion8]) {
      const d = dropDistribution(report), list = shown(report), all = shown(report, true);
      expect(list.some(isInternalOutcome)).toBe(false);
      expect(all.slice(0, 2).map(r => r.id).sort()).toEqual(['nodrop', 'void']);
      expect(list.length).toBe(all.length - 2);
      // Same row objects and values: hiding is a presentation choice only.
      for (const r of list) {
        expect(all).toContain(r);
        expect(rowShares(r, d)).toEqual(rowShares(report.rows.find(x => x.id === r.id)!, d));
      }
      const visibleShare = list.reduce((n, r) => n + rowShares(r, d).simulated!, 0);
      expect(visibleShare).toBeCloseTo(report.itemDrops / report.totalDrops, 12);
      expect(visibleShare).toBeLessThan(0.5);
      expect(d.simulated!.total).toBe(report.totalDrops);
    }
  });
  it('more players change only the calculated odds, not hidden-outcome bookkeeping', () => {
    const d1 = dropDistribution(champion), d8 = dropDistribution(champion8);
    expect(d8.simulated!.total).toBe(champion8.totalDrops);
    expect(physicalDropSummary(champion8).observed!.drops).toBe(champion8.itemDrops);
    expect(d1.simulated!.successful).toBe(champion.itemDrops);
    expect(d8.simulated!.successful).toBe(champion8.itemDrops);
    for (const r of shown(champion8)) expect(presentMonsterRow(r, t).chance).toBe(formatDropChance(r.chance));
  });
});

describe('normal monster', () => {
  it('stays intuitive at about one terminal outcome per kill', () => {
    const summary = physicalDropSummary(normal);
    expect(summary.terminal.expectedPerKill).toBeCloseTo(1, 10);
    expect(summary.observed).toEqual({ drops: normal.itemDrops, perKill: normal.itemDrops / 100 });
    const list = shown(normal);
    expect(list[0].id).toBe('base:gld');
    expect(list.every((r, i) => i === 0 || list[i - 1].chance >= r.chance)).toBe(true);
    expect(monsterResultsState(normal, list)).toBe('items');
  });
});

describe('grouped results', () => {
  it('labels collapsed group chances as at least one member and preserves the semantics', () => {
    const grouped = run('fallen5:0:2:champion', 1, { collapse: true }, 2000, 3), plain = run('fallen5:0:2:champion', 1, {}, 2000, 3);
    const uniques = grouped.rows.find(r => r.id === 'group:unique')!;
    const members = plain.rows.filter(r => r.quality === 'unique');
    expect(members.length).toBeGreaterThan(1);
    expect(chanceScope(uniques)).toBe('Chance of at least one member of this group');
    expect(presentMonsterRow(uniques, t).scope).toMatch(/at least one member/);
    // At least one of the group: no less than any member, no more than the sum of members.
    expect(uniques.chance).toBeGreaterThanOrEqual(Math.max(...members.map(r => r.chance)) - 1e-12);
    expect(uniques.chance).toBeLessThanOrEqual(members.reduce((n, r) => n + r.chance, 0) + 1e-12);
    expect(uniques.expected).toBeCloseTo(members.reduce((n, r) => n + r.expected, 0), 8);
    expect(uniques.count).toBe(members.reduce((n, r) => n + r.count, 0));
    expect(physicalDropSummary(grouped).observed).toEqual(physicalDropSummary(plain).observed);
    expect(physicalDropSummary(grouped).expectedPerKill).toBeCloseTo(physicalDropSummary(plain).expectedPerKill!, 10);
    const leaves = run('fallen5:0:2:champion', 1, { leaves: true, collapse: true }, 2000, 3);
    expect(physicalDropSummary(leaves).expectedPerKill).toBeCloseTo(physicalDropSummary(plain).expectedPerKill!, 10);
    expect(new Set(leaves.rows.map(r => r.id)).size).toBe(leaves.rows.length);
    expect(chanceScope(row('base:hp5', 0.3))).toBeUndefined();
    expect(chanceScope(row('tc:Jewelry A', 0.3, 0.3, 0, 'treasure class'))).toMatch(/from this class/);
    expect(chanceScope(row('nodrop', 1, 1, 0, 'no drop'))).toMatch(/not an item/);
  }, 60000);
});

describe('formatting and labels', () => {
  it('formats exact and near-certain chances', () => {
    expect(presentMonsterRow(row('a', 1), t).chance).toBe('100%');
    expect(presentMonsterRow(row('a', 0.9999999), t)).toMatchObject({ chance: NEAR_CERTAIN_CHANCE, odds: '1 in 1' });
    expect(presentMonsterRow(row('a', 0.25), t)).toMatchObject({ chance: '25%', odds: '1 in 4' });
    expect(presentMonsterRow(row('a', 1e-9), t).chance).toBe('0.0000001%');
  });
  it('uses understandable category labels and offers no-drop only in detailed mode', () => {
    expect(categoryLabel('other equipment')).toBe('Base equipment');
    expect(categoryLabel('no drop')).toBe('No item (internal outcome)');
    expect(monsterCategories(false)).not.toContain('no drop');
    expect(monsterCategories(true)).toContain('no drop');
  });
});

describe('columns and sorting', () => {
  it('shows chance per kill by default and technical shares only in detailed mode', () => {
    expect(monsterResultColumns(true, false).map(c => c.id)).toEqual(['name', 'quality', 'chance', 'odds', 'count']);
    expect(monsterResultColumns(false, false).map(c => c.id)).toEqual(['name', 'quality', 'chance', 'odds']);
    expect(monsterResultColumns(true, true).map(c => c.id)).toEqual(['name', 'quality', 'chance', 'odds', 'count', 'expected', 'expectedShare', 'simulatedShare']);
    expect(monsterResultColumns(false, true).map(c => c.id)).not.toContain('simulatedShare');
    expect(MONSTER_RESULT_COLUMNS.find(c => c.id === 'chance')!.label).toBe('Chance per kill');
    expect(DEFAULT_MONSTER_SORT).toEqual({ column: 'chance', desc: true });
  });
  it('gives each column a unique id so only one can show the active sort indicator', () => {
    const ids = MONSTER_RESULT_COLUMNS.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    // Shared keys keep their meaning, but the indicator follows the clicked column id.
    expect(MONSTER_RESULT_COLUMNS.filter(c => c.sort === 'expected').map(c => c.id)).toEqual(['expected', 'expectedShare']);
    expect(MONSTER_RESULT_COLUMNS.filter(c => c.sort === 'count').map(c => c.id)).toEqual(['count', 'simulatedShare']);
    const active = (column: string) => MONSTER_RESULT_COLUMNS.filter(c => c.id === column);
    expect(active('expectedShare')).toHaveLength(1);
  });
  it('sorts by chance with deterministic ties regardless of input order', () => {
    const rows = [row('b', 0.5, 2), row('c', 0.5, 2), row('a', 0.5, 3), row('d', 0.9)];
    const order = (input: MonsterDropRow[]) => sortMonsterRows(input, 'chance', true, true, t).map(r => r.id);
    expect(order(rows)).toEqual(['d', 'a', 'b', 'c']);
    expect(order([...rows].reverse())).toEqual(['d', 'a', 'b', 'c']);
    expect(sortMonsterRows(rows, 'chance', false, true, t).map(r => r.id)).toEqual(['a', 'b', 'c', 'd']);
    expect(sortMonsterRows(rows, 'name', false, true, t).map(r => r.id)).toEqual(['a', 'b', 'c', 'd']);
    // Without a simulation, count sorting falls back to expected count as before.
    expect(sortMonsterRows(rows, 'count', true, false, t).map(r => r.id)).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('empty and unavailable states', () => {
  const base = (rows: MonsterDropRow[], itemDrops: number, simulated = true): MonsterDropReport =>
    ({ rows, kills: 10, seed: 1, simulated, totalDrops: rows.reduce((n, r) => n + r.count, 0), itemDrops, treasureClass: 'root' });
  it('distinguishes impossible items, nothing dropped this run, and filtered-out results', () => {
    const impossible = base([row('nodrop', 1, 10, 10, 'no drop')], 0);
    expect(monsterResultsState(impossible, shown(impossible))).toBe('no-items-possible');
    expect(physicalDropSummary(impossible)).toMatchObject({ observed: { drops: 0, perKill: 0 }, expectedPerKill: 0 });
    const unlucky = base([row('nodrop', 1, 9.9, 10, 'no drop'), row('rare', 0.01, 0.1, 0)], 0);
    expect(monsterResultsState(unlucky, shown(unlucky))).toBe('none-dropped');
    expect(shown(unlucky).map(r => r.id)).toEqual(['rare']);
    expect(monsterResultsState(unlucky, shown(unlucky, false, { search: 'zzz' }))).toBe('filtered-empty');
    expect(monsterResultsState(unlucky, shown(unlucky, false, { droppedOnly: true }))).toBe('filtered-empty');
  });
  it('shows no observed physical-drop rate when nothing was simulated', () => {
    const rates = run('fallen5:0:2:normal', 1, {}, 100, 1, false), summary = physicalDropSummary(rates);
    expect(summary.observed).toBeNull();
    expect(summary.terminal.observedPerKill).toBeNull();
    expect(summary.expectedPerKill).toBeCloseTo(physicalDropSummary(normal).expectedPerKill!, 12);
    expect(monsterResultColumns(rates.simulated, false).map(c => c.id)).not.toContain('count');
  });
  it('reports a conditional source as unavailable rather than a zero chance', () => {
    expect(() => monsterDrops({ ...data, TreasureClasses: [{ Code: 'root', Picks: 1, Entries: [{ Code: 'missing-item', Weight: 1 }], NoDrop: 0, Group: '', Level: 0, Unique: 0, Set: 0, Condition: '', QuestFlag: '', QuestFlagEx: '' }] },
      { ...source('fallen5:0:2:normal'), TreasureClass: 'root' }, { players: 1, party: 1, magicFind: 0, difficulty: 2, kind: 'all' }, 1, 1, true)).toThrow();
  });
});

describe('preserved table features', () => {
  it('filters by category and text, paginates and exports the shown rows with the full denominators', () => {
    const big = run('fallen5:0:2:champion', 1, {}, 100, 1);
    const list = shown(big);
    expect(list.length).toBeGreaterThan(DROP_RESULTS_PAGE_SIZE);
    expect(dropResultsPage(list, 0)).toHaveLength(DROP_RESULTS_PAGE_SIZE);
    expect(dropResultsPage(list, 1)[0]).toBe(list[DROP_RESULTS_PAGE_SIZE]);
    const uniques = shown(big, false, { category: 'unique' });
    expect(uniques.length).toBeGreaterThan(0);
    expect(uniques.every(r => r.quality === 'unique')).toBe(true);
    expect(shown(big, false, { category: 'no drop' })).toEqual([]);
    expect(shown(big, true, { category: 'no drop' }).map(r => r.id).sort()).toEqual(['nodrop', 'void']);
    expect(shown(big, false, { search: 'hp5' }).map(r => r.id)).toEqual(['base:hp5']);
    const text = monsterDropTsv(big, list, [], t), lines = text.trimEnd().split('\n');
    expect(lines.some(l => l.startsWith('nodrop\t') || l.startsWith('NoDrop\t'))).toBe(false);
    expect(text).toMatch(/^# NoDrop\t/m);
    expect(text).toContain(`# Total simulated rolls\t${big.totalDrops}`);
    expect(text).toContain(`# Item drops\t${big.itemDrops}`);
    const detailedText = monsterDropTsv(big, shown(big, true), [], t);
    expect(detailedText).toMatch(/^NoDrop\t/m);
  }, 60000);
  it('keeps the TSV export of filtered rows identical to exporting those rows directly', () => {
    const list = shown(champion, false, { category: NOTABLE_CATEGORY, search: 'a' });
    expect(monsterDropTsv(champion, list, [], t)).toBe(monsterDropTsv(champion, [...list], [], t));
    expect(monsterDropTsv(champion, list, [], t).trimEnd().split('\n').filter(l => !l.startsWith('#')).length).toBe(list.length + 1);
  });
  it('does not change the report or rerun anything when toggling presentation', () => {
    const before = structuredClone(champion);
    for (const detailed of [false, true, false]) {
      filterMonsterRows(champion, { category: 'all', search: '', droppedOnly: true, detailed }, t);
      sortMonsterRows(champion.rows, 'name', false, true, t);
      physicalDropSummary(champion);
    }
    expect(champion).toEqual(before);
  });
});

describe('loot discovery', () => {
  const report = (rows: MonsterDropRow[]): MonsterDropReport =>
    ({ rows, kills: 10, seed: 1, simulated: true, totalDrops: rows.reduce((n, r) => n + r.count, 0), itemDrops: 0, treasureClass: 'root' });
  const names: Record<string, string> = { 'u:shako': 'Harlequin Crest', 'r:ber': 'Ber Rune', 's:tal': "Tal Rasha's Lidless Eye", 'base:cap': 'Cap' };
  const tr = (key: string) => names[key] ?? key;

  it('matches displayed names case-insensitively by substring, ignoring surrounding spaces', () => {
    const r = report([row('u:shako', 0.1, 0.1, 0, 'unique'), row('r:ber', 0.01, 0.01, 0, 'rune'), row('base:cap', 0.2, 0.2, 0, 'other equipment')]);
    const ids = (search: string, category = 'all') => filterMonsterRows(r, { category, search, droppedOnly: false, detailed: false }, tr).map(x => x.id);
    expect(ids('HARLEQ')).toEqual(['u:shako']);
    expect(ids('  rune ')).toEqual(['r:ber']);
    expect(ids('cre')).toEqual(['u:shako']);
    expect(ids('ca')).toEqual(['base:cap']);
    expect(ids('zzz')).toEqual([]);
    // Text and category filters combine.
    expect(ids('c', NOTABLE_CATEGORY)).toEqual(['u:shako']);
    expect(ids('c', 'other equipment')).toEqual(['base:cap']);
  });

  it('searches the whole result set across pages and keeps the original rows and values', () => {
    const before = structuredClone(champion);
    const all = shown(champion);
    expect(all.length).toBeGreaterThan(DROP_RESULTS_PAGE_SIZE * 2);
    const target = all.at(-1)!;
    expect(dropResultsPage(all, 0)).not.toContain(target);
    const found = shown(champion, false, { search: target.nameKey.toUpperCase() });
    expect(found).toContain(target);
    // A filter change starts again at page 0, which holds the match.
    expect(dropResultsPage(found, 0)).toContain(target);
    for (const r of found) expect(r).toBe(champion.rows.find(x => x.id === r.id));
    expect(champion).toEqual(before);
  });

  it('offers a combined unique, set and rune filter next to the existing categories', () => {
    expect(monsterCategories(false).slice(0, 2)).toEqual(['all', NOTABLE_CATEGORY]);
    expect(monsterCategories(false)).toEqual(expect.arrayContaining(['unique', 'set', 'rune', 'misc']));
    expect(categoryFilterLabel(NOTABLE_CATEGORY)).toBe('Uniques, sets & runes');
    expect(categoryFilterLabel('all')).toBe('All item types');
    expect(categoryFilterLabel('misc')).toBe('Miscellaneous');
    // Same settings as the shared 100-kill, seed 1 champion run.
    const big = champion;
    const notable = shown(big, false, { category: NOTABLE_CATEGORY });
    const each = ['unique', 'set', 'rune'].flatMap(category => shown(big, false, { category }));
    expect(notable.length).toBeGreaterThan(0);
    expect(notable.length).toBe(each.length);
    expect(new Set(notable)).toEqual(new Set(each));
    expect(notable.every(r => ['unique', 'set', 'rune'].includes(r.quality))).toBe(true);
    // Miscellaneous items stay reachable through their own category.
    expect(shown(big, false, { category: 'misc' }).length).toBeGreaterThan(0);
    expect(notable.some(r => r.quality === 'misc')).toBe(false);
  });

  it('ranks the five highest positive chances per kill with stable ties', () => {
    const rows = [row('u:a', 0.1, 0.1, 0, 'unique'), row('s:b', 0.3, 0.3, 0, 'set'), row('r:c', 0.2, 0.2, 0, 'rune'),
      row('u:e', 0.05, 0.05, 0, 'unique'), row('u:d', 0.05, 0.05, 0, 'unique'), row('u:f', 0.05, 0.06, 0, 'unique'), row('base:x', 0.9, 0.9, 0, 'other equipment'), row('m:orb', 0.8, 0.8, 0, 'misc')];
    const ids = (input: MonsterDropRow[]) => notableDrops(report(input)).top.map(r => r.id);
    expect(ids(rows)).toEqual(['s:b', 'r:c', 'u:a', 'u:f', 'u:d']);
    expect(ids([...rows].reverse())).toEqual(['s:b', 'r:c', 'u:a', 'u:f', 'u:d']);
    const summary = notableDrops(report(rows));
    expect(summary.eligible).toBe(6);
    expect(summary.limitation).toBeNull();
    // The same row objects and values as the report.
    expect(summary.top[0]).toBe(rows[1]);
    expect(presentMonsterRow(summary.top[0], t)).toMatchObject({ chance: '30%', category: 'Set' });
  });

  it('never recommends NoDrop, Void, zero, invalid, group or leaf results', () => {
    const rows = [row('nodrop', 1, 5, 0, 'no drop'), row('void', 1, 1, 0, 'no drop'), row('u:zero', 0, 0, 0, 'unique'), row('u:nan', NaN, 0, 0, 'unique'),
      row('u:big', 1.5, 1, 0, 'unique'), row('group:unique', 0.5, 0.5, 0, 'unique'), row('tc:Runes 3', 0.4, 0.4, 0, 'treasure class'), row('r:el', 0.01, 0.01, 0, 'rune')];
    expect(rows.filter(isNotableRow).map(r => r.id)).toEqual(['r:el']);
    expect(notableDrops(report(rows)).top.map(r => r.id)).toEqual(['r:el']);
  });

  it('reports empty states without filling in unrelated equipment', () => {
    const none = notableDrops(report([row('base:cap', 0.5, 0.5, 0, 'other equipment'), row('m:orb', 0.2, 0.2, 0, 'misc')]));
    expect(none).toEqual({ top: [], eligible: 0, limitation: null });
    expect(notableDrops(report([row('tc:Jewelry A', 0.5, 0.5, 0, 'treasure class')])).limitation).toBe('leaves');
    expect(notableDrops(report([row('group:set', 0.5, 0.5, 0, 'set')]))).toEqual({ top: [], eligible: 0, limitation: 'collapsed' });
  });

  it('handles collapsed groups by ranking only individual rows, without splitting group chances', () => {
    const grouped = run('fallen5:0:2:champion', 1, { collapse: true }, 100, 1), plain = champion;
    const g = notableDrops(grouped), p = notableDrops(plain);
    expect(g.limitation).toBe('collapsed');
    expect(g.top.every(r => r.quality === 'rune')).toBe(true);
    // Individual rune rows keep exactly the uncollapsed chance.
    for (const r of g.top) expect(r.chance).toBe(plain.rows.find(x => x.id === r.id)!.chance);
    expect(p.limitation).toBeNull();
    expect(p.top).toHaveLength(5);
    expect(p.top.every((r, i) => i === 0 || p.top[i - 1].chance >= r.chance)).toBe(true);
    for (const r of p.top) expect(r).toBe(plain.rows.find(x => x.id === r.id));
    const leaves = notableDrops(run('fallen5:0:2:champion', 1, { leaves: true }, 100, 1));
    expect(leaves.limitation).toBe('leaves');
    expect(leaves.top).toEqual([]);
  }, 60000);

  it('ranks individual results for a boss and an ordinary monster', () => {
    const boss = notableDrops(baal), ordinary = notableDrops(normal);
    for (const summary of [boss, ordinary]) {
      expect(summary.top.length).toBeGreaterThan(0);
      expect(summary.top.length).toBeLessThanOrEqual(5);
      expect(summary.top.every(isNotableRow)).toBe(true);
    }
  });

  it('keeps presentation controls away from the simulation worker', () => {
    const source = readFileSync(new URL('./components/MonsterDropSimulator.svelte', import.meta.url), 'utf8');
    const body = (name: string) => source.match(new RegExp(`function ${name}\\([^)]*\\) \\{[^\\n]*\\}`))?.[0] ?? '';
    for (const name of ['setSearch', 'setCategory', 'resetFilters', 'showInTable', 'showDetailed', 'sortBy']) {
      expect(source).toContain(`function ${name}(`);
      expect(body(name)).not.toMatch(/run\(|invalidate\(|postMessage/);
    }
    // Only explicit run requests and the existing row-shape options (through setRowShape) start the worker.
    expect(source.match(/run\(lastSimulate\)/g)).toHaveLength(1);
    expect(source.match(/function setRowShape\([\s\S]*?\n {2}\}/)?.[0]).toContain('run(lastSimulate)');
    expect(source).toContain('bind:value={() => search, setSearch}');
  });
});
