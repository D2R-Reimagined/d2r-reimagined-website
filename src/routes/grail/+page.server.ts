import runewords from '../../../static/data/keyed/runewords.json';
import sets from '../../../static/data/keyed/sets.json';
import uniques from '../../../static/data/keyed/uniques.json';
import type { CatalogItem } from '$lib/types';
import { buildCatalog } from '$lib/catalog-sources';

function grailItem(item: CatalogItem): CatalogItem {
  return {
    Index: item.Index,
    Rarity: item.Rarity,
    Lines: item.Lines,
    Type: item.Type,
    Types: item.Types,
    RequiredClass: item.RequiredClass,
    ClassSpecific: item.ClassSpecific,
    Vanilla: item.Vanilla,
    SetName: item.SetName,
    SetBonuses: item.SetBonuses,
    Equipment: item.Equipment,
    Runes: item.Runes?.map((rune) => ({ NameKey: rune.NameKey }))
  };
}

export function load() {
  return {
    uniques: (uniques as CatalogItem[])
      .filter((item) => !String(item.Index ?? '').toLowerCase().includes('grabber'))
      .map(grailItem),
    sets: (sets as CatalogItem[]).flatMap((set) =>
      (set.SetItems ?? []).map((piece) => grailItem({ ...piece, SetName: piece.SetName ?? set.Index, Vanilla: piece.Vanilla ?? set.Vanilla }))
    ),
    runewords: buildCatalog('runewords', { runewords: runewords as CatalogItem[] }).map(grailItem)
  };
}
