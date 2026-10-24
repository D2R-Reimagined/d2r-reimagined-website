import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ api: vi.fn(), upload: vi.fn() }));
vi.mock('$lib/auth', () => ({ apiRequest: mocks.api, apiUploadRequest: mocks.upload }));

import {
  activateServerBuild,
  cancelServerBuildActivation,
  getServerBuilds,
  uploadServerBuild,
  getLadderAccess,
  getLadders,
  getLadderSaveEnforcement,
  grantLadderAccess,
  removeLadderD2RLoader,
  revokeLadderAccess,
  updateLadderSaveEnforcement,
  uploadLadderD2RLoader
} from './admin';

describe('admin ladder discovery', () => {
  it('reloads hidden ladders without a first bundle through authenticated management access', async () => {
    const hidden = { id: 'hidden-id', name: 'Testing', isHidden: true, activeBundle: null,
      allowedExtensions: [], startDateUtc: '2020-01-01T00:00:00Z', endDateUtc: '2099-01-01T00:00:00Z' };
    mocks.api.mockImplementation(async (path, _init, authenticated) =>
      path === '/admin/ladders' && authenticated === true ? [hidden] : []);

    expect(await getLadders()).toEqual([hidden]);
    expect(await getLadders()).toEqual([hidden]);
    expect(mocks.api).toHaveBeenCalledWith('/admin/ladders', {}, true);
  });
});

describe('admin ladder access', () => {
  it('lists, grants, and revokes one user on one ladder through authenticated management routes', async () => {
    mocks.api.mockReset().mockResolvedValue(undefined);
    await getLadderAccess('ladder-id');
    await grantLadderAccess('ladder-id', 'user-id');
    await revokeLadderAccess('ladder-id', 'user-id');
    expect(mocks.api.mock.calls).toEqual([
      ['/admin/ladders/ladder-id/access', { cache: 'no-store' }, true],
      ['/admin/ladders/ladder-id/access/user-id', { method: 'PUT' }, true],
      ['/admin/ladders/ladder-id/access/user-id', { method: 'DELETE' }, true]
    ]);
  });
});

describe('admin server builds', () => {
  it('lists, activates, and cancels one ladder\'s builds through authenticated management routes', async () => {
    mocks.api.mockReset().mockResolvedValue(undefined);
    await getServerBuilds('ladder-id');
    await activateServerBuild('ladder-id', 'build-id');
    await activateServerBuild('ladder-id', 'build-id', true);
    await cancelServerBuildActivation('ladder-id');
    expect(mocks.api.mock.calls).toEqual([
      ['/admin/ladders/ladder-id/server-builds', { cache: 'no-store' }, true],
      ['/admin/ladders/ladder-id/server-builds/build-id/activate?immediate=false', { method: 'POST' }, true],
      ['/admin/ladders/ladder-id/server-builds/build-id/activate?immediate=true', { method: 'POST' }, true],
      ['/admin/ladders/ladder-id/server-builds/activation/cancel', { method: 'POST' }, true]
    ]);
  });

  it('uploads the file and trimmed notes as multipart, leaving out empty notes', async () => {
    mocks.upload.mockReset().mockResolvedValue(undefined);
    const file = new File([new Uint8Array([0x4d, 0x5a])], 'd2rl-d2rds.dll');
    await uploadServerBuild('ladder-id', file, '  hotfix  ');
    await uploadServerBuild('ladder-id', file, '   ');
    const [path, withNotes] = mocks.upload.mock.calls[0] as [string, FormData];
    const withoutNotes = mocks.upload.mock.calls[1][1] as FormData;
    expect(path).toBe('/admin/ladders/ladder-id/server-builds');
    expect((withNotes.get('file') as File).name).toBe('d2rl-d2rds.dll');
    expect(withNotes.get('notes')).toBe('hotfix');
    expect(withoutNotes.has('notes')).toBe(false);
  });
});

describe('admin ladder save enforcement', () => {
  it('reads and replaces every switch for one ladder through authenticated management routes', async () => {
    mocks.api.mockReset().mockResolvedValue(undefined);
    const settings = {
      enforceProgression: true, enforceAffixRanges: false, enforceSaveChecksum: true, enforceUnwitnessedItems: false,
      enforceAreaBounds: false, enforceUnexplainedChanges: false, enforceRetainedDivestments: true,
      enforceJournalCoverage: true, enforceUnlocks: false, enforceServerAuthority: true
    };
    await getLadderSaveEnforcement('ladder-id');
    await updateLadderSaveEnforcement('ladder-id', settings);
    expect(mocks.api.mock.calls).toEqual([
      ['/admin/ladders/ladder-id/save-enforcement', { cache: 'no-store' }, true],
      ['/admin/ladders/ladder-id/save-enforcement', { method: 'PUT', body: JSON.stringify(settings) }, true]
    ]);
  });
});

describe('admin ladder D2RLoader pin', () => {
  it('uploads the release ZIP with its trimmed version and removes the pin through authenticated routes', async () => {
    mocks.upload.mockReset().mockResolvedValue(undefined);
    mocks.api.mockReset().mockResolvedValue(undefined);
    const file = new File([new Uint8Array([0x50, 0x4b])], 'D2RLoader-1.3.1-beta.zip');
    await uploadLadderD2RLoader('ladder-id', file, ' 1.3.1-beta ');
    await removeLadderD2RLoader('ladder-id');
    const [path, body] = mocks.upload.mock.calls[0] as [string, FormData];
    expect(path).toBe('/admin/ladders/ladder-id/d2rloader');
    expect((body.get('file') as File).name).toBe('D2RLoader-1.3.1-beta.zip');
    expect(body.get('version')).toBe('1.3.1-beta');
    expect(mocks.api.mock.calls).toEqual([['/admin/ladders/ladder-id/d2rloader', { method: 'DELETE' }, true]]);
  });
});