import type { WeaponSortMode } from './catalog-controls';
import type { CatalogSlug } from './types';

export interface CatalogFilterState {
  search: string;
  selectedType: string;
  selectedClass: string;
  subtype: string;
  hideVanilla: boolean;
  runeCount: string;
  selectedEquipment: string;
  selectedTier: string;
  selectedSockets: string;
  propertyType: string;
  minLevel: string;
  maxLevel: string;
  exactType: boolean;
  recipeType: string;
  selectedRunes: string[];
  weaponSort: WeaponSortMode;
  handFilter: string;
}

function enabled(value: string | null): boolean {
  return value === 'true' || value === '1';
}

function runeValues(params: URLSearchParams): string[] {
  return params.getAll('runes')
    .flatMap((value) => value.split(/[\s,|]+/))
    .map((value) => value.trim())
    .filter(Boolean);
}

export function readCatalogFilters(params: URLSearchParams, slug: CatalogSlug): CatalogFilterState {
  const sockets = params.get('sockets') ?? '';

  return {
    search: params.get('search') ?? params.get('q') ?? '',
    selectedType: (params.get('type') ?? '').split(',')[0],
    selectedClass: params.get('class') ?? '',
    subtype: params.get('subtype') ?? '',
    hideVanilla: enabled(params.get('hideVanilla')),
    runeCount: slug === 'runewords' ? sockets : '',
    selectedEquipment: params.get('equipment') ?? '',
    selectedTier: params.get('tier') ?? '',
    selectedSockets: slug === 'bases' ? sockets : '',
    propertyType: params.get('property') ?? '',
    minLevel: params.get('minLevel') ?? '',
    maxLevel: params.get('maxLevel') ?? '',
    exactType: enabled(params.get('exact')),
    recipeType: params.get('recipeType') ?? '',
    selectedRunes: runeValues(params),
    weaponSort: (params.get('sort') ?? '') as WeaponSortMode,
    handFilter: params.get('hand') ?? ''
  };
}

function setParam(params: URLSearchParams, key: string, value: string | boolean): void {
  if (value === '' || value === false) params.delete(key);
  else params.set(key, value === true ? 'true' : value);
}

export function writeCatalogFilters(url: URL, filters: CatalogFilterState, slug: CatalogSlug): URL {
  const params = url.searchParams;
  params.delete('q');
  setParam(params, 'search', filters.search.trim() ? filters.search : '');
  setParam(params, 'type', filters.selectedType);
  setParam(params, 'class', filters.selectedClass);
  setParam(params, 'subtype', filters.subtype);
  setParam(params, 'hideVanilla', filters.hideVanilla);
  setParam(params, 'sockets', slug === 'runewords' ? filters.runeCount : slug === 'bases' ? filters.selectedSockets : '');
  setParam(params, 'equipment', filters.selectedEquipment);
  setParam(params, 'tier', filters.selectedTier);
  setParam(params, 'property', filters.propertyType);
  setParam(params, 'minLevel', filters.minLevel);
  setParam(params, 'maxLevel', filters.maxLevel);
  setParam(params, 'exact', filters.exactType);
  setParam(params, 'recipeType', filters.recipeType);
  setParam(params, 'runes', filters.selectedRunes.join(','));
  setParam(params, 'sort', filters.weaponSort);
  setParam(params, 'hand', filters.handFilter);
  return url;
}
