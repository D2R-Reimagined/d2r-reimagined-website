import { readCatalogFilters, type CatalogFilterState } from './catalog-query';

export type GrailCategory = 'uniques' | 'sets' | 'runewords';
export interface GrailFilters {
  category: GrailCategory;
  hideFound: boolean;
  catalog: CatalogFilterState;
}

export function readGrailFilters(params: URLSearchParams): GrailFilters {
  const value = params.get('g-category') ?? params.get('category');
  const category = value === 'sets' || value === 'runewords' ? value : 'uniques';
  const catalogParams = new URLSearchParams(params);
  for (const key of ['search', 'type', 'class', 'equipment', 'hideVanilla', 'sockets', 'runes', 'exact']) {
    const legacy = params.get(`g-${key}`);
    if (legacy !== null) catalogParams.set(key, legacy);
  }
  const found = params.get('g-hideFound') ?? params.get('hideFound');
  return { category, hideFound: found === 'true' || found === '1', catalog: readCatalogFilters(catalogParams, category) };
}

export function writeGrailFilters(url: URL, filters: GrailFilters): URL {
  const values: Record<string, string | boolean> = {
    category: filters.category === 'uniques' ? '' : filters.category,
    hideFound: filters.hideFound,
    search: filters.catalog.search.trim() ? filters.catalog.search : '',
    type: filters.catalog.selectedType,
    class: filters.catalog.selectedClass,
    equipment: filters.catalog.selectedEquipment,
    hideVanilla: filters.catalog.hideVanilla,
    sockets: filters.category === 'runewords' ? filters.catalog.runeCount : '',
    runes: filters.category === 'runewords' ? filters.catalog.selectedRunes.join(',') : '',
    exact: filters.category === 'runewords' && filters.catalog.exactType
  };
  url.searchParams.delete('q');
  for (const [key, value] of Object.entries(values)) {
    url.searchParams.delete(key);
    if (value === '' || value === false) url.searchParams.delete(`g-${key}`);
    else url.searchParams.set(`g-${key}`, String(value));
  }
  return url;
}
