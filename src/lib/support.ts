export const discordInviteUrl = 'https://discord.gg/ZvQD4MARxz';

export interface SupportSource {
  key: 'discord' | 'patreon' | 'stripe' | string;
  label: string;
  amount: number;
  live: boolean;
}

export interface SupportGoal {
  amount: number;
  name: string;
  description: string | null;
  reached: boolean;
}

export interface SupportSummary {
  currency: string;
  periodStartUtc: string;
  periodEndUtc: string;
  monthlyTotal: number;
  sources: SupportSource[];
  goals: SupportGoal[];
  checkoutEnabled: boolean;
  updatedAtUtc: string;
}

export interface SupportProduct {
  productId: string;
  priceId: string;
  name: string;
  description: string | null;
  features: string[];
  imageUrl: string | null;
  amount: number;
  currency: string;
  /** Billing interval for memberships; null for one-time purchases. */
  interval: string | null;
  intervalCount: number;
}

export interface SupportProducts {
  recurring: SupportProduct[];
  oneTime: SupportProduct[];
  checkoutEnabled: boolean;
  customerPortalUrl: string | null;
}

export interface SupportPurchase {
  id: string;
  kind: 'one_time' | 'subscription';
  status: string;
  productId: string;
  productName: string;
  amount: number;
  currency: string;
  purchasedAtUtc: string;
  currentPeriodEndUtc: string | null;
  cancelAtPeriodEnd: boolean;
  active: boolean;
}

/** The label to show for a funding source; Patreon totals are shown as "Other Sources". */
export function sourceLabel(source: Pick<SupportSource, 'key' | 'label'>): string {
  return source.key === 'patreon' ? 'Other Sources' : source.label;
}

export function formatMoney(amount: number, currency = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/** "/ month", "/ 3 months", "/ year" — empty for one-time products. */
export function billingPeriod(product: Pick<SupportProduct, 'interval' | 'intervalCount'>): string {
  if (!product.interval) return '';
  return product.intervalCount > 1 ? `/ ${product.intervalCount} ${product.interval}s` : `/ ${product.interval}`;
}

/**
 * The perks to list on a product card: Stripe's marketing features when set, otherwise a
 * description written as "perk -- perk -- perk". Returns the leftover description, if any.
 */
export function productHighlights(product: Pick<SupportProduct, 'features' | 'description'>): { perks: string[]; description: string | null } {
  if (product.features.length) return { perks: product.features, description: product.description };
  const parts = (product.description ?? '').split(/\s+--\s+/).map((part) => part.trim()).filter(Boolean);
  return parts.length > 1 ? { perks: parts, description: null } : { perks: [], description: product.description };
}

/** Share of the largest goal reached, 0–100. */
export function progressPercent(total: number, goals: SupportGoal[]): number {
  const top = Math.max(0, ...goals.map((goal) => goal.amount));
  if (top <= 0) return 0;
  return Math.min(100, Math.max(0, (total / top) * 100));
}

/** Where a goal sits along the progress bar, 0–100. */
export function goalPosition(goal: SupportGoal, goals: SupportGoal[]): number {
  const top = Math.max(0, ...goals.map((entry) => entry.amount));
  return top > 0 ? (goal.amount / top) * 100 : 0;
}

export function nextGoal(total: number, goals: SupportGoal[]): SupportGoal | null {
  return [...goals].sort((a, b) => a.amount - b.amount).find((goal) => goal.amount > total) ?? null;
}

/** The account's membership still in good standing, if any. */
export function activeMembership(purchases: SupportPurchase[]): SupportPurchase | null {
  return purchases.find((purchase) => purchase.kind === 'subscription' && purchase.active) ?? null;
}

export function purchaseStatusLabel(purchase: SupportPurchase): string {
  if (purchase.kind === 'one_time') return purchase.status === 'refunded' ? 'Refunded' : 'Purchased';
  if (purchase.status === 'past_due') return 'Payment due';
  if (purchase.active) return purchase.cancelAtPeriodEnd ? 'Ends at period end' : 'Active';
  return purchase.status === 'canceled' ? 'Canceled' : 'Inactive';
}

export function formatDate(utc: string | null): string {
  if (!utc) return '';
  const date = new Date(utc);
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(date);
}

export function monthLabel(periodStartUtc: string): string {
  const date = new Date(periodStartUtc);
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}
