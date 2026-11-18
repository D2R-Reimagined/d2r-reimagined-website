import type { TradePriceCombine, TradePriceItem } from '#lib/trade-pricing.js';
import type { TradeListing, TradeListingStatus } from '#lib/trades.js';

/** What a seller can change on a listing. The item itself stays as it was listed. */
export interface TradeListingEditForm {
  title: string;
  price: string;
  priceItems: TradePriceItem[];
  priceCombine: TradePriceCombine;
  priceNote: string;
  description: string;
  isNegotiable: boolean;
}

export type TradeListingEdits = Partial<TradeListingEditForm>;

function normalizePriceItems(items: readonly TradePriceItem[] | undefined | null): TradePriceItem[] {
  return (items ?? []).map((entry) => ({
    currencyCode: entry.currencyCode.toLowerCase(),
    quantity: entry.quantity
  }));
}

function samePriceItems(a: readonly TradePriceItem[], b: readonly TradePriceItem[]): boolean {
  if (a.length !== b.length) return false;
  return a.every(
    (entry, index) =>
      entry.currencyCode.toLowerCase() === b[index].currencyCode.toLowerCase() &&
      entry.quantity === b[index].quantity
  );
}

/**
 * A pending trade's terms are what its buyer agreed to and a completed one's are
 * the record of it, so the API refuses edits to either. Matches its rule.
 */
export function canEditTradeListing(status: TradeListingStatus): boolean {
  return status !== 'Reserved' && status !== 'Completed';
}

export function hasLegacyTradePrice(
  listing: Pick<TradeListing, 'price' | 'priceItems' | 'priceNote'>
): boolean {
  return (
    (listing.priceItems?.length ?? 0) === 0 &&
    !(listing.priceNote ?? '').trim() &&
    Boolean((listing.price ?? '').trim())
  );
}

export function tradeListingEditForm(listing: TradeListing): TradeListingEditForm {
  return {
    title: listing.title,
    price: listing.price ?? '',
    priceItems: normalizePriceItems(listing.priceItems),
    priceCombine: listing.priceCombine ?? 'Or',
    priceNote: listing.priceNote ?? '',
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
  const prevItems = normalizePriceItems(listing.priceItems);
  const nextItems = normalizePriceItems(form.priceItems);
  const prevCombine = listing.priceCombine ?? 'Or';
  const prevNote = (listing.priceNote ?? '').trim();
  const nextNote = form.priceNote.trim();

  const hadStructuredPrice = prevItems.length > 0 || prevNote.length > 0;
  // A legacy text buyout stays untouched until the seller either picks currency
  // chips to convert it or clears `form.price` by switching to 'Offers only'.
  const keepsLegacyBuyout =
    hasLegacyTradePrice(listing) && nextItems.length === 0 && price.length > 0;

  if (listing.isIdentified && title !== listing.title) edits.title = title;
  if (
    !keepsLegacyBuyout &&
    (!samePriceItems(prevItems, nextItems) || form.priceCombine !== prevCombine || nextNote !== prevNote)
  ) {
    edits.priceItems = nextItems;
    if (form.priceCombine !== prevCombine || nextItems.length > 1) {
      edits.priceCombine = form.priceCombine;
    }
    if (nextNote !== prevNote || nextNote.length > 0) {
      edits.priceNote = nextNote;
    }
  } else if (!hadStructuredPrice && price !== (listing.price ?? '').trim()) {
    edits.price = price;
  }
  if (description !== (listing.description ?? '')) edits.description = description;
  if (form.isNegotiable !== listing.isNegotiable) edits.isNegotiable = form.isNegotiable;
  return edits;
}
