import { describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import { i18n, initializeI18n } from './i18n';
import { filterGrailItems, normalizeGrailFilters } from './grail-filters';
import { readGrailFilters, writeGrailFilters } from './grail-query';
import { load } from '../routes/grail/+page.server';
import strings from '../../static/data/strings/enUS.json';

initializeI18n(strings);
const tools = get(i18n);
const data = load();
const defaults = () => readGrailFilters(new URLSearchParams()).catalog;

describe('Grail restored filters', () => {
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
  it('normalizes translated legacy choices before server rendering and clears stale equipment', () => {
    const legacy = { ...defaults(), selectedType: 'Amulet', selectedEquipment: 'Amulet' };
    const filters = normalizeGrailFilters(legacy, data.sets, 'sets', tools);
    expect(filters.selectedType).toBe('amulitype');
    expect(filters.selectedEquipment).toBe('amu');
    expect(filterGrailItems(data.sets, 'sets', filters, {}, false, tools).length).toBe(20);
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
