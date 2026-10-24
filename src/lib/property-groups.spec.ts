import { readFileSync } from 'node:fs';
import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';

import { sortModifierLines } from './catalog-controls';
import { i18n, initializeI18n, setLanguage } from './i18n';
import { childChance, groupHeading, isAlternateGroup, propertyGroupsTitle, splitPropertyGroups } from './property-groups';
import type { CatalogItem, KeyedLine } from './types';
import runewords from '../../static/data/keyed/runewords.json';
import sets from '../../static/data/keyed/sets.json';
import uniques from '../../static/data/keyed/uniques.json';
import deDE from '../../static/data/strings/deDE.json';
import enUS from '../../static/data/strings/enUS.json';

function english() {
  initializeI18n(enUS);
  return get(i18n);
}

/** Exactly what KeyedLines renders for one card: visible lines plus the collapsed groups. */
function present(item: CatalogItem) {
  const tools = english();
  const { visible, groups } = splitPropertyGroups(sortModifierLines(item.Lines));
  return {
    visible: visible.map((line) => tools.line(line)),
    title: groups.length ? propertyGroupsTitle(groups.length, tools.t) : null,
    groups: groups.map((group) => ({
      heading: groupHeading(group, tools.t),
      children: (group.children ?? []).map((child) => tools.line(child) + childChance(child, group.children ?? []))
    }))
  };
}

// Shaped like the exported Renewed Flame Rift: ordinary lines, then six grouped affix rolls.
const group = (n: number, weights: number[]): KeyedLine => ({
  key: '', code: `Incendiary-Affix${n}`, nameKey: 'strPropertyGroupsProperty', pickMode: '2',
  children: weights.map((chance, index) => ({ key: 'ModStr1a', args: [5 + index], chance }))
});
const flameRift: CatalogItem = {
  Index: 'Crafted Flame Rift',
  Lines: [
    group(1, [1, 1, 1]), { key: 'mod_weight', args: [1] }, group(2, [1, 1]), group(3, [1, 1, 1]),
    { key: 'ModItemMonFireSunder', args: [10] }, group(4, [1, 3, 1]), group(5, [1, 1]), group(6, [2, 2]), { key: 'ModStr1j', args: [20] }
  ]
};

describe('property groups in the current export', () => {
  const grouped = (uniques as CatalogItem[]).filter((item) => (item.Lines ?? []).some(isAlternateGroup));

  it('appear only as top-level unique lines, all labelled strPropertyGroupsProperty', () => {
    const groups = grouped.flatMap((item) => (item.Lines ?? []).filter(isAlternateGroup));
    for (const entry of groups) {
      expect(['1', '2']).toContain(entry.pickMode);
      expect(entry.nameKey === 'strPropertyGroupsProperty' && entry.key === '').toBe(true);
      expect(entry.children!.every((child) => !child.children)).toBe(true);
    }
    for (const catalog of [sets, runewords]) expect(JSON.stringify(catalog)).not.toContain('"pickMode"');
  });

  it('splits every exported grouped item into its ordinary lines and its groups, in exporter order', () => {
    for (const item of grouped) {
      const { visible, groups } = splitPropertyGroups(sortModifierLines(item.Lines));
      const exported = (item.Lines ?? []).filter(isAlternateGroup);
      // Child ownership: every child stays under the parent that exported it.
      expect(groups, String(item.Index)).toEqual(exported);
      expect(visible.length + groups.length).toBe((item.Lines ?? []).length);
      expect(visible.some(isAlternateGroup)).toBe(false);
      expect(present(item).title).toBe(propertyGroupsTitle(groups.length, english().t));
    }
  });

  it('leaves items without groups exactly as before', () => {
    const tools = english();
    const plain = (uniques as CatalogItem[]).filter((item) => !(item.Lines ?? []).some(isAlternateGroup));
    expect(plain.length).toBeGreaterThan(0);
    for (const item of plain) {
      const { visible, groups } = splitPropertyGroups(sortModifierLines(item.Lines));
      expect(groups).toEqual([]);
      expect(visible).toEqual(sortModifierLines(item.Lines));
    }
    for (const item of plain.slice(0, 50)) {
      expect(present(item).visible).toEqual(sortModifierLines(item.Lines).map((line) => tools.line(line)));
    }
  });
});

describe('a grouped affix item', () => {
  it('splits Renewed Flame Rift into its ordinary lines and six groups, in exporter order', () => {
    expect(english().t('Crafted Flame Rift')).toBe('Renewed Flame Rift');
    const { visible, groups } = splitPropertyGroups(sortModifierLines(flameRift.Lines));
    expect(visible.map((line) => line.key)).toEqual(['mod_weight', 'ModItemMonFireSunder', 'ModStr1j']);
    expect(groups.map((entry) => entry.code)).toEqual([1, 2, 3, 4, 5, 6].map((n) => `Incendiary-Affix${n}`));
    const exported = (flameRift.Lines ?? []).filter((line) => line.children);
    expect(groups.map((entry) => entry.children)).toEqual(exported.map((entry) => entry.children));
    expect(groups.map((entry) => entry.children!.length)).toEqual([3, 2, 3, 3, 2, 2]);
  });

  it('renders Renewed Flame Rift with unchanged modifier text and percentages', () => {
    const card = present(flameRift);
    expect(card.title).toBe('Possible Property Rolls (6 groups)');
    expect(card.groups.every((entry) => entry.heading === 'Random Grouped Affix')).toBe(true);
    expect(card.groups[0].children).toEqual(['+5 to Strength (33.3%)', '+6 to Strength (33.3%)', '+7 to Strength (33.3%)']);
    // Relative weights 1/3/1 keep the existing share-of-siblings formatting.
    expect(card.groups[3].children.map((text) => text.slice(text.lastIndexOf(' (')))).toEqual([' (20.0%)', ' (60.0%)', ' (20.0%)']);
    expect(card.groups[5].children.map((text) => text.slice(text.lastIndexOf(' (')))).toEqual([' (50.0%)', ' (50.0%)']);
    expect(JSON.stringify(card)).not.toContain('Incendiary-Affix');
  });

  it('keeps pick-mode 1 groups distinct, including a single-roll group', () => {
    const magdam: KeyedLine = { key: '', code: 'magdam-rand', nameKey: 'strPropertyGroupsProperty', pickMode: '1',
      children: Array.from({ length: 6 }, (_, index) => ({ key: 'ModStr1a', args: [index + 1], chance: 1 })) };
    expect(magdam.children!.map((child) => childChance(child, magdam.children!))).toEqual(Array(6).fill(' (16.7%)'));
    const tab: KeyedLine = { key: 'strSkillTabRandomClassOnly', args: [1], selection: { stat: 'item_addskill_tab', min: 21, max: 23 }, classOnly: 'WarOnly' };
    const card = present({ Index: 'Single group', Lines: [{ key: '', code: 'tab-rand', nameKey: 'strPropertyGroupsProperty', pickMode: '1', children: [tab] }] });
    expect(card.title).toBe('Possible Property Rolls (1 group)');
    expect(card.groups).toEqual([{ heading: 'Random Grouped Affix', children: ['+1 Random Skill Tab (Warlock Only)'] }]);
  });
});

describe('splitPropertyGroups', () => {
  it('collapses only non-zero pick modes and keeps every other line in place', () => {
    const lines: KeyedLine[] = [
      { key: 'first' },
      { key: '', pickMode: '0', children: [{ key: 'always' }] },
      { key: 'second' },
      { key: '', pickMode: '2', children: [{ key: 'a', chance: 1 }] },
      { key: '', pickMode: '1', children: [{ key: 'b', chance: 1 }] },
      { key: '', pickMode: '2', children: [] }
    ];
    const { visible, groups } = splitPropertyGroups(sortModifierLines(lines));
    expect(visible).toEqual([lines[0], lines[1], lines[2], lines[5]]);
    expect(groups).toEqual([lines[3], lines[4]]);
  });

  it('returns nothing to collapse for empty input', () => {
    expect(splitPropertyGroups([])).toEqual({ visible: [], groups: [] });
  });

  it('renders every exported line of a multi-stat property in exporter order without merging', () => {
    const tools = english();
    // One exported property can yield several lines: independently rolled stats (same key,
    // different args) stay separate, and an exporter-mirrored stat arrives as one line.
    const lines: KeyedLine[] = [
      { key: 'ModStr1a', args: [5] },
      { key: '', pickMode: '1', children: [{ key: 'ModStr1b', args: [1], chance: 1 }] },
      { key: 'ModStr1a', args: [10] },
      { key: 'Moditem2allattrib', args: [3] },
      { key: 'ModStr1a', args: [5] }
    ];
    const { visible, groups } = splitPropertyGroups(sortModifierLines(lines));
    expect(visible.map((line) => tools.line(line))).toEqual([
      '+5 to Strength', '+10 to Strength', '+3 to all Attributes', '+5 to Strength'
    ]);
    expect(groups).toEqual([lines[1]]);
  });
});

describe('group labels', () => {
  it('uses a translated code, else the translated nameKey, and never an untranslated identifier', () => {
    const { t } = english();
    expect(groupHeading({ key: '', code: 'Incendiary-Affix1', nameKey: 'strPropertyGroupsProperty' }, t)).toBe('Random Grouped Affix');
    expect(groupHeading({ key: '', code: 'Crafted Flame Rift', nameKey: 'strPropertyGroupsProperty' }, t)).toBe('Renewed Flame Rift');
    expect(groupHeading({ key: '', code: 'Incendiary-Affix1' }, t)).toBe('');
    expect(groupHeading({ key: '', nameKey: 'not-a-string-key' }, t)).toBe('');
    expect(groupHeading({ key: '' }, t)).toBe('');
  });

  it('pluralizes the summary and follows the active language', async () => {
    const { t } = english();
    expect(propertyGroupsTitle(1, t)).toBe('Possible Property Rolls (1 group)');
    expect(propertyGroupsTitle(4, t)).toBe('Possible Property Rolls (4 groups)');

    const fetchStub = globalThis.fetch;
    globalThis.fetch = (async () => new Response(JSON.stringify(deDE))) as typeof fetch;
    try {
      await setLanguage('deDE');
    } finally {
      globalThis.fetch = fetchStub;
    }
    const tools = get(i18n);
    expect(propertyGroupsTitle(6, tools.t)).toBe('Mögliche Eigenschaftswürfe (6 Gruppen)');
    expect(groupHeading({ key: '', nameKey: 'strPropertyGroupsProperty' }, tools.t)).toBe((deDE as Record<string, string>).strPropertyGroupsProperty);
    initializeI18n(enUS);
  });
});

describe('childChance', () => {
  it('matches the existing share-of-siblings annotation', () => {
    const siblings: KeyedLine[] = [{ key: 'a', chance: 3 }, { key: 'b', chance: 1 }, { key: 'c' }];
    expect(siblings.map((child) => childChance(child, siblings))).toEqual([' (60.0%)', ' (20.0%)', '']);
    expect(childChance({ key: 'x', chance: 0 }, [{ key: 'x', chance: 0 }])).toBe('');
  });
});

describe('shared consumers', () => {
  it('keeps Grail labels free of interactive disclosures', () => {
    const grail = readFileSync(new URL('./components/GrailItem.svelte', import.meta.url), 'utf8');
    expect(grail).toMatch(/<KeyedLines[^>]*collapsible=\{false\}/);
  });
});
