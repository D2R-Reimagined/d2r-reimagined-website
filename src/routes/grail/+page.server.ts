import runewords from '../../../static/data/keyed/runewords.json';
import sets from '../../../static/data/keyed/sets.json';
import uniques from '../../../static/data/keyed/uniques.json';
import type { CatalogItem } from '$lib/types';

export function load() {
  return {
    uniques: (uniques as CatalogItem[]).filter((item) => !String(item.Index ?? '').toLowerCase().includes('grabber')),
    sets: (sets as CatalogItem[]).flatMap((set) =>
      (set.SetItems ?? []).map((item) => ({ ...item, parentSet: set.Index }))
    ),
    runewords: runewords as CatalogItem[]
  };
}
