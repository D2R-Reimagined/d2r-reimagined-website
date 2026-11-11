import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('#lib/auth.js', () => ({ apiRequest: vi.fn() }));
import { apiRequest } from '#lib/auth.js';
import { fetchSupportRewards, rewardChangeSummary, rewardKindLabel, saveSupportReward, type SupportRewardProduct } from './admin-support';

beforeEach(() => vi.clearAllMocks());

function product(overrides: Partial<SupportRewardProduct> = {}): SupportRewardProduct {
  return {
    productId: 'prod_soldier', productName: 'Harrowing Soldier', kind: 'one_time', onSale: true, currentOwners: 3,
    reward: null, rewardUpdatedAtUtc: null, ...overrides
  };
}

describe('store product rewards', () => {
  it('labels product kinds', () => {
    expect(rewardKindLabel('subscription')).toBe('Membership');
    expect(rewardKindLabel('one_time')).toBe('One-time');
    expect(rewardKindLabel(null)).toBe('Retired');
  });

  it('summarizes mapping, remapping and unmapping, and nothing for no change', () => {
    const unmapped = product();
    expect(rewardChangeSummary(unmapped, '', null)).toBeNull();
    expect(rewardChangeSummary(unmapped, 'pack-1', 'Harrowing Soldier')).toEqual({
      confirm: 'Harrowing Soldier will grant Harrowing Soldier to its 3 current buyers and every future buyer. Continue?',
      done: 'Harrowing Soldier now grants Harrowing Soldier.'
    });
    const mapped = product({ currentOwners: 1, reward: { supporterPackId: 'pack-1', name: 'Harrowing Soldier', isActive: true } });
    expect(rewardChangeSummary(mapped, 'pack-1', 'Harrowing Soldier')).toBeNull();
    expect(rewardChangeSummary(mapped, '', null)?.confirm).toBe('Harrowing Soldier will stop granting Harrowing Soldier, and its 1 current buyer loses it. Continue?');
    expect(rewardChangeSummary(mapped, '', null)?.done).toBe('Harrowing Soldier no longer grants Harrowing Soldier.');
  });

  it('reads uncached, maps with PUT and unmaps with DELETE', async () => {
    vi.mocked(apiRequest).mockResolvedValue([]);
    await fetchSupportRewards();
    expect(apiRequest).toHaveBeenCalledWith('/admin/support/rewards', { cache: 'no-store' }, true);

    await saveSupportReward('prod_a/b', 'pack-1');
    expect(apiRequest).toHaveBeenLastCalledWith('/admin/support/rewards/prod_a%2Fb', { method: 'PUT', body: JSON.stringify({ supporterPackId: 'pack-1' }) }, true);
    await saveSupportReward('prod_a', '');
    expect(apiRequest).toHaveBeenLastCalledWith('/admin/support/rewards/prod_a', { method: 'DELETE' }, true);
  });
});
