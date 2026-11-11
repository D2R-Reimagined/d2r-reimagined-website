import { apiRequest } from '#lib/auth.js';

/** A store product an admin can map to a supporter pack (`GET /admin/support/rewards`). */
export interface SupportRewardProduct {
  productId: string;
  productName: string;
  /** `subscription`, `one_time`, or null for a mapped product that is neither on sale nor bought. */
  kind: string | null;
  /** Listed on the support page right now. */
  onSale: boolean;
  /** Accounts whose purchase of this product grants its pack now. */
  currentOwners: number;
  reward: { supporterPackId: string; name: string; isActive: boolean } | null;
  rewardUpdatedAtUtc: string | null;
}

export function rewardKindLabel(kind: string | null): string {
  if (kind === 'subscription') return 'Membership';
  if (kind === 'one_time') return 'One-time';
  return 'Retired';
}

/**
 * What saving `packId` for `product` would do: the question to confirm and the notice once
 * saved. Null when it changes nothing.
 */
export function rewardChangeSummary(product: SupportRewardProduct, packId: string, packName: string | null): { confirm: string; done: string } | null {
  const current = product.reward?.supporterPackId ?? '';
  if (packId === current) return null;
  const owners = product.currentOwners === 1 ? '1 current buyer' : `${product.currentOwners} current buyers`;
  if (!packId) {
    const pack = product.reward?.name ?? 'its pack';
    return {
      confirm: `${product.productName} will stop granting ${pack}, and its ${owners} ${product.currentOwners === 1 ? 'loses' : 'lose'} it. Continue?`,
      done: `${product.productName} no longer grants ${pack}.`
    };
  }
  const pack = packName ?? 'the pack';
  return {
    confirm: `${product.productName} will grant ${pack} to its ${owners} and every future buyer. Continue?`,
    done: `${product.productName} now grants ${pack}.`
  };
}

export function fetchSupportRewards(): Promise<SupportRewardProduct[]> {
  return apiRequest<SupportRewardProduct[]>('/admin/support/rewards', { cache: 'no-store' }, true);
}

/** Maps the product to a pack, or removes its mapping when `packId` is empty. */
export async function saveSupportReward(productId: string, packId: string): Promise<void> {
  const path = `/admin/support/rewards/${encodeURIComponent(productId)}`;
  if (packId) {
    await apiRequest(path, { method: 'PUT', body: JSON.stringify({ supporterPackId: packId }) }, true);
  } else {
    await apiRequest(path, { method: 'DELETE' }, true);
  }
}
