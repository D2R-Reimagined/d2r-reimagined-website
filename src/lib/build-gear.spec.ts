import { describe, it, expect } from 'vitest';
import { emptyGear, gearErrors } from './build-gear';

describe('Manual gear', () => {
  it('allows multiple inventory entries but not duplicate equipment slots', () => {
    const helm = { ...emptyGear('head'), name: 'Rare circlet' };
    expect(gearErrors([helm, { ...helm }]).join()).toContain('one item per equipment slot');
    const charm = { ...emptyGear('inventory'), name: 'Life charm', quantity: 10 };
    expect(gearErrors([charm, { ...charm }])).toEqual([]);
  });
  it('requires valid quantities and names or catalog references', () => {
    expect(gearErrors([emptyGear('head')]).join()).toContain('name your custom gear');
    for (const quantity of [0, 41, 1.5, NaN]) {
      expect(gearErrors([{ ...emptyGear('inventory'), name: 'Charm', quantity }]).join()).toContain('quantity');
    }
    expect(gearErrors([{ ...emptyGear('head'), name: 'Helm', quantity: 2 }]).join()).toContain('quantity');
  });
});
