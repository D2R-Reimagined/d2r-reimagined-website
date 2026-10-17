import { describe, expect, it } from 'vitest';
import {
  activeMembership,
  billingPeriod,
  formatDate,
  formatMoney,
  goalPosition,
  monthLabel,
  nextGoal,
  productHighlights,
  progressPercent,
  purchaseStatusLabel,
  type SupportGoal,
  type SupportPurchase
} from './support';

const goals: SupportGoal[] = [
  { amount: 90, name: 'US East 2', description: null, reached: false },
  { amount: 50, name: 'US East 1', description: null, reached: true },
  { amount: 250, name: 'Sydney', description: null, reached: false }
];

function purchase(overrides: Partial<SupportPurchase>): SupportPurchase {
  return {
    id: '1', kind: 'subscription', status: 'active', productId: 'prod', productName: 'Pro Supporter',
    amount: 6.99, currency: 'usd', purchasedAtUtc: '2026-10-01T00:00:00Z', currentPeriodEndUtc: null,
    cancelAtPeriodEnd: false, active: true, ...overrides
  };
}

describe('support goals', () => {
  it('measures progress against the largest goal and clamps it', () => {
    expect(progressPercent(125, goals)).toBe(50);
    expect(progressPercent(400, goals)).toBe(100);
    expect(progressPercent(10, [])).toBe(0);
  });

  it('places goals along the bar', () => {
    expect(goalPosition(goals[1], goals)).toBe(20);
  });

  it('finds the next unreached goal in amount order', () => {
    expect(nextGoal(60, goals)?.name).toBe('US East 2');
    expect(nextGoal(50, goals)?.name).toBe('US East 2');
    expect(nextGoal(300, goals)).toBeNull();
  });
});

describe('support products and purchases', () => {
  it('describes billing periods', () => {
    expect(billingPeriod({ interval: 'month', intervalCount: 1 })).toBe('/ month');
    expect(billingPeriod({ interval: 'month', intervalCount: 3 })).toBe('/ 3 months');
    expect(billingPeriod({ interval: null, intervalCount: 1 })).toBe('');
  });

  it('lists perks from features, or from a "--" separated description', () => {
    expect(productHighlights({ features: ['Role'], description: 'Text' })).toEqual({ perks: ['Role'], description: 'Text' });
    expect(productHighlights({ features: [], description: 'A role -- Purple Portal -- Early info' }))
      .toEqual({ perks: ['A role', 'Purple Portal', 'Early info'], description: null });
    expect(productHighlights({ features: [], description: 'Just text' })).toEqual({ perks: [], description: 'Just text' });
  });

  it('finds the active membership only', () => {
    expect(activeMembership([purchase({ kind: 'one_time', status: 'paid' }), purchase({ active: false, status: 'canceled' })])).toBeNull();
    expect(activeMembership([purchase({ id: '2' })])?.id).toBe('2');
  });

  it('labels purchase states', () => {
    expect(purchaseStatusLabel(purchase({}))).toBe('Active');
    expect(purchaseStatusLabel(purchase({ cancelAtPeriodEnd: true }))).toBe('Ends at period end');
    expect(purchaseStatusLabel(purchase({ status: 'past_due' }))).toBe('Payment due');
    expect(purchaseStatusLabel(purchase({ status: 'canceled', active: false }))).toBe('Canceled');
    expect(purchaseStatusLabel(purchase({ kind: 'one_time', status: 'refunded', active: false }))).toBe('Refunded');
  });
});

describe('support formatting', () => {
  it('omits cents for whole amounts', () => {
    expect(formatMoney(50)).toBe('$50');
    expect(formatMoney(6.99)).toBe('$6.99');
  });

  it('labels UTC dates', () => {
    expect(monthLabel('2026-10-01T00:00:00Z')).toBe('October 2026');
    expect(formatDate('2026-11-17T12:00:00Z')).toBe('Nov 17, 2026');
    expect(formatDate(null)).toBe('');
  });
});
