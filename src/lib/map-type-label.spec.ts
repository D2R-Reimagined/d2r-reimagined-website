import { describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import { i18n, initializeI18n } from './i18n';
import { catalogTypeValues, excludesItemType, matchesItemType } from './catalog-controls';
import { load as catalogLoad } from '../routes/data/[catalog]/+page.server';
import { UI_STRINGS } from '../utilities/ui-strings';
import strings from '../../static/data/strings/enUS.json';
import type { CatalogItem } from './types';

initializeI18n(strings);
const tools = get(i18n);
const affixes = (catalogLoad as (event: unknown) => { items: CatalogItem[] })({ params: { catalog: 'affixes' } }).items;
const typesOf = (item: CatalogItem) => (item.Types ?? []).map(String);
const selectMaps = (items: CatalogItem[], exact: boolean) => items
  .filter((item) => matchesItemType(typesOf(item), 'mapiitype', exact, true) && !excludesItemType(item.ETypes ?? [], 'mapiitype'))
  .map((item) => item.NameKey)
  .sort();

describe('Map item type on the Affixes page', () => {
  it('has a readable label in every UI language', () => {
    expect(tools.t('mapiitype')).toBe('Map');
    for (const language of Object.values(UI_STRINGS)) expect(language?.mapiitype).toBeTruthy();
  });

  it('is offered exactly when the export has map affixes', () => {
    const hasMaps = affixes.some((item) => typesOf(item).includes('mapiitype'));
    expect(catalogTypeValues(affixes.flatMap(typesOf), 'affixes').includes('mapiitype')).toBe(hasMaps);
  });

  it('selects only affixes that name maps, never broad equipment affixes', () => {
    const fixture: CatalogItem[] = [
      { NameKey: 'rmapaffix_quality_prefix', Types: ['mapiitype'] },
      { NameKey: 'rmapaffix_quality_suffix', Types: ['mapiitype'] },
      { NameKey: 'weapon', Types: ['weapitype'] },
      { NameKey: 'armor', Types: ['armoitype'] },
      { NameKey: 'jewel', Types: ['jewlitype', 'charitype'] }
    ];
    const expected = ['rmapaffix_quality_prefix', 'rmapaffix_quality_suffix'];
    expect(selectMaps(fixture, false)).toEqual(expected);
    expect(selectMaps(fixture, true)).toEqual(expected);
    // Over the real export the same rule holds, whether it ships map affixes or none.
    const named = affixes.filter((item) => typesOf(item).includes('mapiitype')).map((item) => item.NameKey).sort();
    expect(selectMaps(affixes, false)).toEqual(named);
    expect(selectMaps(affixes, true)).toEqual(named);
  });
});
