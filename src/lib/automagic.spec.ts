import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';

import { autoMagicGroups, childSelection, groupSelections, presentAutoMagic, selectionPercent } from './automagic';
import { buildCatalog } from './catalog-sources';
import { i18n, initializeI18n, setLanguage } from './i18n';
import type { CatalogItem, KeyedLine } from './types';
import armors from '../../static/data/keyed/armors.json';
import uniques from '../../static/data/keyed/uniques.json';
import weapons from '../../static/data/keyed/weapons.json';
import deDE from '../../static/data/strings/deDE.json';
import enUS from '../../static/data/strings/enUS.json';

const bases = buildCatalog('bases', { armors: armors as CatalogItem[], weapons: weapons as CatalogItem[] });

function base(nameKey: string, source: 'armor' | 'weapon'): CatalogItem {
  const item = bases.find((entry) => entry.NameKey === nameKey && entry.source === source);
  expect(item, nameKey).toBeDefined();
  return item!;
}

function english() {
  initializeI18n(enUS);
  return get(i18n);
}

describe('automagic data contract', () => {
  it('attaches automagic only to the expected number of armor and weapon bases', () => {
    expect((armors as CatalogItem[]).filter((item) => autoMagicGroups(item).length).length).toBe(45);
    expect((weapons as CatalogItem[]).filter((item) => autoMagicGroups(item).length).length).toBe(57);
  });

  it('shares one automagic group across every entry of a base', () => {
    const shields = bases.filter((item) => item.AutoPrefix === '304');
    expect(shields.length).toBeGreaterThan(1);
    const codes = shields.map((item) => autoMagicGroups(item).map((group) => group.Code).join('|'));
    expect(new Set(codes).size).toBe(1);
  });
});

describe('presentAutoMagic', () => {
  it('returns nothing for bases without automagic and for unrelated catalog items', () => {
    const tools = english();
    expect(presentAutoMagic(base('uow', 'armor'), tools)).toEqual([]);
    expect(presentAutoMagic(base('9gi', 'weapon'), tools)).toEqual([]);
    for (const unique of uniques as CatalogItem[]) expect(presentAutoMagic(unique, tools)).toEqual([]);
  });

  it('shows translated names, localized ranges and level gates for a named armor group', () => {
    const entries = presentAutoMagic(base('pa4', 'armor'), english());
    expect(entries).toHaveLength(10);
    expect(entries[0]).toEqual({
      name: 'Shimmering',
      label: 'Shimmering',
      meta: ['Item level 1+', 'Required Level: 3'],
      lines: [{ text: '+5-10% to All Resistances' }]
    });
    const sharp = entries.find((entry) => entry.name === 'Sharp')!;
    expect(sharp.lines.map((line) => line.text)).toEqual(['+15-30 to Attack Rating', '+10-20% Enhanced Weapon Damage']);
    expect(sharp.meta).toEqual(['Item level 10+', 'Required Level: 5']);
  });

  it('describes unnamed weapon groups from their translated lines, never from the engine code', () => {
    const entries = presentAutoMagic(base('am6', 'weapon'), english());
    expect(entries.map((entry) => entry.name)).toEqual([null, null, null]);
    expect(entries.map((entry) => entry.label)).toEqual([
      '+1 to Bow and Crossbow Skills (Amazon Only)',
      '+2 to Bow and Crossbow Skills (Amazon Only)',
      '+3 to Bow and Crossbow Skills (Amazon Only)'
    ]);
    expect(entries.map((entry) => entry.meta)).toEqual([
      ['Item level 1+', 'Required Level: 15'],
      ['Item level 40+', 'Required Level: 30'],
      ['Item level 60+', 'Required Level: 45']
    ]);
    const text = JSON.stringify(entries);
    expect(text).not.toContain('Bow 1');
    expect(text).not.toContain('StrSklTabItem3');
  });

  it('keeps each unnamed armor group as its own entry with all of its lines', () => {
    const item = base('wae', 'armor');
    const entries = presentAutoMagic(item, english());
    const groups = autoMagicGroups(item);
    expect(entries).toHaveLength(groups.length);
    entries.forEach((entry, index) => {
      expect(entry.name).toBeNull();
      expect(entry.lines).toHaveLength(groups[index].Lines!.length);
      expect(entry.label).toBe(entry.lines.map((line) => line.text).join(', '));
    });
    expect(JSON.stringify(entries)).not.toContain('of Ember');
  });

  it('follows the active language through the shared translator', async () => {
    initializeI18n(enUS);
    const fetchStub = globalThis.fetch;
    globalThis.fetch = (async () => new Response(JSON.stringify(deDE))) as typeof fetch;
    try {
      await setLanguage('deDE');
    } finally {
      globalThis.fetch = fetchStub;
    }
    const tools = get(i18n);
    const [first] = presentAutoMagic(base('pa4', 'armor'), tools);
    expect(first.name).toBe(tools.t('Shimmering'));
    expect(first.lines[0].text).toBe(tools.line({ key: 'strModAllResistances', args: [5, 10] }));
    expect(first.meta).toEqual(['Gegenstandsstufe 1+', tools.t('strRequiredLevel', [3])]);
    expect(first.lines[0].text).not.toBe('+5-10% to All Resistances');
  });

  it('keeps property-group children under their parent and labels their ticket shares', () => {
    const weighted: KeyedLine = {
      key: '', pickMode: '2', code: 'Magnetic-Affix1',
      children: [{ key: 'strModAllResistances', args: [5, 10], chance: 3 }, { key: 'strModAllResistances', args: [11, 15], chance: 1 }]
    };
    const weightedWithoutReplacement: KeyedLine = {
      key: '', pickMode: '1', code: 'Gelid-Affix3',
      children: [{ key: 'strModAllResistances', args: [20], chance: 1 }, { key: 'strModAllResistances', args: [30], chance: 2 }]
    };
    const incomplete: KeyedLine = {
      key: '', pickMode: '2', code: 'Partial-Affix',
      children: [{ key: 'strModAllResistances', args: [50], chance: 3 }, { key: 'strModAllResistances', args: [60] }]
    };
    const fixed: KeyedLine = {
      key: '', pickMode: '0', code: 'Fixed-Properties',
      children: [{ key: 'strModAllResistances', args: [40], chance: 100 }]
    };
    const item: CatalogItem = {
      AutoMagicGroups: [{ Code: 'Synthetic', Level: 12, RequiredLevel: 9, Lines: [{ key: 'strModAllResistances', args: [1, 2] }, weighted, weightedWithoutReplacement, fixed, incomplete] }]
    };
    const [entry] = presentAutoMagic(item, english());
    expect(entry.name).toBeNull();
    expect(entry.lines).toEqual([
      { text: '+1-2% to All Resistances' },
      {
        text: 'Random Grouped Affix',
        children: [{ text: '+40% to All Resistances', selection: null, selectionText: '' }]
      },
      {
        text: 'Random Grouped Affix',
        children: [
          { text: '+5-10% to All Resistances', selection: { kind: 'per-draw', percent: 75 }, selectionText: '75%' },
          { text: '+11-15% to All Resistances', selection: { kind: 'per-draw', percent: 25 }, selectionText: '25%' }
        ]
      },
      {
        text: 'Random Grouped Affix',
        children: [
          { text: '+20% to All Resistances', selection: { kind: 'first-draw', percent: (1 / 3) * 100 }, selectionText: '33.3%' },
          { text: '+30% to All Resistances', selection: { kind: 'first-draw', percent: (2 / 3) * 100 }, selectionText: '66.7%' }
        ]
      },
      {
        text: 'Random Grouped Affix',
        children: [
          { text: '+50% to All Resistances', selection: null, selectionText: '' },
          { text: '+60% to All Resistances', selection: null, selectionText: '' }
        ]
      }
    ]);
    expect(JSON.stringify(entry)).not.toMatch(/relative weight|\b1%/);
    expect(JSON.stringify(entry)).not.toContain('Magnetic-Affix1');
  });
});

describe('groupSelections', () => {
  const group = (pickMode: string | undefined, chances: (number | undefined)[]): KeyedLine => ({
    key: '', pickMode, children: chances.map((chance, index) => ({ key: `x${index}`, chance }))
  });
  const percents = (line: KeyedLine) => groupSelections(line).map(selectionPercent);

  it('turns ticket weights into shares: first draw for mode 1, every draw for mode 2', () => {
    expect(groupSelections(group('1', [1, 3]))).toEqual([{ kind: 'first-draw', percent: 25 }, { kind: 'first-draw', percent: 75 }]);
    expect(groupSelections(group('2', [1, 3]))).toEqual([{ kind: 'per-draw', percent: 25 }, { kind: 'per-draw', percent: 75 }]);
    expect(percents(group('2', [1, 1, 1]))).toEqual(['33.3%', '33.3%', '33.3%']);
    expect(percents(group('2', [1, 3, 1]))).toEqual(['20%', '60%', '20%']);
    expect(percents(group('1', Array(8).fill(1)))).toEqual(Array(8).fill('12.5%'));
    // A single ticket is a share of the group, never a literal 1%.
    expect(percents(group('1', [1]))).toEqual(['100%']);
    expect(percents(group('2', [1, 9999]))).toEqual(['<0.1%', '100%']);
  });

  it('gives no shares to all-selected or unknown pick modes', () => {
    expect(groupSelections(group('0', [1, 5]))).toEqual([null, null]);
    expect(groupSelections(group('3', [1, 5]))).toEqual([null, null]);
    expect(groupSelections(group(undefined, [1, 5]))).toEqual([null, null]);
  });

  it('omits the whole group when its weights cannot support a reliable share', () => {
    expect(groupSelections(group('2', [3, undefined]))).toEqual([null, null]);
    expect(groupSelections(group('1', [3, -1]))).toEqual([null, null]);
    expect(groupSelections(group('2', [3, Number.NaN]))).toEqual([null, null]);
    expect(groupSelections(group('2', [0, 0]))).toEqual([null, null]);
    expect(groupSelections({ key: '', pickMode: '2' })).toEqual([]);
  });

  it('excludes zero-ticket children from the total and leaves them unannotated', () => {
    expect(percents(group('2', [0, 1, 1]))).toEqual(['', '50%', '50%']);
  });

  it('resolves a single child against its own group', () => {
    const line = group('2', [1, 3]);
    expect(childSelection(line.children![1], line)).toEqual({ kind: 'per-draw', percent: 75 });
    expect(childSelection({ key: 'x0', chance: 1 }, line)).toBeNull();
  });
});
