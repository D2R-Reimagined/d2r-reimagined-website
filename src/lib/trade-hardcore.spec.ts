import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  savedTradeHardcore,
  saveTradeHardcore,
  stashIsHardcore,
  tradeHardcoreLabel
} from '#lib/trade-hardcore.js';

function fakeStorage(): Storage {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
    removeItem: (key: string) => void values.delete(key)
  } as Storage;
}

describe('trade hardcore', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('reads the side from a shared stash file name', () => {
    expect(stashIsHardcore('ModernSharedStashHardCoreV2.d2i')).toBe(true);
    expect(stashIsHardcore('SharedStashHardCoreV2.d2i')).toBe(true);
    expect(stashIsHardcore('ModernSharedStashSoftCoreV2.d2i')).toBe(false);
    expect(stashIsHardcore('SharedStashSoftCoreV2.d2i')).toBe(false);
    expect(stashIsHardcore('Borgir.d2s')).toBeNull();
  });

  it('labels softcore apart from unknown', () => {
    expect(tradeHardcoreLabel(true)).toBe('Hardcore');
    expect(tradeHardcoreLabel(false)).toBe('Softcore');
    expect(tradeHardcoreLabel(null)).toBeNull();
    expect(tradeHardcoreLabel(undefined)).toBeNull();
  });

  it('remembers softcore, hardcore and both', () => {
    vi.stubGlobal('localStorage', fakeStorage());
    expect(savedTradeHardcore()).toBeNull();
    saveTradeHardcore(false);
    expect(savedTradeHardcore()).toBe(false);
    saveTradeHardcore(true);
    expect(savedTradeHardcore()).toBe(true);
    saveTradeHardcore(null);
    expect(savedTradeHardcore()).toBeNull();
  });

  it('treats unavailable storage as both', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('blocked'); },
      setItem: () => { throw new Error('blocked'); },
      removeItem: () => { throw new Error('blocked'); }
    });
    expect(savedTradeHardcore()).toBeNull();
    expect(() => saveTradeHardcore(true)).not.toThrow();
  });
});
