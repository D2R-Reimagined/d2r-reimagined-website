import type { SaveItem } from '$lib/characters';

export function isItemIdentified(item: Pick<SaveItem, 'flags'>): boolean {
  return item.flags.names.some((name) => name.toLowerCase() === 'identified');
}

export function itemDisplayLabel(item: SaveItem, identifiedName?: string | null): string {
  const baseName = item.baseName || item.codeText;
  if (!isItemIdentified(item)) return baseName;
  return identifiedName || item.personalizedName || baseName;
}
