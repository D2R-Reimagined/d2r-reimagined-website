import { describe, expect, it } from 'vitest';
import { dropIndex, isMove, reorderTarget } from './reorder';

describe('reorder geometry', () => {
  const mids = [10, 30, 50];
  it('finds the gap under the pointer', () => {
    expect(dropIndex(mids, 0)).toBe(0);
    expect(dropIndex(mids, 20)).toBe(1);
    expect(dropIndex(mids, 50)).toBe(2);
    expect(dropIndex(mids, 99)).toBe(3);
    expect(dropIndex([], 5)).toBe(0);
  });
  it('maps a gap to the final index and detects no-op drops', () => {
    expect(reorderTarget(0, 3)).toBe(2);
    expect(reorderTarget(2, 0)).toBe(0);
    expect(isMove(1, 1)).toBe(false);
    expect(isMove(1, 2)).toBe(false);
    expect(isMove(1, 3)).toBe(true);
  });
});
