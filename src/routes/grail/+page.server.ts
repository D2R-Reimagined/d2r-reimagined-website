import runewords from '../../../static/data/keyed/runewords.json';
import sets from '../../../static/data/keyed/sets.json';
import uniques from '../../../static/data/keyed/uniques.json';
import type { CatalogItem } from '#lib/types.js';
import { buildCatalog } from '#lib/catalog-sources.js';
import { assignGrailKeys } from '#lib/grail-progress.js';

function grailItem(item: CatalogItem): CatalogItem {
  return {
    Index: item.Index,
    GrailKey: item.GrailKey,
    Rarity: item.Rarity,
    ItemLevel: item.ItemLevel,
    RequiredLevel: item.RequiredLevel,
    PartialBonuses: item.PartialBonuses,
    FullBonuses: item.FullBonuses,
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
    uniques: assignGrailKeys((uniques as CatalogItem[])
      .filter((item) => !String(item.Index ?? '').toLowerCase().includes('grabber')))
      .map(grailItem),
    sets: assignGrailKeys((sets as CatalogItem[]).flatMap((set) =>
      (set.SetItems ?? []).map((piece) => ({ ...piece, PartialBonuses: set.PartialBonuses, FullBonuses: set.FullBonuses, SetName: piece.SetName ?? set.Index, Vanilla: piece.Vanilla ?? set.Vanilla }))
    )).map(grailItem),
    // Same-name runewords (e.g. Zephyr, Purity) stay separate rows with their own recipes.
    runewords: assignGrailKeys(buildCatalog('runewords', { runewords: runewords as CatalogItem[] })).map(grailItem)
  };
}
