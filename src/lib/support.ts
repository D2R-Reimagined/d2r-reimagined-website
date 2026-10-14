export const patreonUrl = 'https://www.patreon.com/c/scottieknows_mods';
export const discordInviteUrl = 'https://discord.gg/ZvQD4MARxz';
export const donationPresets = [5, 10, 25, 50] as const;

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
  minimumAmount: number;
  maximumAmount: number;
  updatedAtUtc: string;
}

export function formatMoney(amount: number, currency = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2
  }).format(amount);
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

/** Whole amount the donor typed, or null when it is empty or out of range. */
export function parseDonationAmount(value: string, minimum: number, maximum: number): number | null {
  const trimmed = value.trim().replace(/^\$/, '');
  if (!/^\d+$/.test(trimmed)) return null;
  const amount = Number.parseInt(trimmed, 10);
  return amount >= minimum && amount <= maximum ? amount : null;
}

export function monthLabel(periodStartUtc: string): string {
  const date = new Date(periodStartUtc);
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}
