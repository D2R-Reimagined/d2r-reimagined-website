import { apiRequest, apiUploadRequest, type ApiUploadProgress } from '$lib/auth';
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
  archivePath: string;
  targetPath: string;
  fileName: string;
  sizeBytes: number;
  sha256: string;
}

export interface LadderBundlePlugin {
  pluginId: string;
  name: string;
  fileName: string;
  targetPath: string;
  sizeBytes: number;
  sha256: string;
}

export interface LadderBundle {
  id: string;
  ladderId: string;
  revision: number;
  schemaVersion: number;
  status: LadderBundleStatus;
  artifactSha256: string;
  manifestSha256: string;
  manifestSignature: string;
  signingKeyId: string;
  artifactSizeBytes: number;
  compatibility: LadderBundleCompatibility;
  files: LadderBundleFile[];
  plugins: LadderBundlePlugin[];
  createdAtUtc: string;
  publishedAtUtc: string | null;
  revokedAtUtc: string | null;
  downloadPath: string;
}

export type LadderBundlePublishStatus = 'Queued' | 'Processing' | 'Completed' | 'Failed';
export type LadderBundlePublishStage =
  | 'Queued'
  | 'DownloadingSource'
  | 'ValidatingArchive'
  | 'HashingFiles'
  | 'SigningManifest'
  | 'PackagingBundle'
  | 'HashingBundle'
  | 'UploadingBundle'
  | 'SavingRevision'
  | 'Completed'
  | 'Failed';

export interface LadderBundlePublishJob {
  id: string;
  ladderId: string;
  bundleId: string | null;
  status: LadderBundlePublishStatus;
  stage: LadderBundlePublishStage;
  progressPercent: number;
  sourceFileName: string;
  sourceSizeBytes: number;
  message: string;
  detail: string | null;
  error: string | null;
  processedFiles: number | null;
  totalFiles: number | null;
  processedBytes: number | null;
  totalBytes: number | null;
  createdAtUtc: string;
  updatedAtUtc: string;
  startedAtUtc: string | null;
  completedAtUtc: string | null;
}

export interface PluginReleaseUpload {
  pluginId: string;
  name: string;
  version: string;
  targetPath: string;
  kind: LadderExtensionKind;
  file: File;
}

export interface CreateLadderBundleInput {
  minimumLauncherVersion: string;
  requiredD2RLoaderVersion: string;
  supportedGameVersion: string;
  archive: File;
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
  input: CreateLadderBundleInput,
  onProgress?: (progress: ApiUploadProgress) => void
): Promise<LadderBundlePublishJob> {
  const body = new FormData();
  body.set('minimumLauncherVersion', input.minimumLauncherVersion);
  body.set('requiredD2RLoaderVersion', input.requiredD2RLoaderVersion);
  body.set('supportedGameVersion', input.supportedGameVersion);
  body.set('archive', input.archive, input.archive.name);
  return apiUploadRequest<LadderBundlePublishJob>(
    `/admin/ladders/${ladderId}/bundles`,
    body,
    onProgress
  );
}

export function uploadOptionalExtension(ladderId: string, file: File,
  onProgress?: (progress: ApiUploadProgress) => void): Promise<Ladder> {
  const body = new FormData();
  body.set('file', file, file.name);
  return apiUploadRequest<Ladder>(`/admin/ladders/${ladderId}/optional-extensions`, body, onProgress);
}

export function removeOptionalExtension(ladderId: string, extensionId: string): Promise<Ladder> {
  return apiRequest<Ladder>(`/admin/ladders/${ladderId}/optional-extensions/${extensionId}`, {method: 'DELETE'}, true);
}

export async function getLatestLadderBundlePublishJob(
  ladderId: string
): Promise<LadderBundlePublishJob | null> {
  return await apiRequest<LadderBundlePublishJob | undefined>(
    `/admin/ladders/${ladderId}/bundle-publish-jobs/latest`,
    { cache: 'no-store' },
    true
  ) ?? null;
}

export function getLadderBundlePublishJob(
  ladderId: string,
  jobId: string
): Promise<LadderBundlePublishJob> {
  return apiRequest<LadderBundlePublishJob>(
    `/admin/ladders/${ladderId}/bundle-publish-jobs/${jobId}`,
    { cache: 'no-store' },
    true
  );
}

export function cancelLadderBundlePublishJob(
  ladderId: string,
  jobId: string
): Promise<LadderBundlePublishJob> {
  return apiRequest<LadderBundlePublishJob>(
    `/admin/ladders/${ladderId}/bundle-publish-jobs/${jobId}/cancel`,
    { method: 'POST' },
    true
  );
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
