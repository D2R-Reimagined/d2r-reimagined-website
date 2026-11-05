import type { AdminUser } from '#lib/admin.js';
import { apiRequest } from '#lib/auth.js';
import { supporterTierName } from '#lib/mtx.js';

// One account's admin page: its cosmetics access and what it paid for.

export interface SupporterPack {
  id: string;
  name: string;
  isActive: boolean;
  portalIds: string[];
}

export interface UserPortalAccess {
  /** Individual rewards an admin granted. */
  portalIds: string[];
  /** Packs an admin assigned. */
  packIds: string[];
  /** Packs owned through a Stripe purchase; these follow the purchase and are not editable. */
  purchasedPackIds: string[];
  supporterTier: string | null;
  effective: { selectedPortalId: string; portals: { id: string; name: string; unlocked: boolean }[] };
}

export interface UserPurchase {
  id: string;
  kind: string;
  status: string;
  productName: string;
  amount: number;
  currency: string;
  purchasedAtUtc: string;
  currentPeriodEndUtc: string | null;
  cancelAtPeriodEnd: boolean;
  grantingReward: boolean;
  reward: { name: string } | null;
}

export interface PortalAccessRow {
  id: string;
  name: string;
  unlocked: boolean;
  /** Why it is unlocked; empty when locked. */
  sources: string[];
}

const entitlements = '/admin/portal-entitlements';

export function getAdminUser(id: string): Promise<AdminUser> {
  return apiRequest<AdminUser>(`/admin/users/${id}`, { cache: 'no-store' }, true);
}

export function refreshUserDiscordRoles(id: string): Promise<AdminUser> {
  return apiRequest<AdminUser>(`/admin/users/${id}/discord-roles/refresh`, { method: 'POST' }, true);
}

export function getUserPortalAccess(id: string): Promise<UserPortalAccess> {
  return apiRequest<UserPortalAccess>(`${entitlements}/users/${id}`, { cache: 'no-store' }, true);
}

export function saveUserPortalAccess(id: string, portalIds: string[], packIds: string[]): Promise<UserPortalAccess> {
  return apiRequest<UserPortalAccess>(
    `${entitlements}/users/${id}`,
    { method: 'PUT', body: JSON.stringify({ portalIds, packIds }) },
    true
  );
}

export function getSupporterPacks(): Promise<SupporterPack[]> {
  return apiRequest<SupporterPack[]>(`${entitlements}/packs`, {}, true);
}

export async function getUserPurchases(id: string): Promise<UserPurchase[]> {
  const response = await apiRequest<{ purchases: UserPurchase[] }>(`/admin/support/users/${id}/purchases`, { cache: 'no-store' }, true);
  return response.purchases;
}

/**
 * Every portal with what unlocks it. The tier ladder lives in the API, so a tier is named only
 * for a portal nothing else explains: it may also be covering one a grant or pack names.
 */
export function portalAccessRows(access: UserPortalAccess, packs: SupporterPack[]): PortalAccessRow[] {
  const owned = (ids: string[], label: string) => packs
    .filter((pack) => pack.isActive && ids.includes(pack.id))
    .map((pack) => ({ label: `${label}: ${pack.name}`, portalIds: pack.portalIds }));
  const grants = [...owned(access.packIds, 'Pack'), ...owned(access.purchasedPackIds, 'Purchased pack')];

  return access.effective.portals.map(({ id, name, unlocked }) => {
    if (!unlocked) return { id, name, unlocked, sources: [] };
    if (id === 'classic') return { id, name, unlocked, sources: ['Free for everyone'] };
    const sources = [
      ...(access.portalIds.includes(id) ? ['Individual reward'] : []),
      ...grants.filter((grant) => grant.portalIds.includes(id)).map((grant) => grant.label)
    ];
    if (sources.length === 0) {
      sources.push(access.supporterTier ? `Supporter tier: ${supporterTierName(access.supporterTier)}` : 'Server configuration');
    }
    return { id, name, unlocked, sources };
  });
}

/** Explains a paying account that the stored Discord tier does not reflect, or null when nothing looks off. */
export function supporterGap(user: Pick<AdminUser, 'discordId' | 'discordSupporterTier'>, purchases: UserPurchase[]): string | null {
  const paying = purchases.filter((purchase) => purchase.grantingReward).map((purchase) => purchase.productName);
  if (paying.length === 0) return null;
  const products = [...new Set(paying)].join(', ');
  if (!user.discordId) {
    return `Has an active purchase (${products}) but no linked Discord account. Portal tiers come from Discord roles, so tier portals stay locked until they link. An individual reward below unlocks a portal without it.`;
  }
  if (!user.discordSupporterTier) {
    return `Has an active purchase (${products}) but no supporter tier. They may not be in the Discord server. Try Refresh Discord roles; an individual reward below unlocks a portal without it.`;
  }
  return null;
}
