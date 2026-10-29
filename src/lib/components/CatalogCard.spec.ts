import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'svelte/server';

import { initializeI18n } from '#lib/i18n.js';
import type { CatalogItem } from '#lib/types.js';
import CatalogCard from './CatalogCard.svelte';

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
