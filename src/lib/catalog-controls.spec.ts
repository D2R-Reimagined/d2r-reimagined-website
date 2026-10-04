import { describe, expect, it } from 'vitest';

import {
  affixMatchesProperty,
  baseHasSockets,
  baseTier,
  catalogTypeValues,
  equipmentNamesForType,
  groupBases,
  matchesSearch,
  matchesItemType,
  matchesRunes,
  passesHandFilter,
  sortCatalogItems,
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

  it('groups concrete types and keeps each base family in N → X → E order', () => {
    const family = { NormCode: 'qui', UberCode: 'xui', UltraCode: 'uui', source: 'armor' as const, Type: 'torsitype' };
    const groups = groupBases([
      { ...family, NameKey: 'uui' },
      { Type: 'shieitype', NameKey: 'shield', source: 'armor' },
      { ...family, NameKey: 'qui' },
      { ...family, NameKey: 'xui' }
    ]);
    expect(groups.find((group) => group.type === 'torsitype')?.families[0].items.map((item) => item.NameKey))
      .toEqual(['qui', 'xui', 'uui']);
    expect(groups.find((group) => group.type === 'shieitype')?.families).toHaveLength(1);
  });
});

describe('item type filtering', () => {
  it('limits equipment choices to the selected family, including set pieces', () => {
    const items: CatalogItem[] = [
      { Type: 'torsitype', Equipment: { NameKey: 'armor' } },
      { Type: 'shieitype', Equipment: { NameKey: 'shield' } },
      { Type: 'h2hitype', Equipment: { NameKey: 'claw' } },
      { Type: 'sworitype', Equipment: { NameKey: 'sword' } },
      { SetItems: [
        { Type: 'torsitype', Equipment: { NameKey: 'set armor' } },
        { Type: 'shieitype', Equipment: { NameKey: 'set shield' } }
      ] }
    ];
    expect(equipmentNamesForType(items, 'torsitype')).toEqual(['armor', 'set armor']);
    expect(equipmentNamesForType(items, 'h2hitype')).toEqual(['claw']);
    expect(equipmentNamesForType(items, 'armoitype')).toEqual(['armor', 'shield', 'set armor', 'set shield']);
  });
  it.each(['bases', 'uniques', 'sets'] as const)('offers broad equipment families in %s', (slug) => {
    const values = catalogTypeValues(['sworitype', 'abowitype', 'taxeitype', 'peltitype'], slug);
    expect(values).toEqual(expect.arrayContaining([
      'sworitype', 'abowitype', 'taxeitype', 'peltitype',
      'weapitype', 'meleitype', 'missitype', 'throitype', 'armoitype'
    ]));
    expect(new Set(values).size).toBe(values.length);
  });

  it('only offers families present in equipment and leaves applicability options intact', () => {
    expect(catalogTypeValues(['peltitype'], 'uniques')).toEqual(['peltitype', 'armoitype', 'helmitype']);
    expect(catalogTypeValues(['ashditype'], 'sets')).toEqual(['ashditype', 'armoitype', 'shlditype']);
    expect(catalogTypeValues([], 'bases')).toEqual([]);
    expect(catalogTypeValues(['sworitype'], 'runewords')).toEqual(['sworitype']);
    expect(catalogTypeValues(['sworitype'], 'affixes')).toEqual(['sworitype']);
  });

  it('combines broad weapon families with descending damage sorting', () => {
    const items: CatalogItem[] = [
      { Index: 'sword', Type: 'sworitype', DamageTypes: [{ Type: 1, AverageDamage: 80 }] },
      { Index: 'axe', Type: 'axeitype', DamageTypes: [{ Type: 1, AverageDamage: 120 }] },
      { Index: 'bow', Type: 'bowitype', DamageTypes: [{ Type: 1, AverageDamage: 90 }] },
      { Index: 'amazon bow', Type: 'abowitype', DamageTypes: [{ Type: 1, AverageDamage: 150 }] },
      { Index: 'helm', Type: 'helmitype' }
    ];
    const ranked = (type: string) => sortCatalogItems(
      items.filter((item) => matchesItemType([item.Type as string], type, false)),
      'avg-2h-phys-descending'
    ).map((item) => item.Index);
    expect(ranked('meleitype')).toEqual(['axe', 'sword']);
    expect(ranked('missitype')).toEqual(['amazon bow', 'bow']);
    expect(ranked('weapitype')).toEqual(['amazon bow', 'axe', 'bow', 'sword']);
    expect(matchesItemType(['taxeitype'], 'throitype', false)).toBe(true);
    expect(matchesItemType(['ajavitype'], 'throitype', false)).toBe(true);
  });

  it('keeps specific equipment selections from including ancestors or siblings', () => {
    expect(matchesItemType(['peltitype'], 'peltitype', false)).toBe(true);
    expect(matchesItemType(['helmitype'], 'peltitype', false)).toBe(false);
    expect(matchesItemType(['phlmitype'], 'peltitype', false)).toBe(false);
    expect(matchesItemType(['peltitype'], 'helmitype', false)).toBe(true);
    expect(matchesItemType(['peltitype'], 'armoitype', false)).toBe(true);
    expect(matchesItemType(['shlditype'], 'ashditype', false)).toBe(false);
    expect(matchesItemType(['bowitype'], 'abowitype', false)).toBe(false);
  });

  it('preserves broad allowed types for runeword and affix applicability', () => {
    expect(matchesItemType(['helmitype'], 'peltitype', false, true)).toBe(true);
    expect(matchesItemType(['weapitype'], 'sworitype', false, true)).toBe(true);
    expect(matchesItemType(['helmitype'], 'peltitype', true, true)).toBe(false);
  });

  it('matches descendants for broad types unless Exact is enabled', () => {
    expect(matchesItemType(['sworitype'], 'weapitype', false)).toBe(true);
    expect(matchesItemType(['sworitype'], 'weapitype', true)).toBe(false);
    expect(matchesItemType(['weapitype'], 'weapitype', true)).toBe(true);
  });
});

describe('rune matching', () => {
  const on = (...runes: string[]) => runes;

  it('keeps runewords that use every selected rune by default', () => {
    expect(matchesRunes(on('r01', 'r02', 'r03'), on('r01', 'r03'), '')).toBe(true);
    expect(matchesRunes(on('r01', 'r02'), on('r01', 'r03'), '')).toBe(false);
  });

  it('keeps only runewords buildable from the selected runes in makeable mode', () => {
    expect(matchesRunes(on('r01', 'r02'), on('r01', 'r02', 'r03'), 'makeable')).toBe(true);
    expect(matchesRunes(on('r30', 'r30', 'r01'), on('r30', 'r01'), 'makeable')).toBe(true);
    expect(matchesRunes(on('r01', 'r04'), on('r01', 'r02', 'r03'), 'makeable')).toBe(false);
    expect(matchesRunes([], on('r01'), 'makeable')).toBe(false);
  });

  it('applies no rune filter until a rune is selected', () => {
    expect(matchesRunes(on('r01'), [], '')).toBe(true);
    expect(matchesRunes(on('r01'), [], 'makeable')).toBe(true);
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
    expect(sortCatalogItems([armor, low, high], 'avg-2h-phys-descending').map((item) => item.Index))
      .toEqual(['high', 'low', 'armor']);
  });

  it('sorts by required level in either direction', () => {
    const items: CatalogItem[] = [
      { Index: 'mid', RequiredLevel: 40 },
      { Index: 'high', RequiredLevel: 85 },
      { Index: 'low', RequiredLevel: 5 }
    ];
    expect(sortCatalogItems(items, 'level-descending').map((item) => item.Index)).toEqual(['high', 'mid', 'low']);
    expect(sortCatalogItems(items, 'level-ascending').map((item) => item.Index)).toEqual(['low', 'mid', 'high']);
  });

  it('sorts armor by its best defense roll while keeping items without defense last', () => {
    const plain: CatalogItem = { Index: 'plain', Equipment: { Lines: [{ key: 'strDefense', args: [120] }] } };
    const ranged: CatalogItem = { Index: 'ranged', Equipment: { Lines: [{ key: 'strDefenseRange', args: [90, 140] }] } };
    const enhanced: CatalogItem = {
      Index: 'enhanced',
      Equipment: { Lines: [{ key: 'strChanceToBlock', args: [20] }, { key: 'strDefenseRangeRange', args: [186, 257, 205, 276] }] }
    };
    const ring: CatalogItem = { Index: 'ring', Equipment: { Lines: [] } };
    expect(sortCatalogItems([ring, plain, ranged, enhanced], 'defense-descending').map((item) => item.Index))
      .toEqual(['enhanced', 'ranged', 'plain', 'ring']);
    expect(sortCatalogItems([ring, plain, ranged, enhanced], 'defense-ascending').map((item) => item.Index))
      .toEqual(['plain', 'ranged', 'enhanced', 'ring']);
  });

  it('ranks sets by their highest-level and best-defense piece', () => {
    const light: CatalogItem = { Index: 'light', SetItems: [
      { RequiredLevel: 10, Equipment: { Lines: [{ key: 'strDefense', args: [30] }] } }
    ] };
    const heavy: CatalogItem = { Index: 'heavy', SetItems: [
      { RequiredLevel: 8, Equipment: { Lines: [] } },
      { RequiredLevel: 60, Equipment: { Lines: [{ key: 'strDefenseRange', args: [200, 250] }] } }
    ] };
    expect(sortCatalogItems([light, heavy], 'level-descending').map((item) => item.Index)).toEqual(['heavy', 'light']);
    expect(sortCatalogItems([light, heavy], 'defense-descending').map((item) => item.Index)).toEqual(['heavy', 'light']);
  });

  it('filters one- and two-handed equipment', () => {
    expect(passesHandFilter(low, '2h')).toBe(true);
    expect(passesHandFilter(low, '1h')).toBe(false);
  });
});
