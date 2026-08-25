import { describe, expect, it } from 'vitest';
import type { SaveItem } from '$lib/characters';
import { buildRunewordNameMap, runewordNameKey } from './runeword-presentation';

function socket(codeText: string): SaveItem {
  return { codeText } as SaveItem;
}

describe('runeword presentation', () => {
  it('resolves an ordered modded rune recipe to its name key', () => {
    const names = buildRunewordNameMap([
      { Index: 'Snowdrop', Runes: [{ NameKey: 'r03' }, { NameKey: 'r10' }] }
    ]);
    const item = {
      runewordId: 53506,
      sockets: [socket('r03'), socket('r10')]
    } as SaveItem;

    expect(runewordNameKey(item, names)).toBe('Snowdrop');
  });

  it('does not mistake a different rune order for the same runeword', () => {
    const names = buildRunewordNameMap([
      { Index: 'Snowdrop', Runes: [{ NameKey: 'r03' }, { NameKey: 'r10' }] }
    ]);
    const item = {
      runewordId: 53506,
      sockets: [socket('r10'), socket('r03')]
    } as SaveItem;

    expect(runewordNameKey(item, names)).toBeUndefined();
  });
});
