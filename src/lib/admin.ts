import { apiRequest } from '$lib/auth';

export type LadderExtensionKind = 'Plugin' | 'Patch';

export interface LadderAllowedExtension {
  id: string;
  name: string;
  fileName: string;
  sha256: string;
  kind: LadderExtensionKind;
}

export interface Ladder {
  id: string;
  name: string;
  startDateUtc: string;
  endDateUtc: string;
  allowedExtensions: LadderAllowedExtension[];
}

export interface LadderAllowedExtensionInput {
  name: string;
  fileName: string;
  sha256: string;
  kind: LadderExtensionKind;
}

export interface LadderInput {
  name: string;
  startDateUtc: string;
  endDateUtc: string;
  allowedExtensions: LadderAllowedExtensionInput[];
}

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  roles: string[];
  createdAtUtc: string;
}

export function getLadders(): Promise<Ladder[]> {
  return apiRequest<Ladder[]>('/ladders');
}

export function createLadder(input: LadderInput): Promise<Ladder> {
  return apiRequest<Ladder>('/admin/ladders', {
    method: 'POST',
    body: JSON.stringify(input)
  }, true);
}

export function updateLadder(id: string, input: LadderInput): Promise<Ladder> {
  return apiRequest<Ladder>(`/admin/ladders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input)
  }, true);
}

export function startLadder(id: string): Promise<Ladder> {
  return apiRequest<Ladder>(`/admin/ladders/${id}/start`, { method: 'POST' }, true);
}

export function getAdminUsers(): Promise<AdminUser[]> {
  return apiRequest<AdminUser[]>('/admin/users', {}, true);
}

export function updateUserRoles(id: string, roles: string[]): Promise<AdminUser> {
  return apiRequest<AdminUser>(`/admin/users/${id}/roles`, {
    method: 'PUT',
    body: JSON.stringify({ roles })
  }, true);
}
