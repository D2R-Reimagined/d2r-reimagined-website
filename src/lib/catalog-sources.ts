import { isOrbRecipe } from './orbs';
import type { CatalogItem, CatalogSlug } from './types';

/** One `static/data/keyed/*.json` file backing a catalog, plus the badge its rows carry. */
export interface CatalogSource {
  file: string;
  source?: CatalogItem['source'];
  /** Keeps only the rows this catalog owns when one file backs more than one catalog. */
  rows?: (row: CatalogItem) => boolean;
}

/**
 * Which keyed files make up each catalog. Two of them merge a pair of files and tag every
 * row so the card and the subtype filter can tell the halves apart, and two split one file:
 * the orb recipes are the Orbs catalog, so Cube Recipes leaves them out rather than burying
 * the rest of the cube under 145 rows that enumerate one effect per item type.
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
  'cube-recipes': [{ file: 'cube-recipes', rows: (row) => !isOrbRecipe(row) }],
  orbs: [{ file: 'cube-recipes', rows: isOrbRecipe }]
};

/** Narrows a file to the rows a catalog owns, then applies that source's badge. */
export function tagSource(rows: CatalogItem[], { source, rows: keep }: Omit<CatalogSource, 'file'>): CatalogItem[] {
  const owned = keep ? rows.filter(keep) : rows;
  return source ? owned.map((row) => ({ ...row, source })) : owned;
}

/** Assembles a catalog from already-loaded file contents, keyed by file name. */
export function buildCatalog(slug: CatalogSlug, files: Record<string, CatalogItem[]>): CatalogItem[] {
  return catalogSources[slug].flatMap(({ file, ...rest }) => tagSource(files[file] ?? [], rest));
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
    catalogSources[slug].map(async ({ file, ...rest }) => {
      const response = await fetcher(`/data/keyed/${file}.json`);
      if (!response.ok) throw new Error(`Unable to load ${file}.json (${response.status})`);
      return tagSource(await response.json() as CatalogItem[], rest);
    })
  ).then((groups) => groups.flat());

  // Drop a failed load so a later search can retry instead of replaying the rejection.
  request.catch(() => pending.delete(slug));
  pending.set(slug, request);
  return request;
}
