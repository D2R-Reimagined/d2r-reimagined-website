import { browser } from '$app/environment';
import { initializeAuth } from '$lib/auth';
import { getActiveLadders } from '$lib/ladders';
import { buildTradeLadders } from '$lib/trade-ladders';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, url, depends }) => {
  depends('app:ladder-visibility');
  if (!browser) return data;
  await initializeAuth();
  if (!data.tradeEnabled && !url.pathname.startsWith('/trade')) return data;
  try {
    return { ...data, tradeLadders: buildTradeLadders(await getActiveLadders()) };
  } catch {
    return data;
  }
};
