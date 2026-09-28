import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ api: vi.fn() }));
vi.mock('$lib/auth', () => ({ apiRequest: mocks.api, apiUploadRequest: vi.fn() }));

import { getLadders } from './admin';

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
