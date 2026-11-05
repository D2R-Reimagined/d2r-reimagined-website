/**
 * Which side of the game an item is on. Softcore and hardcore characters cannot
 * join each other's games, so a listing from one is out of reach of the other.
 */
export const tradeHardcoreOptions: { value: boolean; label: string }[] = [
  { value: false, label: 'Softcore' },
  { value: true, label: 'Hardcore' }
];

export const tradeHardcoreStorageKey = 'd2r_reimagined_trade_hardcore';

export function tradeHardcoreLabel(isHardcore: boolean | null | undefined): string | null {
  return tradeHardcoreOptions.find((option) => option.value === isHardcore)?.label ?? null;
}

/** The side the marketplace was last browsed in, or null for both. */
export function savedTradeHardcore(): boolean | null {
  try {
    const value = localStorage.getItem(tradeHardcoreStorageKey);
    return value === 'true' ? true : value === 'false' ? false : null;
  } catch {
    return null;
  }
}

export function saveTradeHardcore(isHardcore: boolean | null): void {
  try {
    if (isHardcore === null) localStorage.removeItem(tradeHardcoreStorageKey);
    else localStorage.setItem(tradeHardcoreStorageKey, String(isHardcore));
  } catch { /* storage is optional */ }
}

/** The game names each shared stash file after its side. */
export function stashIsHardcore(fileName: string): boolean | null {
  const name = fileName.toLowerCase();
  if (name.includes('hardcore')) return true;
  if (name.includes('softcore')) return false;
  return null;
}
