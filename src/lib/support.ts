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
  checkoutEnabled: boolean;
  updatedAtUtc: string;
}

/**
 * The monthly server goals, owned by the website so changing them needs no API deploy.
 * The API's own `goals` list is ignored. Each amount is the running monthly cost.
 */
export const supportGoals: ReadonlyArray<Omit<SupportGoal, 'reached'>> = [
  { amount: 300, name: 'Keep Lights On', description: 'Servers continue to run' },
  { amount: 350, name: 'US East 1', description: 'Keeps our first US East game server online.' },
  { amount: 390, name: 'US East 2', description: 'A second US East server for peak hours.' },
  { amount: 430, name: 'US West 1 (LA)', description: 'Lower latency for West Coast players.' },
  { amount: 470, name: 'Frankfurt, Germany 1', description: 'A European server hosted in Warsaw.' },
  { amount: 560, name: 'South Korea', description: 'An Asia server hosted in South Korea.' },
  { amount: 620, name: 'Sydney, Australia', description: 'An Oceania server hosted in Sydney.' },
  { amount: 660, name: 'US Central 1 (TX)', description: 'First US Central Server' },
  { amount: 700, name: 'Frankfurt, Germany 2', description: 'Second Germany Server' },
  { amount: 765, name: 'São Paulo, Brazil', description: 'First South American Server' },
  { amount: 805, name: 'Frankfurt, Germany 3', description: 'Third Germany Server' },
  { amount: 845, name: 'Frankfurt, Germany 4', description: 'Fourth Germany Server' },
  { amount: 885, name: 'US West 2 (Utah)', description: 'Lower latency for West Coast players.' },
  { amount: 940, name: 'Singapore', description: 'First Singapore Server' }
];

/** The goals in amount order, each marked reached against this month's total. */
export function goalsFor(total: number, goals: ReadonlyArray<Omit<SupportGoal, 'reached'>> = supportGoals): SupportGoal[] {
  return [...goals].sort((a, b) => a.amount - b.amount).map((goal) => ({ ...goal, reached: total >= goal.amount }));
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
  /** The global chat badge buying this grants, or null/absent. */
  chatBadge?: string | null;
}

export interface ChatBadge {
  id: string;
  name: string;
  /** Transparent icon, 128 px tall (d2rl-plugins global-chat/tools/chat_badges/web_images.py). */
  icon: string;
}

/** The supporter chat badges, lowest to highest (ChatBadges in the API). */
export const chatBadges: ReadonlyArray<ChatBadge> = [
  { id: 'soldier', name: 'Harrowing Soldier', icon: '/images/badges/soldier.png' },
  { id: 'legionnaire', name: 'Harrowing Legionnaire', icon: '/images/badges/legionnaire.png' },
  { id: 'praetorian', name: 'Harrowing Praetorian', icon: '/images/badges/praetorian.png' }
];

/** The badge a product grants, or null when it grants none or one this site does not know. */
export function chatBadgeFor(product: Pick<SupportProduct, 'chatBadge'>): ChatBadge | null {
  return chatBadges.find((badge) => badge.id === product.chatBadge) ?? null;
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
