import { describe, expect, it } from 'vitest';
import { buildItemKey, buildItemTitle, findBuildItem, isCraftRecipe } from './build-items';
import { inlineTokens } from './build-markdown';
import { searchText, type SearchTools } from './catalog';
import recipeAliases from './data/cube-recipe-aliases.json';
import recipes from '../../static/data/keyed/cube-recipes.json';
import type { CatalogItem } from './types';

const tools: SearchTools = {
  code: 'test', t: key => String(key ?? ''),
  line: line => line ? `${line.key} ${(line.args ?? []).join(' ')}`.trim() : ''
};

describe('Build craft references', () => {
  it('recognizes craft links in text and preserves unsupported catalogs as text', () => {
    expect(inlineTokens('Use [[item:cube-recipes:249]].')).toEqual([
      { kind: 'text', text: 'Use ' }, { kind: 'item', text: '249', catalog: 'cube-recipes', key: '249' },
      { kind: 'text', text: '.' }
    ]);
    expect(inlineTokens('[[item:unknown:249]]')[0].kind).toBe('text');
  });

  it('resolves a legacy craft link and retains the craft\'s additional output modifiers', () => {
    // Shaped like an exported craft; `249` is a link saved before recipes were renumbered.
    const craft: CatalogItem = {
      Index: 293, Id: recipeAliases.aliases['249']!, Description: '',
      Inputs: [
        { Name: { key: 'amu' }, Quantity: 1, Qualifiers: [{ key: 'strCubeQualifierRareItem' }] },
        { Name: { key: 'r26' }, Quantity: 1, Qualifiers: [] }
      ],
      Outputs: { A: { Name: { key: 'strCubeOutputUseTypeOfInput1' }, Lines: [{ key: 'ModStr3k', args: [2] }] } },
      Notes: [{ key: 'strCubeNoteItemCrafting' }]
    };
    const corruption: CatalogItem = { Index: 103, Id: 'cr-0000000000000003', Notes: [{ key: 'strCubeNoteOrbOfCorruption' }] };
    const crafts = [corruption, craft].filter(isCraftRecipe);
    expect(crafts).toEqual([craft]);
    expect(findBuildItem(crafts, 'cube-recipes', '249')).toBe(craft);
    expect(findBuildItem(crafts, 'cube-recipes', buildItemKey(craft, 'cube-recipes'))).toBe(craft);
    expect(searchText(craft, tools)).toContain('modstr3k 2');
    expect(buildItemTitle(craft, 'cube-recipes', tools)).toBe('amu strCubeQualifierRareItem + r26');
    // A link whose recipe the current export dropped resolves to nothing rather than another craft.
    expect(findBuildItem([corruption], 'cube-recipes', '249')).toBeUndefined();
  });

  it('links, titles and searches every craft of the active export', () => {
    const crafts = (recipes as CatalogItem[]).filter(isCraftRecipe);
    expect(crafts.length).toBeGreaterThan(0);
    for (const craft of crafts) {
      const key = buildItemKey(craft, 'cube-recipes');
      expect(findBuildItem(crafts, 'cube-recipes', key), key).toBe(craft);
      expect(buildItemTitle(craft, 'cube-recipes', tools), key).not.toBe('');
      for (const line of craft.Outputs?.A?.Lines ?? []) expect(searchText(craft, tools), key).toContain(line.key.toLowerCase());
    }
  });

  it('uses localized ingredients, quantities and qualifiers when the recipe is unnamed', () => {
    const localized: SearchTools = { ...tools, line: line => ({ amu: 'Amulet', rare: 'Rare', gem: 'Ruby' })[line?.key as 'amu'] ?? '' };
    expect(buildItemTitle({ Inputs: [
      { Name: { key: 'amu' }, Qualifiers: [{ key: 'rare' }] },
      { Name: { key: 'gem' }, Quantity: 3 }
    ] }, 'cube-recipes', localized)).toBe('Amulet Rare + 3 × Ruby');
    expect(buildItemTitle({ Index: 1 }, 'cube-recipes', tools)).toBe('Recipe 1');
    expect(buildItemTitle({ Index: 'The Oculus' }, 'uniques', tools)).toBe('The Oculus');
  });
});
