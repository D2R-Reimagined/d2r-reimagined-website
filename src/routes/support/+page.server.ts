import { env } from '$env/dynamic/public';
import type { PageServerLoad } from './$types';
import type { SupportProducts, SupportSummary } from '$lib/support';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
  // The API caches both for a few minutes; a short page cache keeps the total fresh after a purchase.
  setHeaders({ 'cache-control': 'public, max-age=60' });

  const api = (env.PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
  async function get<T>(path: string): Promise<T | null> {
    try {
      const response = await fetch(`${api}${path}`);
      return response.ok ? await response.json() as T : null;
    } catch {
      // The page still offers Discord when the API is offline.
      return null;
    }
  }

  const [summary, products] = await Promise.all([
    get<SupportSummary>('/support/summary'),
    get<SupportProducts>('/support/products')
  ]);
  return { summary, products };
};
