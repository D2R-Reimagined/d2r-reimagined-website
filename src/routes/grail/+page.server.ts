import runewords from '../../../static/data/keyed/runewords.json';
import sets from '../../../static/data/keyed/sets.json';
import uniques from '../../../static/data/keyed/uniques.json';
import type { CatalogItem } from '$lib/types';

function grailUnique(item: CatalogItem): CatalogItem {
  return {
    Index: item.Index,
    Rarity: item.Rarity,
    Lines: item.Lines,
    Equipment: item.Equipment ? { NameKey: item.Equipment.NameKey } : undefined
  };
}

function grailSetItem(item: CatalogItem): CatalogItem {
  return {
    Index: item.Index,
    Rarity: item.Rarity,
    Lines: item.Lines,
    Equipment: item.Equipment ? { NameKey: item.Equipment.NameKey } : undefined
  };
}

function grailRuneword(item: CatalogItem): CatalogItem {
  return {
    Index: item.Index,
    Lines: item.Lines,
    Runes: item.Runes?.map((rune) => ({ NameKey: rune.NameKey }))
  };
}

export function load() {
  return {
    uniques: (uniques as CatalogItem[])
      .filter((item) => !String(item.Index ?? '').toLowerCase().includes('grabber'))
      .map(grailUnique),
    sets: (sets as CatalogItem[]).flatMap((set) =>
      (set.SetItems ?? []).map(grailSetItem)
    ),
    runewords: (runewords as CatalogItem[]).map(grailRuneword)
  };
}
