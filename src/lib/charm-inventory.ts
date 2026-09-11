// Dimentio's CharmInv plugin adds a charm panel beside the normal inventory,
// and this is what the rest of the site needs to know about where it is kept.
//
// Nothing here imports a value, only the item type, so that modules under unit
// test can use it without dragging in the API client `characters.ts` also holds.
import type { SaveItem } from '$lib/characters';

/**
 * The stored page the charm panel occupies.
 *
 * A save records an item's page in three bits, and vanilla names five of the
 * eight values that can hold. CharmInv claims the unused sixth for its panel,
 * so charms sitting in it arrive in the ordinary item list like everything else
 * and need nothing extra fetched to draw them.
 */
export const charmInventoryStorePageId = 6;

/** The panel's grid, which CharmInv reports as 10x4 when it loads its tables. */
export const charmInventoryColumns = 10;
export const charmInventoryRows = 4;

/**
 * Whether this item sits in the charm panel.
 *
 * Matched on the numeric page rather than the name. The API names page 6
 * `CharmInventory`, but equipment snapshots taken before it learned to do that
 * are stored rather than reparsed and still carry the bare string `"6"` - so the
 * name is the half that can be stale and the number is the half that cannot.
 */
export function isCharmInventoryItem(item: SaveItem): boolean {
  return item.position.mode === 'Stored'
    && item.position.storePageId === charmInventoryStorePageId;
}
