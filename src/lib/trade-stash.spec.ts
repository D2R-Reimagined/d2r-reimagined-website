import { describe, expect, it } from 'vitest';
import type { SaveItem } from './characters';
import type { ItemPresentation } from './item-presentation';
import type { SharedStash, SharedStashTab } from './trades';
import {
  MIN_CURRENCY_STASH_ROWS,
  STASH_COLUMNS,
  STASH_ROWS,
  isSameSaveItem,
  layoutStashItems,
  stashTabItems,
  stashTabLabel,
  visibleStashTabs
} from './trade-stash';

function makeItem(overrides: Partial<SaveItem> & { x?: number; y?: number } = {}): SaveItem {
  const { x = 0, y = 0, ...rest } = overrides;
  return {
    version: 105,
    code: 0,
    codeText: 'rin',
    baseName: 'Ring',
    qualityId: 7,
    quality: 'Unique',
    itemLevel: 85,
    seed: 12345,
    flags: { value: 0, names: ['Identified'] },
    position: {
      modeId: 0,
      mode: 'Stored',
      isOnGround: false,
      bodyLocationId: 0,
      bodyLocation: 'None',
      inventoryX: x,
      inventoryY: y,
      storePageId: 5,
      storePage: 'Stash'
    },
    qualityData: null,
    runewordId: null,
    personalizedName: '',
    defense: null,
    maximumDurability: null,
    durability: null,
    quantity: null,
    setItemMask: null,
    stats: [],
    setBonusStats: [],
    runewordStats: null,
    sockets: [],
    advancedStashStackSize: null,
    ...rest
  };
}

describe('trade-stash helpers', () => {
  it('uses the 16x13 Reimagined shared stash grid and preserves edge items without clipping', () => {
    const presentations = new Map<string, ItemPresentation>([
      ['rin', { Width: 1, Height: 1 } as ItemPresentation],
      ['tow', { Width: 2, Height: 3 } as ItemPresentation]
    ]);
    const topRight = makeItem({ codeText: 'rin', seed: 1, x: 15, y: 0 });
    const bottomRight = makeItem({ codeText: 'tow', seed: 2, x: 14, y: 10 });

    const layout = layoutStashItems([topRight, bottomRight], presentations, 'Normal');
    expect(layout.columns).toBe(STASH_COLUMNS);
    expect(layout.rows).toBe(STASH_ROWS);
    expect(layout.entries[0]).toMatchObject({ x: 15, y: 0, width: 1, height: 1 });
    expect(layout.entries[1]).toMatchObject({ x: 14, y: 10, width: 2, height: 3 });
  });

  it('produces unique keys and exact single-item selection for compact seed === 0 items', () => {
    const firstRune = makeItem({ codeText: 'r30', seed: 0, x: 2, y: 4 });
    const secondRune = makeItem({ codeText: 'r30', seed: 0, x: 3, y: 4 });
    const layout = layoutStashItems([firstRune, secondRune], new Map(), 'Normal');

    expect(layout.entries[0].key).not.toBe(layout.entries[1].key);

    const clonedSelection = structuredClone(firstRune);
    expect(isSameSaveItem(clonedSelection, firstRune)).toBe(true);
    expect(isSameSaveItem(clonedSelection, secondRune)).toBe(false);
    expect(isSameSaveItem(null, firstRune, 0)).toBe(false);
  });

  it('hides Chronicle tabs and lays out AdvancedStash currency stacks sequentially while skipping empty slots', () => {
    const normalTab: SharedStashTab = {
      index: 0,
      type: 'Normal',
      gold: 0,
      items: [makeItem({ seed: 10, x: 12, y: 11 })]
    };
    const currencyTab: SharedStashTab = {
      index: 9,
      type: 'AdvancedStash',
      gold: 0,
      items: [
        makeItem({ codeText: 'r01', seed: 0, x: 4, y: 0, advancedStashStackSize: 4 }),
        makeItem({ codeText: 'r02', seed: 0, x: 0, y: 0, advancedStashStackSize: 0 }),
        makeItem({ codeText: 'gmr', seed: 0, x: 4, y: 0, advancedStashStackSize: 4 })
      ]
    };
    const chronicleTab: SharedStashTab = {
      index: 10,
      type: 'Chronicle',
      gold: 0,
      items: []
    };
    const stash: SharedStash = {
      profile: 'reimagined',
      fileName: 'ModernSharedStashSoftCoreV2.d2i',
      itemFormat: 2,
      tabs: [normalTab, currencyTab, chronicleTab]
    };

    const tabs = visibleStashTabs(stash);
    expect(tabs.map((tab) => tab.index)).toEqual([0, 9]);
    expect(stashTabLabel(normalTab, tabs)).toBe('Tab 1 · 1 item');
    expect(stashTabLabel(currencyTab, tabs)).toBe('Currency · 2 items');
    const postCurrencyNormal: SharedStashTab = { index: 11, type: 'Normal', gold: 0, items: [] };
    expect(stashTabLabel(postCurrencyNormal, [normalTab, currencyTab, postCurrencyNormal])).toBe('Tab 2 · 0 items');

    // Editing advancedStashStackSize on a cloned Currency item keeps selection active
    const editedCurrency = { ...structuredClone(currencyTab.items[0]), advancedStashStackSize: 1 };
    expect(isSameSaveItem(editedCurrency, currencyTab.items[0])).toBe(true);
    expect(isSameSaveItem(editedCurrency, currencyTab.items[2])).toBe(false);
    expect(stashTabItems(currencyTab)).toHaveLength(2);

    const currencyLayout = layoutStashItems(currencyTab.items, new Map(), currencyTab.type);
    expect(currencyLayout.columns).toBe(STASH_COLUMNS);
    expect(currencyLayout.rows).toBe(MIN_CURRENCY_STASH_ROWS);
    expect(currencyLayout.entries).toHaveLength(2);
    expect(currencyLayout.entries[0]).toMatchObject({ x: 0, y: 0, width: 1, height: 1 });
    expect(currencyLayout.entries[1]).toMatchObject({ x: 1, y: 0, width: 1, height: 1 });
  });
});
