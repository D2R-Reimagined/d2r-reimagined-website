import { env } from '$env/dynamic/public';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { BuildDetails } from '$lib/builds';

export const load: PageServerLoad = async ({ fetch, params, url }) => {
  let response: Response;
  try { response = await fetch(`${(env.PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/,'')}/builds/${encodeURIComponent(params.id)}`); }
  catch { error(503, 'The build library is temporarily unavailable. Please try again shortly.'); }
  if (!response.ok) error(response.status === 404 ? 404 : 503, response.status === 404 ? 'This build is private, unpublished, or no longer available.' : 'The build could not be loaded. Please try again shortly.');
  return { details: await response.json() as BuildDetails, variant: url.searchParams.get('variant') ?? '' };
};
