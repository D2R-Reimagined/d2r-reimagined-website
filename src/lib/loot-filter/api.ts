import { apiRequest } from '$lib/auth';
import type { Filter } from './types';
export interface FilterSummary { id: string; name: string; ruleCount: number; revision: number; updatedAtUtc: string; lastUsedAtUtc: string }
export interface FilterDetails extends FilterSummary { document: Filter }
export interface FilterLibrary { items: FilterSummary[]; lastUsedId: string | null; limit: number }
export const listFilters = () => apiRequest<FilterLibrary>('/loot-filters', {}, true);
export const getFilter = (id: string) => apiRequest<FilterDetails>(`/loot-filters/${encodeURIComponent(id)}`, {}, true);
export const useFilter = (id: string) => apiRequest<FilterDetails>(`/loot-filters/${encodeURIComponent(id)}/use`, { method: 'POST' }, true);
export const saveFilter = (id: string | undefined, name: string, document: Filter, revision: number) => apiRequest<FilterDetails>(id ? `/loot-filters/${encodeURIComponent(id)}` : '/loot-filters', { method: id ? 'PUT' : 'POST', body: JSON.stringify({ name, document, revision }) }, true);
export const deleteFilter = (id: string, revision: number) => apiRequest<void>(`/loot-filters/${encodeURIComponent(id)}`, { method: 'DELETE', body: JSON.stringify({ revision }) }, true);
