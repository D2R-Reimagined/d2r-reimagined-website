import type { RequestHandler } from './$types';

const routes = [
  '/',
  '/download',
  '/characters',
  '/grail',
  '/data',
  '/data/skills',
  '/data/uniques',
  '/data/sets',
  '/data/runewords',
  '/data/bases',
  '/data/affixes',
  '/data/cube-recipes',
  '/data/orbs'
];

export const GET: RequestHandler = () => {
  const urls = routes.map((route) => `  <url><loc>https://www.d2r-reimagined.com${route}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'content-type': 'application/xml; charset=utf-8' }
  });
};
