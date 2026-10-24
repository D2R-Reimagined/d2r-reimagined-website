import { itemTitle, type SearchTools } from './catalog';
import { findRecipe, recipeKey } from './cube-recipe-ids';
import type { CatalogItem, CatalogSlug } from './types';

/** The key a build reference stores for an item; recipes use a renumbering-proof key. */
export function buildItemKey(item: CatalogItem, catalog: CatalogSlug): string {
  return catalog === 'cube-recipes' ? recipeKey(item) : String(item.Index ?? item.NameKey ?? '');
}

/** Resolves a saved build reference key against the current catalog. */
export function findBuildItem(items: CatalogItem[], catalog: CatalogSlug, key: string): CatalogItem | undefined {
  return catalog === 'cube-recipes' ? findRecipe(items, key) : items.find(item => buildItemKey(item, catalog) === key);
}

export function isCraftRecipe(item: CatalogItem): boolean {
  return item.Notes?.some(note => note.key === 'strCubeNoteItemCrafting') ?? false;
}

/** Recipes often have no description; identify those by their localized ingredients. */
export function buildItemTitle(item: CatalogItem, catalog: CatalogSlug, tools: SearchTools): string {
  if (catalog !== 'cube-recipes' || item.Description) return tools.t(itemTitle(item, catalog));
  return (item.Inputs ?? []).map(input => [
    input.Quantity && input.Quantity > 1 ? `${input.Quantity} ×` : '',
    tools.line(input.Name),
    ...(input.Qualifiers ?? []).filter(line => line.key !== 'strCubeQualifierQuantityN').map(tools.line)
  ].filter(Boolean).join(' ')).join(' + ') || tools.t(itemTitle(item, catalog));
}
