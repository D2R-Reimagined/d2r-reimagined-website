import { describe, expect, it } from 'vitest';
import { formatMoney, goalPosition, monthLabel, nextGoal, parseDonationAmount, progressPercent, type SupportGoal } from './support';

const goals: SupportGoal[] = [
  { amount: 90, name: 'US East 2', description: null, reached: false },
  { amount: 50, name: 'US East 1', description: null, reached: true },
  { amount: 250, name: 'Sydney', description: null, reached: false }
];

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

describe('support formatting', () => {
  it('omits cents for whole amounts', () => {
    expect(formatMoney(50)).toBe('$50');
    expect(formatMoney(42.5)).toBe('$42.50');
  });

  it('labels the UTC month', () => {
    expect(monthLabel('2026-10-01T00:00:00Z')).toBe('October 2026');
  });

  it('accepts whole amounts inside the allowed range only', () => {
    expect(parseDonationAmount(' $25 ', 1, 1000)).toBe(25);
    expect(parseDonationAmount('2.50', 1, 1000)).toBeNull();
    expect(parseDonationAmount('0', 1, 1000)).toBeNull();
    expect(parseDonationAmount('5000', 1, 1000)).toBeNull();
    expect(parseDonationAmount('', 1, 1000)).toBeNull();
  });
});
