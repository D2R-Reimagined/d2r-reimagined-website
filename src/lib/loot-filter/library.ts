import type { Filter } from './types';
import type { FilterDetails } from './api';

export interface FilterDraft {
  id: string; name: string; document: Filter; selected: number; updatedAt: number; lastUsedAt: number;
  remoteId?: string; revision: number; savedContent?: string;
}
export interface LocalLibrary { key: string; version: 1; entries: FilterDraft[]; lastId: string | null }
export const contentKey = (name: string, document: Filter) => JSON.stringify([name.trim(), document]);
export const isDirty = (draft: FilterDraft) => draft.savedContent !== contentKey(draft.name, draft.document);
export function newDraft(name: string, document: Filter): FilterDraft {
  return { id: crypto.randomUUID(), name, document: structuredClone(document), selected: document.rules.length ? 0 : -1, updatedAt: Date.now(), lastUsedAt: Date.now(), revision: 0 };
}
export function fromRemote(details: FilterDetails, existing?: FilterDraft): FilterDraft {
  return { id: existing?.id ?? crypto.randomUUID(), name: details.name, document: structuredClone(details.document), selected: details.ruleCount ? Math.max(0, Math.min(existing?.selected ?? 0, details.ruleCount - 1)) : -1,
    updatedAt: Date.parse(details.updatedAtUtc), lastUsedAt: Date.parse(details.lastUsedAtUtc), remoteId: details.id, revision: details.revision, savedContent: contentKey(details.name, details.document) };
}
