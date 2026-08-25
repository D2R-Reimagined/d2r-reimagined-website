import type { SaveItem } from '$lib/characters';

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

let presentationPromise: Promise<Map<string, ItemPresentation>> | null = null;

function variantQuality(item: SaveItem): 'unique' | 'set' | null {
  const quality = item.quality.toLowerCase();
  if (quality.includes('unique')) return 'unique';
  if (quality.includes('set')) return 'set';
  return null;
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

export function itemVariant(
  item: SaveItem,
  presentation: ItemPresentation,
  _presentations?: Map<string, ItemPresentation>
): ItemSpriteVariant | null {
  const fileIndex = item.qualityData?.fileIndex;
  if (fileIndex === null || fileIndex === undefined) return null;
  if (variantQuality(item) === 'unique') {
    return presentation.UniqueSprites.find((entry) => entry.FileIndex === fileIndex) ?? null;
  }
  if (variantQuality(item) === 'set') {
    return presentation.SetSprites.find((entry) => entry.FileIndex === fileIndex) ?? null;
  }
  return null;
}

export function hasUnknownItemVariant(
  item: SaveItem,
  presentation?: ItemPresentation,
  presentations?: Map<string, ItemPresentation>
): boolean {
  return variantQuality(item) !== null
    && (!presentation || itemVariant(item, presentation, presentations) === null);
}

export function itemSprite(
  item: SaveItem,
  presentation?: ItemPresentation,
  presentations?: Map<string, ItemPresentation>
): string | null {
  if (!presentation) return null;
  const variant = itemVariant(item, presentation, presentations);
  if (variantQuality(item) !== null && !variant) return null;
  const path = variant?.Sprite ?? presentation.Sprite;
  return path ? `/data/${path}` : null;
}
