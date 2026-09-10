import { describe, expect, it } from 'vitest';
import { buildItemTitle, isCraftRecipe } from './build-items';
import { inlineTokens } from './build-markdown';
import { searchText, type SearchTools } from './catalog';
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

  it('selects actual exported crafts and retains their additional output modifiers', () => {
    const crafts = (recipes as CatalogItem[]).filter(isCraftRecipe);
    expect(crafts.length).toBeGreaterThan(0);
    const craft = crafts.find(item => item.Index === 249)!;
    expect(craft.Outputs?.A.Lines).toContainEqual({ key: 'ModStr3k', args: [2] });
    expect(searchText(craft, tools)).toContain('modstr3k 2');
    expect(buildItemTitle(craft, 'cube-recipes', tools)).toContain('amu strCubeQualifierRareItem');
    expect(buildItemTitle(craft, 'cube-recipes', tools)).toContain('r26');
    expect(isCraftRecipe({ Notes: [{ key: 'strCubeNoteOrbOfCorruption' }] })).toBe(false);
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
