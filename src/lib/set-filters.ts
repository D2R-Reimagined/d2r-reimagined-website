import { itemClass, itemType, searchText, type SearchTools } from './catalog';
import { matchesItemType, matchesSearch, passesHandFilter, type SearchGroups } from './catalog-controls';
import type { CatalogItem } from './types';

export interface PieceFilters {
  selectedType: string;
  selectedClass: string;
  selectedEquipment: string;
  handFilter?: string;
}

export function matchesPiece(item: CatalogItem, filters: PieceFilters): boolean {
  return matchesItemType([itemType(item)], filters.selectedType, false)
    && (!filters.selectedClass || itemClass(item) === filters.selectedClass)
    && (!filters.selectedEquipment || item.Equipment?.NameKey === filters.selectedEquipment)
    && (!filters.handFilter || passesHandFilter(item, filters.handFilter));
}

export function scopesSetPieces(filters: PieceFilters): boolean {
  return Boolean(filters.selectedType || filters.selectedClass || filters.selectedEquipment || filters.handFilter);
}

/** All active filters and search terms must match the same piece, not its siblings. */
export function filterSetPieces(
  set: CatalogItem, filters: PieceFilters, search: SearchGroups, tools: SearchTools
): CatalogItem | null {
  if (!scopesSetPieces(filters)) return matchesSearch(searchText(set, tools), search) ? set : null;
  const pieces = (set.SetItems ?? []).filter((piece) => matchesPiece(piece, filters)
    && matchesSearch(`${searchText(piece, tools)}\n${tools.t(set.Index).toLowerCase()}`, search));
  return pieces.length ? { ...set, SetItems: pieces } : null;
}
