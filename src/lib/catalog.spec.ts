import { describe, expect, it } from 'vitest';

import { collectText, searchText, type SearchTools } from './catalog';
import { matchesSearch, tokenizeSearch } from './catalog-controls';
import { formatTemplate } from '../utilities/format-template';
import type { CatalogItem, KeyedLine } from './types';

const templates: Record<string, string> = {
  ModStr3k: '+%d to All Skills',
  ModStr5v: '+%d to %s (%s Only)',
  strSmiteDamage: 'Smite Damage: %d to %d',
  strRequiredLevel: 'Required Level: %d',
  tow: 'Tower Shield [N]',
  Vengeance: 'Vengeance',
  Paladin: 'Paladin'
};

function tools(code = 'enUS'): SearchTools {
  const t = (key: string | number | undefined | null): string => templates[String(key ?? '')] ?? String(key ?? '');
  return {
    code,
    t,
    line: (value: KeyedLine | undefined | null): string =>
      value ? formatTemplate(t(value.key), (value.args ?? []).map((arg) => typeof arg === 'string' ? t(arg) : arg)) : ''
  };
}

const shield: CatalogItem = {
  Index: "Bigby's Crushing Fist",
  Code: 'tow',
  RequiredLevel: 25,
  Lines: [
    { key: 'ModStr3k', args: [5] },
    { key: 'ModStr5v', args: [3, 'Vengeance', 'Paladin'] }
  ],
  Equipment: {
    NameKey: 'tow',
    Lines: [{ key: 'strSmiteDamage', args: [1, 5] }]
  }
};

describe('catalog search text', () => {
  it('searches the numbers a card actually shows, not the bare template', () => {
    const haystack = searchText(shield, tools());
    expect(haystack).toContain('+5 to all skills');
    expect(matchesSearch(haystack, tokenizeSearch('5 to all skills'))).toBe(true);
    // The number lives in args, so this is the case that never worked before.
    expect(matchesSearch(haystack, tokenizeSearch('3 to vengeance'))).toBe(true);
  });

  it('keeps a phrase from straddling two unrelated values', () => {
    // "…Required Level 25" next to base code "tow" used to read as "25 tow" -> "5 to".
    const level: CatalogItem = { Index: 'Plain', Code: 'tow', RequiredLevel: 25 };
    expect(matchesSearch(searchText(level, tools()), tokenizeSearch('5 to'))).toBe(false);
  });

  it('still matches raw keys, codes, and translated names', () => {
    const haystack = searchText(shield, tools());
    expect(matchesSearch(haystack, tokenizeSearch('tower shield'))).toBe(true);
    expect(matchesSearch(haystack, tokenizeSearch('modstr3k'))).toBe(true);
    expect(matchesSearch(haystack, tokenizeSearch("bigby's"))).toBe(true);
  });

  it('renders grouped child lines without their empty parent', () => {
    const grouped: CatalogItem = {
      Index: 'Charm',
      Lines: [{ key: '', args: [], code: 'Magnetic-Affix1', children: [{ key: 'ModStr3k', args: [2] }] }]
    };
    expect(searchText(grouped, tools())).toContain('+2 to all skills');
  });

  it('re-derives the haystack when the language changes', () => {
    const item: CatalogItem = { Index: 'Shield', Code: 'tow' };
    expect(searchText(item, tools('enUS'))).toContain('tower shield');

    const german: SearchTools = { ...tools('deDE'), t: (key) => key === 'tow' ? 'Turmschild' : String(key ?? '') };
    german.line = () => '';
    expect(searchText(item, german)).toContain('turmschild');
  });

  it('leaves lines untouched when no renderer is supplied', () => {
    expect(collectText(shield, tools().t)).not.toContain('+5 to all skills');
  });
});
