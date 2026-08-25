import type { SaveItem } from '$lib/characters';
import type { CatalogItem } from '$lib/types';

function recipeKey(codes: string[]): string {
  return codes.map((code) => code.trim().toLowerCase()).join(',');
}

/** Maps an ordered socket-rune recipe to its localized runeword name key. */
export function buildRunewordNameMap(runewords: CatalogItem[]): Map<string, string> {
  const names = new Map<string, string>();

  for (const runeword of runewords) {
    const runes = runeword.Runes ?? [];
    if (!runes.length || runes.some((rune) => !rune.NameKey) || runeword.Index == null || runeword.Enabled === false) continue;

    const key = recipeKey(runes.map((rune) => rune.NameKey ?? ''));

    // Match the game's/editor's behavior when two type-specific runewords share
    // a recipe: the first enabled table entry is the canonical display name.
    if (!names.has(key)) names.set(key, String(runeword.Index));
  }

  return names;
}

export function runewordNameKey(item: SaveItem, names: Map<string, string>): string | undefined {
  if (item.runewordId == null) return undefined;

  const socketCodes = item.sockets
    .filter((socket): socket is SaveItem => socket !== null)
    .map((socket) => socket.codeText);

  return socketCodes.length ? names.get(recipeKey(socketCodes)) : undefined;
}
