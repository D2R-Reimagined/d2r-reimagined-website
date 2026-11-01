// The landing realm comes from the visitor's saved choice, so it can only be
// picked in the browser.
export const ssr = false;
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { loadTradeMarketplace } from '#lib/trade-marketplace.js';
import { lastTradeRealmStorageKey, preferredTradePath } from '#lib/trade-ladders.js';

export const load: PageLoad = async ({ fetch, parent }) => {
  const { tradeLadders } = await parent();
  let stored: string | null = null;
  try { stored = localStorage.getItem(lastTradeRealmStorageKey); } catch { /* storage is optional */ }
  const path = preferredTradePath(stored, tradeLadders);
  if (path) redirect(307, path);
  return await loadTradeMarketplace(fetch, tradeLadders);
};
