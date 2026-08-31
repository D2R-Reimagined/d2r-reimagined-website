import { apiRequest } from '$lib/auth';
import type { LadderExtensionKind, LadderSummary } from '$lib/ladders';

// Re-exported so the admin pages keep importing these from one place.
export type { LadderAllowedExtension, LadderExtensionKind } from '$lib/ladders';

// The admin view is the public ladder plus the bundle only staff can act on.
export interface Ladder extends LadderSummary {
  activeBundle: LadderBundle | null;
}

export type LadderBundleStatus = 'Ready' | 'Active' | 'Retired' | 'Revoked';

export interface PluginRelease {
  id: string;
  pluginId: string;
  name: string;
  version: string;
  fileName: string;
  sha256: string;
  targetPath: string;
  sourceCommit: string;
  kind: LadderExtensionKind;
  sizeBytes: number;
  isRevoked: boolean;
  createdAtUtc: string;
}

export interface LadderBundleCompatibility {
  minimumLauncherVersion: string;
  requiredD2RLoaderVersion: string;
  requiredD2RLoaderSha256: string;
  requiredD2RCoreSha256: string;
  requiredModVersion: string;
  supportedGameVersion: string;
}

export interface LadderBundleFile {
  pluginReleaseId: string;
  pluginId: string;
  name: string;
  version: string;
  kind: LadderExtensionKind;
  isRequired: boolean;
  archivePath: string;
  targetPath: string;
  fileName: string;
  sizeBytes: number;
  sha256: string;
}

export interface LadderBundle {
  id: string;
  ladderId: string;
  revision: number;
  status: LadderBundleStatus;
  artifactSha256: string;
  manifestSha256: string;
  manifestSignature: string;
  signingKeyId: string;
  sourceCommit: string;
  artifactSizeBytes: number;
  compatibility: LadderBundleCompatibility;
  files: LadderBundleFile[];
  createdAtUtc: string;
  publishedAtUtc: string | null;
  revokedAtUtc: string | null;
  downloadPath: string;
}

export interface PluginReleaseUpload {
  pluginId: string;
  name: string;
  version: string;
  sourceCommit: string;
  targetPath: string;
  kind: LadderExtensionKind;
  file: File;
}

export interface CreateLadderBundleInput extends LadderBundleCompatibility {
  sourceCommit: string;
  components: Array<{ pluginReleaseId: string; isRequired: boolean }>;
}

export interface LadderAllowedExtensionInput {
  name: string;
  fileName: string;
  sha256: string;
  kind: LadderExtensionKind;
  isRequired: boolean;
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

export interface Announcement {
  id: string;
  type: 'announcement';
  message: string;
  sentAtUtc: string;
}

export interface SendAnnouncementResponse {
  announcement: Announcement;
  recipientCount: number;
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

export interface LadderDeletion {
  ladderId: string;
  name: string;
  bundlesDeleted: number;
  allowedExtensionsDeleted: number;
  saveFilesDeleted: number;
  charactersDeleted: number;
  storedObjectsDeleted: number;
  storageWarning: string | null;
}

// The API requires the ladder's exact name back, so a stale id in this tab
// cannot delete whichever ladder now happens to hold it.
export function deleteLadder(id: string, confirmName: string): Promise<LadderDeletion> {
  return apiRequest<LadderDeletion>(
    `/admin/ladders/${id}?confirmName=${encodeURIComponent(confirmName)}`,
    { method: 'DELETE' },
    true
  );
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

export function getPluginReleases(): Promise<PluginRelease[]> {
  return apiRequest<PluginRelease[]>('/admin/plugin-releases', {}, true);
}

export function publishPluginRelease(input: PluginReleaseUpload): Promise<PluginRelease> {
  const body = new FormData();
  body.set('pluginId', input.pluginId);
  body.set('name', input.name);
  body.set('version', input.version);
  body.set('sourceCommit', input.sourceCommit);
  body.set('targetPath', input.targetPath);
  body.set('kind', input.kind);
  body.set('file', input.file, input.file.name);
  return apiRequest<PluginRelease>('/admin/plugin-releases', { method: 'POST', body }, true);
}

export function getLadderBundles(ladderId: string): Promise<LadderBundle[]> {
  return apiRequest<LadderBundle[]>(`/admin/ladders/${ladderId}/bundles`, {}, true);
}

export function createLadderBundle(
  ladderId: string,
  input: CreateLadderBundleInput
): Promise<LadderBundle> {
  return apiRequest<LadderBundle>(`/admin/ladders/${ladderId}/bundles`, {
    method: 'POST',
    body: JSON.stringify(input)
  }, true);
}

export function activateLadderBundle(ladderId: string, bundleId: string): Promise<LadderBundle> {
  return apiRequest<LadderBundle>(`/admin/ladders/${ladderId}/bundles/${bundleId}/activate`, {
    method: 'POST'
  }, true);
}

export function revokeLadderBundle(ladderId: string, bundleId: string): Promise<LadderBundle> {
  return apiRequest<LadderBundle>(`/admin/ladders/${ladderId}/bundles/${bundleId}/revoke`, {
    method: 'POST'
  }, true);
}

export function sendAnnouncement(message: string): Promise<SendAnnouncementResponse> {
  return apiRequest<SendAnnouncementResponse>('/admin/announcements', {
    method: 'POST',
    body: JSON.stringify({ message })
  }, true);
}
