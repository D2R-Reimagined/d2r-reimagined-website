import { env } from '$env/dynamic/public';
import type { PageServerLoad } from './$types';
import type { BuildPage, BuildSummary } from '$lib/builds';

export const load: PageServerLoad = async ({ fetch, url }) => {
  const filters = Object.fromEntries(['search','characterClass','category','budget','patch','tag','sort'].map(key => [key, url.searchParams.get(key) ?? '']));
  filters.sort ||= 'updated';
  const skip = Math.min(100000, Math.max(0, Number.parseInt(url.searchParams.get('skip') ?? '0', 10) || 0));
  const params = new URLSearchParams({ ...filters, skip: String(skip), count: '12' });
  let results: BuildPage<BuildSummary> = { items: [], total: 0, skip, count: 12 };
  let serviceError = '';
  try {
    const response = await fetch(`${(env.PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/,'')}/builds?${params}`);
    if (!response.ok) serviceError = response.status === 400 ? 'Some filters are invalid. Clear them and try again.' : 'The build library is temporarily unavailable. Please try again shortly.';
    else results = await response.json();
  } catch { serviceError = 'Unable to reach the build library. Please try again shortly.'; }
  return { results, filters, serviceError };
};
