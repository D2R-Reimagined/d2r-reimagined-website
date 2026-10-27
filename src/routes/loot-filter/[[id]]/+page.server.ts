import { PUBLIC_API_BASE_URL } from '$app/env/public';
import type { PageServerLoad } from './$types';
import type { PublicFilterDetails } from '#lib/loot-filter/api.js';

const filterId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const load: PageServerLoad = async ({ fetch, params, setHeaders }) => {
  setHeaders({ 'x-robots-tag': 'noindex, nofollow' });
  const id = params.id ?? null;
  let shared: PublicFilterDetails | null = null;
  let sharedError = '';
  // A missing public copy is not an error yet: the signed-in owner may still open a private filter.
  if (id && filterId.test(id)) {
    try {
      const response = await fetch(`${(PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')}/loot-filters/public/${encodeURIComponent(id)}`);
      if (response.ok) shared = await response.json() as PublicFilterDetails;
      else if (response.status !== 404) sharedError = 'The shared filter could not be loaded. Please try again shortly.';
    } catch {
      sharedError = 'The shared filter could not be loaded. Please try again shortly.';
    }
  }
  return { filterId: id, shared, sharedError };
};
