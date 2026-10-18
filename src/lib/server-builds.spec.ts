import { describe, expect, it } from 'vitest';
import type { ServerBuild, ServerBuildState } from '$lib/admin';
import {
  currentServerBuild,
  installedBuildMatch,
  isServerBuildRollback,
  pendingServerBuild,
  serverBuildCountdown,
  serverBuildUploadProblem,
  shortBuildId,
  shortSha
} from './server-builds';

const sha = (digit: string) => digit.repeat(64);
const build = (id: string, uploadedAtUtc: string, status: ServerBuild['status'], digit: string): ServerBuild =>
  ({ id, ladderId: 'ladder', sha256: sha(digit), sizeBytes: 1024, uploadedAtUtc, status });
const newest = build('cccccccc-0000-0000-0000-000000000003', '2026-10-18T12:00:00Z', 'pending', 'C');
const middle = build('bbbbbbbb-0000-0000-0000-000000000002', '2026-10-17T12:00:00Z', 'current', 'B');
const oldest = build('aaaaaaaa-0000-0000-0000-000000000001', '2026-10-16T12:00:00Z', 'available', 'A');
const state: ServerBuildState = { ladderId: 'ladder', currentBuildId: middle.id,
  pending: { buildId: newest.id, activatesAtUtc: '2026-10-18T12:05:00Z' }, builds: [newest, middle, oldest] };

describe('server build display', () => {
  it('shortens build ids and hashes without losing their prefix', () => {
    expect(shortBuildId(middle.id)).toBe('bbbbbbbb');
    expect(shortSha('ab'.repeat(32))).toBe('ABABABABABAB');
    expect(shortSha(sha('F'), 8)).toBe('FFFFFFFF');
  });

  it('finds the current and pending builds, and none when the state omits them', () => {
    expect(currentServerBuild(state)).toBe(middle);
    expect(pendingServerBuild(state)).toBe(newest);
    const idle: ServerBuildState = { ladderId: 'ladder', currentBuildId: null, builds: [oldest] };
    expect(currentServerBuild(idle)).toBeNull();
    expect(pendingServerBuild(idle)).toBeNull();
    expect(currentServerBuild(null)).toBeNull();
  });

  it('calls activating a build older than the current one a rollback', () => {
    expect(isServerBuildRollback(state, oldest)).toBe(true);
    expect(isServerBuildRollback(state, newest)).toBe(false);
    expect(isServerBuildRollback(state, middle)).toBe(false);
    expect(isServerBuildRollback({ ...state, currentBuildId: null }, oldest)).toBe(false);
  });

  it('counts down in minutes and seconds and stops at zero', () => {
    const now = Date.parse('2026-10-18T12:00:00Z');
    expect(serverBuildCountdown('2026-10-18T12:05:00Z', now)).toBe('5:00');
    expect(serverBuildCountdown('2026-10-18T12:00:09.200Z', now)).toBe('0:10');
    expect(serverBuildCountdown('2026-10-18T11:59:00Z', now)).toBe('0:00');
  });
});

describe('server build upload checks', () => {
  it('accepts only d2rl-d2rds.dll up to 64 MiB with short notes', () => {
    expect(serverBuildUploadProblem({ name: 'D2RL-D2RDS.dll', size: 1024 }, 'fix')).toBeNull();
    expect(serverBuildUploadProblem(null, '')).toContain('Choose');
    expect(serverBuildUploadProblem({ name: 'd2rl-maps.dll', size: 1024 }, '')).toContain('must be the file');
    expect(serverBuildUploadProblem({ name: 'd2rl-d2rds.dll', size: 0 }, '')).toContain('64 MiB');
    expect(serverBuildUploadProblem({ name: 'd2rl-d2rds.dll', size: 64 * 1024 * 1024 + 1 }, '')).toContain('64 MiB');
    expect(serverBuildUploadProblem({ name: 'd2rl-d2rds.dll', size: 1 }, 'x'.repeat(501))).toContain('500');
  });
});

describe('installed server build', () => {
  const reportedAtUtc = '2026-10-18T12:00:00Z';

  it('matches a server to its ladder current build by id or hash', () => {
    expect(installedBuildMatch({ buildId: middle.id, sha256: middle.sha256, reportedAtUtc }, state)).toBe('up-to-date');
    expect(installedBuildMatch({ buildId: middle.id, sha256: middle.sha256.toLowerCase(), reportedAtUtc }, state)).toBe('up-to-date');
    expect(installedBuildMatch({ buildId: oldest.id, sha256: oldest.sha256, reportedAtUtc }, state)).toBe('outdated');
    expect(installedBuildMatch({ buildId: newest.id, sha256: newest.sha256, reportedAtUtc }, state)).toBe('outdated');
  });

  it('reports unknown bytes and missing reports whether or not the ladder is loaded', () => {
    expect(installedBuildMatch(undefined, state)).toBe('not-reported');
    expect(installedBuildMatch(null, undefined)).toBe('not-reported');
    expect(installedBuildMatch({ buildId: null, sha256: sha('D'), reportedAtUtc }, state)).toBe('unknown-build');
    expect(installedBuildMatch({ sha256: sha('D'), reportedAtUtc }, undefined)).toBe('unknown-build');
  });

  it('cannot compare until the ladder has a current build loaded', () => {
    const installed = { buildId: middle.id, sha256: middle.sha256, reportedAtUtc };
    expect(installedBuildMatch(installed, undefined)).toBeNull();
    expect(installedBuildMatch(installed, { ...state, currentBuildId: null })).toBeNull();
  });
});
