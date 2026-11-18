import type { SaveItem } from '#lib/characters.js';
import type { ItemUpgradeTiers } from './item-upgrade-tiers';

export interface ItemSpriteVariant {
  FileIndex: number;
  NameKey: string;
  Sprite?: string;
}

export interface ItemPresentation {
  Code: string;
  NameKey: string;
  Width: number;
  Height: number;
  Sprite?: string;
  UniqueSprites: ItemSpriteVariant[];
  SetSprites: ItemSpriteVariant[];
}

/** A resolved unique or set row, plus the base it is declared on. */
export interface ItemVariantMatch {
  variant: ItemSpriteVariant;
  base: ItemPresentation;
  /** True when the row belongs to a sibling tier because the item was upgraded in the cube. */
  upgraded: boolean;
}

let presentationPromise: Promise<Map<string, ItemPresentation>> | null = null;

function variantQuality(item: SaveItem): 'unique' | 'set' | null {
  const quality = item.quality.toLowerCase();
  if (quality.includes('unique')) return 'unique';
  if (quality.includes('set')) return 'set';
  return null;
}

function variantsOf(presentation: ItemPresentation, quality: 'unique' | 'set'): ItemSpriteVariant[] {
  return quality === 'unique' ? presentation.UniqueSprites : presentation.SetSprites;
}

export function loadItemPresentation(): Promise<Map<string, ItemPresentation>> {
  if (!presentationPromise) {
    presentationPromise = fetch('/data/keyed/item-presentation.json')
      .then((response) => {
        if (!response.ok) throw new Error('The character item artwork could not be loaded.');
        return response.json() as Promise<ItemPresentation[]>;
      })
      .then((rows) => new Map(rows.map((row) => [row.Code.toLowerCase(), row])));
  }
  return presentationPromise;
}

/**
 * Finds the unique or set row a saved item rolled from. The file index is looked up on the
 * item's own base first; when that misses, the search widens to the base's upgrade family,
 * because upgrading a unique in the cube swaps the base code and keeps the row. The search
 * never widens further than that — an index the mod has since reassigned would otherwise
 * borrow an unrelated item's name.
 */
export function itemVariantMatch(
  item: SaveItem,
  presentation?: ItemPresentation,
  presentations?: Map<string, ItemPresentation>,
  upgradeTiers?: ItemUpgradeTiers
): ItemVariantMatch | null {
  const fileIndex = item.qualityData?.fileIndex;
  if (fileIndex === null || fileIndex === undefined) return null;
  const quality = variantQuality(item);
  if (!quality || !presentation) return null;

  const own = variantsOf(presentation, quality).find((entry) => entry.FileIndex === fileIndex);
  if (own) return { variant: own, base: presentation, upgraded: false };
  if (!presentations || !upgradeTiers) return null;

  const code = item.codeText.toLowerCase();
  for (const sibling of upgradeTiers.get(code) ?? []) {
    if (sibling === code) continue;
    const siblingBase = presentations.get(sibling);
    if (!siblingBase) continue;
    const variant = variantsOf(siblingBase, quality).find((entry) => entry.FileIndex === fileIndex);
    if (variant) return { variant, base: siblingBase, upgraded: true };
  }

  return null;
}

export function itemVariant(
  item: SaveItem,
  presentation?: ItemPresentation,
  presentations?: Map<string, ItemPresentation>,
  upgradeTiers?: ItemUpgradeTiers
): ItemSpriteVariant | null {
  return itemVariantMatch(item, presentation, presentations, upgradeTiers)?.variant ?? null;
}

export function hasUnknownItemVariant(
  item: SaveItem,
  presentation?: ItemPresentation,
  presentations?: Map<string, ItemPresentation>,
  upgradeTiers?: ItemUpgradeTiers
): boolean {
  return variantQuality(item) !== null
    && itemVariantMatch(item, presentation, presentations, upgradeTiers) === null;
}

const JEWEL_CODES = new Set(['jew', 'cjw']);
const JEWEL_PLACEHOLDER_SPRITES = new Set([
  'sprites/items/misc-gem-jewels.webp',
  'sprites/items/misc-gem-perfect_diamond.webp'
]);
const JEWEL_VARIANT_COUNT = 6;
const DEFAULT_JEWEL_SPRITE = '/images/items/jewels5.webp';

function jewelSpriteForItem(item: SaveItem): string {
  const gfx = item.variableGraphicsId;
  if (typeof gfx === 'number' && Number.isInteger(gfx) && gfx >= 0 && gfx < JEWEL_VARIANT_COUNT) {
    return `/images/items/jewels${gfx + 1}.webp`;
  }
  const fallbackKey = item.qualityData?.fileIndex ?? item.seed;
  if (typeof fallbackKey === 'number' && Number.isFinite(fallbackKey)) {
    const index = (Math.abs(Math.trunc(fallbackKey)) % JEWEL_VARIANT_COUNT) + 1;
    return `/images/items/jewels${index}.webp`;
  }
  return DEFAULT_JEWEL_SPRITE;
}

export function baseItemSprite(presentation?: ItemPresentation): string | null {
  if (!presentation?.Sprite) return null;
  if (
    JEWEL_CODES.has(presentation.Code.toLowerCase()) &&
    JEWEL_PLACEHOLDER_SPRITES.has(presentation.Sprite)
  ) {
    return DEFAULT_JEWEL_SPRITE;
  }
  return `/data/${presentation.Sprite}`;
}

export function itemSprite(
  item: SaveItem,
  presentation?: ItemPresentation,
  presentations?: Map<string, ItemPresentation>,
  upgradeTiers?: ItemUpgradeTiers
): string | null {
  if (!presentation) return null;
  const match = itemVariantMatch(item, presentation, presentations, upgradeTiers);
  // An upgraded unique keeps artwork of its own, but not the plain sprite of the base tier it
  // was upgraded away from. Anything still unresolved falls back to the base sprite so the
  // slot shows the item instead of an empty square.
  const inherited = match?.upgraded && match.variant.Sprite === match.base.Sprite;
  const path = (inherited ? undefined : match?.variant.Sprite) ?? presentation.Sprite;
  if (!path) return null;
  const code = (item.codeText?.trim() || presentation.Code).toLowerCase();
  if (JEWEL_CODES.has(code) && JEWEL_PLACEHOLDER_SPRITES.has(path)) {
    return jewelSpriteForItem(item);
  }
  return `/data/${path}`;
}
