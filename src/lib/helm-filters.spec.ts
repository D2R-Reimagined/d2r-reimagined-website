import { describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import { i18n, initializeI18n } from './i18n';
import { itemType } from './catalog';
import { catalogTypeValues, matchesItemType, parseTypeChoice, typeChoiceValue, typeFamilyChoices } from './catalog-controls';
import { readCatalogFilters, writeCatalogFilters } from './catalog-query';
import { filterGrailItems } from './grail-filters';
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

describe('Helm filtering against the exported catalogs', () => {
  it('separates ordinary unique helms from the helm family', () => {
    const uniques = catalog('uniques');
    expect(helms(uniques, true)).toHaveLength(64);
    expect(helms(uniques, false)).toHaveLength(136);
    expect(typeTally(helms(uniques, false))).toEqual({ helmitype: 64, peltitype: 30, phlmitype: 30, circitype: 12 });
  });

  it('separates ordinary helm bases from class headgear and circlets', () => {
    const bases = catalog('bases');
    expect(catalogTypeValues(bases.map(itemType), 'bases')).toContain('helmitype');
    expect(typeTally(helms(bases, true))).toEqual({ helmitype: 24 });
    expect(typeTally(helms(bases, false))).toEqual({ helmitype: 24, peltitype: 15, phlmitype: 15, circitype: 4 });
  });

  describe('set pieces', () => {
    const sets = catalog('sets');
    const filtered = (exactType: boolean) => sets
      .map((set) => filterSetPieces(set, { ...pieceFilters, exactType }, [], tools))
      .filter((set): set is CatalogItem => set !== null);
    const pieces = (exactType: boolean) => filtered(exactType).flatMap((set) => set.SetItems ?? []);
    const named = (exactType: boolean, name: string) => filtered(exactType).find((set) => set.Index === name);

    it('keeps only ordinary helm pieces for Helm and adds descendants for Any Helm', () => {
      expect(typeTally(pieces(true))).toEqual({ helmitype: 53 });
      expect(typeTally(pieces(false))).toEqual({ helmitype: 53, peltitype: 4, phlmitype: 4, circitype: 8 });
    });

    it('scopes mixed-type sets to their matching pieces', () => {
      expect(named(true, "Aldur's Watchtower")).toBeUndefined();
      expect(named(false, "Aldur's Watchtower")?.SetItems?.map(itemType)).toEqual(['peltitype']);
      expect(named(true, 'Immortal King')).toBeUndefined();
      expect(named(false, 'Immortal King')?.SetItems?.map(itemType)).toEqual(['phlmitype']);
      expect(named(true, "Iratha's Finery")?.SetItems?.map(itemType)).toEqual(['helmitype']);
      expect(named(false, "M'avina's Battle Hymn")?.SetItems?.map(itemType)).toEqual(['circitype']);
      expect(named(true, "Civerb's Vestments")).toBeUndefined();
    });

    it('does not alter the source sets', () => {
      const source = sets.find((set) => set.Index === "Iratha's Finery")!;
      filtered(true);
      expect(source.SetItems).toHaveLength(4);
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
    expect(shown('g-type=helmitype&g-exact=true')).toHaveLength(64);
    expect(shown('g-type=helmitype')).toHaveLength(136);
    expect(typeTally(shown('g-category=sets&g-type=helmitype&g-exact=true'))).toEqual({ helmitype: 53 });
    expect(shown('g-category=sets&g-type=helmitype')).toHaveLength(69);
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
    const found = { [String(shown('g-type=helmitype&g-exact=true')[0].Index)]: true };
    const snapshot = JSON.stringify(found);
    expect(shown('g-type=helmitype&g-exact=true', found, true)).toHaveLength(63);
    expect(shown('g-type=helmitype', found, true)).toHaveLength(135);
    expect(JSON.stringify(found)).toBe(snapshot);
  });
});
