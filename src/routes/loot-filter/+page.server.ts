import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ setHeaders }) => {
  setHeaders({ 'x-robots-tag': 'noindex, nofollow' });
};
