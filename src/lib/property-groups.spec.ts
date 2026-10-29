import { readFileSync } from 'node:fs';
import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';

import { sortModifierLines } from './catalog-controls';
import { i18n, initializeI18n, setLanguage } from './i18n';
import { childChance, groupHeading, groupRollCount, isAlternateGroup, propertyGroupsTitle, splitPropertyGroups } from './property-groups';
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
      children: (group.children ?? []).map((child) => tools.line(child) + childChance(child, group))
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

  it('renders Renewed Flame Rift with unchanged modifier text and ticket shares', () => {
    const card = present(flameRift);
    expect(card.title).toBe('Possible Property Rolls (6 groups)');
    expect(card.groups.every((entry) => entry.heading === 'Random Grouped Affix')).toBe(true);
    expect(card.groups[0].children).toEqual(['+5 to Strength (33.3%)', '+6 to Strength (33.3%)', '+7 to Strength (33.3%)']);
    expect(card.groups[3].children.map((text) => text.slice(text.lastIndexOf(' (')))).toEqual([' (20%)', ' (60%)', ' (20%)']);
    expect(card.groups[5].children.map((text) => text.slice(text.lastIndexOf(' (')))).toEqual([' (50%)', ' (50%)']);
    expect(JSON.stringify(card)).not.toContain('Incendiary-Affix');
  });

  it('keeps pick-mode 1 groups distinct, including a single-roll group', () => {
    const magdam: KeyedLine = { key: '', code: 'magdam-rand', nameKey: 'strPropertyGroupsProperty', pickMode: '1',
      children: Array.from({ length: 6 }, (_, index) => ({ key: 'ModStr1a', args: [index + 1], chance: 1 })) };
    expect(magdam.children!.map((child) => childChance(child, magdam))).toEqual(Array(6).fill(' (16.7%)'));
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

describe('group roll counts', () => {
  const rolled = (rollCount: unknown): KeyedLine => ({ key: '', nameKey: 'strPropertyGroupsProperty', pickMode: '2', rollCount } as KeyedLine);

  it('appends a fixed count or a range to the heading, pluralized', () => {
    const { t } = english();
    expect(groupHeading(rolled({ min: 1, max: 1 }), t)).toBe('Random Grouped Affix (1 roll)');
    expect(groupHeading(rolled({ min: 2, max: 2 }), t)).toBe('Random Grouped Affix (2 rolls)');
    expect(groupHeading(rolled({ min: 1, max: 3 }), t)).toBe('Random Grouped Affix (1-3 rolls)');
    expect(groupHeading(rolled({ min: 0, max: 1 }), t)).toBe('Random Grouped Affix (0-1 rolls)');
  });

  it('keeps the plain heading when the roll count is missing or unusable', () => {
    const { t } = english();
    for (const value of [
      undefined, null, {}, [1, 3], { min: 1 }, { max: 3 }, { min: 3, max: 1 }, { min: 0, max: 0 }, { min: -1, max: 2 },
      { min: 1.5, max: 2 }, { min: 1, max: Infinity }, { min: Number.NaN, max: 1 }, { min: '1', max: '3' }
    ]) {
      expect(groupRollCount(rolled(value), t), JSON.stringify(value)).toBe('');
      expect(groupHeading(rolled(value), t)).toBe('Random Grouped Affix');
    }
  });

  it('never shows a roll count on its own as an engine identifier, and follows the active language', async () => {
    const { t } = english();
    expect(groupHeading({ key: '', code: 'Incendiary-Affix1', rollCount: { min: 1, max: 3 } }, t)).toBe('(1-3 rolls)');
    const fetchStub = globalThis.fetch;
    globalThis.fetch = (async () => new Response(JSON.stringify(deDE))) as typeof fetch;
    try {
      await setLanguage('deDE');
    } finally {
      globalThis.fetch = fetchStub;
    }
    const tools = get(i18n);
    const label = (deDE as Record<string, string>).strPropertyGroupsProperty;
    expect(groupHeading(rolled({ min: 1, max: 1 }), tools.t)).toBe(`${label} (1 Wurf)`);
    expect(groupHeading(rolled({ min: 1, max: 3 }), tools.t)).toBe(`${label} (1-3 Würfe)`);
    initializeI18n(enUS);
  });
});

describe('childChance', () => {
  const parent = (pickMode: string | undefined, children: KeyedLine[]): KeyedLine => ({ key: '', pickMode, children });
  const chances = (group: KeyedLine) => group.children!.map((child) => childChance(child, group));

  it('shows each child\'s share of the group\'s tickets in both pick modes', () => {
    // Mode 2 draws independently: the share is the probability of every draw.
    expect(chances(parent('2', [{ key: 'a', chance: 3 }, { key: 'b', chance: 1 }, { key: 'c', chance: 1 }]))).toEqual([' (60%)', ' (20%)', ' (20%)']);
    // Mode 1 draws without replacement: the share is the first-draw probability.
    expect(chances(parent('1', [{ key: 'a', chance: 1 }, { key: 'b', chance: 2 }]))).toEqual([' (33.3%)', ' (66.7%)']);
    // One ticket is never read as a literal 1%.
    expect(chances(parent('1', [{ key: 'a', chance: 1 }]))).toEqual([' (100%)']);
  });

  it('omits the whole group when a weight is missing or invalid', () => {
    expect(chances(parent('2', [{ key: 'a', chance: 3 }, { key: 'b' }]))).toEqual(['', '']);
    expect(chances(parent('1', [{ key: 'a', chance: 3 }, { key: 'b', chance: -1 }]))).toEqual(['', '']);
    expect(chances(parent('2', [{ key: 'a', chance: 0 }, { key: 'b', chance: 0 }]))).toEqual(['', '']);
  });

  it('leaves a zero-ticket child unannotated and out of the total', () => {
    expect(chances(parent('2', [{ key: 'a', chance: 0 }, { key: 'b', chance: 1 }]))).toEqual(['', ' (100%)']);
  });

  it('does not annotate all-selected, unknown-mode, or mode-less properties', () => {
    expect(chances(parent('0', [{ key: 'a', chance: 1 }, { key: 'b', chance: 5 }]))).toEqual(['', '']);
    expect(chances(parent('3', [{ key: 'a', chance: 5 }]))).toEqual(['']);
    expect(chances(parent(undefined, [{ key: 'a', chance: 5 }]))).toEqual(['']);
  });
});

describe('exported property-group chances', () => {
  const lineWithCode = (item: CatalogItem | undefined, code: string) => (item?.Lines ?? []).find((line) => line.code === code);

  it('shows Opalvein\'s magdam-rand children as shares of six equal tickets, not 1% each', () => {
    const opalvein = (uniques as CatalogItem[]).find((item) => item.Index === 'Opalvein');
    const magdam = lineWithCode(opalvein, 'magdam-rand');
    expect(magdam?.pickMode).toBe('1');
    expect(magdam!.children).toHaveLength(6);
    expect(magdam!.children!.every((child) => child.chance === 1)).toBe(true);
    const card = present(opalvein!);
    const group = card.groups[(opalvein!.Lines ?? []).filter(isAlternateGroup).indexOf(magdam!)];
    expect(group.children).toHaveLength(6);
    for (const text of group.children) expect(text.endsWith(' (16.7%)'), text).toBe(true);
    expect(JSON.stringify(card)).not.toMatch(/\(1%\)|relative weight/);
  });

  it('shows the exported Renewed Flame Rift groups as ticket shares', () => {
    const flame = (uniques as CatalogItem[]).find((item) => item.Index === 'Crafted Flame Rift');
    const affix4 = lineWithCode(flame, 'Incendiary-Affix4')!;
    expect(affix4.pickMode).toBe('2');
    expect(affix4.children!.map((child) => child.chance)).toEqual([1, 3, 1]);
    expect(affix4.children!.map((child) => childChance(child, affix4))).toEqual([' (20%)', ' (60%)', ' (20%)']);
    const affix1 = lineWithCode(flame, 'Incendiary-Affix1')!;
    expect(affix1.pickMode).toBe('2');
    expect(affix1.children!.map((child) => child.chance)).toEqual([1, 1, 1]);
    expect(affix1.children!.map((child) => childChance(child, affix1))).toEqual(Array(3).fill(' (33.3%)'));
    const card = present(flame!);
    expect(JSON.stringify(card)).not.toMatch(/\(1%\)|relative weight/);
  });

  it('shows Wraithstep\'s eight equal mode-1 entries at 12.5% each on the first draw', () => {
    const wraithstep = (uniques as CatalogItem[]).find((item) => item.Index === 'Wraithstep')!;
    const skillTabs = lineWithCode(wraithstep, 'skilltab-all')!;
    expect(skillTabs.pickMode).toBe('1');
    expect(skillTabs.children).toHaveLength(8);
    expect(skillTabs.children!.map((child) => child.chance)).toEqual(Array(8).fill(1));
    expect(skillTabs.children!.map((child) => childChance(child, skillTabs))).toEqual(Array(8).fill(' (12.5%)'));
    const [group] = present(wraithstep).groups;
    expect(group.children.map((text) => text.slice(0, text.lastIndexOf(' (')))).toEqual(
      skillTabs.children!.map((child) => english().line(child))
    );
    expect(group.children.every((text) => text.endsWith(' (12.5%)'))).toBe(true);
  });
});

/**
 * The English heading a group's exported roll count should produce, spelled out here rather
 * than taken from groupRollCount: plain when the count is missing or not a whole-number range.
 */
function expectedHeading(rollCount: unknown): string {
  const { min, max } = (rollCount ?? {}) as Record<string, unknown>;
  if (!Number.isInteger(min) || !Number.isInteger(max)) return 'Random Grouped Affix';
  const [low, high] = [min as number, max as number];
  if (low < 0 || high < 1 || low > high) return 'Random Grouped Affix';
  if (low !== high) return `Random Grouped Affix (${low}-${high} rolls)`;
  return `Random Grouped Affix (${high} ${high === 1 ? 'roll' : 'rolls'})`;
}

/** A copy of `item` whose groups carry no roll count, to compare everything else against. */
function withoutRollCounts(item: CatalogItem): CatalogItem {
  const copy = structuredClone(item);
  for (const line of copy.Lines ?? []) delete line.rollCount;
  return copy;
}

const percentSuffix = / \(\d+(\.\d)?%\)$/;

describe('exported property-group roll counts', () => {
  const find = (index: string) => (uniques as CatalogItem[]).find((item) => item.Index === index)!;

  it('heads Wraithstep\'s groups with whatever roll count was exported, keeping the wrapper and child shares', () => {
    const wraithstep = find('Wraithstep');
    const exported = wraithstep.Lines!.filter(isAlternateGroup);
    expect(exported.length).toBeGreaterThan(0);
    const card = present(wraithstep);
    expect(card.groups.map((entry) => entry.heading)).toEqual(exported.map((line) => expectedHeading(line.rollCount)));

    // The roll count only extends the headings: wrapper, visible lines and child shares are as without it.
    const plain = present(withoutRollCounts(wraithstep));
    expect(plain.groups.every((entry) => entry.heading === 'Random Grouped Affix')).toBe(true);
    expect(card.title).toBe(exported.length === 1 ? 'Possible Property Rolls (1 group)' : `Possible Property Rolls (${exported.length} groups)`);
    expect(card.title).toBe(plain.title);
    expect(card.visible).toEqual(plain.visible);
    expect(card.groups.map((entry) => entry.children)).toEqual(plain.groups.map((entry) => entry.children));
    card.groups.forEach((entry, index) => {
      expect(entry.children).toHaveLength(exported[index].children!.length);
      for (const text of entry.children) expect(text, text).toMatch(percentSuffix);
    });
  });

  it.each([
    [{ min: 1, max: 1 }, 'Random Grouped Affix (1 roll)'],
    [{ min: 2, max: 2 }, 'Random Grouped Affix (2 rolls)'],
    [{ min: 1, max: 3 }, 'Random Grouped Affix (1-3 rolls)'],
    [undefined, 'Random Grouped Affix'],
    [{ min: 3, max: 1 }, 'Random Grouped Affix'],
    [{ min: '1', max: '3' }, 'Random Grouped Affix']
  ])('heads Wraithstep\'s groups for an exported roll count of %j as %s, with unchanged children', (rollCount, heading) => {
    const wraithstep = withoutRollCounts(find('Wraithstep'));
    const plain = present(wraithstep);
    for (const line of wraithstep.Lines!.filter(isAlternateGroup)) Object.assign(line, { rollCount });
    const card = present(wraithstep);
    expect(card.groups.map((entry) => entry.heading)).toEqual(plain.groups.map(() => heading));
    expect(card.groups.map((entry) => entry.children)).toEqual(plain.groups.map((entry) => entry.children));
    expect(card.title).toBe(plain.title);
  });

  it('heads Renewed Flame Rift\'s fixed single-roll groups as 1 roll and leaves the group without data unchanged', () => {
    const flame = find('Crafted Flame Rift');
    const exported = flame.Lines!.filter(isAlternateGroup);
    expect(exported.map((line) => line.rollCount ?? null)).toEqual([
      { min: 1, max: 1 }, { min: 1, max: 1 }, { min: 1, max: 1 }, { min: 1, max: 1 }, null, { min: 1, max: 1 }
    ]);
    const card = present(flame);
    expect(card.title).toBe('Possible Property Rolls (6 groups)');
    expect(card.groups.map((entry) => entry.heading)).toEqual([
      'Random Grouped Affix (1 roll)', 'Random Grouped Affix (1 roll)', 'Random Grouped Affix (1 roll)',
      'Random Grouped Affix (1 roll)', 'Random Grouped Affix', 'Random Grouped Affix (1 roll)'
    ]);
    expect(card.groups[0].children.map((text) => text.slice(text.lastIndexOf(' (')))).toEqual(Array(3).fill(' (33.3%)'));
    expect(card.groups[3].children.map((text) => text.slice(text.lastIndexOf(' (')))).toEqual([' (20%)', ' (60%)', ' (20%)']);
  });

  it('gives every exported roll count a valid heading suffix', () => {
    const { t } = english();
    const groups = (uniques as CatalogItem[]).flatMap((item) => (item.Lines ?? []).filter(isAlternateGroup));
    for (const entry of groups.filter((line) => line.rollCount)) expect(groupRollCount(entry, t), entry.code).toMatch(/^ \(\d+(-\d+)? rolls?\)$/);
  });
});

describe('shared consumers', () => {
  it('keeps Grail labels free of interactive disclosures', () => {
    const grail = readFileSync(new URL('./components/GrailItem.svelte', import.meta.url), 'utf8');
    expect(grail).toMatch(/<KeyedLines[^>]*collapsible=\{false\}/);
  });
});
