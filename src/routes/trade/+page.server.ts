import type { PageServerLoad } from './$types';
import { loadTradeMarketplace } from '$lib/server/trade-marketplace';

export const load: PageServerLoad = async ({ fetch, parent }) => {
  const { tradeLadders } = await parent();
  return await loadTradeMarketplace(fetch, tradeLadders);
};
