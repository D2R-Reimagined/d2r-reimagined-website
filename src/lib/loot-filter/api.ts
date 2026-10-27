import { apiRequest } from '#lib/auth.js';
import type { Filter } from './types';
export interface FilterSummary { id: string; name: string; ruleCount: number; revision: number; updatedAtUtc: string; lastUsedAtUtc: string; isPublic: boolean }
export interface FilterDetails extends FilterSummary { document: Filter }
export interface FilterLibrary { items: FilterSummary[]; lastUsedId: string | null; limit: number }
export interface PublicFilterSummary { id: string; name: string; authorName: string; ruleCount: number; updatedAtUtc: string }
export interface PublicFilterDetails extends PublicFilterSummary { document: Filter }
export interface PublicFilterPage { items: PublicFilterSummary[]; total: number; skip: number; count: number }
export const publicFilterPageSize = 24;
export const listFilters = () => apiRequest<FilterLibrary>('/loot-filters', {}, true);
export const getFilter = (id: string) => apiRequest<FilterDetails>(`/loot-filters/${encodeURIComponent(id)}`, {}, true);
export const useFilter = (id: string) => apiRequest<FilterDetails>(`/loot-filters/${encodeURIComponent(id)}/use`, { method: 'POST' }, true);
export const saveFilter = (id: string | undefined, name: string, document: Filter, revision: number) => apiRequest<FilterDetails>(id ? `/loot-filters/${encodeURIComponent(id)}` : '/loot-filters', { method: id ? 'PUT' : 'POST', body: JSON.stringify({ name, document, revision }) }, true);
export const setFilterVisibility = (id: string, isPublic: boolean) => apiRequest<FilterDetails>(`/loot-filters/${encodeURIComponent(id)}/visibility`, { method: 'PUT', body: JSON.stringify({ isPublic }) }, true);
export const deleteFilter = (id: string, revision: number) => apiRequest<void>(`/loot-filters/${encodeURIComponent(id)}`, { method: 'DELETE', body: JSON.stringify({ revision }) }, true);
