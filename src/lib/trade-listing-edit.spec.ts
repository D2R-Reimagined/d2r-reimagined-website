import { describe, expect, it } from 'vitest';
import {
  canEditTradeListing,
  hasLegacyTradePrice,
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

  it('tracks structured priceItems, priceCombine, and priceNote diffs without touching untouched listings', () => {
    const structured = {
      ...listing,
      price: '2 OoA or Jah',
      priceItems: [
        { currencyCode: 'ooa', quantity: 2 },
        { currencyCode: 'r31', quantity: 1 }
      ],
      priceCombine: 'Or' as const,
      priceNote: null
    } as TradeListing;

    const form = tradeListingEditForm(structured);
    expect(tradeListingEdits(structured, form)).toEqual({});

    const updated = tradeListingEdits(structured, {
      ...form,
      priceItems: [
        { currencyCode: 'r30', quantity: 1 },
        { currencyCode: 'r24', quantity: 1 }
      ],
      priceCombine: 'And',
      priceNote: '  or 3 Keysets '
    });
    expect(updated).toEqual({
      priceItems: [
        { currencyCode: 'r30', quantity: 1 },
        { currencyCode: 'r24', quantity: 1 }
      ],
      priceCombine: 'And',
      priceNote: 'or 3 Keysets'
    });

    const clearedToOffers = tradeListingEdits(structured, {
      ...form,
      priceItems: []
    });
    expect(clearedToOffers).toEqual({
      priceItems: []
    });
  });

  it('never sends price="" to wipe structured buyouts or offers-only barter notes when form.price is cleared', () => {
    const structuredBuyout = {
      ...listing,
      price: 'OoC',
      priceItems: [{ currencyCode: 'ka3', quantity: 1 }],
      priceCombine: 'Or' as const,
      priceNote: null
    } as TradeListing;

    const offersWithNote = {
      ...listing,
      price: 'ISO sorc torch',
      priceItems: [],
      priceCombine: 'Or' as const,
      priceNote: 'ISO sorc torch'
    } as TradeListing;

    expect(hasLegacyTradePrice(listing)).toBe(true);
    expect(hasLegacyTradePrice(structuredBuyout)).toBe(false);
    expect(hasLegacyTradePrice(offersWithNote)).toBe(false);

    expect(tradeListingEdits(structuredBuyout, { ...tradeListingEditForm(structuredBuyout), price: '' })).toEqual({});
    expect(tradeListingEdits(offersWithNote, { ...tradeListingEditForm(offersWithNote), price: '' })).toEqual({});
  });

  it('protects a legacy text buyout until currencies are picked or the seller explicitly clears to offers', () => {
    const baseForm = tradeListingEditForm(listing);

    // Accidental barter note or combine toggle while legacy price is still active must not wipe '2 Ber'
    expect(
      tradeListingEdits(listing, {
        ...baseForm,
        priceCombine: 'And',
        priceNote: 'firm'
      })
    ).toEqual({});

    // Explicitly clearing legacy price to Offers only with a barter note sends the structured offers note
    expect(
      tradeListingEdits(listing, {
        ...baseForm,
        price: '',
        priceNote: 'ISO cold skillers'
      })
    ).toEqual({
      priceItems: [],
      priceNote: 'ISO cold skillers'
    });

    // Picking structured currencies converts the legacy listing cleanly
    expect(
      tradeListingEdits(listing, {
        ...baseForm,
        priceItems: [{ currencyCode: 'r30', quantity: 2 }],
        priceNote: 'firm'
      })
    ).toEqual({
      priceItems: [{ currencyCode: 'r30', quantity: 2 }],
      priceNote: 'firm'
    });
  });
});
