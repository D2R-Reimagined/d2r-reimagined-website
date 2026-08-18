import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => new Response(
  'User-agent: *\nAllow: /\nSitemap: https://www.d2r-reimagined.com/sitemap.xml\n',
  { headers: { 'content-type': 'text/plain; charset=utf-8' } }
);
