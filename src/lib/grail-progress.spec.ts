import { describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import { i18n, initializeI18n } from './i18n';
import { filterGrailItems } from './grail-filters';
import { readGrailFilters, type GrailCategory } from './grail-query';
import { assignGrailKeys, countGrailFound, grailKey, grailRenderKey, migrateGrailProgress } from './grail-progress';
import { buildCatalog } from './catalog-sources';
import { load } from '../routes/grail/+page.server';
import runewords from '../../static/data/keyed/runewords.json';
import strings from '../../static/data/strings/enUS.json';
import type { CatalogItem } from './types';

initializeI18n(strings);
const tools = get(i18n);
const data = load();
const defaults = () => readGrailFilters(new URLSearchParams()).catalog;
const named = (name: string) => data.runewords.filter((item) => item.Index === name);
const runes = (item: CatalogItem) => (item.Runes ?? []).map((rune) => rune.NameKey).join('-');

describe('Grail same-name variants', () => {
  it('keeps every runeword row with its own recipe and properties', () => {
    const source = buildCatalog('runewords', { runewords: runewords as CatalogItem[] });
    expect(data.runewords).toHaveLength(source.length);
    for (const name of ['Zephyr', 'Purity']) {
      const variants = named(name);
      expect(variants).toHaveLength(2);
      expect(runes(variants[0])).not.toBe(runes(variants[1]));
      expect(variants[0].Lines).not.toEqual(variants[1].Lines);
    }
  });

  it('gives each variant a unique key derived from its data, and leaves unique names alone', () => {
    for (const category of ['uniques', 'sets', 'runewords'] as GrailCategory[]) {
      const keys = data[category].map(grailKey);
      expect(new Set(keys).size, category).toBe(keys.length);
    }
    const zephyr = named('Zephyr').map(grailKey);
    expect(zephyr).toEqual(['Zephyr|r09-r05|missitype', 'Zephyr|r35-r35-r35|weapitype']);
    expect(load().runewords.map(grailKey)).toEqual(data.runewords.map(grailKey));
    expect(grailKey(named('Beauty')[0])).toBe('Beauty');
    expect(data.uniques.every((item) => item.GrailKey === undefined)).toBe(true);
  });

  it('keys identical duplicates by data order, not by visible position', () => {
    const row = { Index: 'Twin', Runes: [{ NameKey: 'r01' }], Types: ['swor'] };
    const keyed = assignGrailKeys([row, { ...row }, { Index: 'Solo' }]);
    expect(keyed.map(grailKey)).toEqual(['Twin|r01|swor', 'Twin|r01|swor#2', 'Solo']);
    expect(assignGrailKeys([...keyed].reverse()).map(grailKey).sort()).toEqual(keyed.map(grailKey).sort());
  });

  it('filters, searches, and hides found per variant', () => {
    const [bow, weapon] = named('Zephyr');
    const search = { ...defaults(), search: 'zephyr' };
    expect(filterGrailItems(data.runewords, 'runewords', search, {}, false, tools)).toEqual([bow, weapon]);
    const found = { [grailKey(bow)]: true };
    expect(filterGrailItems(data.runewords, 'runewords', search, found, true, tools)).toEqual([weapon]);
    expect(countGrailFound(data.runewords, found)).toBe(1);
    // The progress key's rune codes are not item text a search should reach.
    expect(filterGrailItems(data.runewords, 'runewords', { ...defaults(), search: 'r09-r05' }, {}, false, tools)).toEqual([]);
    const byRunes = { ...defaults(), selectedRunes: ['r35'], runeMatch: 'makeable' as const };
    expect(filterGrailItems(named('Zephyr'), 'runewords', byRunes, {}, false, tools)).toEqual([weapon]);
  });

  it('keeps row identities and found counts separate when switching tabs', () => {
    const categories: GrailCategory[] = ['uniques', 'sets', 'runewords'];
    const renderKeys = categories.flatMap((category) => data[category].map((item) => grailRenderKey(category, item)));
    expect(new Set(renderKeys).size).toBe(renderKeys.length);
    const maps = {
      uniques: { [grailKey(data.uniques[0])]: true },
      sets: {},
      runewords: Object.fromEntries(named('Purity').map((item) => [grailKey(item), true]))
    };
    const counts = (order: GrailCategory[]) => order.map((category) => countGrailFound(data[category], maps[category]));
    expect(counts(categories)).toEqual([1, 0, 2]);
    expect(counts([...categories].reverse())).toEqual([2, 0, 1]);
  });
});

describe('Grail saved progress', () => {
  it('expands an ambiguous name-level save to every variant and keeps everything else', () => {
    const saved = { Zephyr: true, Purity: false, Beauty: true, 'Retired Runeword': true };
    const migrated = migrateGrailProgress(saved, data.runewords);
    expect(migrated).toEqual({
      'Zephyr|r09-r05|missitype': true,
      'Zephyr|r35-r35-r35|weapitype': true,
      Beauty: true,
      'Retired Runeword': true
    });
    expect(countGrailFound(data.runewords, migrated)).toBe(3);
    expect(migrateGrailProgress(migrated, data.runewords)).toEqual(migrated);
  });

  it('leaves saves without shared names untouched', () => {
    const saved = { [grailKey(data.uniques[0])]: true, [grailKey(data.uniques[1])]: false };
    expect(migrateGrailProgress(saved, data.uniques)).toEqual(saved);
  });
});
