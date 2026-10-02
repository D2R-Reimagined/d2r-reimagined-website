import { isVanilla, itemClass, searchText, type SearchTools } from './catalog';
import { catalogTypeValues, equipmentNamesForType, matchesItemType, matchesSearch, tokenizeSearch } from './catalog-controls';
import type { CatalogFilterState } from './catalog-query';
import { matchesPiece } from './set-filters';
import type { CatalogItem } from './types';
import type { GrailCategory } from './grail-query';

export function grailTypes(item: CatalogItem): string[] {
  if (item.Types) return item.Types.map((type) => typeof type === 'string' ? type : type.Index ?? type.Name ?? '').filter(Boolean);
  const type = typeof item.Type === 'string' ? item.Type : item.Type?.Index ?? item.Type?.Name ?? '';
  return type ? [type] : [];
}

/** Legacy links used translated labels; normalize before SSR as well as hydration. */
export function normalizeGrailFilters(
  filters: CatalogFilterState, items: CatalogItem[], category: GrailCategory, tools: SearchTools
): CatalogFilterState {
  const resolve = (value: string, choices: string[], rune = false) => {
    const normalize = (text: string) => rune
      ? text.toLowerCase().replace(/\s+rune(?:\s+\(#\d+\))?$/i, '')
      : text.toLowerCase();
    return choices.find((choice) => normalize(choice) === normalize(value)
      || normalize(tools.t(choice)) === normalize(value)) ?? '';
  };
  const selectedType = resolve(filters.selectedType, catalogTypeValues(items.flatMap(grailTypes), category));
  return {
    ...filters, selectedType,
    selectedClass: category === 'runewords' ? '' : resolve(filters.selectedClass, items.map(itemClass).filter(Boolean)),
    selectedEquipment: category === 'runewords' ? '' : resolve(filters.selectedEquipment, equipmentNamesForType(items, selectedType)),
    selectedRunes: filters.selectedRunes.map((rune) => resolve(rune,
      items.flatMap((item) => (item.Runes ?? []).map((value) => value.NameKey ?? '')), true)).filter(Boolean)
  };
}

export function filterGrailItems(
  items: CatalogItem[], category: GrailCategory, filters: CatalogFilterState,
  found: Record<string, boolean>, hideFound: boolean, tools: SearchTools
): CatalogItem[] {
  const groups = tokenizeSearch(filters.search);
  return items.filter((item) => {
    if (hideFound && found[String(item.Index ?? item.NameKey ?? 'Unknown')]) return false;
    if (filters.hideVanilla && isVanilla(item)) return false;
    if (category === 'runewords') {
      if (!matchesItemType(grailTypes(item), filters.selectedType, filters.exactType, true)) return false;
      if (filters.runeCount && item.Runes?.length !== Number(filters.runeCount)) return false;
      if (!filters.selectedRunes.every((rune) => item.Runes?.some((value) => value.NameKey === rune))) return false;
    } else if (!matchesPiece(item, filters)) return false;
    return !groups.length || matchesSearch(searchText(item, tools), groups);
  });
}
