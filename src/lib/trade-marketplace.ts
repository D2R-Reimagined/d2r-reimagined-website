import { browser } from '$app/environment';
import { apiRequest } from '$lib/auth';
import { env } from '$env/dynamic/public';
import { error } from '@sveltejs/kit';
import {
  resolveTradeRealm,
  type TradeLadder,
  type TradeMarketplacePageData
} from '$lib/trade-ladders';
import type { TradeListingPage } from '$lib/trades';

export async function loadTradeMarketplace(
  fetch: typeof globalThis.fetch,
  ladders: TradeLadder[],
  segment?: string
): Promise<TradeMarketplacePageData> {
  const realm = resolveTradeRealm(ladders, segment);
  if (!realm) error(404, 'Trade ladder not found.');

  const api = (env.PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
  const query = new URLSearchParams({ count: '24', status: 'Active' });
  if (realm.kind === 'ladder') query.set('ladderId', realm.ladder!.id);
  if (realm.kind === 'standard') query.set('isLadder', 'false');

  try {
    const listings = browser
      ? await apiRequest<TradeListingPage>(`/trades?${query}`, {}, 'optional')
      : await fetch(`${api}/trades?${query}`).then(response => response.ok ? response.json() as Promise<TradeListingPage> : null);
    return {
      ladders,
      realm,
      initialListings: listings
    };
  } catch {
    return { ladders, realm, initialListings: null };
  }
}
