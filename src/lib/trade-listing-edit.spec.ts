import { describe, expect, it } from 'vitest';
import {
  canEditTradeListing,
  tradeListingEditForm,
  tradeListingEdits
} from '#lib/trade-listing-edit.js';
import type { TradeListing } from '#lib/trades.js';

const listing = {
  title: 'Stone of Jordan for trade',
  price: '2 Ber',
  description: 'Perfect roll',
  isNegotiable: true,
  isIdentified: true
} as TradeListing;

describe('trade listing edits', () => {
  it('leaves pending and completed trades alone', () => {
    expect(canEditTradeListing('Active')).toBe(true);
    expect(canEditTradeListing('Cancelled')).toBe(true);
    expect(canEditTradeListing('Expired')).toBe(true);
    expect(canEditTradeListing('Reserved')).toBe(false);
    expect(canEditTradeListing('Completed')).toBe(false);
  });

  it('sends nothing when nothing changed', () => {
    expect(tradeListingEdits(listing, tradeListingEditForm(listing))).toEqual({});
  });

  it('does not count surrounding spaces as a change', () => {
    const form = { ...tradeListingEditForm(listing), price: '  2 Ber ', title: ' Stone of Jordan for trade ' };
    expect(tradeListingEdits(listing, form)).toEqual({});
  });

  it('sends only what changed, trimmed', () => {
    const form = { ...tradeListingEditForm(listing), price: ' 1 Ber ', isNegotiable: false };
    expect(tradeListingEdits(listing, form)).toEqual({ price: '1 Ber', isNegotiable: false });
  });

  it('clears with a blank string, never null, which the API ignores', () => {
    const form = { ...tradeListingEditForm(listing), price: '', description: '   ' };
    expect(tradeListingEdits(listing, form)).toEqual({ price: '', description: '' });
  });

  it('adds a price and notes to a listing that had none', () => {
    const bare = { ...listing, price: null, description: null };
    const form = tradeListingEditForm(bare);
    expect(form.price).toBe('');
    expect(form.description).toBe('');
    expect(tradeListingEdits(bare, form)).toEqual({});
    expect(tradeListingEdits(bare, { ...form, price: 'Offers', description: 'Ask' }))
      .toEqual({ price: 'Offers', description: 'Ask' });
  });

  it('never sends the generated title of an unidentified listing', () => {
    const unidentified = { ...listing, isIdentified: false, title: 'Unidentified Ring for trade' };
    const form = { ...tradeListingEditForm(unidentified), title: 'Changed', price: '1 Ber' };
    expect(tradeListingEdits(unidentified, form)).toEqual({ price: '1 Ber' });
  });
});
