import { apiRequest } from '$lib/auth';

export interface TesterLadder {
  id: string;
  name: string;
  isHidden: boolean;
  startDateUtc: string;
  endDateUtc: string;
  archivedAtUtc?: string | null;
}

export interface TesterSaveResult {
  fileName: string;
  characterName: string;
  version: number;
}

export function canUseTesterSaves(roles: readonly string[] | undefined): boolean {
  return roles?.includes('Tester') ?? false;
}

export function testerSaveError(file: File | undefined): string | null {
  if (!file) return 'Choose a .d2s character save.';
  if (!file.name.toLowerCase().endsWith('.d2s')) return 'Choose a .d2s character save.';
  if (file.size === 0) return 'The selected save is empty.';
  if (file.size > 1024 * 1024) return 'The character save exceeds the 1 MiB limit.';
  return null;
}

export function getTesterLadders(): Promise<TesterLadder[]> {
  return apiRequest('/testers/ladders', {}, true);
}

export function uploadTesterSave(ladderId: string, file: File): Promise<TesterSaveResult> {
  const error = testerSaveError(file);
  if (error) throw new Error(error);
  if (!ladderId) throw new Error('Choose a hidden tester ladder.');
  const form = new FormData();
  form.set('file', file);
  return apiRequest(`/testers/ladders/${encodeURIComponent(ladderId)}/saves`, {
    method: 'POST', body: form
  }, true);
}
