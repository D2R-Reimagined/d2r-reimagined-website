import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'svelte/server';

import { initializeI18n } from '#lib/i18n.js';
import { isAlternateGroup } from '#lib/property-groups.js';
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
function visibleText(item: CatalogItem): string[] {
  return render(CatalogCard, { props: { item, slug: 'uniques' } }).body
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(summary|p|li)\b[^>]*>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .split('\n').map((line) => line.trim()).filter(Boolean);
}

const unique = (index: string) => (uniques as CatalogItem[]).find((entry) => entry.Index === index)!;

/**
 * The English heading a group's exported roll count should produce, spelled out here rather
 * than taken from groupRollCount: plain when the count is missing or not a whole-number range.
 */
function expectedHeading(rollCount: unknown): string {
  const { min, max } = (rollCount ?? {}) as Record<string, unknown>;
  if (!Number.isInteger(min) || !Number.isInteger(max)) return 'Random Grouped Affix';
  const [low, high] = [min as number, max as number];
  if (low < 0 || high < 1 || low > high) return 'Random Grouped Affix';
  if (low !== high) return `Random Grouped Affix (${low}-${high} rolls)`;
  return `Random Grouped Affix (${high} ${high === 1 ? 'roll' : 'rolls'})`;
}

const isGroupHeading = (line: string) => /^\d+\.Random Grouped Affix/.test(line);

describe('CatalogCard property-group roll counts', () => {
  beforeEach(() => initializeI18n(enUS));

  it('renders Wraithstep\'s group headings from its exported roll counts, leaving the rest of the card unchanged', () => {
    const wraithstep = unique('Wraithstep');
    const groups = (wraithstep.Lines ?? []).filter(isAlternateGroup);
    expect(groups.length).toBeGreaterThan(0);
    const text = visibleText(wraithstep);
    expect(text.filter(isGroupHeading)).toEqual(groups.map((group, index) => `${index + 1}.${expectedHeading(group.rollCount)}`));

    const stripped = structuredClone(wraithstep);
    for (const line of stripped.Lines ?? []) delete line.rollCount;
    const plain = visibleText(stripped);
    expect(plain.filter(isGroupHeading)).toEqual(groups.map((_, index) => `${index + 1}.Random Grouped Affix`));
    // Same lines in the same places, so the wrapper, modifiers and child shares are untouched.
    expect(text.map(isGroupHeading)).toEqual(plain.map(isGroupHeading));
    expect(text.filter((line) => !isGroupHeading(line))).toEqual(plain.filter((line) => !isGroupHeading(line)));
    expect(text).toContain(groups.length === 1 ? 'Possible Property Rolls (1 group)' : `Possible Property Rolls (${groups.length} groups)`);
    groups.forEach((group, index) => {
      const heading = text.indexOf(`${index + 1}.${expectedHeading(group.rollCount)}`);
      const children = text.slice(heading + 1, heading + 1 + group.children!.length);
      for (const child of children) expect(child, child).toMatch(/ \(\d+(\.\d)?%\)$/);
    });
  });

  it.each([
    [{ min: 1, max: 1 }, '1.Random Grouped Affix (1 roll)'],
    [{ min: 3, max: 3 }, '1.Random Grouped Affix (3 rolls)'],
    [{ min: 1, max: 3 }, '1.Random Grouped Affix (1-3 rolls)'],
    [undefined, '1.Random Grouped Affix'],
    [{ min: 2, max: 1 }, '1.Random Grouped Affix'],
    [{ min: 1, max: '3' }, '1.Random Grouped Affix']
  ])('renders a synthetic group with roll count %j as %s above its unchanged children', (rollCount, heading) => {
    const item = {
      Index: 'Synthetic grouped unique',
      Lines: [{
        key: '', code: 'synthetic-group', nameKey: 'strPropertyGroupsProperty', pickMode: '1', rollCount,
        children: [{ key: 'ModStr1a', args: [5], chance: 1 }, { key: 'ModStr1a', args: [6], chance: 3 }]
      }]
    } as CatalogItem;
    const text = visibleText(item);
    const title = text.indexOf('Possible Property Rolls (1 group)');
    expect(title).toBeGreaterThan(-1);
    expect(text.slice(title + 1, title + 4)).toEqual([heading, '+5 to Strength (25%)', '+6 to Strength (75%)']);
  });

  it('renders Renewed Flame Rift\'s fixed single-roll headings and the group without exported data', () => {
    const text = visibleText(unique('Crafted Flame Rift'));
    expect(text).toContain('Possible Property Rolls (6 groups)');
    expect(text.filter((line) => /^\d\.Random Grouped Affix/.test(line))).toEqual([
      '1.Random Grouped Affix (1 roll)', '2.Random Grouped Affix (1 roll)', '3.Random Grouped Affix (1 roll)',
      '4.Random Grouped Affix (1 roll)', '5.Random Grouped Affix', '6.Random Grouped Affix (1 roll)'
    ]);
    expect(text).toContain('+15-30% Faster Hit Recovery (60%)');
    expect(text.join('\n')).not.toContain('Possible Property Rolls (6 groups) (');
  });
});
