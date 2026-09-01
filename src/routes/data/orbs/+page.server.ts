import cubeRecipes from '../../../../static/data/keyed/cube-recipes.json';
import { buildCatalog } from '$lib/catalog-sources';
import { buildOrbs } from '$lib/orbs';
import { catalogDefinitions, type CatalogItem } from '$lib/types';

// Bundled rather than fetched so every outcome is in the server-rendered HTML for SEO, the
// same way the catalog route loads its keyed files.
export function load() {
  return {
    definition: catalogDefinitions.orbs,
    orbs: buildOrbs(buildCatalog('orbs', { 'cube-recipes': cubeRecipes as CatalogItem[] }))
  };
}
