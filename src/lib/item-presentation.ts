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

export function itemVariant(item: SaveItem, presentation: ItemPresentation): ItemSpriteVariant | null {
  const fileIndex = item.qualityData?.fileIndex;
  if (fileIndex === null || fileIndex === undefined) return null;
  if (item.quality.toLowerCase().includes('unique')) {
    return presentation.UniqueSprites.find((entry) => entry.FileIndex === fileIndex) ?? null;
  }
  if (item.quality.toLowerCase().includes('set')) {
    return presentation.SetSprites.find((entry) => entry.FileIndex === fileIndex) ?? null;
  }
  return null;
}

export function itemSprite(item: SaveItem, presentation?: ItemPresentation): string | null {
  if (!presentation) return null;
  const path = itemVariant(item, presentation)?.Sprite ?? presentation.Sprite;
  return path ? `/data/${path}` : null;
}
