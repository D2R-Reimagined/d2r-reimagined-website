import type { ServerBuild, ServerBuildState } from '$lib/admin';

// Pure helpers for the server build channel (d2rl-d2rds.dll), shared by the
// ladder admin panel and the monitoring cards.

export const serverBuildFileName = 'd2rl-d2rds.dll';
export const maxServerBuildBytes = 64 * 1024 * 1024;
export const maxServerBuildNotes = 500;

/** What a server's supervisor last reported installed; `buildId` is null for bytes no upload matches. */
export interface InstalledServerBuild {
  buildId?: string | null;
  sha256: string;
  reportedAtUtc: string;
}

export type InstalledBuildMatch = 'up-to-date' | 'outdated' | 'unknown-build' | 'not-reported';

export const installedBuildLabels: Record<InstalledBuildMatch, string> = {
  'up-to-date': 'Up to date',
  outdated: 'Outdated',
  'unknown-build': 'Unknown build',
  'not-reported': 'Not reported'
};

export function shortSha(sha256: string, length = 12): string {
  return sha256.slice(0, length).toUpperCase();
}

export function shortBuildId(id: string): string {
  return id.slice(0, 8);
}

export function currentServerBuild(state: ServerBuildState | null | undefined): ServerBuild | null {
  return state?.currentBuildId ? state.builds.find(build => build.id === state.currentBuildId) ?? null : null;
}

export function pendingServerBuild(state: ServerBuildState | null | undefined): ServerBuild | null {
  const pending = state?.pending;
  return pending ? state.builds.find(build => build.id === pending.buildId) ?? null : null;
}

/** Activating a build uploaded before the current one rolls the ladder's servers back. */
export function isServerBuildRollback(state: ServerBuildState, build: ServerBuild): boolean {
  const current = currentServerBuild(state);
  return !!current && current.id !== build.id && Date.parse(build.uploadedAtUtc) < Date.parse(current.uploadedAtUtc);
}

/** `m:ss` until the deadline, never negative. */
export function serverBuildCountdown(activatesAtUtc: string, nowMs: number): string {
  const seconds = Math.max(0, Math.ceil((Date.parse(activatesAtUtc) - nowMs) / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

/** The reason an upload would be refused before sending it, or null; the API checks the same rules. */
export function serverBuildUploadProblem(file: { name: string; size: number } | null, notes: string): string | null {
  if (!file) return `Choose ${serverBuildFileName} to upload.`;
  if (file.name.trim().toLowerCase() !== serverBuildFileName) return `A server build must be the file ${serverBuildFileName}.`;
  if (file.size <= 0 || file.size > maxServerBuildBytes) return 'A server build must be between 1 byte and 64 MiB.';
  if (notes.trim().length > maxServerBuildNotes) return `Notes are limited to ${maxServerBuildNotes} characters.`;
  return null;
}

/**
 * How a server's installed build compares with its ladder's current one. Null
 * when it cannot be compared: the ladder's builds are not loaded yet, or the
 * ladder has no current build.
 */
export function installedBuildMatch(installed: InstalledServerBuild | null | undefined,
  state: ServerBuildState | null | undefined): InstalledBuildMatch | null {
  if (!installed) return 'not-reported';
  if (!installed.buildId) return 'unknown-build';
  const current = currentServerBuild(state);
  if (!current) return null;
  return installed.buildId === current.id || installed.sha256.toUpperCase() === current.sha256.toUpperCase()
    ? 'up-to-date' : 'outdated';
}
