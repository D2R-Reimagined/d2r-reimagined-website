import { describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import { i18n, initializeI18n } from './i18n';
import { filterGrailItems } from './grail-filters';
import { readGrailFilters, type GrailCategory } from './grail-query';
import {
  assignGrailKeys, countGrailFound, grailKey, grailRenderKey, legacyGrailKey, migrateGrailProgress
} from './grail-progress';
import { buildCatalog } from './catalog-sources';
import { load } from '../routes/grail/+page.server';
import runewords from '../../static/data/keyed/runewords.json';
import strings from '../../static/data/strings/enUS.json';
import type { CatalogItem } from './types';

initializeI18n(strings);
const tools = get(i18n);
const defaults = () => readGrailFilters(new URLSearchParams()).catalog;

// Two runewords share a name but not a recipe, as same-name Reimagined runewords do.
const zephyrBow: CatalogItem = {
  Index: 'Zephyr', Runes: [{ NameKey: 'r09' }, { NameKey: 'r05' }], Types: ['missitype'],
  Lines: [{ key: 'ModStr1a', args: [20] }]
};
const zephyrWeapon: CatalogItem = {
  Index: 'Zephyr', Runes: [{ NameKey: 'r35' }, { NameKey: 'r35' }, { NameKey: 'r35' }], Types: [{ Index: 'weapitype' }],
  Lines: [{ key: 'ModStr1b', args: [40] }]
};
const beauty: CatalogItem = { Index: 'Beauty', Runes: [{ NameKey: 'r01' }], Types: ['helmitype'], Lines: [] };
const catalog = () => assignGrailKeys(buildCatalog('runewords', { runewords: [zephyrBow, zephyrWeapon, beauty] }));
const bowKey = 'Zephyr|r09-r05|missitype';
const weaponKey = 'Zephyr|r35-r35-r35|weapitype';

describe('Grail same-name variants', () => {
  it('keeps both same-name rows with their own recipes and distinct data-derived keys', () => {
    const rows = catalog();
    expect(rows).toHaveLength(3);
    expect(rows.map(grailKey)).toEqual([bowKey, weaponKey, 'Beauty']);
    expect(rows[0].Lines).toEqual(zephyrBow.Lines);
    expect(rows[1].Lines).toEqual(zephyrWeapon.Lines);
    // Keys depend on the data, not on the row order or on a filtered list.
    expect(assignGrailKeys(buildCatalog('runewords', { runewords: [beauty, zephyrWeapon, zephyrBow] })).map(grailKey))
      .toEqual(['Beauty', weaponKey, bowKey]);
    expect(assignGrailKeys([zephyrWeapon, zephyrBow]).map(grailKey)).toEqual([weaponKey, bowKey]);
  });

  it('leaves every key and row untouched when no names are shared', () => {
    const rows = [beauty, { ...zephyrBow }, { Index: 'Spirit', Runes: [{ NameKey: 'r07' }] }];
    const keyed = assignGrailKeys(rows);
    expect(keyed.map(grailKey)).toEqual(['Beauty', 'Zephyr', 'Spirit']);
    keyed.forEach((row, index) => expect(row).toBe(rows[index]));
    expect(keyed.every((row) => row.GrailKey === undefined)).toBe(true);
    const found = { Zephyr: true, Beauty: false };
    expect(migrateGrailProgress(found, keyed)).toEqual(found);
    expect(countGrailFound(keyed, found)).toBe(1);
  });

  it('keys identical duplicates by data order, not by visible position', () => {
    const row = { Index: 'Twin', Runes: [{ NameKey: 'r01' }], Types: ['swor'] };
    const keyed = assignGrailKeys([row, { ...row }, { Index: 'Solo' }]);
    expect(keyed.map(grailKey)).toEqual(['Twin|r01|swor', 'Twin|r01|swor#2', 'Solo']);
    expect(assignGrailKeys([...keyed].reverse()).map(grailKey).sort()).toEqual(keyed.map(grailKey).sort());
  });

  it('does not crash on rows without runes, types or a name', () => {
    const odd: CatalogItem[] = [{ Index: 'Odd' }, { Index: 'Odd', Runes: [] }, { NameKey: 'Keyed' }, {}];
    const keyed = assignGrailKeys(odd);
    expect(keyed.map(grailKey)).toEqual(['Odd||', 'Odd||#2', 'Keyed', 'Unknown']);
    expect(filterGrailItems(keyed, 'runewords', defaults(), {}, false, tools)).toHaveLength(4);
    expect(filterGrailItems(keyed, 'runewords', { ...defaults(), search: 'odd' }, {}, false, tools)).toHaveLength(2);
    expect(migrateGrailProgress({ Odd: true }, keyed)).toEqual({ 'Odd||': true, 'Odd||#2': true });
  });

  it('filters, searches, and hides found per variant', () => {
    const rows = catalog();
    const [bow, weapon] = rows;
    const search = { ...defaults(), search: 'zephyr' };
    expect(filterGrailItems(rows, 'runewords', search, {}, false, tools)).toEqual([bow, weapon]);
    const found = { [grailKey(bow)]: true };
    expect(filterGrailItems(rows, 'runewords', search, found, true, tools)).toEqual([weapon]);
    expect(countGrailFound(rows, found)).toBe(1);
    // The progress key's rune codes are not item text a search should reach.
    expect(filterGrailItems(rows, 'runewords', { ...defaults(), search: 'r09-r05' }, {}, false, tools)).toEqual([]);
    const byRunes = { ...defaults(), selectedRunes: ['r35'], runeMatch: 'makeable' as const };
    expect(filterGrailItems(rows, 'runewords', byRunes, {}, false, tools)).toEqual([weapon]);
    expect(filterGrailItems(rows, 'runewords', { ...defaults(), selectedType: 'missitype' }, {}, false, tools)).toContain(bow);
  });

  it('keeps row identities and found counts separate when switching tabs', () => {
    const data = { uniques: assignGrailKeys([{ Index: 'Zephyr' }, { Index: 'Gull' }]), sets: [] as CatalogItem[], runewords: catalog() };
    const categories: GrailCategory[] = ['uniques', 'sets', 'runewords'];
    const renderKeys = categories.flatMap((category) => data[category].map((item) => grailRenderKey(category, item)));
    expect(new Set(renderKeys).size).toBe(renderKeys.length);
    const maps = { uniques: { Zephyr: true }, sets: {}, runewords: { [bowKey]: true, [weaponKey]: true } };
    const counts = (order: GrailCategory[]) => order.map((category) => countGrailFound(data[category], maps[category]));
    expect(counts(categories)).toEqual([1, 0, 2]);
    expect(counts([...categories].reverse())).toEqual([2, 0, 1]);
  });
});

describe('Grail saved progress', () => {
  it('expands an ambiguous name-level save to every variant and keeps everything else', () => {
    const rows = catalog();
    const saved = { Zephyr: true, Beauty: true, 'Retired Runeword': true };
    const migrated = migrateGrailProgress(saved, rows);
    expect(migrated).toEqual({ [bowKey]: true, [weaponKey]: true, Beauty: true, 'Retired Runeword': true });
    expect(countGrailFound(rows, migrated)).toBe(3);
    expect(migrateGrailProgress(migrated, rows)).toEqual(migrated);
    // An unchecked shared name marks nothing.
    expect(migrateGrailProgress({ Zephyr: false }, rows)).toEqual({});
  });

  it('saves and restores each variant independently', () => {
    const rows = catalog();
    const saved = JSON.parse(JSON.stringify({ [weaponKey]: true, [bowKey]: false })) as Record<string, boolean>;
    const restored = migrateGrailProgress(saved, rows);
    expect(restored).toEqual(saved);
    expect(filterGrailItems(rows, 'runewords', { ...defaults(), search: 'zephyr' }, restored, true, tools)).toEqual([rows[0]]);
    expect(countGrailFound(rows, restored)).toBe(1);
  });

  it('moves a variant key back to the name when an export has only one row of that name', () => {
    const rows = assignGrailKeys([zephyrBow, beauty]);
    expect(rows.map(grailKey)).toEqual(['Zephyr', 'Beauty']);
    expect(migrateGrailProgress({ [bowKey]: true, [weaponKey]: false }, rows)).toEqual({ Zephyr: true });
    expect(migrateGrailProgress({ [weaponKey]: false }, rows)).toEqual({ Zephyr: false });
    // Variant keys of names this export no longer has at all stay untouched.
    expect(migrateGrailProgress({ 'Gone|r01|helmitype': true }, rows)).toEqual({ 'Gone|r01|helmitype': true });
    // A variant key whose recipe changed while the name stays shared is not guessed onto a variant.
    expect(migrateGrailProgress({ 'Zephyr|r01|helmitype': true }, catalog())).toEqual({ 'Zephyr|r01|helmitype': true });
  });

  it('leaves saves without shared names untouched', () => {
    const rows = assignGrailKeys([{ Index: 'Gull' }, { Index: 'Nagelring' }]);
    const saved = { Gull: true, Nagelring: false };
    expect(migrateGrailProgress(saved, rows)).toEqual(saved);
  });
});

describe('Grail page data from the active export', () => {
  const data = load();

  it('keeps every runeword row and gives every row of a category a unique progress key', () => {
    expect(data.runewords).toHaveLength(buildCatalog('runewords', { runewords: runewords as CatalogItem[] }).length);
    for (const category of ['uniques', 'sets', 'runewords'] as GrailCategory[]) {
      expect(data[category].length, category).toBeGreaterThan(0);
      const keys = data[category].map(grailKey);
      expect(new Set(keys).size, category).toBe(keys.length);
      const names = new Map<string, number>();
      for (const item of data[category]) names.set(legacyGrailKey(item), (names.get(legacyGrailKey(item)) ?? 0) + 1);
      for (const item of data[category]) {
        // Only shared names get variant keys, so existing saves of unique names keep matching.
        const shared = names.get(legacyGrailKey(item))! > 1;
        expect(item.GrailKey === undefined, `${category}:${grailKey(item)}`).toBe(!shared);
        if (shared) expect(grailKey(item).startsWith(`${legacyGrailKey(item)}|`)).toBe(true);
      }
    }
    expect(load().runewords.map(grailKey)).toEqual(data.runewords.map(grailKey));
  });

  it('filters, counts and migrates the real rows without losing any', () => {
    for (const category of ['uniques', 'sets', 'runewords'] as GrailCategory[]) {
      const rows = data[category];
      expect(filterGrailItems(rows, category, defaults(), {}, false, tools)).toHaveLength(rows.length);
      const legacy = Object.fromEntries(rows.map((item) => [legacyGrailKey(item), true]));
      const migrated = migrateGrailProgress(legacy, rows);
      expect(countGrailFound(rows, migrated), category).toBe(rows.length);
      expect(filterGrailItems(rows, category, defaults(), migrated, true, tools)).toEqual([]);
    }
  });
});
