import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('#lib/auth.js', () => ({ apiRequest: vi.fn() }));
import { apiRequest } from '#lib/auth.js';
import { equipMtx, fetchMtx, groupBySlot, mtxPreview, ownedCount, slotLabel, type MtxItem } from './mtx';

beforeEach(() => vi.clearAllMocks());

function item(id: string, overrides: Partial<MtxItem> = {}): MtxItem {
  return { id, name: id, slot: 'helmet', unlock: 'Halloween ladder', owned: true, equipped: false, ...overrides };
}

describe('mtx catalog', () => {
  it('groups items by slot in catalog order with owned items first', () => {
    const items = [item('pumpkin', { owned: false }), item('pumpkin-lit'), item('wings', { slot: 'back' }), item('pumpkin-inferno')];
    const slots = groupBySlot({ items, loadout: {} });
    expect(slots.map((slot) => slot.slot)).toEqual(['helmet', 'back']);
    expect(slots[0].items.map((entry) => entry.id)).toEqual(['pumpkin-lit', 'pumpkin-inferno', 'pumpkin']);
    expect(slots[0].label).toBe('Helmet');
    expect(slots[1].label).toBe('Back');
  });

  it('reads the equipped item of each slot from the loadout', () => {
    const items = [item('pumpkin'), item('pumpkin-lit', { equipped: true })];
    expect(groupBySlot({ items, loadout: { helmet: 'pumpkin-lit' } })[0].equipped?.id).toBe('pumpkin-lit');
    expect(groupBySlot({ items, loadout: {} })[0].equipped).toBeNull();
    // A loadout entry the catalog no longer lists equips nothing.
    expect(groupBySlot({ items, loadout: { helmet: 'retired' } })[0].equipped).toBeNull();
  });

  it('finds preview renders only for items that have one', () => {
    expect(mtxPreview('pumpkin-lit')).toEqual({ animated: '/images/mtx/pumpkin-lit.webp', still: '/images/mtx/pumpkin-lit-still.webp' });
    expect(mtxPreview('wings')).toBeNull();
  });

  it('counts owned items and labels unknown slots', () => {
    expect(ownedCount([item('a'), item('b', { owned: false })])).toBe(1);
    expect(slotLabel('helmet')).toBe('Helmet');
    expect(slotLabel('cape')).toBe('Cape');
  });
});

describe('mtx API client', () => {
  it('reads the signed-in account uncached', async () => {
    await fetchMtx();
    expect(apiRequest).toHaveBeenCalledWith('/cosmetics/mtx/me', { cache: 'no-store' }, true);
  });

  it('equips one item per slot and sends null to take the slot off', async () => {
    await equipMtx('helmet', 'pumpkin-lit');
    expect(apiRequest).toHaveBeenCalledWith('/cosmetics/mtx/me/loadout', {
      method: 'POST', body: JSON.stringify({ slot: 'helmet', itemId: 'pumpkin-lit' })
    }, true);
    await equipMtx('helmet', null);
    expect(apiRequest).toHaveBeenLastCalledWith('/cosmetics/mtx/me/loadout', {
      method: 'POST', body: JSON.stringify({ slot: 'helmet', itemId: null })
    }, true);
  });
});
