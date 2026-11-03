import { describe, expect, it } from 'vitest';

import { buildRunewordNameMap } from '#lib/runeword-presentation.js';
import type { TradeListing } from '#lib/trades.js';
import type { CatalogItem } from '#lib/types.js';
import runewords from '../../static/data/keyed/runewords.json';
import { listingRunewordName, runewordNameList, runewordNamesForSearch } from './trade-runeword-search.js';

const names = buildRunewordNameMap(runewords as CatalogItem[]);

function listing(sockets: Array<string | null>, runewordId: number | null = 20539): TradeListing {
  return {
    itemName: 'Wire Fleece',
    itemData: JSON.stringify({
      runewordId,
      sockets: sockets.map((code) => code && { codeText: code, sockets: [], stats: [] })
    })
  } as unknown as TradeListing;
}

describe('trade runeword search', () => {
  it('treats a full or partial runeword name as a runeword search, ignoring case and punctuation', () => {
    expect([...runewordNamesForSearch('Enigma', names)]).toEqual(['Enigma']);
    expect([...runewordNamesForSearch('  enig ', names)]).toEqual(['Enigma']);
    expect(runewordNamesForSearch('heart of the', names).has('Heart of the Oak')).toBe(true);
  });

  it('leaves short or non-runeword searches to the normal text search', () => {
    expect(runewordNamesForSearch('en', names).size).toBe(0);
    expect(runewordNamesForSearch('Shako', names).size).toBe(0);
    expect(runewordNamesForSearch('', names).size).toBe(0);
  });

  it('names a listing from its socketed runes, in order', () => {
    expect(listingRunewordName(listing(['r31', 'r06', 'r30']), names)).toBe('Enigma');
    expect(listingRunewordName(listing(['r30', 'r06', 'r31']), names)).toBeUndefined();
  });

  it('does not name items that are not runewords or have unreadable data', () => {
    expect(listingRunewordName(listing(['r31', 'r06', 'r30'], null), names)).toBeUndefined();
    expect(listingRunewordName({ itemData: 'not json' } as TradeListing, names)).toBeUndefined();
    expect(listingRunewordName({ itemData: null } as unknown as TradeListing, names)).toBeUndefined();
  });

  it('lists each runeword name once for suggestions', () => {
    const list = runewordNameList(names);
    expect(list).toContain('Enigma');
    expect(new Set(list).size).toBe(list.length);
  });
});
