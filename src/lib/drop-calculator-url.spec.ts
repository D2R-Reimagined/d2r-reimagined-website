import { describe, expect, it } from 'vitest';
import { readDropUrl, writeDropUrl } from './drop-calculator-url';
import type { DropItem } from './drop-calculator';

const item: DropItem = { Id: "set:Angel's Touch", NameKey: 'name', Code: 'rin', Quality: 'set', Level: 1, Rarity: 1, Random: true, Condition: '' };
const base = new URL('https://example.com/data/drop-calculator');

describe('shareable drop URLs', () => {
  it('round trips every setting, including punctuation and result filters', () => {
    const state = { ...readDropUrl(base, [item]), selected: item, quality: 'set' as const,
      difficulty: -1, players: 8, party: 4, magicFind: 350, kind: 'superunique', filter: 'Baal & friends', showZero: true };
    const url = writeDropUrl(new URL(`${base}?utm_source=discord#results`), state);
    expect(readDropUrl(url, [item])).toEqual(state);
    expect(url.searchParams.get('utm_source')).toBe('discord');
    expect(url.hash).toBe('#results');
  });
  it('uses stable item IDs and derives quality from the item', () => {
    const url = new URL(base);
    url.searchParams.set('item', item.Id);
    url.searchParams.set('type', 'rune');
    expect(readDropUrl(url, [item]).quality).toBe('set');
  });
  it('handles stale items and malformed or out-of-range settings', () => {
    const state = readDropUrl(new URL(`${base}?item=removed&type=bogus&players=99&party=99&mf=NaN&difficulty=oops&monster=oops`), [item]);
    expect(state).toMatchObject({ selected: null, quality: 'unique', players: 8, party: 8, magicFind: 0, difficulty: 2, kind: 'all' });
    expect(readDropUrl(new URL(`${base}?players=2&party=8&mf=-1`), [item])).toMatchObject({ players: 2, party: 2, magicFind: 0 });
  });
  it('removes stale state and omits defaults', () => {
    expect(writeDropUrl(new URL(`${base}?item=removed&mf=500&zero=1`), readDropUrl(base, [item])).href).toBe(base.href);
  });
});
