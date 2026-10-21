import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';

import { autoMagicGroups, childSelection, presentAutoMagic } from './automagic';
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

  it('keeps property-group children under their parent and labels weights and percentages', () => {
    const weighted: KeyedLine = {
      key: '', pickMode: '2', code: 'Magnetic-Affix1',
      children: [{ key: 'strModAllResistances', args: [5, 10], chance: 3 }, { key: 'strModAllResistances', args: [11, 15], chance: 1 }]
    };
    const percent: KeyedLine = {
      key: '', pickMode: '1', code: 'Gelid-Affix3',
      children: [{ key: 'strModAllResistances', args: [20], chance: 25 }, { key: 'strModAllResistances', args: [30] }]
    };
    const item: CatalogItem = {
      AutoMagicGroups: [{ Code: 'Synthetic', Level: 12, RequiredLevel: 9, Lines: [{ key: 'strModAllResistances', args: [1, 2] }, weighted, percent] }]
    };
    const [entry] = presentAutoMagic(item, english());
    expect(entry.name).toBeNull();
    expect(entry.lines).toEqual([
      { text: '+1-2% to All Resistances' },
      {
        text: 'Random Grouped Affix',
        children: [
          { text: '+5-10% to All Resistances', selection: { kind: 'weight', value: 3 }, selectionText: 'relative weight 3' },
          { text: '+11-15% to All Resistances', selection: { kind: 'weight', value: 1 }, selectionText: 'relative weight 1' }
        ]
      },
      {
        text: 'Random Grouped Affix',
        children: [
          { text: '+20% to All Resistances', selection: { kind: 'percent', value: 25 }, selectionText: '25% chance' },
          { text: '+30% to All Resistances', selection: null, selectionText: '' }
        ]
      }
    ]);
    // Relative weights are never turned into derived odds such as "75%".
    expect(JSON.stringify(entry)).not.toMatch(/75(\.0)?%|25\.0%/);
    expect(JSON.stringify(entry)).not.toContain('Magnetic-Affix1');
  });
});

describe('childSelection', () => {
  it('reads chance as a relative weight only under pick mode 2', () => {
    expect(childSelection({ key: 'x', chance: 4 }, '2')).toEqual({ kind: 'weight', value: 4 });
    expect(childSelection({ key: 'x', chance: 4 }, '1')).toEqual({ kind: 'percent', value: 4 });
    expect(childSelection({ key: 'x', chance: 4 }, undefined)).toEqual({ kind: 'percent', value: 4 });
    expect(childSelection({ key: 'x' }, '2')).toBeNull();
  });
});
