import recipeAliases from './data/cube-recipe-aliases.json';
import type { CatalogItem } from './types';

/**
 * Saved `[[item:cube-recipes:<key>]]` links must survive exports that insert recipes, because
 * `Index` is a row position. A recipe's key is its exporter `Id` once the export ships one and
 * `#<Index>` until then. Bare numbers are links saved before keys existed; they, and keys of
 * earlier exports, resolve through the historical alias table. Every exported recipe now ships a
 * stable `Id`, so the table is frozen compatibility data rather than a per-export migration.
 */
const aliases: Record<string, string | null> = recipeAliases.aliases;

/** The key build links store for a recipe. Alias targets in `cube-recipe-aliases.json` use this form. */
export function recipeKey(item: CatalogItem): string {
  return typeof item.Id === 'string' && item.Id ? item.Id : `#${item.Index ?? ''}`;
}

/** The recipe a saved key names in the current export, or undefined when it was removed. */
export function findRecipe(items: CatalogItem[], key: string): CatalogItem | undefined {
  const current = items.find(item => recipeKey(item) === key);
  if (current) return current;
  const target = aliases[key];
  return target ? items.find(item => recipeKey(item) === target) : undefined;
}
