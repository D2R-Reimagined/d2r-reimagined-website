import type { PageLoad } from './$types';
import { loadTradeMarketplace } from '$lib/trade-marketplace';

export const load: PageLoad = async ({ fetch, parent }) => {
  const { tradeLadders } = await parent();
  return await loadTradeMarketplace(fetch, tradeLadders);
};
