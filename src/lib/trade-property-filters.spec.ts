import { describe, expect, it } from 'vitest';
import {
  activeTradePropertyCount,
  createTradePropertyGroup,
  invalidTradePropertyQuery,
  toTradePropertyFilterGroups
} from './trade-property-filters';

describe('trade property filters', () => {
  it('omits untouched rows and serializes selected stat ranges', () => {
    const group = createTradePropertyGroup('And');
    Object.assign(group.filters[0], {
      query: '#% Faster Cast Rate',
      stat: 'item_fastercastrate',
      minimumValue: '20',
      maximumValue: '40',
      valueShift: 0,
      valueFunction: 19
    });

    expect(toTradePropertyFilterGroups([group])).toEqual([{
      type: 'And',
      minimumCount: undefined,
      maximumCount: undefined,
      filters: [{
        stat: 'item_fastercastrate',
        minimumValue: 20,
        maximumValue: 40,
        valueShift: 0,
        valueFunction: 19
      }]
    }]);
    expect(activeTradePropertyCount([group])).toBe(1);
  });

  it('retains COUNT limits and detects typed but unselected properties', () => {
    const group = createTradePropertyGroup('Count');
    group.minimumCount = '2';
    group.maximumCount = '3';
    group.filters[0].query = 'resist';

    expect(invalidTradePropertyQuery([group])).toBe(true);
    expect(toTradePropertyFilterGroups([group])).toEqual([]);
  });
});
