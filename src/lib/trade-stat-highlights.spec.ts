import { describe, expect, it } from 'vitest';

import { lineMatchesHighlights, tradeStatHighlights } from './trade-stat-highlights.js';

describe('trade stat highlights', () => {
  const highlights = tradeStatHighlights([
    { type: 'And', filters: [{ stat: 'item_fastercastrate', valueShift: 0 }, { stat: 'item_singleskill', layer: 149, valueShift: 0 }] },
    { type: 'Count', filters: [{ stat: 'fireresist', valueShift: 0 }] }
  ]);

  it('collects every filtered stat, keeping the layer when one was chosen', () => {
    expect([...highlights].sort()).toEqual(['fireresist', 'item_fastercastrate', 'item_singleskill:149']);
  });

  it('matches a line by any of its source stats, and a layered filter only on that layer', () => {
    expect(lineMatchesHighlights({ fallback: '', sources: [{ name: 'item_fastercastrate', layer: 0 }] }, highlights)).toBe(true);
    expect(lineMatchesHighlights({ fallback: '', sources: [{ name: 'firemindam', layer: 0 }, { name: 'fireresist', layer: 0 }] }, highlights)).toBe(true);
    expect(lineMatchesHighlights({ fallback: '', sources: [{ name: 'item_singleskill', layer: 149 }] }, highlights)).toBe(true);
    expect(lineMatchesHighlights({ fallback: '', sources: [{ name: 'item_singleskill', layer: 150 }] }, highlights)).toBe(false);
    expect(lineMatchesHighlights({ fallback: '' }, highlights)).toBe(false);
    expect(lineMatchesHighlights({ fallback: '', sources: [{ name: 'fireresist', layer: 0 }] }, new Set())).toBe(false);
  });
});
