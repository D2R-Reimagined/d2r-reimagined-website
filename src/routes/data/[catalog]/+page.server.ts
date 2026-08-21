import { error } from '@sveltejs/kit';

import armors from '../../../../static/data/keyed/armors.json';
import cubeRecipes from '../../../../static/data/keyed/cube-recipes.json';
import magicPrefixes from '../../../../static/data/keyed/magicprefix.json';
import magicSuffixes from '../../../../static/data/keyed/magicsuffix.json';
import runewords from '../../../../static/data/keyed/runewords.json';
import sets from '../../../../static/data/keyed/sets.json';
import uniques from '../../../../static/data/keyed/uniques.json';
import weapons from '../../../../static/data/keyed/weapons.json';
import { buildCatalog } from '$lib/catalog-sources';
import { catalogDefinitions, catalogSlugs, type CatalogItem, type CatalogSlug } from '$lib/types';

// Bundled here so catalog content is server-rendered; the all-data search fetches the same
// files at runtime. Both shape their items through buildCatalog.
const files: Record<string, CatalogItem[]> = {
  uniques: uniques as CatalogItem[],
  sets: sets as CatalogItem[],
  runewords: runewords as CatalogItem[],
  armors: armors as CatalogItem[],
  weapons: weapons as CatalogItem[],
  magicprefix: magicPrefixes as CatalogItem[],
  magicsuffix: magicSuffixes as CatalogItem[],
  'cube-recipes': cubeRecipes as CatalogItem[]
};

export function load({ params }) {
  if (!catalogSlugs.includes(params.catalog as CatalogSlug)) error(404, 'Catalog not found');
  const slug = params.catalog as CatalogSlug;

  return {
    definition: catalogDefinitions[slug],
    items: buildCatalog(slug, files)
  };
}
