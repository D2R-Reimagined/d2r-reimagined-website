import { PUBLIC_API_BASE_URL } from '$app/env/public';
import type { PageServerLoad } from './$types';
import { publicFilterPageSize, type PublicFilterPage } from '#lib/loot-filter/api.js';

export const load: PageServerLoad = async ({ fetch, url, setHeaders }) => {
  setHeaders({ 'x-robots-tag': 'noindex, nofollow' });
  const search = (url.searchParams.get('search') ?? '').trim().slice(0, 80);
  const skip = Math.min(100000, Math.max(0, Number.parseInt(url.searchParams.get('skip') ?? '0', 10) || 0));
  const params = new URLSearchParams({ search, skip: String(skip), count: String(publicFilterPageSize) });
  let results: PublicFilterPage = { items: [], total: 0, skip, count: publicFilterPageSize };
  let serviceError = '';
  try {
    const response = await fetch(`${(PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')}/loot-filters/public?${params}`);
    if (response.ok) results = await response.json() as PublicFilterPage;
    else serviceError = 'Public filters are temporarily unavailable. Please try again shortly.';
  } catch {
    serviceError = 'Unable to reach public filters. Please try again shortly.';
  }
  return { results, search, serviceError };
};
