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

function unique(name: string): CatalogItem {
  const item = (uniques as CatalogItem[]).find((entry) => entry.Index === name);
  expect(item, name).toBeDefined();
  return item!;
}

function poolsOf(name: string): Array<{ text: string; names: string[] | null }> {
  initializeI18n(enUS);
  const { line, t } = get(i18n);
  return selectionLines(unique(name)).map((entry) => ({
    text: line(entry),
    names: resolveSkillPool(entry, lookup)?.map((key) => t(key)) ?? null
  }));
}

describe('skill class ranges', () => {
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

describe('restricted skill pools from current exported data', () => {
  it('adds nothing to a full-class pool such as Neonate\'s Sallet', () => {
    expect(poolsOf("Neonate's Sallet")).toEqual([
      { text: '+2 Random Sorceress Skill', names: null },
      { text: '+2 Random Sorceress Skill', names: null }
    ]);
  });

  it('names the nine inclusive Fire Bolt to Frozen Armor identifiers of Puzzler\'s Mystery', () => {
    const pools = poolsOf("Puzzler's Mystery");
    expect(pools).toHaveLength(2);
    for (const pool of pools) {
      expect(pool.text).toBe('+2 Random Sorceress Skill');
      expect(pool.names).toHaveLength(9);
      expect(pool.names?.[0]).toBe(enUS.skillname36);
      expect(pool.names?.[8]).toBe(enUS.skillname44);
      expect(pool.names).not.toContain(enUS.skillname45);
    }
  });

  it('names the fifteen identifiers behind each of Puppeteer\'s Staff\'s rolls', () => {
    const pools = poolsOf("Puppeteer's Staff");
    expect(pools.map((pool) => pool.text)).toEqual([
      '+1 Random Sorceress Skill',
      '+2 Random Sorceress Skill',
      '+2 Random Sorceress Skill'
    ]);
    for (const pool of pools) {
      expect(pool.names).toEqual(Array.from({ length: 15 }, (_, index) => (enUS as Record<string, string>)[`skillname${36 + index}`]));
    }
  });

  it('distinguishes different ranges behind an identical visible description', () => {
    const sorceressTwo = selectionLines(exported)
      .filter((line) => line.key === 'strSkillRandomClass' && JSON.stringify(line.args) === '[2,"Sorceress"]');
    initializeI18n(enUS);
    const texts = new Set(sorceressTwo.map((line) => get(i18n).line(line)));
    const sizes = new Set(sorceressTwo.map((line) => resolveSkillPool(line, lookup)?.length ?? 'full'));
    expect([...texts]).toEqual(['+2 Random Sorceress Skill']);
    expect(sizes).toEqual(new Set([9, 15, 'full']));
  });

  it('resolves names through the active language', () => {
    const line = selectionLines(unique("Puzzler's Mystery"))[0];
    initializeI18n(deDE);
    const { t } = get(i18n);
    const names = resolveSkillPool(line, lookup)!.map((key) => t(key));
    expect(names[0]).toBe(deDE.skillname36);
    expect(names[8]).toBe(deDE.skillname44);
  });
});

describe('selection classification', () => {
  const lines = selectionLines(exported);
  const tally = (stat: string) => lines.filter((line) => line.selection?.stat === stat);

  it('keeps the current export\'s 246 occurrences in the verified groups', () => {
    expect(lines).toHaveLength(246);
    const single = tally('item_singleskill');
    const restricted = single.filter((line) => resolveSkillPool(line, lookup));
    expect(single).toHaveLength(217);
    expect(restricted).toHaveLength(24);
    expect(tally('item_addskill_tab')).toHaveLength(25);
    expect(tally('item_addclassskills')).toHaveLength(4);
  });

  it('never adds a pool to skill-tab or class selections, including Wraithstep\'s grouped 21-23', () => {
    const others = lines.filter((line) => line.selection?.stat !== 'item_singleskill');
    expect(others.every((line) => resolveSkillPool(line, lookup) === null)).toBe(true);
    const wraithstep = selectionLines(unique('Wraithstep'));
    expect(wraithstep).toEqual([expect.objectContaining({
      key: 'strSkillTabRandomClassOnly',
      classOnly: 'WarOnly',
      selection: { stat: 'item_addskill_tab', min: 21, max: 23 }
    })]);
    initializeI18n(enUS);
    expect(get(i18n).line(wraithstep[0])).toBe('+1 Random Skill Tab (Warlock Only)');
  });

  it('sends only the skill names restricted pools need', () => {
    const ids = Object.keys(lookup.names).map(Number).sort((a, b) => a - b);
    // Sorceress 36-60, Necromancer 66-95, Assassin 251-268.
    expect(ids).toHaveLength(25 + 30 + 18);
    expect(ids[0]).toBe(36);
    expect(ids.at(-1)).toBe(268);
    expect(ids).not.toContain(61);
  });
});

describe('defensive resolution', () => {
  const base: KeyedLine = { key: 'strSkillRandomClass', args: [2, 'Sorceress'], selection: { stat: 'item_singleskill', min: 36, max: 44 } };
  const withSelection = (selection: KeyedLine['selection'], args = base.args): KeyedLine => ({ ...base, args, selection });

  it('returns nothing without metadata or a lookup', () => {
    expect(resolveSkillPool({ key: 'strSkillRandomClass', args: [2, 'Sorceress'] }, lookup)).toBeNull();
    expect(resolveSkillPool(base, undefined)).toBeNull();
    expect(resolveSkillPool({ key: 'ModStr3a', args: [1] }, lookup)).toBeNull();
  });

  it('rejects invalid, reversed, cross-class, or out-of-range bounds', () => {
    expect(resolveSkillPool(withSelection({ stat: 'item_singleskill', min: 44, max: 36 }), lookup)).toBeNull();
    expect(resolveSkillPool(withSelection({ stat: 'item_singleskill', min: 36 }), lookup)).toBeNull();
    expect(resolveSkillPool(withSelection({ stat: 'item_singleskill', min: 36.5, max: 44 }), lookup)).toBeNull();
    expect(resolveSkillPool(withSelection({ stat: 'item_singleskill', min: 60, max: 70 }), lookup)).toBeNull();
    expect(resolveSkillPool(withSelection({ stat: 'item_singleskill', min: 160, max: 170 }), lookup)).toBeNull();
  });

  it('rejects a pool whose class contradicts the visible text', () => {
    expect(resolveSkillPool(withSelection(base.selection, [2, 'Necromancer']), lookup)).toBeNull();
  });

  it('shows no list when any identifier lacks a name', () => {
    const incomplete: SkillPoolLookup = { ...lookup, names: { ...lookup.names } };
    delete incomplete.names[40];
    expect(resolveSkillPool(base, incomplete)).toBeNull();
    expect(resolveSkillPool(base, lookup)).toHaveLength(9);
  });

  it('keeps the existing localized line text unchanged', () => {
    initializeI18n(enUS);
    expect(get(i18n).line(base)).toBe('+2 Random Sorceress Skill');
    expect(get(i18n).line({ ...base, selection: undefined })).toBe('+2 Random Sorceress Skill');
  });
});
