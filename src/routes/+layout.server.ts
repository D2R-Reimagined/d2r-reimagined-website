import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import type { LayoutServerLoad } from './$types';
import { buildTradeLadders, type TradeLadder } from '$lib/trade-ladders';
import enUS from '../../static/data/strings/enUS.json';

export const load: LayoutServerLoad = async ({ fetch, url }) => {
  const tradeEnabled = privateEnv.TRADE_ENABLED === 'true';
  let tradeLadders: TradeLadder[] = [];
  if (tradeEnabled || url.pathname.startsWith('/trade')) {
    const api = (publicEnv.PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
    try {
      const response = await fetch(`${api}/ladders/active`);
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
