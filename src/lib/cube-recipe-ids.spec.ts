import { describe, expect, it } from 'vitest';
import { findRecipe, recipeKey } from './cube-recipe-ids';
import recipeAliases from './data/cube-recipe-aliases.json';
import recipes from '../../static/data/keyed/cube-recipes.json';
import type { CatalogItem } from './types';

const rows = recipes as CatalogItem[];
const aliases: Record<string, string | null> = recipeAliases.aliases;

describe('Stable cube recipe keys', () => {
  it('gives every exported recipe a unique key that resolves back to it', () => {
    expect(rows.length).toBeGreaterThan(0);
    const keys = rows.map(recipeKey);
    expect(new Set(keys).size).toBe(rows.length);
    for (const row of rows) expect(findRecipe(rows, recipeKey(row))).toBe(row);
  });

  it('prefers the exporter Id over the row position', () => {
    const items: CatalogItem[] = [{ Index: 7, Id: 'cr-abc' }, { Index: 8 }];
    expect(recipeKey(items[0])).toBe('cr-abc');
    expect(recipeKey(items[1])).toBe('#8');
    expect(findRecipe(items, 'cr-abc')).toBe(items[0]);
    expect(findRecipe(items, '#7')).toBeUndefined();
  });

  it('keeps the frozen alias table in the recipe key format', () => {
    expect(Object.keys(aliases).length).toBeGreaterThan(0);
    for (const [key, target] of Object.entries(aliases)) {
      expect(key, key).toMatch(/^(\d+|#\d+)$/);
      if (target !== null) expect(target, key).toMatch(/^(cr-[0-9a-f]{16}|#\d+)$/);
    }
  });

  it('follows a legacy link to the renumbered recipe it named', () => {
    // A link saved as `249` before 38 recipes were inserted ahead of it.
    const target = aliases['249']!;
    const moved: CatalogItem = { Index: 293, Id: target };
    const other: CatalogItem = { Index: 249, Id: 'cr-0000000000000001' };
    expect(findRecipe([other, moved], '249')).toBe(moved);
    expect(findRecipe([other, moved], target)).toBe(moved);
    expect(findRecipe([other, moved], 'not-a-recipe')).toBeUndefined();
  });

  it('reports a link to a deleted recipe as removed instead of resolving to another recipe', () => {
    // `797` named the +3% Crushing Blow glove recipe, which later exports no longer ship.
    const target = aliases['797']!;
    expect(target).toBe('cr-d0129779b6c23257');
    const remaining: CatalogItem[] = [{ Index: 797, Id: 'cr-0000000000000002' }, { Index: 831 }];
    expect(findRecipe(remaining, '797')).toBeUndefined();
    expect(findRecipe(remaining, target)).toBeUndefined();
    expect(findRecipe([...remaining, { Index: 900, Id: target }], '797')?.Index).toBe(900);
  });

  it('resolves every legacy link of the active export to its target or to nothing', () => {
    const byKey = new Map(rows.map((row) => [recipeKey(row), row]));
    for (const [key, target] of Object.entries(aliases)) {
      if (byKey.has(key)) continue;
      // A removed target reports the link as removed; it never falls back to a different recipe.
      expect(findRecipe(rows, key), key).toBe(target === null ? undefined : byKey.get(target));
    }
  });
});
