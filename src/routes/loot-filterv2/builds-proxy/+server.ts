import { PUBLIC_API_BASE_URL } from '$app/env/public';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const LIVE_API_BASE = 'https://api.d2r-reimagined.com';

async function fetchWithFallback(pathAndQuery: string, fetcher: typeof fetch): Promise<Response> {
  const configuredBase = (PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
  const candidates = configuredBase && configuredBase !== LIVE_API_BASE
    ? [configuredBase, LIVE_API_BASE]
    : [LIVE_API_BASE];

  let lastErr: unknown;
  for (const base of candidates) {
    try {
      const res = await fetcher(`${base}${pathAndQuery}`, {
        headers: { Accept: 'application/json' }
      });
      if (res.ok || res.status === 404) {
        return res;
      }
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr ?? new Error('Unable to reach build API');
}

export const GET: RequestHandler = async ({ url, fetch }) => {
  const buildId = url.searchParams.get('id')?.trim();
  try {
    if (buildId) {
      const res = await fetchWithFallback(`/builds/${encodeURIComponent(buildId)}`, fetch);
      if (!res.ok) {
        error(res.status, 'Build guide not found.');
      }
      return json(await res.json());
    }

    const search = url.searchParams.get('search') ?? '';
    const characterClass = url.searchParams.get('characterClass') ?? '';
    const count = url.searchParams.get('count') ?? '8';
    const sort = url.searchParams.get('sort') ?? 'rating';
    const qs = new URLSearchParams({ search, count, sort });
    if (characterClass) qs.set('characterClass', characterClass);

    const res = await fetchWithFallback(`/builds?${qs.toString()}`, fetch);
    if (!res.ok) {
      error(res.status, 'Unable to search builds.');
    }
    return json(await res.json());
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) throw err;
    error(503, 'Could not reach the Reimagined build library API.');
  }
};
