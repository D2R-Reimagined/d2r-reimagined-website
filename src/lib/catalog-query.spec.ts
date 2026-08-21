import { describe, expect, it } from 'vitest';

import { readCatalogFilters, writeCatalogFilters } from './catalog-query';

describe('catalog filter query parameters', () => {
  it('reads legacy shared runeword links', () => {
    const filters = readCatalogFilters(
      new URLSearchParams('search=damage&type=Sword%2CMelee+Weapon%2CWeapon&runes=El+Eld&sockets=3&exact=true'),
      'runewords'
    );

    expect(filters.search).toBe('damage');
    expect(filters.selectedType).toBe('Sword');
    expect(filters.selectedRunes).toEqual(['El', 'Eld']);
    expect(filters.runeCount).toBe('3');
    expect(filters.exactType).toBe(true);
  });

  it('round-trips all shareable filters while preserving unrelated parameters', () => {
    const filters = readCatalogFilters(new URLSearchParams(), 'affixes');
    Object.assign(filters, {
      search: 'fire damage',
      selectedType: 'weapitype',
      selectedClass: 'Amazon',
      subtype: 'prefix',
      hideVanilla: true,
      selectedEquipment: 'cap',
      selectedTier: 'Elite',
      propertyType: 'prop_group_damage',
      minLevel: '12',
      maxLevel: '80',
      exactType: true,
      recipeType: 'crafting',
      selectedRunes: ['r01', 'r02'],
      weaponSort: 'avg-1h-phys-descending',
      handFilter: '1h'
    });

    const url = writeCatalogFilters(new URL('https://example.test/data/affixes?keep=yes'), filters, 'affixes');
    const restored = readCatalogFilters(url.searchParams, 'affixes');

    expect(url.searchParams.get('keep')).toBe('yes');
    expect(restored).toEqual(filters);
  });

  it('uses the legacy sockets parameter for the relevant catalog', () => {
    const baseFilters = readCatalogFilters(new URLSearchParams('sockets=4'), 'bases');
    const runewordFilters = readCatalogFilters(new URLSearchParams('sockets=4'), 'runewords');

    expect(baseFilters.selectedSockets).toBe('4');
    expect(baseFilters.runeCount).toBe('');
    expect(runewordFilters.runeCount).toBe('4');
    expect(runewordFilters.selectedSockets).toBe('');
  });

  it('accepts the global-search q parameter as a search handoff', () => {
    const filters = readCatalogFilters(new URLSearchParams('q=holy+fire'), 'uniques');
    const url = writeCatalogFilters(new URL('https://example.test/data/uniques?q=holy+fire'), filters, 'uniques');

    expect(filters.search).toBe('holy fire');
    expect(url.searchParams.get('search')).toBe('holy fire');
    expect(url.searchParams.has('q')).toBe(false);
  });
});
