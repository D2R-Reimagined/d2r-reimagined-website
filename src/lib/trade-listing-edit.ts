import type { TradeListing, TradeListingStatus } from '#lib/trades.js';

/** What a seller can change on a listing. The item itself stays as it was listed. */
export interface TradeListingEditForm {
  title: string;
  price: string;
  description: string;
  isNegotiable: boolean;
}

export type TradeListingEdits = Partial<TradeListingEditForm>;

/**
 * A pending trade's terms are what its buyer agreed to and a completed one's are
 * the record of it, so the API refuses edits to either. Matches its rule.
 */
export function canEditTradeListing(status: TradeListingStatus): boolean {
  return status !== 'Reserved' && status !== 'Completed';
}

export function tradeListingEditForm(listing: TradeListing): TradeListingEditForm {
  return {
    title: listing.title,
    price: listing.price ?? '',
    description: listing.description ?? '',
    isNegotiable: listing.isNegotiable
  };
}

/**
 * Only what changed, so an untouched form sends nothing. The API reads null as
 * "leave it alone", which makes a blank string the way to clear a price or notes.
 * An unidentified listing's title is generated from its base item and never edited.
 */
export function tradeListingEdits(listing: TradeListing, form: TradeListingEditForm): TradeListingEdits {
  const edits: TradeListingEdits = {};
  const title = form.title.trim();
  const price = form.price.trim();
  const description = form.description.trim();
  if (listing.isIdentified && title !== listing.title) edits.title = title;
  if (price !== (listing.price ?? '')) edits.price = price;
  if (description !== (listing.description ?? '')) edits.description = description;
  if (form.isNegotiable !== listing.isNegotiable) edits.isNegotiable = form.isNegotiable;
  return edits;
}
