import { error } from '@sveltejs/kit';

import armors from '../../../../static/data/keyed/armors.json';
import cubeRecipes from '../../../../static/data/keyed/cube-recipes.json';
import magicPrefixes from '../../../../static/data/keyed/magicprefix.json';
import magicSuffixes from '../../../../static/data/keyed/magicsuffix.json';
import runewords from '../../../../static/data/keyed/runewords.json';
import sets from '../../../../static/data/keyed/sets.json';
import uniques from '../../../../static/data/keyed/uniques.json';
import weapons from '../../../../static/data/keyed/weapons.json';
import { catalogDefinitions, catalogSlugs, type CatalogItem, type CatalogSlug } from '$lib/types';

export function load({ params }) {
  if (!catalogSlugs.includes(params.catalog as CatalogSlug)) error(404, 'Catalog not found');
  const slug = params.catalog as CatalogSlug;

  const catalogs: Record<CatalogSlug, CatalogItem[]> = {
    uniques: uniques as CatalogItem[],
    sets: sets as CatalogItem[],
    runewords: runewords as CatalogItem[],
    bases: [
      ...armors.map((item) => ({ ...item, source: 'armor' as const })),
      ...weapons.map((item) => ({ ...item, source: 'weapon' as const }))
    ] as CatalogItem[],
    affixes: [
      ...magicPrefixes.map((item) => ({ ...item, source: 'prefix' as const })),
      ...magicSuffixes.map((item) => ({ ...item, source: 'suffix' as const }))
    ] as CatalogItem[],
    'cube-recipes': cubeRecipes as CatalogItem[]
  };

  return {
    definition: catalogDefinitions[slug],
    items: catalogs[slug]
  };
}
