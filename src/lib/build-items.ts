import { itemTitle, type SearchTools } from './catalog';
import type { CatalogItem, CatalogSlug } from './types';

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
