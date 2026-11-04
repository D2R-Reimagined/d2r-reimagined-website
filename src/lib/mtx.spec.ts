import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('#lib/auth.js', () => ({ apiRequest: vi.fn() }));
import { apiRequest } from '#lib/auth.js';
import { canTakeOff, equipMtx, fetchMtx, groupBySlot, mtxPreview, ownedCount, slotLabel, unlockedBySupport, type MtxItem } from './mtx';

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
    // Not an inherited object key.
    expect(mtxPreview('constructor')).toBeNull();
  });

  it('has a preview for every town portal', () => {
    for (const id of ['classic', 'green', 'violet', 'red', 'teal', 'ember']) {
      expect(mtxPreview(id)).toEqual({ animated: `/images/mtx/portal-${id}.webp`, still: `/images/mtx/portal-${id}-still.webp` });
    }
  });

  it('points only locked supporter portals at the support page', () => {
    for (const id of ['green', 'violet', 'red', 'teal']) {
      expect(unlockedBySupport({ id, owned: false })).toBe(true);
      expect(unlockedBySupport({ id, owned: true })).toBe(false);
    }
    // A membership unlocks none of these.
    for (const id of ['ember', 'pumpkin', 'pumpkin-lit', 'pumpkin-inferno', 'classic']) {
      expect(unlockedBySupport({ id, owned: false })).toBe(false);
    }
  });

  it('groups portals as their own slot, equipped from the loadout', () => {
    const items = [item('pumpkin'), item('classic', { slot: 'portal' }), item('green', { slot: 'portal', equipped: true })];
    const slots = groupBySlot({ items, loadout: { portal: 'green' } });
    expect(slots.map((slot) => slot.label)).toEqual(['Helmet', 'Town Portal']);
    expect(slots[0].equipped).toBeNull();
    expect(slots[1].equipped?.id).toBe('green');
  });

  it('never offers to take off the free default', () => {
    expect(canTakeOff({ id: 'classic' })).toBe(false);
    expect(canTakeOff({ id: 'green' })).toBe(true);
    expect(canTakeOff({ id: 'pumpkin' })).toBe(true);
  });

  it('counts owned items and labels unknown slots', () => {
    expect(ownedCount([item('a'), item('b', { owned: false })])).toBe(1);
    expect(slotLabel('helmet')).toBe('Helmet');
    expect(slotLabel('portal')).toBe('Town Portal');
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
