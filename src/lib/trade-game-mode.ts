/**
 * The game an item is in. Reign of the Warlock and Expansion characters cannot
 * join each other's games, so a listing from one is out of reach of the other.
 */
export type TradeGameMode = 'RotW' | 'Expansion';

export const tradeGameModes: { value: TradeGameMode; label: string }[] = [
  { value: 'RotW', label: 'Reign of the Warlock' },
  { value: 'Expansion', label: 'Expansion' }
];

export const tradeGameModeStorageKey = 'd2r_reimagined_trade_game_mode';

export function isTradeGameMode(value: unknown): value is TradeGameMode {
  return value === 'RotW' || value === 'Expansion';
}

/** The game mode the marketplace was last browsed in, or null for both. */
export function savedTradeGameMode(): TradeGameMode | null {
  try {
    const value = localStorage.getItem(tradeGameModeStorageKey);
    return isTradeGameMode(value) ? value : null;
  } catch {
    return null;
  }
}

export function saveTradeGameMode(mode: TradeGameMode | null): void {
  try {
    if (mode) localStorage.setItem(tradeGameModeStorageKey, mode);
    else localStorage.removeItem(tradeGameModeStorageKey);
  } catch { /* storage is optional */ }
}

/** The game gives the Reign of the Warlock shared stash a "Modern" prefix. */
export function stashGameMode(fileName: string): TradeGameMode | null {
  const name = fileName.toLowerCase();
  if (name.startsWith('modernsharedstash')) return 'RotW';
  if (name.startsWith('sharedstash')) return 'Expansion';
  return null;
}
