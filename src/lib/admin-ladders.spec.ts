import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ api: vi.fn() }));
vi.mock('$lib/auth', () => ({ apiRequest: mocks.api, apiUploadRequest: vi.fn() }));

import {
  getLadderAccess,
  getLadders,
  getLadderSaveEnforcement,
  grantLadderAccess,
  revokeLadderAccess,
  updateLadderSaveEnforcement
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
