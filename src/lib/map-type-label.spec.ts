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
const mapAffixes = (exact: boolean) => affixes
  .filter((item) => matchesItemType(typesOf(item), 'mapiitype', exact, true) && !excludesItemType(item.ETypes ?? [], 'mapiitype'))
  .map((item) => item.NameKey)
  .sort();

describe('Map item type on the Affixes page', () => {
  it('is offered with a readable label in every UI language', () => {
    expect(catalogTypeValues(affixes.flatMap(typesOf), 'affixes')).toContain('mapiitype');
    expect(tools.t('mapiitype')).toBe('Map');
    for (const language of Object.values(UI_STRINGS)) expect(language?.mapiitype).toBeTruthy();
  });

  it('still selects only the two map affixes', () => {
    const expected = ['rmapaffix_quality_prefix', 'rmapaffix_quality_suffix'];
    expect(mapAffixes(false)).toEqual(expected);
    expect(mapAffixes(true)).toEqual(expected);
  });
});
