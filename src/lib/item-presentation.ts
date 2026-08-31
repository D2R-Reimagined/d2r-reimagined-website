import type { SaveItem } from '$lib/characters';
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
  return path ? `/data/${path}` : null;
}
