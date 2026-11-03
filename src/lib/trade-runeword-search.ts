import type { SaveItem } from '#lib/characters.js';
import { loadCatalog } from '#lib/catalog-sources.js';
import { buildRunewordNameMap, runewordNameKey } from '#lib/runeword-presentation.js';
import type { TradeListing } from '#lib/trades.js';
import type { CatalogItem } from '#lib/types.js';

/**
 * Trade listings are stored under their base item ("Wire Fleece"), so the API's text
 * search cannot find a runeword by name. The runeword is worked out here instead, from
 * the ordered runes in the listing's sockets.
 */

/** Recipe (ordered rune codes) to runeword name, e.g. "r31,r06,r30" -> "Enigma". */
export type RunewordNames = Map<string, string>;

let cached: Promise<RunewordNames> | null = null;

/** The runeword recipe table, loaded once per page. */
export function loadRunewordNames(): Promise<RunewordNames> {
  cached ??= loadCatalog('runewords')
    .then((runewords: CatalogItem[]) => buildRunewordNameMap(runewords))
    .catch((error) => {
      cached = null;
      throw error;
    });
  return cached;
}

/** Every runeword name, for search suggestions. */
export function runewordNameList(names: RunewordNames): string[] {
  return [...new Set(names.values())];
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

/**
 * The runeword names a search means, or an empty set when it is not a runeword search.
 * A search counts when it is the start of a runeword's name (at least 3 characters, so
 * "a" or "of" do not turn every search into a runeword search).
 */
export function runewordNamesForSearch(search: string, names: RunewordNames): Set<string> {
  const query = normalize(search);
  const matches = new Set<string>();
  if (query.length < 3) return matches;
  for (const name of names.values()) {
    const candidate = normalize(name);
    if (candidate === query || candidate.startsWith(query)) matches.add(name);
  }
  return matches;
}

/** The runeword a listing's item is, or undefined when it is not one or cannot be read. */
export function listingRunewordName(listing: TradeListing, names: RunewordNames): string | undefined {
  if (!listing.itemData) return undefined;
  let item: SaveItem;
  try {
    item = JSON.parse(listing.itemData) as SaveItem;
  } catch {
    return undefined;
  }
  if (!item || !Array.isArray(item.sockets)) return undefined;
  return runewordNameKey(item, names);
}
