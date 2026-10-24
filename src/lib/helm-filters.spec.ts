import { describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import { i18n, initializeI18n } from './i18n';
import { itemType } from './catalog';
import {
  catalogTypeValues, matchesItemType, orderTypeChoices, parseTypeChoice, typeChoiceValue, typeFamilyChoices
} from './catalog-controls';
import { readCatalogFilters, writeCatalogFilters } from './catalog-query';
import { filterGrailItems } from './grail-filters';
import { grailKey } from './grail-progress';
import { readGrailFilters, writeGrailFilters } from './grail-query';
import { filterSetPieces } from './set-filters';
import { load as catalogLoad } from '../routes/data/[catalog]/+page.server';
import { load as grailLoad } from '../routes/grail/+page.server';
import { UI_STRINGS } from '../utilities/ui-strings';
import strings from '../../static/data/strings/enUS.json';
import type { CatalogItem } from './types';

initializeI18n(strings);
const tools = get(i18n);
const catalog = (slug: string) => (catalogLoad as (event: unknown) => { items: CatalogItem[] })({ params: { catalog: slug } }).items;
const helms = (items: CatalogItem[], exact: boolean) => items.filter((item) => matchesItemType([itemType(item)], 'helmitype', exact));
const typeTally = (items: CatalogItem[]) => items.reduce<Record<string, number>>((counts, item) =>
  ({ ...counts, [itemType(item)]: (counts[itemType(item)] ?? 0) + 1 }), {});
const pieceFilters = { selectedType: 'helmitype', selectedClass: '', selectedEquipment: '', handFilter: '' };

describe('Helm and Any Helm choices', () => {
  const options = [
    { value: 'helmitype', label: 'Helm' }, { value: 'peltitype', label: 'Druid Pelt' }, { value: 'armoitype', label: 'Any Armor' }
  ];

  it('offers both choices sharing the helm type code', () => {
    expect(typeFamilyChoices(options, (key) => tools.t(key))).toEqual([
      { value: 'helmitype', label: 'Any Helm' },
      { value: 'armoitype', label: 'Any Armor' },
      { value: 'peltitype', label: 'Druid Pelt' },
      { value: 'exact:helmitype', label: 'Helm' }
    ].sort((a, b) => a.label.localeCompare(b.label)));
  });

  it('leaves type lists without helms untouched', () => {
    const others = options.slice(1);
    expect(typeFamilyChoices(others, (key) => tools.t(key))).toEqual([others[1], others[0]]);
  });

  it('maps each choice to the real type and the Exact flag', () => {
    expect(parseTypeChoice('exact:helmitype')).toEqual({ selectedType: 'helmitype', exactType: true });
    expect(parseTypeChoice('helmitype')).toEqual({ selectedType: 'helmitype', exactType: false });
    expect(parseTypeChoice('')).toEqual({ selectedType: '', exactType: false });
    expect(typeChoiceValue('helmitype', true)).toBe('exact:helmitype');
    expect(typeChoiceValue('helmitype', false)).toBe('helmitype');
    expect(typeChoiceValue('peltitype', true)).toBe('peltitype');
  });

  it('orders priority families, other families, then specific types by translated label', () => {
    // Labels are deliberately unrelated to the codes so ordering cannot depend on English text.
    const synthetic = [
      { value: 'bootitype', label: 'A' }, { value: 'throitype', label: 'B' }, { value: 'shlditype', label: 'Z' },
      { value: 'meleitype', label: 'C' }, { value: 'blunitype', label: 'D' }, { value: 'armoitype', label: 'E' },
      { value: 'peltitype', label: 'F' }, { value: 'missitype', label: 'G' }, { value: 'weapitype', label: 'H' },
      { value: 'helmitype', label: 'I' }, { value: 'exact:helmitype', label: 'J' }
    ];
    expect(orderTypeChoices(synthetic).map((option) => option.value)).toEqual([
      'armoitype', 'helmitype', 'weapitype', 'meleitype', 'missitype', 'throitype',
      'blunitype', 'shlditype',
      'bootitype', 'peltitype', 'exact:helmitype'
    ]);
  });

  it('treats Helm as specific when no separate exact choice exists', () => {
    const synthetic = [{ value: 'peltitype', label: 'B' }, { value: 'helmitype', label: 'A' }, { value: 'weapitype', label: 'C' }];
    expect(orderTypeChoices(synthetic)).toEqual([synthetic[2], synthetic[1], synthetic[0]]);
    expect(synthetic.map((option) => option.value)).toEqual(['peltitype', 'helmitype', 'weapitype']);
  });

  it('localizes Any Helm in every UI language', () => {
    for (const language of Object.values(UI_STRINGS)) expect(language?.itype_any_helm).toBeTruthy();
  });
});

describe('Helm URL compatibility', () => {
  it.each(['uniques', 'sets', 'bases'] as const)('restores both selections on %s', (slug) => {
    const broad = readCatalogFilters(new URLSearchParams('type=helmitype'), slug);
    const exact = readCatalogFilters(new URLSearchParams('type=helmitype&exact=true'), slug);
    expect(typeChoiceValue(broad.selectedType, broad.exactType)).toBe('helmitype');
    expect(typeChoiceValue(exact.selectedType, exact.exactType)).toBe('exact:helmitype');
  });

  it('switches between the choices without disturbing unrelated state', () => {
    const url = new URL('https://example.test/data/uniques?search=life&sort=level-descending&hideVanilla=true&keep=yes&type=helmitype');
    const filters = { ...readCatalogFilters(url.searchParams, 'uniques'), ...parseTypeChoice('exact:helmitype') };
    const exact = writeCatalogFilters(new URL(url), filters, 'uniques');
    expect(exact.searchParams.get('type')).toBe('helmitype');
    expect(exact.searchParams.get('exact')).toBe('true');
    for (const [key, value] of [['search', 'life'], ['sort', 'level-descending'], ['hideVanilla', 'true'], ['keep', 'yes']]) {
      expect(exact.searchParams.get(key)).toBe(value);
    }
    const broad = writeCatalogFilters(new URL(exact), { ...filters, ...parseTypeChoice('helmitype') }, 'uniques');
    expect(broad.searchParams.get('type')).toBe('helmitype');
    expect(broad.searchParams.has('exact')).toBe(false);
    expect(broad.searchParams.get('search')).toBe('life');
  });
});

// Helm and its descendants (Druid pelts, Barbarian helms, circlets): the game's item type tree.
const helmFamily = ['helmitype', 'peltitype', 'phlmitype', 'circitype'];
const ofTypes = (items: CatalogItem[], types: string[]) => items.filter((item) => types.includes(itemType(item)));

describe('Helm filtering against the exported catalogs', () => {
  it.each(['uniques', 'bases'] as const)('separates ordinary helms from the helm family in %s', (slug) => {
    const items = catalog(slug);
    expect(catalogTypeValues(items.map(itemType), slug)).toContain('helmitype');
    expect(helms(items, true)).toEqual(ofTypes(items, ['helmitype']));
    expect(helms(items, false)).toEqual(ofTypes(items, helmFamily));
    expect(helms(items, true).length).toBeGreaterThan(0);
    expect(Object.keys(typeTally(helms(items, false))).every((type) => helmFamily.includes(type))).toBe(true);
  });

  describe('set pieces', () => {
    const sets = catalog('sets');
    const filtered = (source: CatalogItem[], exactType: boolean) => source
      .map((set) => filterSetPieces(set, { ...pieceFilters, exactType }, [], tools))
      .filter((set): set is CatalogItem => set !== null);
    const pieces = (exactType: boolean) => filtered(sets, exactType).flatMap((set) => set.SetItems ?? []);
    const allPieces = sets.flatMap((set) => set.SetItems ?? []);

    it('keeps only ordinary helm pieces for Helm and adds descendants for Any Helm', () => {
      expect(pieces(true).length).toBeGreaterThan(0);
      expect(pieces(true)).toEqual(ofTypes(allPieces, ['helmitype']));
      expect(pieces(false)).toEqual(ofTypes(allPieces, helmFamily));
    });

    it('scopes mixed-type sets to their matching pieces', () => {
      const piece = (Index: string, Type: string): CatalogItem => ({ Index, Type });
      const fixture: CatalogItem[] = [
        { Index: 'Druid set', SetItems: [piece('pelt', 'peltitype'), piece('boots', 'bootitype')] },
        { Index: 'Barbarian set', SetItems: [piece('primal', 'phlmitype'), piece('belt', 'beltitype')] },
        { Index: 'Helm set', SetItems: [piece('helm', 'helmitype'), piece('armor', 'torsitype')] },
        { Index: 'Circlet set', SetItems: [piece('circlet', 'circitype'), piece('bow', 'abowitype')] },
        { Index: 'No helm set', SetItems: [piece('amulet', 'amulitype'), piece('ring', 'ringitype')] }
      ];
      const named = (exactType: boolean, name: string) => filtered(fixture, exactType).find((set) => set.Index === name);
      expect(named(true, 'Druid set')).toBeUndefined();
      expect(named(false, 'Druid set')?.SetItems?.map(itemType)).toEqual(['peltitype']);
      expect(named(true, 'Barbarian set')).toBeUndefined();
      expect(named(false, 'Barbarian set')?.SetItems?.map(itemType)).toEqual(['phlmitype']);
      expect(named(true, 'Helm set')?.SetItems?.map(itemType)).toEqual(['helmitype']);
      expect(named(false, 'Circlet set')?.SetItems?.map(itemType)).toEqual(['circitype']);
      expect(named(false, 'No helm set')).toBeUndefined();
      expect(fixture[2].SetItems).toHaveLength(2);
    });

    it('does not alter the source sets', () => {
      const before = JSON.stringify(sets);
      filtered(sets, true);
      filtered(sets, false);
      expect(JSON.stringify(sets)).toBe(before);
    });
  });
});

describe('Grail Helm filtering', () => {
  const data = grailLoad();
  const filters = (query: string) => readGrailFilters(new URLSearchParams(query));
  const shown = (query: string, found: Record<string, boolean> = {}, hideFound = false) => {
    const restored = filters(query);
    return filterGrailItems(data[restored.category], restored.category, restored.catalog, found, hideFound, tools);
  };

  it('filters uniques and set pieces by exact and inherited helms', () => {
    expect(shown('g-type=helmitype&g-exact=true').length).toBeGreaterThan(0);
    expect(shown('g-type=helmitype&g-exact=true')).toEqual(ofTypes(data.uniques, ['helmitype']));
    expect(shown('g-type=helmitype')).toEqual(ofTypes(data.uniques, helmFamily));
    expect(shown('g-category=sets&g-type=helmitype&g-exact=true')).toEqual(ofTypes(data.sets, ['helmitype']));
    expect(shown('g-category=sets&g-type=helmitype')).toEqual(ofTypes(data.sets, helmFamily));
  });

  it('round trips both choices and leaves runeword Exact behavior intact', () => {
    for (const query of ['g-type=helmitype&g-exact=true', 'g-category=sets&g-type=helmitype&g-exact=true',
      'g-type=helmitype', 'g-category=runewords&g-type=helmitype&g-exact=true']) {
      const restored = filters(query);
      const url = writeGrailFilters(new URL('https://example.test/grail?keep=yes'), restored);
      expect(readGrailFilters(url.searchParams)).toEqual(restored);
      expect(url.searchParams.get('keep')).toBe('yes');
    }
    expect(writeGrailFilters(new URL('https://example.test/grail'), filters('g-exact=true')).search).toBe('');
  });

  it('applies found progress without changing its keys', () => {
    const found = { [grailKey(shown('g-type=helmitype&g-exact=true')[0])]: true };
    const snapshot = JSON.stringify(found);
    expect(shown('g-type=helmitype&g-exact=true', found, true)).toHaveLength(shown('g-type=helmitype&g-exact=true').length - 1);
    expect(shown('g-type=helmitype', found, true)).toHaveLength(shown('g-type=helmitype').length - 1);
    expect(JSON.stringify(found)).toBe(snapshot);
  });
});
