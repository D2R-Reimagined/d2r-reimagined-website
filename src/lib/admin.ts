import { apiRequest, apiUploadRequest, type ApiUploadProgress } from '#lib/auth.js';
import type { LadderAllowedExtension, LadderExtensionKind, LadderSummary } from '#lib/ladders.js';

// Re-exported so the admin pages keep importing these from one place.
export type { LadderAllowedExtension, LadderExtensionKind } from '#lib/ladders.js';

// The admin view is the public ladder plus the bundle only staff can act on.
export interface Ladder extends LadderSummary {
  allowedExtensions: LadderAllowedExtension[];
  activeBundle: LadderBundle | null;
  /** A bundle counting down to activation; absent when none is. */
  pendingRelease?: LadderPendingRelease | null;
  /** The exact D2RLoader build players must run; absent when the ladder does not pin one. */
  requiredD2RLoader?: LadderD2RLoader | null;
}

export interface LadderD2RLoaderFile {
  path: string;
  sha256: string;
  sizeBytes: number;
}

/** `sha256`/`sizeBytes` describe the uploaded ZIP; launchers match `files` byte-for-byte. */
export interface LadderD2RLoader {
  version: string;
  fileName: string;
  sha256: string;
  sizeBytes: number;
  files: LadderD2RLoaderFile[];
  uploadedAtUtc: string;
  downloadPath: string;
}

/** The current bundle stays valid for launches and saves until `activatesAtUtc`. */
export interface LadderPendingRelease {
  bundleId: string;
  revision: number;
  activatesAtUtc: string;
}

export interface LadderBundleActivation {
  bundle: LadderBundle;
  /** Null when the bundle became current immediately. */
  pendingRelease: LadderPendingRelease | null;
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

/** A revision in the admin list: a file count stands in for the full file list. */
export interface LadderBundleSummary {
  id: string;
  ladderId: string;
  revision: number;
  status: LadderBundleStatus;
  artifactSha256: string;
  signingKeyId: string;
  artifactSizeBytes: number;
  compatibility: LadderBundleCompatibility;
  fileCount: number;
  plugins: LadderBundlePlugin[];
  createdAtUtc: string;
  publishedAtUtc: string | null;
  revokedAtUtc: string | null;
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
  isHidden: boolean;
  name: string;
  startDateUtc: string;
  endDateUtc: string;
  allowedExtensions: LadderAllowedExtensionInput[];
}

export interface ParticipationSettings {
  tradeBanned: boolean;
  leaderboardBanned: boolean;
  reason: string;
}

export function updateUserParticipation(id: string, settings: ParticipationSettings): Promise<AdminUser> {
  return apiRequest<AdminUser>(`/admin/users/${id}/participation`, {
    method: 'PUT', body: JSON.stringify(settings)
  }, true);
}

// Which save checks may refuse a write to one ladder. Off means the check
// still runs and logs, but the save is stored.
export interface LadderSaveEnforcementSettings {
  enforceProgression: boolean;
  enforceAffixRanges: boolean;
  enforceSaveChecksum: boolean;
  enforceUnlocks: boolean;
  enforceUnwitnessedItems: boolean;
  enforceAreaBounds: boolean;
  enforceUnexplainedChanges: boolean;
  enforceRetainedDivestments: boolean;
  enforceJournalCoverage: boolean;
  enforceServerAuthority: boolean;
}

export interface LadderSaveEnforcement extends LadderSaveEnforcementSettings {
  ladderId: string;
  updatedAtUtc: string | null;
  updatedBy: string | null;
  progressionChecksEnabled: boolean;
  journalChecksEnabled: boolean;
}

export function getLadderSaveEnforcement(ladderId: string): Promise<LadderSaveEnforcement> {
  return apiRequest<LadderSaveEnforcement>(`/admin/ladders/${ladderId}/save-enforcement`, { cache: 'no-store' }, true);
}

export function updateLadderSaveEnforcement(
  ladderId: string,
  settings: LadderSaveEnforcementSettings
): Promise<LadderSaveEnforcement> {
  return apiRequest<LadderSaveEnforcement>(`/admin/ladders/${ladderId}/save-enforcement`, {
    method: 'PUT',
    body: JSON.stringify(settings)
  }, true);
}

// One user invited to one hidden ladder, on top of everyone with the Tester role.
export interface LadderAccessGrant {
  ladderId: string;
  ladderName: string;
  ladderIsHidden: boolean;
  userId: string;
  displayName: string;
  email: string;
  grantedAtUtc: string;
}

export function getLadderAccess(ladderId: string): Promise<LadderAccessGrant[]> {
  return apiRequest<LadderAccessGrant[]>(`/admin/ladders/${ladderId}/access`, { cache: 'no-store' }, true);
}

export function grantLadderAccess(ladderId: string, userId: string): Promise<LadderAccessGrant> {
  return apiRequest<LadderAccessGrant>(`/admin/ladders/${ladderId}/access/${userId}`, { method: 'PUT' }, true);
}

export async function revokeLadderAccess(ladderId: string, userId: string): Promise<void> {
  await apiRequest<void>(`/admin/ladders/${ladderId}/access/${userId}`, { method: 'DELETE' }, true);
}

export interface AdminUser {
  ladderAccess: LadderAccessGrant[];
  tradeBanned: boolean;
  leaderboardBanned: boolean;
  participationReason: string | null;
  participationUpdatedBy: string | null;
  participationUpdatedAtUtc: string | null;
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

export interface AnnouncementListeners {
  /** Sockets attached. One player with the game open twice is two. */
  listeners: number;
  /** Distinct players those sockets represent. */
  players: number;
}

export function getLadders(): Promise<Ladder[]> {
  return apiRequest<Ladder[]>('/admin/ladders', {}, true);
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

export interface AdminUserSearch {
  skip?: number;
  count?: number;
  search?: string;
}

export interface AdminUserPage {
  items: AdminUser[];
  total: number;
  skip: number;
  count: number;
}

export function searchAdminUsers(query: AdminUserSearch = {}): Promise<AdminUserPage> {
  const parameters = new URLSearchParams();
  if (query.skip !== undefined) parameters.set('skip', String(query.skip));
  if (query.count !== undefined) parameters.set('count', String(query.count));
  if (query.search?.trim()) parameters.set('search', query.search.trim());
  const suffix = parameters.size > 0 ? `?${parameters.toString()}` : '';
  return apiRequest<AdminUserPage>(`/admin/users/search${suffix}`, {}, true);
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

export function getLadderBundles(ladderId: string): Promise<LadderBundleSummary[]> {
  return apiRequest<LadderBundleSummary[]>(`/admin/ladders/${ladderId}/bundles`, {}, true);
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

/** Pins the ladder to this D2RLoader release ZIP, replacing any earlier pin. */
export function uploadLadderD2RLoader(ladderId: string, file: File, version: string,
  onProgress?: (progress: ApiUploadProgress) => void): Promise<Ladder> {
  const body = new FormData();
  body.set('file', file, file.name);
  body.set('version', version.trim());
  return apiUploadRequest<Ladder>(`/admin/ladders/${ladderId}/d2rloader`, body, onProgress);
}

export function removeLadderD2RLoader(ladderId: string): Promise<Ladder> {
  return apiRequest<Ladder>(`/admin/ladders/${ladderId}/d2rloader`, {method: 'DELETE'}, true);
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

/**
 * Starts the bundle's activation countdown: players are counted down in game
 * and dedicated servers restart onto it together when it ends. `immediate`
 * skips the countdown, as does a ladder with no current bundle.
 */
export function activateLadderBundle(
  ladderId: string,
  bundleId: string,
  immediate = false
): Promise<LadderBundleActivation> {
  const query = immediate ? '?immediate=true' : '';
  return apiRequest<LadderBundleActivation>(`/admin/ladders/${ladderId}/bundles/${bundleId}/activate${query}`, {
    method: 'POST'
  }, true);
}

/** Stops a running countdown; the current bundle stays. Null when none was running. */
export async function cancelLadderBundleActivation(ladderId: string): Promise<LadderPendingRelease | null> {
  return await apiRequest<LadderPendingRelease | undefined>(
    `/admin/ladders/${ladderId}/bundle-activation/cancel`,
    { method: 'POST' },
    true
  ) ?? null;
}

export function revokeLadderBundle(ladderId: string, bundleId: string): Promise<LadderBundle> {
  return apiRequest<LadderBundle>(`/admin/ladders/${ladderId}/bundles/${bundleId}/revoke`, {
    method: 'POST'
  }, true);
}

// The dedicated-server plugin (d2rl-d2rds.dll), kept apart from the player
// bundle. Admins see a build's hash, size and notes but never its bytes: the
// API has no download for them, only the ladder's servers can fetch one.
export type ServerBuildStatus = 'current' | 'pending' | 'available';

export interface ServerBuild {
  id: string;
  ladderId: string;
  sha256: string;
  sizeBytes: number;
  notes?: string | null;
  uploadedAtUtc: string;
  status: ServerBuildStatus;
}

/** Set when the build shares a bundle countdown, so servers restart once for both. */
export interface ServerBuildPending {
  buildId: string;
  activatesAtUtc: string;
  attachedToBundleRevision?: number | null;
}

export interface ServerBuildState {
  ladderId: string;
  currentBuildId: string | null;
  /** A build counting down to activation; absent when none is. */
  pending?: ServerBuildPending | null;
  /** Newest first. */
  builds: ServerBuild[];
}

export function getServerBuilds(ladderId: string): Promise<ServerBuildState> {
  return apiRequest<ServerBuildState>(`/admin/ladders/${ladderId}/server-builds`, { cache: 'no-store' }, true);
}

/** Uploading the same bytes again returns the build already stored. */
export function uploadServerBuild(ladderId: string, file: File, notes: string,
  onProgress?: (progress: ApiUploadProgress) => void): Promise<ServerBuild> {
  const body = new FormData();
  body.set('file', file, file.name);
  if (notes.trim()) body.set('notes', notes.trim());
  return apiUploadRequest<ServerBuild>(`/admin/ladders/${ladderId}/server-builds`, body, onProgress);
}

/**
 * Starts the build's countdown, or joins a bundle countdown already running.
 * `immediate` makes it current now. Activating an older build is the rollback,
 * and activating the current one cancels a pending build.
 */
export function activateServerBuild(ladderId: string, buildId: string, immediate = false): Promise<ServerBuildState> {
  return apiRequest<ServerBuildState>(
    `/admin/ladders/${ladderId}/server-builds/${buildId}/activate?immediate=${immediate}`,
    { method: 'POST' },
    true
  );
}

/** Stops a server build countdown; servers stay on the current build. */
export function cancelServerBuildActivation(ladderId: string): Promise<ServerBuildState> {
  return apiRequest<ServerBuildState>(`/admin/ladders/${ladderId}/server-builds/activation/cancel`, { method: 'POST' }, true);
}

/**
 * Who would receive an announcement sent right now, without sending one.
 *
 * Worth checking before writing the message rather than after sending it: the
 * recipient count on a send is the first and only feedback otherwise, and by
 * then the announcement has already gone.
 */
export function getAnnouncementListeners(): Promise<AnnouncementListeners> {
  return apiRequest<AnnouncementListeners>('/admin/announcements/listeners', {}, true);
}

export function sendAnnouncement(message: string): Promise<SendAnnouncementResponse> {
  return apiRequest<SendAnnouncementResponse>('/admin/announcements', {
    method: 'POST',
    body: JSON.stringify({ message })
  }, true);
}
