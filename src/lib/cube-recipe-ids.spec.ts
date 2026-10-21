import { describe, expect, it } from 'vitest';
import { findRecipe, recipeKey } from './cube-recipe-ids';
import recipeAliases from './data/cube-recipe-aliases.json';
import recipes from '../../static/data/keyed/cube-recipes.json';
import type { CatalogItem } from './types';

const rows = recipes as CatalogItem[];
// Recipes the mod deleted after links to them were saved. Their aliases keep naming the deleted
// recipe so those links report it as removed instead of resolving to a different recipe.
// cr-d0129779b6c23257: Gloves + Infusion Orb + Ruby + Cham + unique Jewel = +3% Crushing Blow
// (mod commit 03d8a3b6 "remove crush from cube recipes").
const removedTargets = new Set(['cr-d0129779b6c23257']);

describe('Stable cube recipe keys', () => {
  it('gives every exported recipe a unique key that resolves back to it', () => {
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

  it('maps every legacy link onto a recipe of the current export', () => {
    const aliases: Record<string, string | null> = recipeAliases.aliases;
    const current = new Set(rows.map(recipeKey));
    for (const target of Object.values(aliases)) {
      if (target !== null && !removedTargets.has(target)) expect(current.has(target), target).toBe(true);
    }
    // Recipes from Index 220 on were renumbered when 38 recipes were inserted ahead of them.
    expect(findRecipe(rows, '249')?.Index).toBe(293);
    expect(findRecipe(rows, '219')?.Index).toBe(219);
    expect(findRecipe(rows, 'not-a-recipe')).toBeUndefined();
  });

  it('reports legacy links to a deleted recipe as removed', () => {
    const aliases: Record<string, string | null> = recipeAliases.aliases;
    const current = new Set(rows.map(recipeKey));
    for (const target of removedTargets) {
      // Drop the entry once the recipe is back, so its links resolve again.
      expect(current.has(target), target).toBe(false);
      expect(Object.values(aliases)).toContain(target);
      expect(findRecipe(rows, target)).toBeUndefined();
    }
    expect(aliases['797']).toBe('cr-d0129779b6c23257');
    expect(findRecipe(rows, '797')).toBeUndefined();
    expect(findRecipe(rows, '#831')).toBeUndefined();
  });
});
