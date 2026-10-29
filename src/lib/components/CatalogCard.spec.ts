import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'svelte/server';

import { initializeI18n } from '#lib/i18n.js';
import type { CatalogItem } from '#lib/types.js';
import CatalogCard from './CatalogCard.svelte';
import uniques from '../../../static/data/keyed/uniques.json';
import enUS from '../../../static/data/strings/enUS.json';

const translations = {
  strCubeRelicUpgradeTitle: 'Relic Upgrade',
  strCubeNoteUberCharmUpgrade: 'Upgrade an Uber Charm',
  strCubeNoteRelicKillRequirement: 'Requires %d Uber Tristram kills',
  strCubeNoteRelicUpgradeRefund: 'Refunds prior upgrade materials',
  strCubeNoteItemCrafting: 'Craft an item'
};

function renderRecipe(item: CatalogItem): string {
  return render(CatalogCard, { props: { item, slug: 'cube-recipes' } }).body;
}

describe('CatalogCard cube recipe details', () => {
  beforeEach(() => initializeI18n(translations));

  it('renders Relic category and both explanatory Details lines', () => {
    const relicRecipe: CatalogItem = {
      Description: 'strCubeRelicUpgradeTitle',
      Notes: [{ key: 'strCubeNoteUberCharmUpgrade' }],
      Details: [
        { key: 'strCubeNoteRelicKillRequirement', args: [500] },
        { key: 'strCubeNoteRelicUpgradeRefund' }
      ]
    };
    const html = renderRecipe(relicRecipe);

    expect(html).toContain('Upgrade an Uber Charm');
    expect(html).toContain('Requires 500 Uber Tristram kills');
    expect(html).toContain('Refunds prior upgrade materials');
  });

  it('renders older recipes without Details', () => {
    const olderRecipe: CatalogItem = {
      Description: 'strCubeRelicUpgradeTitle',
      Notes: [{ key: 'strCubeNoteItemCrafting' }]
    };

    expect(renderRecipe(olderRecipe)).toContain('Craft an item');
  });
});

/** The card's visible text, one line per summary, paragraph or list entry. */
function visibleText(index: string): string[] {
  const item = (uniques as CatalogItem[]).find((entry) => entry.Index === index)!;
  return render(CatalogCard, { props: { item, slug: 'uniques' } }).body
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(summary|p|li)\b[^>]*>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .split('\n').map((line) => line.trim()).filter(Boolean);
}

describe('CatalogCard property-group roll counts', () => {
  beforeEach(() => initializeI18n(enUS));

  it('renders Wraithstep\'s group heading with its roll range under the unchanged wrapper', () => {
    const text = visibleText('Wraithstep');
    const title = text.indexOf('Possible Property Rolls (1 group)');
    expect(title).toBeGreaterThan(-1);
    expect(text.slice(title + 1, title + 4)).toEqual([
      '1.Random Grouped Affix (1-3 rolls)',
      '+1 Random Skill Tab (Amazon Only) (12.5%)',
      '+1 Random Skill Tab (Sorceress Only) (12.5%)'
    ]);
  });

  it('renders Renewed Flame Rift\'s fixed single-roll headings and the group without exported data', () => {
    const text = visibleText('Crafted Flame Rift');
    expect(text).toContain('Possible Property Rolls (6 groups)');
    expect(text.filter((line) => /^\d\.Random Grouped Affix/.test(line))).toEqual([
      '1.Random Grouped Affix (1 roll)', '2.Random Grouped Affix (1 roll)', '3.Random Grouped Affix (1 roll)',
      '4.Random Grouped Affix (1 roll)', '5.Random Grouped Affix', '6.Random Grouped Affix (1 roll)'
    ]);
    expect(text).toContain('+15-30% Faster Hit Recovery (60%)');
    expect(text.join('\n')).not.toContain('Possible Property Rolls (6 groups) (');
  });
});
