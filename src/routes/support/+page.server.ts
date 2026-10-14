import { env } from '$env/dynamic/public';
import type { PageServerLoad } from './$types';
import type { SupportSummary } from '$lib/support';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
  // The API caches the summary for a few minutes; a short page cache keeps it fresh after a donation.
  setHeaders({ 'cache-control': 'public, max-age=60' });

  let summary: SupportSummary | null = null;
  try {
    const response = await fetch(`${(env.PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')}/support/summary`);
    if (response.ok) summary = await response.json();
  } catch {
    // The page still offers Patreon and Discord when the API is offline.
  }
  return { summary };
};
