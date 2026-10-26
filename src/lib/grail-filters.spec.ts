import { describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import { i18n, initializeI18n } from './i18n';
import { filterGrailItems, normalizeGrailFilters } from './grail-filters';
import { readGrailFilters, writeGrailFilters } from './grail-query';
import type { CatalogItem } from './types';
import { load } from '../routes/grail/+page.server';
import strings from '../../static/data/strings/enUS.json';
import sourceSets from '../../static/data/keyed/sets.json';
import sourceUniques from '../../static/data/keyed/uniques.json';

initializeI18n(strings);
const tools = get(i18n);
const data = load();
const defaults = () => readGrailFilters(new URLSearchParams()).catalog;

describe('Grail restored filters', () => {
  it('retains catalog requirements and shared set bonuses for item details', () => {
    const beauty = data.runewords.find((item) => item.Index === 'Beauty')!;
    expect(beauty.RequiredLevel).toBeGreaterThan(1);
    expect(beauty.Types).toBeTruthy();
    const icon = data.sets.find((item) => item.Index === "Civerb's Icon")!;
    expect(icon.RequiredLevel).toBeGreaterThan(1);
    expect(icon.PartialBonuses?.length).toBeGreaterThan(0);
    expect(icon.FullBonuses?.length).toBeGreaterThan(0);
    expect(data.uniques.some((item) => Number(item.RequiredLevel) > 1)).toBe(true);
  });
  it('retains type, class, equipment, vanilla, and set name metadata without changing progress keys', () => {
    const icon = data.sets.find((item) => item.Index === "Civerb's Icon")!;
    expect(icon.Type).toBe('amulitype');
    expect(icon.Equipment?.NameKey).toBe('amu');
    expect(icon.Vanilla).toBe('Y');
    expect(icon.SetName).toBe("Civerb's Vestments");
    expect(data.sets.some((item) => Boolean(item.Equipment?.RequiredClass))).toBe(true);
    expect(data.uniques.some((item) => Boolean(item.Type))).toBe(true);
    expect(data.runewords.some((item) => Boolean(item.Types?.length))).toBe(true);
  });
  it('preserves source ItemLevel on uniques and individual set pieces', () => {
    const sourceAnnihilus = (sourceUniques as CatalogItem[]).find((item) => item.Index === 'Annihilus')!;
    const annihilus = data.uniques.find((item) => item.Index === 'Annihilus')!;
    const sourceWarlordPiece = (sourceSets as CatalogItem[]).flatMap((set) => set.SetItems ?? [])
      .find((item) => item.Index === "Warlord's Conquest")!;
    const warlordPiece = data.sets.find((item) => item.Index === "Warlord's Conquest")!;

    expect(annihilus.ItemLevel).toBe(sourceAnnihilus.ItemLevel);
    expect(annihilus.ItemLevel).toBe(110);
    expect(warlordPiece.ItemLevel).toBe(sourceWarlordPiece.ItemLevel);
    expect(warlordPiece.ItemLevel).toBe(100);
  });
  it('filters drop-only by ItemLevel and keeps the search aliases exact', () => {
    const items: CatalogItem[] = [
      { Index: 'Drop-only Fire 99', ItemLevel: 99, RequiredLevel: 120 },
      { Index: 'Fire 100', ItemLevel: 100, RequiredLevel: 1 },
      { Index: 'Cold 101', ItemLevel: 101, RequiredLevel: 1 },
      { Index: 'Fire Missing Level', RequiredLevel: 120 }
    ];
    const search = (query: string) => filterGrailItems(items, 'uniques', { ...defaults(), search: query }, {}, false, tools);
    const indices = (query: string) => search(query).map((item) => item.Index);

    expect(indices('drop')).toEqual(['Fire 100', 'Cold 101']);
    expect(indices('drop-only')).toEqual(indices('drop'));
    expect(indices('-drop')).toEqual(['Drop-only Fire 99', 'Fire Missing Level']);
    expect(indices('-drop-only')).toEqual(indices('-drop'));
    expect(indices('!drop')).toEqual(indices('-drop'));
    expect(indices('!drop-only')).toEqual(indices('-drop'));
    expect(indices('fire')).toEqual(['Drop-only Fire 99', 'Fire 100', 'Fire Missing Level']);
    expect(indices('drop+fire')).toEqual(['Fire 100']);
    expect(indices('-drop+fire')).toEqual(['Drop-only Fire 99', 'Fire Missing Level']);
    expect(indices('drop+fire, cold')).toEqual(['Fire 100', 'Cold 101']);
    expect(indices('drop, drop-only')).toEqual(indices('drop'));
  });
  it('filters mixed-level set pieces independently and composes with Hide Found and Hide Vanilla', () => {
    const items: CatalogItem[] = [
      { Index: 'Fire Drop Piece', ItemLevel: 100, GrailKey: 'found-drop', Vanilla: 'Y' },
      { Index: 'Fire Regular Piece', ItemLevel: 99 },
      { Index: 'Cold Drop Piece', ItemLevel: 101, GrailKey: 'found-cold' },
      { Index: 'Fire Missing Level', RequiredLevel: 120 }
    ];
    const search = (query: string, found: Record<string, boolean> = {}, hideFound = false, hideVanilla = false) =>
      filterGrailItems(items, 'sets', { ...defaults(), search: query, hideVanilla }, found, hideFound, tools)
        .map((item) => item.Index);

    expect(search('drop')).toEqual(['Fire Drop Piece', 'Cold Drop Piece']);
    expect(search('drop+fire')).toEqual(['Fire Drop Piece']);
    expect(search('-drop+fire')).toEqual(['Fire Regular Piece', 'Fire Missing Level']);
    expect(search('drop', { 'found-drop': true }, true)).toEqual(['Cold Drop Piece']);
    expect(search('drop', {}, false, true)).toEqual(['Cold Drop Piece']);
  });
  it('leaves Runewords on ordinary search and checks source catalog drop-only results', () => {
    const runewords: CatalogItem[] = [
      { Index: 'Drop-only Runeword', ItemLevel: 99 },
      { Index: 'High Level Runeword', ItemLevel: 100 }
    ];
    expect(filterGrailItems(runewords, 'runewords', { ...defaults(), search: 'drop' }, {}, false, tools)
      .map((item) => item.Index)).toEqual(['Drop-only Runeword']);

    const uniques = filterGrailItems(data.uniques, 'uniques', { ...defaults(), search: 'drop' }, {}, false, tools);
    const sets = filterGrailItems(data.sets, 'sets', { ...defaults(), search: 'drop' }, {}, false, tools);
    expect(uniques.every((item) => Number(item.ItemLevel) >= 100)).toBe(true);
    expect(sets.every((item) => Number(item.ItemLevel) >= 100)).toBe(true);
    expect(uniques.map((item) => item.Index)).toContain('Annihilus');
    expect(sets.map((item) => item.Index)).toContain("Warlord's Conquest");
  });
  it('combines type, equipment, search syntax, hide found, and hide vanilla on individual pieces', () => {
    const filters = { ...defaults(), selectedType: 'amulitype', selectedEquipment: 'amu', search: 'civerb + mana -block' };
    const match = filterGrailItems(data.sets, 'sets', filters, {}, false, tools);
    expect(match.map((item) => item.Index)).toEqual(["Civerb's Icon"]);
    expect(filterGrailItems(data.sets, 'sets', filters, { "Civerb's Icon": true }, true, tools)).toEqual([]);
    expect(filterGrailItems(data.sets, 'sets', { ...filters, hideVanilla: true }, {}, false, tools)).toEqual([]);
    expect(filterGrailItems(data.sets, 'sets', { ...filters, search: 'faster block rate' }, {}, false, tools)).toEqual([]);
  });
  it('matches class equipment and broad armor families', () => {
    const filtered = filterGrailItems(data.sets, 'sets', { ...defaults(), selectedType: 'armoitype', selectedClass: 'Paladin' }, {}, false, tools);
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((item) => item.Equipment?.RequiredClass === 'Paladin')).toBe(true);
  });
  it('preserves runeword applicability, rune count, and rune filters', () => {
    const filtered = filterGrailItems(data.runewords, 'runewords', { ...defaults(), selectedType: 'sworitype', runeCount: '3', selectedRunes: ['r01'] }, {}, false, tools);
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((item) => item.Runes?.length === 3 && item.Runes.some((rune) => rune.NameKey === 'r01'))).toBe(true);
  });
  it('lists only runewords makeable from the selected runes', () => {
    const selectedRunes = ['r01', 'r02', 'r03', 'r04', 'r05', 'r06', 'r07', 'r08'];
    const filters = { ...defaults(), selectedRunes, runeMatch: 'makeable' as const };
    const filtered = filterGrailItems(data.runewords, 'runewords', filters, {}, false, tools);
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((item) => item.Runes?.every((rune) => selectedRunes.includes(rune.NameKey ?? '')))).toBe(true);
    expect(readGrailFilters(writeGrailFilters(new URL('https://example.test/grail?g-category=runewords'),
      { category: 'runewords', hideFound: false, catalog: filters }).searchParams).catalog.runeMatch).toBe('makeable');
  });
  it('normalizes translated legacy choices before server rendering and clears stale equipment', () => {
    const legacy = { ...defaults(), selectedType: 'Amulet', selectedEquipment: 'Amulet' };
    const filters = normalizeGrailFilters(legacy, data.sets, 'sets', tools);
    expect(filters.selectedType).toBe('amulitype');
    expect(filters.selectedEquipment).toBe('amu');
    const amulets = data.sets.filter((item) => item.Type === 'amulitype' && item.Equipment?.NameKey === 'amu');
    expect(amulets.length).toBeGreaterThan(0);
    expect(filterGrailItems(data.sets, 'sets', filters, {}, false, tools)).toEqual(amulets);
    expect(normalizeGrailFilters({ ...filters, selectedType: 'shieitype' }, data.sets, 'sets', tools).selectedEquipment).toBe('');
    expect(normalizeGrailFilters({ ...defaults(), selectedRunes: ['El'] }, data.runewords, 'runewords', tools).selectedRunes).toEqual(['r01']);
  });
});

describe('Grail shareable filters', () => {
  it('reads the old category and hide-toggle link from issue 108', () => {
    const filters = readGrailFilters(new URLSearchParams('g-category=sets&g-hideFound=false&g-hideVanilla=false'));
    expect(filters.category).toBe('sets');
    expect(filters.hideFound).toBe(false);
    expect(filters.catalog.hideVanilla).toBe(false);
  });
  it('round trips combined filters and preserves unrelated URL state', () => {
    const filters = readGrailFilters(new URLSearchParams('g-category=sets&g-type=amulitype&g-equipment=amu&g-class=Paladin&g-search=mana&g-hideVanilla=true&g-hideFound=1'));
    const url = writeGrailFilters(new URL('https://example.test/grail?keep=yes'), filters);
    expect(readGrailFilters(url.searchParams)).toEqual(filters);
    expect(url.searchParams.get('keep')).toBe('yes');
  });
  it('supports search handoffs and removes default filters on reset', () => {
    expect(readGrailFilters(new URLSearchParams('q=mana')).catalog.search).toBe('mana');
    const url = writeGrailFilters(new URL('https://example.test/grail?g-category=sets&g-hideVanilla=true&type=amu&q=mana'), readGrailFilters(new URLSearchParams()));
    expect(url.search).toBe('');
    expect(readGrailFilters(new URLSearchParams('g-category=invalid')).category).toBe('uniques');
  });
});
