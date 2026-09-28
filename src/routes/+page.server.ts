import uniques from '../../static/data/keyed/uniques.json';
import sets from '../../static/data/keyed/sets.json';
import runewords from '../../static/data/keyed/runewords.json';
import cubeRecipes from '../../static/data/keyed/cube-recipes.json';
import { buildCatalog } from '$lib/catalog-sources';
import type { CatalogItem } from '$lib/types';

export function load() {
  return {
    serverNow: Date.now(),
    counts: {
      uniques: uniques.length,
      sets: sets.length,
      runewords: buildCatalog('runewords', { runewords: runewords as CatalogItem[] }).length,
      recipes: cubeRecipes.length
    }
  };
}
