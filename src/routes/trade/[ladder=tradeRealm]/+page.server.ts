import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { loadTradeMarketplace } from '$lib/server/trade-marketplace';

export const load: PageServerLoad = async ({ fetch, params, parent, url }) => {
  const { tradeLadders } = await parent();
  const data = await loadTradeMarketplace(fetch, tradeLadders, params.ladder);
  if (url.pathname !== data.realm.path) redirect(308, data.realm.path);
  return data;
};
