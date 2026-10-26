import { describe, expect, it } from 'vitest';
import { countAdvancedDropFilters, readDropMode, readDropUrl, writeDropMode, writeDropUrl } from './drop-calculator-url';
import { writeMonsterDropUrl, readMonsterDropUrl } from './monster-drop-url';
import type { DropItem } from './drop-calculator';

const item: DropItem = { Id: "set:Angel's Touch", NameKey: 'name', Code: 'rin', Quality: 'set', Level: 1, Rarity: 1, Random: true, Condition: '' };
const base = new URL('https://example.com/data/drop-calculator');

describe('shareable drop URLs', () => {
  it('round trips every setting, including punctuation and result filters', () => {
    const state = { ...readDropUrl(base, [item]), selected: item, category: 'set' as const,
      difficulty: -1, players: 8, party: 4, magicFind: 350, kind: 'superunique', filter: 'Baal & friends', showZero: true, treasureClass: 'Act 5 (H) H2H C', minLevel: 80, maxLevel: 90, kills: 25000 };
    const url = writeDropUrl(new URL(`${base}?utm_source=discord#results`), state);
    expect(readDropUrl(url, [item])).toEqual(state);
    expect(url.searchParams.get('utm_source')).toBe('discord');
    expect(url.hash).toBe('#results');
  });
  it('uses stable item IDs and never lets a conflicting legacy type hide the selection', () => {
    const url = new URL(base);
    url.searchParams.set('item', item.Id);
    url.searchParams.set('type', 'rune');
    expect(readDropUrl(url, [item])).toMatchObject({ selected: item, category: 'all' });
    url.searchParams.set('type', 'set');
    expect(readDropUrl(url, [item])).toMatchObject({ selected: item, category: 'set' });
  });
  it('opens legacy item links in the all-items category and keeps the item selected', () => {
    const state = readDropUrl(new URL(`${base}?item=${encodeURIComponent(item.Id)}`), [item]);
    expect(state).toMatchObject({ selected: item, category: 'all' });
    expect(writeDropUrl(base, state).searchParams.toString()).toBe(new URLSearchParams({ item: item.Id }).toString());
  });
  it('maps legacy type links to the optional category filter', () => {
    for (const type of ['unique', 'set', 'rune', 'misc'] as const) {
      const state = readDropUrl(new URL(`${base}?type=${type}`), [item]);
      expect(state).toMatchObject({ selected: null, category: type });
      expect(writeDropUrl(base, state).searchParams.get('type')).toBe(type);
    }
    expect(readDropUrl(new URL(`${base}?type=all`), [item]).category).toBe('all');
    expect(writeDropUrl(base, readDropUrl(base, [item])).searchParams.has('type')).toBe(false);
  });
  it('leaves monster simulator mode untouched', () => {
    const current = new URL(`${base}?mode=simulate&type=rune`);
    const url = writeDropUrl(current, readDropUrl(current, [item]));
    expect(url.searchParams.get('mode')).toBe('simulate');
    expect(url.searchParams.get('type')).toBe('rune');
  });
  it('handles stale items and malformed or out-of-range settings', () => {
    const state = readDropUrl(new URL(`${base}?item=removed&type=bogus&players=99&party=99&mf=NaN&difficulty=oops&monster=oops&kills=999999&minLevel=oops&maxLevel=-1`), [item]);
    expect(state).toMatchObject({ selected: null, category: 'all', players: 8, party: 8, magicFind: 0, difficulty: 2, kind: 'all', kills: 100000, minLevel: 1, maxLevel: 999 });
    expect(readDropUrl(new URL(`${base}?players=2&party=8&mf=-1`), [item])).toMatchObject({ players: 2, party: 2, magicFind: 0 });
  });
  it('removes stale state and omits defaults', () => {
    expect(writeDropUrl(new URL(`${base}?item=removed&mf=500&zero=1`), readDropUrl(base, [item])).href).toBe(base.href);
  });
});

describe('advanced setting indicator', () => {
  it('counts nothing for defaults, essential settings, or result filters', () => {
    expect(countAdvancedDropFilters(readDropUrl(base, [item]))).toBe(0);
    expect(countAdvancedDropFilters(readDropUrl(new URL(`${base}?difficulty=all&players=8&mf=300&filter=baal&zero=1&type=set`), [item]))).toBe(0);
  });
  it('counts each nondefault advanced setting restored from a bookmarked URL', () => {
    const url = new URL(`${base}?item=${encodeURIComponent(item.Id)}&players=4&party=3&monster=boss&tc=Act%205%20(H)%20H2H%20C&minLevel=80&maxLevel=90&kills=500`);
    const state = readDropUrl(url, [item]);
    expect(state.selected).toBe(item);
    expect(countAdvancedDropFilters(state)).toBe(6);
    expect(countAdvancedDropFilters({ ...state, kind: 'all', kills: 100000 })).toBe(4);
  });
  it('agrees with the URL writer about which values are defaults', () => {
    const state = { ...readDropUrl(base, [item]), minLevel: 1, maxLevel: 999, kills: 100000, party: 1, kind: 'all', treasureClass: '' };
    expect(countAdvancedDropFilters(state)).toBe(0);
    expect(writeDropUrl(base, state).search).toBe('');
    expect(countAdvancedDropFilters({ ...state, maxLevel: 998 })).toBe(1);
    expect(writeDropUrl(base, { ...state, maxLevel: 998 }).searchParams.get('maxLevel')).toBe('998');
  });
});

describe('mode switching keeps the current selection', () => {
  const unique: DropItem = { ...item, Id: 'unique:Harlequin Crest', Quality: 'unique' };
  const rune: DropItem = { ...item, Id: 'rune:r33', Quality: 'rune' };
  const items = [item, unique, rune];
  const bookmark = new URL(`${base}?item=${encodeURIComponent(unique.Id)}&players=4&party=3&monster=boss&tc=Act%205%20(H)%20H2H%20C&minLevel=80&kills=500`);

  it('switches from the address bar without restoring a cleared item', () => {
    let address = bookmark;
    const opened = readDropUrl(address, items);
    expect(opened.selected).toBe(unique);
    // Choosing Runes clears the unique item; the page writes that to the address bar.
    address = writeDropUrl(address, { ...opened, selected: null, category: 'rune' });
    expect(address.searchParams.has('item')).toBe(false);

    address = writeDropMode(address, 'simulate');
    expect(readDropMode(address)).toBe('simulate');
    expect(address.searchParams.has('item')).toBe(false);
    expect(address.searchParams.get('type')).toBe('rune');

    address = writeDropMode(address, 'item');
    const back = readDropUrl(address, items);
    expect(readDropMode(address)).toBe('item');
    expect(back).toMatchObject({ selected: null, category: 'rune' });
    // Advanced filters survive the cleared item and both switches unchanged.
    expect(back).toMatchObject({ players: 4, party: 3, kind: 'boss', treasureClass: 'Act 5 (H) H2H C', minLevel: 80, kills: 500 });

    address = writeDropUrl(address, { ...back, selected: rune });
    for (const mode of ['simulate', 'item', 'simulate', 'simulate', 'item'] as const) {
      address = writeDropMode(address, mode);
      expect(readDropUrl(address, items)).toMatchObject({ selected: rune, category: 'rune' });
      expect(readDropMode(address)).toBe(mode);
    }
  });

  it('shows how the original snapshot resurrected the cleared item', () => {
    const cleared = writeDropUrl(bookmark, { ...readDropUrl(bookmark, items), selected: null, category: 'rune' });
    expect(writeDropMode(bookmark, 'simulate').searchParams.get('item')).toBe(unique.Id);
    expect(writeDropMode(cleared, 'simulate').searchParams.has('item')).toBe(false);
  });

  it('keeps simulator settings and item state independent across switches', () => {
    let address = writeDropMode(new URL(`${base}?item=${encodeURIComponent(unique.Id)}`), 'simulate');
    const sim = { ...readMonsterDropUrl(address), sourceId: 'baal:hell', seed: 7 };
    address = writeMonsterDropUrl(address, sim);
    address = writeDropUrl(address, { ...readDropUrl(address, items), selected: null, category: 'rune' });
    address = writeDropMode(address, 'item');
    expect(readMonsterDropUrl(address)).toEqual(sim);
    expect(readDropUrl(address, items).selected).toBeNull();
    expect(readDropMode(new URL(`${base}?mode=simulate`))).toBe('simulate');
    expect(readDropMode(new URL(`${base}?mode=bogus`))).toBe('item');
  });
});

it('shares miscellaneous item selections and an empty misc search', () => {
  const misc: DropItem = { ...item, Id: 'misc:ka3', Quality: 'misc' };
  const state = { ...readDropUrl(base, [misc]), selected: misc, category: 'misc' as const };
  expect(readDropUrl(writeDropUrl(base, state), [misc])).toEqual(state);
  expect(readDropUrl(new URL(`${base}?type=misc`), [misc]).category).toBe('misc');
});
