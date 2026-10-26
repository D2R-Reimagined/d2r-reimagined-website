import { TRADE_ENABLED } from '$app/env/private';
import { PUBLIC_API_BASE_URL } from '$app/env/public';
import type { LayoutServerLoad } from './$types';
import { buildTradeLadders, type TradeLadder } from '#lib/trade-ladders.js';
import enUS from '../../static/data/strings/enUS.json';

export const load: LayoutServerLoad = async ({ fetch, url }) => {
  const tradeEnabled = TRADE_ENABLED === 'true';
  let tradeLadders: TradeLadder[] = [];
  if (tradeEnabled || url.pathname.startsWith('/trade')) {
    const api = (PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
    try {
      const response = await fetch(`${api}/ladders/summaries?activeOnly=true`);
      if (response.ok) {
        const ladders = await response.json() as Array<{ id: string; name: string }>;
        tradeLadders = buildTradeLadders(ladders);
      }
    } catch {
      // Trade remains usable without a ladder selection when the API is offline.
    }
  }

  return {
    translations: enUS,
    tradeEnabled,
    tradeLadders
  };
};
