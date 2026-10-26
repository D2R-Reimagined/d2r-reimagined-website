import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import { monsterDrops, treasureClassSource, type MonsterDropOptions, type MonsterDropReport } from './monster-drop-calculator';
import { readMonsterDropUrl, writeMonsterDropUrl } from './monster-drop-url';
import { monsterDropTsv } from './monster-drop-export';
import { DROP_RESULTS_PAGE_SIZE, dropResultsPage, dropResultsPageCount } from './drop-result-table';
import { NOTABLE_CATEGORY, filterMonsterRows, isLeafRow, notableDrops, sortMonsterRows } from './monster-drop-results';
import {
  RESULT_PERSPECTIVES, activeFilters, leavesFor, missingItemHint, notableRecovery, perspectiveInfo, perspectiveOf, resultBasis, resultControls
} from './monster-drop-perspective';
import type { DropData } from './drop-calculator';
import exported from '../../static/data/keyed/drop-calculator.json';

const data = exported as DropData;
const t = (key: string) => key;
const base = new URL('https://example.com/data/drop-calculator?mode=simulate');
const component = readFileSync(new URL('./components/MonsterDropSimulator.svelte', import.meta.url), 'utf8');
const fn = (name: string) => component.match(new RegExp(`function ${name}\\([^)]*\\) \\{[\\s\\S]*?(\\}\\n|\\n {2}\\})`))?.[0] ?? '';
// The recording's workflow: Act 5 (H) Unique C Desecrated chosen as a treasure class at level 96.
const desecrated = treasureClassSource('Act 5 (H) Unique C Desecrated', 2, 96);
const settings = { players: 1, party: 1, magicFind: 0, difficulty: 2, kind: 'all' as const };
const run = (options: MonsterDropOptions = {}, simulate = true, kills = 300, seed = 7) => monsterDrops(data, desecrated, settings, kills, seed, simulate, options);
const shown = (report: MonsterDropReport, filters: Partial<{ category: string; search: string; droppedOnly: boolean; detailed: boolean }> = {}) =>
  sortMonsterRows(filterMonsterRows(report, { category: 'all', search: '', droppedOnly: false, detailed: false, ...filters }, t), 'chance', true, report.simulated, t);

let items: MonsterDropReport, breakdown: MonsterDropReport, collapsed: MonsterDropReport, both: MonsterDropReport, rates: MonsterDropReport;
beforeAll(() => {
  items = run(); breakdown = run({ leaves: true }); collapsed = run({ collapse: true }); both = run({ leaves: true, collapse: true });
  rates = run({}, false);
}, 120000);

describe('result perspectives', () => {
  it('defaults to Item drops when no saved state says otherwise', () => {
    const state = readMonsterDropUrl(base);
    expect(state.leaves).toBe(false);
    expect(perspectiveOf(state.leaves)).toBe('items');
    expect(RESULT_PERSPECTIVES.map(p => p.label)).toEqual(['Item drops', 'Treasure-class breakdown']);
    expect(component).toContain('const perspective = $derived(perspectiveOf(leaves));');
  });

  it('restores a bookmarked treasure-class-leaf link as the breakdown and keeps its URL meaning', () => {
    const url = new URL(`${base}&sim_sourceType=tc&sim_treasureClass=${encodeURIComponent(desecrated.TreasureClass)}&sim_level=96&sim_leaves=1&sim_collapse=1`);
    const state = readMonsterDropUrl(url);
    expect(state).toMatchObject({ leaves: true, collapse: true, sourceType: 'tc', level: 96 });
    expect(perspectiveOf(state.leaves)).toBe('tc');
    expect(writeMonsterDropUrl(base, state).searchParams.get('sim_leaves')).toBe('1');
    expect(writeMonsterDropUrl(base, state).searchParams.get('sim_collapse')).toBe('1');
  });

  it('switches between perspectives through the existing leaves option only', () => {
    for (const p of RESULT_PERSPECTIVES) expect(perspectiveOf(leavesFor(p.value))).toBe(p.value);
    expect(component).toContain('onchange={() => setRowShape({ leaves: leavesFor(option.value) })}');
    expect(component).toContain('role="radiogroup" aria-labelledby="result-perspective-label"');
    // The old checkbox is gone; the radio group is its only control.
    expect(component).not.toContain('bind:checked={leaves}');
    const state = readMonsterDropUrl(base);
    expect(writeMonsterDropUrl(base, { ...state, leaves: leavesFor('tc') }).searchParams.get('sim_leaves')).toBe('1');
    expect(writeMonsterDropUrl(base, { ...state, leaves: leavesFor('items') }).searchParams.has('sim_leaves')).toBe(false);
    expect(perspectiveInfo('tc').description).toMatch(/not individual item drops/);
  });

  it('keeps the source, game settings and seed when switching or resetting filters', () => {
    const state = readMonsterDropUrl(new URL(`${base}&sim_sourceId=x&sim_difficulty=1&sim_players=5&sim_party=2&sim_magicFind=300&sim_seed=42&sim_kills=900`));
    const switched = writeMonsterDropUrl(base, { ...state, leaves: true });
    for (const key of ['sim_sourceId', 'sim_difficulty', 'sim_players', 'sim_party', 'sim_magicFind', 'sim_seed', 'sim_kills'])
      expect(switched.searchParams.get(key)).toBe(writeMonsterDropUrl(base, state).searchParams.get(key));
    for (const name of ['setRowShape', 'recover', 'resetFilters'])
      expect(fn(name)).not.toMatch(/sourceId|sourceType|treasureClass =|difficulty|players|party|magicFind|seed|kills|level/);
    expect(fn('resetFilters')).not.toMatch(/collapse|leaves/);
  });
});

describe('control applicability', () => {
  it('hides the unique, set and rune shortcut in the breakdown without discarding the chosen category', () => {
    expect(resultControls('items').notableShortcut).toBe(true);
    expect(resultControls('tc').notableShortcut).toBe(false);
    expect(component).toContain('{#if controls.notableShortcut}');
    // Switching never touches search or category, so a hidden selection returns intact.
    expect(fn('setRowShape')).not.toMatch(/search|category|droppedOnly|detailed/);
    expect(resultControls('tc').categoryLabel).toBe('Row type');
  });

  it('keeps every Collapse similar combination available and disjoint', () => {
    expect(component).toContain('onchange={event => setRowShape({ collapse: event.currentTarget.checked })}');
    for (const report of [items, breakdown, collapsed, both]) expect(new Set(report.rows.map(r => r.id)).size).toBe(report.rows.length);
    expect(collapsed.rows.some(r => r.id === 'group:unique')).toBe(true);
    expect(breakdown.rows.some(isLeafRow)).toBe(true);
    expect(both.rows.length).toBeLessThanOrEqual(breakdown.rows.length);
    // Grouping only renames rows: physical drops of the seeded run are identical.
    for (const report of [breakdown, collapsed, both]) expect(report.itemDrops).toBe(items.itemDrops);
  });
});

describe('notable drops', () => {
  it('ranks individual items in Item drops and offers a recovery action otherwise', () => {
    const individual = notableDrops(items);
    expect(individual.limitation).toBeNull();
    expect(individual.top.length).toBeGreaterThan(0);
    expect(notableRecovery(individual.limitation)).toBeNull();
    expect(notableRecovery(notableDrops(breakdown).limitation)).toMatchObject({ action: 'show-items', label: 'Show item drops' });
    expect(notableRecovery(notableDrops(both).limitation)?.action).toBe('show-items');
    expect(notableRecovery(notableDrops(collapsed).limitation)).toMatchObject({ action: 'uncollapse', label: 'Turn off Collapse similar' });
    // Group rows are never split: only individual rows can be ranked.
    for (const row of notableDrops(collapsed).top) expect(row.id.startsWith('group:')).toBe(false);
  });

  it('Show item drops returns to the individual-item rows through the existing worker path', () => {
    expect(fn('recover')).toContain("setRowShape(action === 'show-items' ? { leaves: false } : { collapse: false })");
    expect(component).toContain('onclick={() => recover(recovery.action)}');
    // Recovering recalculates the same settings and seed, giving exactly the original item rows.
    expect(run({ leaves: false })).toEqual(items);
    expect(notableDrops(run({ leaves: false, collapse: false })).limitation).toBeNull();
  }, 60000);
});

describe('filter state, counts and pagination', () => {
  it('names the perspective basis and the active filters', () => {
    expect(resultBasis(items)).toMatch(/^Simulation of 300 kills · seed 7/);
    expect(resultBasis(rates)).toMatch(/^Drop rates · theoretical/);
    expect(activeFilters({ search: '  ring ', category: NOTABLE_CATEGORY, droppedOnly: true, simulated: true }))
      .toEqual(['name contains “ring”', 'Uniques, sets & runes', 'seen this run only']);
    // "Only results seen this run" applies only to simulations, matching the table filter.
    expect(activeFilters({ search: '', category: 'all', droppedOnly: true, simulated: false })).toEqual([]);
    expect(missingItemHint({ perspective: 'tc', collapse: false })).toMatch(/switch to Item drops/);
    expect(missingItemHint({ perspective: 'items', collapse: true })).toMatch(/Collapse similar/);
    expect(missingItemHint({ perspective: 'items', collapse: false })).toBe('');
    expect(component).toContain('const filtersActive = $derived(appliedFilters.length > 0);');
  });

  it('filters by text and category in both perspectives and paginates the whole filtered list', () => {
    const list = shown(items);
    expect(dropResultsPageCount(list.length)).toBe(Math.ceil(list.length / DROP_RESULTS_PAGE_SIZE));
    if (list.length > DROP_RESULTS_PAGE_SIZE) expect(dropResultsPage(list, 1)[0]).toBe(list[DROP_RESULTS_PAGE_SIZE]);
    const notable = shown(items, { category: NOTABLE_CATEGORY });
    expect(notable.length).toBeGreaterThan(0);
    expect(notable.every(r => ['unique', 'set', 'rune'].includes(r.quality))).toBe(true);
    const leaf = breakdown.rows.find(isLeafRow)!;
    expect(shown(breakdown, { search: leaf.nameKey })).toContain(leaf);
    expect(shown(breakdown, { category: 'treasure class' }).every(isLeafRow)).toBe(true);
  });

  it('limits to results seen this run only for simulations', () => {
    const seen = shown(items, { droppedOnly: true });
    expect(seen.every(r => r.count > 0)).toBe(true);
    expect(seen.length).toBeLessThanOrEqual(shown(items).length);
    expect(shown(rates, { droppedOnly: true })).toEqual(shown(rates));
    expect(component).toMatch(/\{#if report\.simulated\}<div class="control-group"[^]*?Only results seen this run/);
  });

  it('shows detailed statistics from the same report without recalculating', () => {
    const before = structuredClone(items);
    expect(shown(items, { detailed: true }).length).toBeGreaterThan(shown(items).length);
    expect(fn('showDetailed')).not.toMatch(/run\(|invalidate\(|setRowShape/);
    expect(items).toEqual(before);
  });

  it('keeps TSV export semantics and settings lines unchanged', () => {
    const list = shown(breakdown, { search: 'a' });
    expect(monsterDropTsv(breakdown, list, [], t)).toBe(monsterDropTsv(breakdown, [...list], [], t));
    expect(component).toContain("['Rows', `${leaves ? 'treasure class leaves' : 'items'}${collapse ? ', collapsed similar' : ''}`]");
    expect(component).toContain('onclick={copyTable}');
  });
});

describe('worker isolation and numerical stability', () => {
  it('reruns the worker only for row-shape changes on an existing result', () => {
    expect(component.match(/run\(lastSimulate\)/g)).toHaveLength(1);
    expect(fn('setRowShape')).toContain('if (!report && !busy) return;');
    for (const name of ['setSearch', 'setCategory', 'resetFilters', 'showInTable', 'showDetailed', 'sortBy'])
      expect(fn(name)).not.toMatch(/run\(|invalidate\(|setRowShape|postMessage/);
    expect(component).toContain('bind:checked={droppedOnly} onchange={() => page=0}');
  });

  it('gives identical numbers for equivalent settings regardless of how they were reached', () => {
    expect(run({ leaves: true })).toEqual(breakdown);
    expect(run({ collapse: true })).toEqual(collapsed);
    expect(run({}, false)).toEqual(rates);
  }, 120000);
});
