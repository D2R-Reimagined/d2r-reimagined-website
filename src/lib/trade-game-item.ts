import type { CharacterDetailsResponse, SaveItem } from '$lib/characters';
import type { TradeInventory } from '$lib/trades';

/**
 * An item the trade-sell plugin read in game (item-sdk's snapshot, version 1).
 * It arrives in the listing link's fragment, `#item=<base64url JSON>`, which the
 * browser never sends to a server.
 */
export interface GameItemPayload {
  v: number;
  code: string;
  classId: number;
  quality: number;
  qualityRecord: number;
  itemLevel: number;
  identified: boolean;
  ethereal: boolean;
  sockets: number;
  socketed: number;
  quantity: number;
  durability: number;
  maxDurability: number;
  prefixes: number[];
  suffixes: number[];
  itemSeed: number;
  generationSeed: number;
  container: string;
  /** How complete `stats` is: the full list, layer-zero stats only, or nothing. */
  statSource: 'list' | 'probe' | 'none';
  stats: Array<[number, number, number]>;
}

export const GAME_ITEM_VERSION = 1;

function base64UrlDecode(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** The game item in a location hash, or null when there is none or it cannot be read. */
export function decodeGameItemHash(hash: string): GameItemPayload | null {
  const encoded = new URLSearchParams(hash.replace(/^#/, '')).get('item');
  if (!encoded) return null;
  try {
    const value = JSON.parse(base64UrlDecode(encoded)) as Partial<GameItemPayload>;
    if (value?.v !== GAME_ITEM_VERSION || typeof value.code !== 'string' || !/^[A-Za-z0-9]{1,4}$/.test(value.code)) {
      return null;
    }
    const stats = Array.isArray(value.stats)
      ? value.stats.filter((stat): stat is [number, number, number] =>
          Array.isArray(stat) && stat.length === 3 && stat.every((part) => Number.isInteger(part)))
      : [];
    return {
      ...(value as GameItemPayload),
      prefixes: Array.isArray(value.prefixes) ? value.prefixes : [],
      suffixes: Array.isArray(value.suffixes) ? value.suffixes : [],
      statSource: value.statSource === 'list' || value.statSource === 'probe' ? value.statSource : 'none',
      stats
    };
  } catch {
    return null;
  }
}

export type GameItemMatch =
  | { source: 'character'; characterId: string; item: SaveItem }
  | { source: 'stash'; fileName: string; tabIndex: number; item: SaveItem };

function sameItem(item: SaveItem, game: GameItemPayload): boolean {
  // Which of the two seeds a save reports as `seed` is not pinned down, so
  // either counts; the code rules out a collision between different items.
  return item.codeText.toLowerCase() === game.code.toLowerCase()
    && (item.seed === game.itemSeed || item.seed === game.generationSeed);
}

function characterItems(entry: CharacterDetailsResponse): SaveItem[] {
  return [...(entry.save?.items.entries ?? []), ...(entry.save?.mercenaryItems?.entries ?? [])];
}

/**
 * The same item in the player's synced saves, if it is there. A save's copy is
 * preferred because it carries what the game does not report (runeword, socket
 * contents, set bonuses). Its absence is normal: the item may have been found
 * since the last save, or given away already.
 */
export function findGameItemInInventory(inventory: TradeInventory | null, game: GameItemPayload): GameItemMatch | null {
  if (!inventory) return null;
  for (const entry of inventory.characters) {
    const item = characterItems(entry).find((candidate) => sameItem(candidate, game));
    if (item) return { source: 'character', characterId: entry.character.id, item };
  }
  for (const stash of inventory.sharedStashes) {
    for (const tab of stash.tabs) {
      const item = tab.items.find((candidate) => sameItem(candidate, game));
      if (item) return { source: 'stash', fileName: stash.fileName, tabIndex: tab.index, item };
    }
  }
  return null;
}
