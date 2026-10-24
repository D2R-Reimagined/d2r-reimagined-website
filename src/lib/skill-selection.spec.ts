import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';

import { i18n, initializeI18n } from './i18n';
import { buildSkillPoolLookup, resolveSkillPool, skillClassRanges, type SkillPoolLookup } from './skill-selection';
import type { CatalogItem, KeyedLine, SkillClass } from './types';
import cubeRecipes from '../../static/data/keyed/cube-recipes.json';
import magicPrefixes from '../../static/data/keyed/magicprefix.json';
import runewords from '../../static/data/keyed/runewords.json';
import sets from '../../static/data/keyed/sets.json';
import skillClasses from '../../static/data/keyed/skills.json';
import uniques from '../../static/data/keyed/uniques.json';
import deDE from '../../static/data/strings/deDE.json';
import enUS from '../../static/data/strings/enUS.json';

const classes = skillClasses as SkillClass[];
const exported = { uniques, sets, runewords, magicPrefixes, cubeRecipes };
const lookup = buildSkillPoolLookup(classes, exported);
const skillName = (id: number) => (enUS as Record<string, string>)[`skillname${id}`];

function selectionLines(value: unknown): KeyedLine[] {
  const found: KeyedLine[] = [];
  const walk = (node: unknown) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== 'object') return;
    if ((node as KeyedLine).selection) found.push(node as KeyedLine);
    Object.values(node).forEach(walk);
  };
  walk(value);
  return found;
}

// Shaped like the exported item lines; Sorceress skill identifiers are 36-65.
const single = (count: number, min: number, max: number): KeyedLine =>
  ({ key: 'strSkillRandomClass', args: [count, 'Sorceress'], selection: { stat: 'item_singleskill', min, max } });
const fixture: Record<string, CatalogItem[]> = {
  uniques: [
    { Index: 'Whole class', Lines: [single(2, 36, 65), single(2, 36, 65)] },
    { Index: 'Fire to frost', Lines: [single(2, 36, 44), single(2, 36, 44)] },
    { Index: 'First fifteen', Lines: [single(1, 36, 50), single(2, 36, 50), single(2, 36, 50)] },
    { Index: 'Grouped tab', Lines: [{ key: 'strSkillTabRandomClassOnly', args: [1], selection: { stat: 'item_addskill_tab', min: 21, max: 23 }, classOnly: 'WarOnly' }] },
    { Index: 'Any class', Lines: [{ key: 'strSkillRandom', args: [3], selection: { stat: 'item_addclassskills', min: 0, max: 7 } }] }
  ],
  runewords: [{ Index: 'Nested', Equipment: { Lines: [{ key: 'group', children: [single(1, 40, 44)] }] } }]
};
const fixtureLookup = buildSkillPoolLookup(classes, fixture);
const item = (name: string) => Object.values(fixture).flat().find((entry) => entry.Index === name)!;

function poolsOf(name: string): Array<{ text: string; names: string[] | null }> {
  initializeI18n(enUS);
  const { line, t } = get(i18n);
  return selectionLines(item(name)).map((entry) => ({
    text: line(entry),
    names: resolveSkillPool(entry, fixtureLookup)?.map((key) => t(key)) ?? null
  }));
}

describe('skill class ranges', () => {
  // Skill identifiers are engine constants, so the class blocks are a game rule.
  it('derives one contiguous identifier block per playable class from skills.json', () => {
    expect(skillClassRanges(classes)).toEqual([
      { key: 'Amazon', min: 6, max: 35 },
      { key: 'Sorceress', min: 36, max: 65 },
      { key: 'Necromancer', min: 66, max: 95 },
      { key: 'Paladin', min: 96, max: 125 },
      { key: 'Barbarian', min: 126, max: 155 },
      { key: 'Druid', min: 221, max: 250 },
      { key: 'Assassin', min: 251, max: 280 },
      { key: 'Warlock', min: 373, max: 402 }
    ]);
  });

  it('drops a class whose identifiers have a gap', () => {
    const gapped = structuredClone(classes.slice(0, 1));
    gapped[0].Tabs[0].Skills = gapped[0].Tabs[0].Skills.filter((skill) => skill.Id !== 7);
    expect(skillClassRanges(gapped)).toEqual([]);
  });
});

describe('restricted skill pools', () => {
  it('adds nothing to a full-class pool', () => {
    expect(poolsOf('Whole class')).toEqual([
      { text: '+2 Random Sorceress Skill', names: null },
      { text: '+2 Random Sorceress Skill', names: null }
    ]);
  });

  it('names the nine inclusive Fire Bolt to Frozen Armor identifiers', () => {
    const pools = poolsOf('Fire to frost');
    expect(pools).toHaveLength(2);
    for (const pool of pools) {
      expect(pool.text).toBe('+2 Random Sorceress Skill');
      expect(pool.names).toEqual(Array.from({ length: 9 }, (_, index) => skillName(36 + index)));
      expect(pool.names).not.toContain(skillName(45));
    }
  });

  it('names the fifteen identifiers behind each roll of a multi-roll item', () => {
    const pools = poolsOf('First fifteen');
    expect(pools.map((pool) => pool.text)).toEqual(['+1 Random Sorceress Skill', '+2 Random Sorceress Skill', '+2 Random Sorceress Skill']);
    for (const pool of pools) expect(pool.names).toEqual(Array.from({ length: 15 }, (_, index) => skillName(36 + index)));
  });

  it('distinguishes different ranges behind an identical visible description', () => {
    const sorceressTwo = selectionLines(fixture)
      .filter((line) => line.key === 'strSkillRandomClass' && JSON.stringify(line.args) === '[2,"Sorceress"]');
    initializeI18n(enUS);
    expect([...new Set(sorceressTwo.map((line) => get(i18n).line(line)))]).toEqual(['+2 Random Sorceress Skill']);
    expect(new Set(sorceressTwo.map((line) => resolveSkillPool(line, fixtureLookup)?.length ?? 'full'))).toEqual(new Set([9, 15, 'full']));
  });

  it('finds pools nested in grouped lines', () => {
    const [nested] = selectionLines(item('Nested'));
    expect(resolveSkillPool(nested, fixtureLookup)).toHaveLength(5);
  });

  it('resolves names through the active language', () => {
    const line = selectionLines(item('Fire to frost'))[0];
    initializeI18n(deDE);
    const { t } = get(i18n);
    const names = resolveSkillPool(line, fixtureLookup)!.map((key) => t(key));
    expect(names[0]).toBe(deDE.skillname36);
    expect(names[8]).toBe(deDE.skillname44);
  });

  it('never adds a pool to skill-tab or class selections, including grouped tab identifiers', () => {
    const [tab] = selectionLines(item('Grouped tab'));
    expect(resolveSkillPool(tab, fixtureLookup)).toBeNull();
    expect(resolveSkillPool(selectionLines(item('Any class'))[0], fixtureLookup)).toBeNull();
    initializeI18n(enUS);
    expect(get(i18n).line(tab)).toBe('+1 Random Skill Tab (Warlock Only)');
  });

  it('sends only the skill names restricted pools need', () => {
    // Sorceress 36-50 from the widest restricted pool; full-class, tab and class selections add none.
    expect(Object.keys(fixtureLookup.names).map(Number).sort((a, b) => a - b)).toEqual(Array.from({ length: 15 }, (_, index) => 36 + index));
    expect(buildSkillPoolLookup(classes, { uniques: [item('Whole class'), item('Grouped tab')] }).names).toEqual({});
  });
});

describe('selection classification of the active export', () => {
  const lines = selectionLines(exported);
  const tally = (stat: string) => lines.filter((line) => line.selection?.stat === stat);

  it('classifies every exported occurrence into a supported stat', () => {
    expect(lines.length).toBeGreaterThan(0);
    const stats = ['item_singleskill', 'item_addskill_tab', 'item_addclassskills'];
    expect(lines.filter((line) => !stats.includes(line.selection!.stat!)).map((line) => line.selection)).toEqual([]);
    expect(tally('item_singleskill').length).toBeGreaterThan(0);
  });

  it('resolves every restricted pool inside one class block, narrower than it, naming each skill once', () => {
    const ranges = skillClassRanges(classes);
    for (const line of tally('item_singleskill')) {
      const pool = resolveSkillPool(line, lookup);
      if (!pool) continue;
      const { min, max } = line.selection as { min: number; max: number };
      const owner = ranges.find((range) => min >= range.min && max <= range.max);
      expect(owner, JSON.stringify(line.selection)).toBeDefined();
      expect(pool).toHaveLength(max - min + 1);
      expect(pool.length).toBeLessThan(owner!.max - owner!.min + 1);
      expect(new Set(pool).size).toBe(pool.length);
    }
  });

  it('never adds a pool to skill-tab or class selections', () => {
    const others = lines.filter((line) => line.selection?.stat !== 'item_singleskill');
    expect(others.every((line) => resolveSkillPool(line, lookup) === null)).toBe(true);
  });

  it('sends exactly the skill names the exported restricted pools need', () => {
    const needed = new Set<number>();
    for (const line of tally('item_singleskill')) {
      if (!resolveSkillPool(line, lookup)) continue;
      const { min, max } = line.selection as { min: number; max: number };
      for (let id = min; id <= max; id++) needed.add(id);
    }
    expect(Object.keys(lookup.names).map(Number).sort((a, b) => a - b)).toEqual([...needed].sort((a, b) => a - b));
  });
});

describe('defensive resolution', () => {
  const base: KeyedLine = { key: 'strSkillRandomClass', args: [2, 'Sorceress'], selection: { stat: 'item_singleskill', min: 36, max: 44 } };
  const withSelection = (selection: KeyedLine['selection'], args = base.args): KeyedLine => ({ ...base, args, selection });

  it('returns nothing without metadata or a lookup', () => {
    expect(resolveSkillPool({ key: 'strSkillRandomClass', args: [2, 'Sorceress'] }, fixtureLookup)).toBeNull();
    expect(resolveSkillPool(base, undefined)).toBeNull();
    expect(resolveSkillPool({ key: 'ModStr3a', args: [1] }, fixtureLookup)).toBeNull();
  });

  it('rejects invalid, reversed, cross-class, or out-of-range bounds', () => {
    expect(resolveSkillPool(withSelection({ stat: 'item_singleskill', min: 44, max: 36 }), fixtureLookup)).toBeNull();
    expect(resolveSkillPool(withSelection({ stat: 'item_singleskill', min: 36 }), fixtureLookup)).toBeNull();
    expect(resolveSkillPool(withSelection({ stat: 'item_singleskill', min: 36.5, max: 44 }), fixtureLookup)).toBeNull();
    expect(resolveSkillPool(withSelection({ stat: 'item_singleskill', min: 60, max: 70 }), fixtureLookup)).toBeNull();
    expect(resolveSkillPool(withSelection({ stat: 'item_singleskill', min: 160, max: 170 }), fixtureLookup)).toBeNull();
  });

  it('rejects a pool whose class contradicts the visible text', () => {
    expect(resolveSkillPool(withSelection(base.selection, [2, 'Necromancer']), fixtureLookup)).toBeNull();
  });

  it('shows no list when any identifier lacks a name', () => {
    const incomplete: SkillPoolLookup = { ...fixtureLookup, names: { ...fixtureLookup.names } };
    delete incomplete.names[40];
    expect(resolveSkillPool(base, incomplete)).toBeNull();
    expect(resolveSkillPool(base, fixtureLookup)).toHaveLength(9);
    // A lookup built for other pools names nothing outside them.
    expect(resolveSkillPool(withSelection({ stat: 'item_singleskill', min: 51, max: 55 }), fixtureLookup)).toBeNull();
  });

  it('keeps the existing localized line text unchanged', () => {
    initializeI18n(enUS);
    expect(get(i18n).line(base)).toBe('+2 Random Sorceress Skill');
    expect(get(i18n).line({ ...base, selection: undefined })).toBe('+2 Random Sorceress Skill');
  });
});
