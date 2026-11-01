import { describe, expect, it } from 'vitest';
import { isTradeGameMode, stashGameMode } from '#lib/trade-game-mode.js';

describe('trade game mode', () => {
  it('reads the game from a shared stash file name', () => {
    expect(stashGameMode('ModernSharedStashSoftCoreV2.d2i')).toBe('RotW');
    expect(stashGameMode('ModernSharedStashHardCoreV2.d2i')).toBe('RotW');
    expect(stashGameMode('SharedStashSoftCoreV2.d2i')).toBe('Expansion');
    expect(stashGameMode('Borgir.d2s')).toBeNull();
  });

  it('accepts only the two modes', () => {
    expect(isTradeGameMode('RotW')).toBe(true);
    expect(isTradeGameMode('Expansion')).toBe(true);
    expect(isTradeGameMode('Classic')).toBe(false);
    expect(isTradeGameMode(null)).toBe(false);
  });
});
