// A hidden realm can only be resolved after browser authentication.
export const ssr = false;
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { loadTradeMarketplace } from '$lib/trade-marketplace';

export const load: PageLoad = async ({ fetch, params, parent, url }) => {
  const { tradeLadders } = await parent();
  const data = await loadTradeMarketplace(fetch, tradeLadders, params.ladder);
  if (url.pathname !== data.realm.path) redirect(308, data.realm.path);
  return data;
};
