import { describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import { i18n, initializeI18n } from './i18n';
import { tokenizeSearch } from './catalog-controls';
import { filterSetPieces, scopesSetPieces } from './set-filters';
import type { CatalogItem } from './types';
import strings from '../../static/data/strings/enUS.json';
import sets from '../../static/data/keyed/sets.json';

initializeI18n(strings);
const tools = get(i18n);
const defaults = { selectedType: '', selectedClass: '', selectedEquipment: '', handFilter: '' };
const set: CatalogItem = {
  Index: 'Test Set',
  PartialBonuses: [{ key: 'shared partial bonus' }],
  FullBonuses: [{ key: 'shared full bonus' }],
  SetItems: [
    { Index: 'Test Amulet', Type: 'amulitype', Equipment: { NameKey: 'amu' },
      Lines: [{ key: 'ModStr3k', args: [2] }], SetBonuses: [[{ key: 'piece bonus' }]] },
    { Index: 'Test Shield', Type: 'ashditype', Equipment: { NameKey: 'shield', RequiredClass: 'Paladin' },
      Lines: [{ key: 'sibling lightning property' }] }
  ]
};
const filter = (filters = {}, search = '', item = set) => filterSetPieces(item, { ...defaults, ...filters }, tokenizeSearch(search), tools);

describe('set piece filtering', () => {
  it('retains the complete set and global-bonus search without piece filters', () => {
    expect(filter()).toBe(set);
    expect(filter({}, 'shared full bonus')).toBe(set);
  });
  it('searches only the selected type, excluding sibling properties and shared bonuses', () => {
    expect(filter({ selectedType: 'amulitype' }, 'lightning')).toBeNull();
    expect(filter({ selectedType: 'amulitype' }, 'shared')).toBeNull();
    expect(filter({ selectedType: 'amulitype' }, '2 to all skills')?.SetItems?.map((item) => item.Index)).toEqual(['Test Amulet']);
  });
  it('requires class, type, and equipment on the same piece', () => {
    expect(filter({ selectedType: 'amulitype', selectedClass: 'Paladin' })).toBeNull();
    expect(filter({ selectedType: 'amulitype', selectedEquipment: 'shield' })).toBeNull();
    expect(filter({ selectedType: 'shlditype', selectedClass: 'Paladin', selectedEquipment: 'shield' })?.SetItems).toEqual([set.SetItems![1]]);
  });
  it('supports AND, OR, exclusions, set names, and the matching piece’s conditional bonuses', () => {
    expect(filter({ selectedType: 'amulitype' }, 'test set + all skills -lightning')?.SetItems).toHaveLength(1);
    expect(filter({ selectedType: 'amulitype' }, 'lightning | piece bonus')?.SetItems).toHaveLength(1);
    expect(filter({ selectedType: 'amulitype' }, '-all skills')).toBeNull();
  });
  it('does not mutate source sets or count unrelated weapon damage', () => {
    const result = filter({ selectedType: 'amulitype' });
    expect(result).not.toBe(set);
    expect(result?.FullBonuses).toBe(set.FullBonuses);
    expect(set.SetItems).toHaveLength(2);
  });
  it('reproduces the real Civerb amulet case', () => {
    const civerb = (sets as CatalogItem[]).find((item) => item.Index === "Civerb's Vestments")!;
    expect(filter({ selectedType: 'amulitype' }, 'faster block rate', civerb)).toBeNull();
    expect(filter({ selectedType: 'amulitype' }, "civerb", civerb)?.SetItems?.map((item) => item.Index)).toEqual(["Civerb's Icon"]);
  });

  it('filters drop-only searches per piece, preserving bonuses and the source set', () => {
    const mixed: CatalogItem = {
      Index: 'Mixed Set',
      ItemLevel: 101,
      PartialBonuses: [{ key: 'shared partial bonus' }],
      FullBonuses: [{ key: 'shared full bonus' }],
      SetItems: [
        { Index: 'Fire Drop Piece', ItemLevel: 100, RequiredLevel: 99, Lines: [{ key: 'fire' }] },
        { Index: 'Cold Drop Piece', ItemLevel: 101, Lines: [{ key: 'cold' }] },
        { Index: 'Fire Regular Piece', ItemLevel: 99, Lines: [{ key: 'fire' }] },
        { Index: 'Missing Level Fire Piece', RequiredLevel: 100, Lines: [{ key: 'fire' }] }
      ]
    };
    const apply = (query: string) => filterSetPieces(mixed, defaults, tokenizeSearch(query), tools);
    const dropResult = apply('drop');
    const negativeResult = apply('-drop');

    expect(dropResult?.SetItems?.map((piece) => piece.Index)).toEqual(['Fire Drop Piece', 'Cold Drop Piece']);
    expect(apply('drop-only')?.SetItems).toEqual(dropResult?.SetItems);
    expect(negativeResult?.SetItems?.map((piece) => piece.Index))
      .toEqual(['Fire Regular Piece', 'Missing Level Fire Piece']);
    expect(apply('-drop-only')?.SetItems).toEqual(negativeResult?.SetItems);
    expect(dropResult?.PartialBonuses).toBe(mixed.PartialBonuses);
    expect(dropResult?.FullBonuses).toBe(mixed.FullBonuses);
    expect(mixed.SetItems).toHaveLength(4);
    expect(mixed.ItemLevel).toBe(101);
  });

  it('requires combined drop and ordinary terms to match the same piece', () => {
    const mixed: CatalogItem = {
      Index: 'Combined Set',
      SetItems: [
        { Index: 'Fire Piece', ItemLevel: 100 },
        { Index: 'Cold Piece', ItemLevel: 101 },
        { Index: 'Fire Regular Piece', ItemLevel: 99 }
      ]
    };

    expect(filterSetPieces(mixed, defaults, tokenizeSearch('drop+fire'), tools)?.SetItems?.map((piece) => piece.Index))
      .toEqual(['Fire Piece']);
    expect(filterSetPieces(mixed, defaults, tokenizeSearch('-drop+fire'), tools)?.SetItems?.map((piece) => piece.Index))
      .toEqual(['Fire Regular Piece']);
  });

  it('omits sets with no matching drop-only pieces', () => {
    const regularSet: CatalogItem = {
      Index: 'Regular Set',
      ItemLevel: 101,
      SetItems: [{ Index: 'Regular Piece', ItemLevel: 99 }, { Index: 'Unleveled Piece' }]
    };

    expect(filterSetPieces(regularSet, defaults, tokenizeSearch('drop'), tools)).toBeNull();
  });

  it('marks drop-only searches as piece-scoped for the existing set presentation', () => {
    expect(scopesSetPieces(defaults, tokenizeSearch('drop'))).toBe(true);
    expect(scopesSetPieces(defaults, tokenizeSearch('-drop-only'))).toBe(true);
    expect(scopesSetPieces(defaults, tokenizeSearch('fire'))).toBe(false);
  });
});
