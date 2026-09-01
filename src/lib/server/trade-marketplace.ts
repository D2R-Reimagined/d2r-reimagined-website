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
    const response = await fetch(`${api}/trades?${query}`);
    return {
      ladders,
      realm,
      initialListings: response.ok ? await response.json() as TradeListingPage : null
    };
  } catch {
    return { ladders, realm, initialListings: null };
  }
}
