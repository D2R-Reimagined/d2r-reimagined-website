import type { CatalogItem, CatalogSlug } from './types';

/** One `static/data/keyed/*.json` file backing a catalog, plus the badge its rows carry. */
export interface CatalogSource {
  file: string;
  source?: CatalogItem['source'];
}

/**
 * Which keyed files make up each catalog. Two of them merge a pair of files and tag every
 * row so the card and the subtype filter can tell the halves apart.
 *
 * The catalog route bundles these files through static imports while the all-data search
 * fetches them at runtime; both assemble their items from this one table so the two paths
 * cannot drift.
 */
export const catalogSources: Record<CatalogSlug, CatalogSource[]> = {
  uniques: [{ file: 'uniques' }],
  sets: [{ file: 'sets' }],
  runewords: [{ file: 'runewords' }],
  bases: [{ file: 'armors', source: 'armor' }, { file: 'weapons', source: 'weapon' }],
  affixes: [{ file: 'magicprefix', source: 'prefix' }, { file: 'magicsuffix', source: 'suffix' }],
  'cube-recipes': [{ file: 'cube-recipes' }]
};

/** Applies a source's badge to its rows. */
export function tagSource(rows: CatalogItem[], source: CatalogItem['source']): CatalogItem[] {
  return source ? rows.map((row) => ({ ...row, source })) : rows;
}

/** Assembles a catalog from already-loaded file contents, keyed by file name. */
export function buildCatalog(slug: CatalogSlug, files: Record<string, CatalogItem[]>): CatalogItem[] {
  return catalogSources[slug].flatMap(({ file, source }) => tagSource(files[file] ?? [], source));
}

// The catalogs total several megabytes, so the all-data search pulls them in only once the
// visitor actually searches — and then only once per session. Promises are cached rather
// than results so overlapping requests share a single fetch.
const pending = new Map<CatalogSlug, Promise<CatalogItem[]>>();

/**
 * Fetches one catalog's keyed JSON at runtime. Served straight from `static/`, so this hits
 * the same cacheable URLs the language bundles use.
 */
export function loadCatalog(slug: CatalogSlug, fetcher: typeof fetch = fetch): Promise<CatalogItem[]> {
  const inFlight = pending.get(slug);
  if (inFlight) return inFlight;

  const request = Promise.all(
    catalogSources[slug].map(async ({ file, source }) => {
      const response = await fetcher(`/data/keyed/${file}.json`);
      if (!response.ok) throw new Error(`Unable to load ${file}.json (${response.status})`);
      return tagSource(await response.json() as CatalogItem[], source);
    })
  ).then((groups) => groups.flat());

  // Drop a failed load so a later search can retry instead of replaying the rejection.
  request.catch(() => pending.delete(slug));
  pending.set(slug, request);
  return request;
}
