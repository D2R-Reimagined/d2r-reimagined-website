import type { SaveItem } from '$lib/characters';

export interface RareNamePresentation {
  Names: Array<string | null>;
}

let presentationPromise: Promise<RareNamePresentation> | null = null;

export function loadRareNamePresentation(): Promise<RareNamePresentation> {
  presentationPromise ??= fetch('/data/keyed/rare-names.json').then(async (response) => {
    if (!response.ok) throw new Error('Rare item names could not be loaded.');
    return response.json() as Promise<RareNamePresentation>;
  });
  return presentationPromise;
}

export function rareItemName(
  item: SaveItem,
  presentation: RareNamePresentation | undefined,
  translate: (key: string) => string = (key) => key
): string | null {
  if (!presentation || !/(rare|crafted)/i.test(item.quality)) return null;

  const prefixId = item.qualityData?.properties.rarePrefixId;
  const suffixId = item.qualityData?.properties.rareSuffixId;
  if (!Number.isInteger(prefixId) || !Number.isInteger(suffixId)) return null;

  const prefix = presentation.Names[prefixId as number];
  const suffix = presentation.Names[suffixId as number];
  if (!prefix || !suffix) return null;
  return `${translate(prefix)} ${translate(suffix)}`;
}
