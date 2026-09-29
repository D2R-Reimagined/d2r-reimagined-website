import { describe, expect, it } from 'vitest';
import type { SaveItem } from './characters';
import type { TradeInventory } from './trades';
import { decodeGameItemHash, findGameItemInInventory, type GameItemPayload } from './trade-game-item';

function encode(value: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const game: GameItemPayload = {
  v: 1,
  code: 'rin',
  classId: 522,
  quality: 7,
  qualityRecord: 122,
  itemLevel: 85,
  identified: true,
  ethereal: false,
  sockets: 0,
  socketed: 0,
  quantity: 1,
  durability: 0,
  maxDurability: 0,
  prefixes: [],
  suffixes: [],
  itemSeed: 3000000001,
  generationSeed: 42,
  container: 'inventory',
  statSource: 'list',
  stats: [[7, 0, 2560], [107, 54, 3]]
};

function saveItem(codeText: string, seed: number): SaveItem {
  return { codeText, seed } as SaveItem;
}

function inventory(characterItems: SaveItem[], stashItems: SaveItem[] = []): TradeInventory {
  return {
    ladderId: null,
    characters: [{
      character: { id: 'char-1' },
      save: { items: { entries: characterItems }, mercenaryItems: null }
    }],
    sharedStashes: [{ profile: 'reimagined', fileName: 'stash.d2i', itemFormat: 105, tabs: [{ index: 2, type: 'Shared', gold: 0, items: stashItems }] }]
  } as unknown as TradeInventory;
}

describe('game item links', () => {
  it('decodes the base64url fragment trade-sell writes', () => {
    const decoded = decodeGameItemHash(`#item=${encode(game)}`);
    expect(decoded?.code).toBe('rin');
    expect(decoded?.stats).toEqual([[7, 0, 2560], [107, 54, 3]]);
    expect(decoded?.statSource).toBe('list');
  });

  it('refuses a missing, unknown or malformed item', () => {
    expect(decodeGameItemHash('')).toBeNull();
    expect(decodeGameItemHash('#other=1')).toBeNull();
    expect(decodeGameItemHash('#item=%%%')).toBeNull();
    expect(decodeGameItemHash(`#item=${encode({ ...game, v: 2 })}`)).toBeNull();
    expect(decodeGameItemHash(`#item=${encode({ ...game, code: '../x' })}`)).toBeNull();
  });

  it('drops stat entries that are not integer triples and unknown stat sources', () => {
    const decoded = decodeGameItemHash(`#item=${encode({ ...game, statSource: 'x', stats: [[7, 0, 1], [1, 2], ['a', 0, 1]] })}`);
    expect(decoded?.stats).toEqual([[7, 0, 1]]);
    expect(decoded?.statSource).toBe('none');
  });
});

describe('matching a game item to synced saves', () => {
  it('finds it on a character by either seed and the code', () => {
    expect(findGameItemInInventory(inventory([saveItem('rin', 3000000001)]), game)).toMatchObject({ source: 'character', characterId: 'char-1' });
    expect(findGameItemInInventory(inventory([saveItem('RIN', 42)]), game)?.source).toBe('character');
  });

  it('finds it in a shared stash tab', () => {
    expect(findGameItemInInventory(inventory([], [saveItem('rin', 42)]), game)).toMatchObject({ source: 'stash', fileName: 'stash.d2i', tabIndex: 2 });
  });

  it('needs the code to agree, and is fine with no match at all', () => {
    expect(findGameItemInInventory(inventory([saveItem('amu', 3000000001)]), game)).toBeNull();
    expect(findGameItemInInventory(null, game)).toBeNull();
  });
});
