import { describe, expect, it } from 'vitest';

import {
  affixMatchesProperty,
  baseHasSockets,
  baseTier,
  matchesSearch,
  matchesItemType,
  passesHandFilter,
  sortByWeaponDamage,
  sortModifierLines,
  tokenizeSearch
} from './catalog-controls';
import type { CatalogItem, KeyedLine } from './types';

describe('catalog search', () => {
  it('supports legacy AND, OR, and exclusion syntax', () => {
    const query = tokenizeSearch('fire + damage -cold | lightning');
    expect(matchesSearch('fire damage increased', query)).toBe(true);
    expect(matchesSearch('fire cold damage', query)).toBe(false);
    expect(matchesSearch('lightning resistance', query)).toBe(true);
  });
});

describe('base filters', () => {
  const base: CatalogItem = {
    NameKey: '7gi', NormCode: 'gix', UberCode: '9gi', UltraCode: '7gi',
    GemSockets: '(1-25): 4 - (26-40): 5 - (41+): 6'
  };

  it('derives tiers from the base family codes', () => expect(baseTier(base)).toBe('Elite'));
  it('matches every socket count offered by an item-level range', () => {
    expect(baseHasSockets(base, 4)).toBe(true);
    expect(baseHasSockets(base, 6)).toBe(true);
    expect(baseHasSockets(base, 3)).toBe(false);
  });
});

describe('item type filtering', () => {
  it('matches descendants for broad types unless Exact is enabled', () => {
    expect(matchesItemType(['sworitype'], 'weapitype', false)).toBe(true);
    expect(matchesItemType(['sworitype'], 'weapitype', true)).toBe(false);
    expect(matchesItemType(['weapitype'], 'weapitype', true)).toBe(true);
  });
});

describe('affix and modifier behavior', () => {
  it('maps legacy affix groups to property categories', () => {
    expect(affixMatchesProperty({ Group: 111 }, 'prop_group_damage')).toBe(true);
    expect(affixMatchesProperty({ Group: 111 }, 'prop_group_resistances')).toBe(false);
  });

  it('keeps ordinary and pick-mode zero lines ahead of alternate grouped rolls', () => {
    const lines: KeyedLine[] = [
      { key: 'late', pickMode: '1', children: [{ key: 'choice' }] },
      { key: 'first' },
      { key: 'also-first', pickMode: '0', children: [{ key: 'choice' }] }
    ];
    expect(sortModifierLines(lines).map((line) => line.key)).toEqual(['first', 'also-first', 'late']);
  });
});

describe('weapon controls', () => {
  const low: CatalogItem = { Index: 'low', Equipment: { DamageTypes: [{ Type: 1, AverageDamage: 20 }] } };
  const high: CatalogItem = { Index: 'high', Equipment: { DamageTypes: [{ Type: 1, AverageDamage: 80 }] } };
  const armor: CatalogItem = { Index: 'armor', Equipment: { DamageTypes: [] } };

  it('sorts weapon damage while keeping non-weapons last', () => {
    expect(sortByWeaponDamage([armor, low, high], 'avg-2h-phys-descending').map((item) => item.Index))
      .toEqual(['high', 'low', 'armor']);
  });

  it('filters one- and two-handed equipment', () => {
    expect(passesHandFilter(low, '2h')).toBe(true);
    expect(passesHandFilter(low, '1h')).toBe(false);
  });
});
