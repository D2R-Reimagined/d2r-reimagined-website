import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$lib/auth', () => ({ apiRequest: vi.fn() }));
import { apiRequest } from '$lib/auth';
import { canUseTesterSaves, getTesterLadders, testerSaveError, uploadTesterSave } from './tester-saves';

describe('tester save uploads', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows tester access only with the explicit Tester role', () => {
    for (const roles of [undefined, [], ['Admin'], ['Moderator']]) expect(canUseTesterSaves(roles)).toBe(false);
    expect(canUseTesterSaves(['Tester'])).toBe(true);
    expect(canUseTesterSaves(['Admin', 'Tester'])).toBe(true);
  });

  it('loads eligible ladders with authentication', async () => {
    vi.mocked(apiRequest).mockResolvedValue([]);
    await getTesterLadders();
    expect(apiRequest).toHaveBeenCalledWith('/testers/ladders', {}, true);
  });

  it('uploads the exact file as authenticated multipart to the selected ladder', async () => {
    const file = new File([new Uint8Array([0, 255, 42])], 'Tester.d2s');
    await uploadTesterSave('hidden-id', file);
    const [path, init, authenticated] = vi.mocked(apiRequest).mock.calls[0];
    expect(path).toBe('/testers/ladders/hidden-id/saves');
    expect(authenticated).toBe(true);
    expect(init?.method).toBe('POST');
    const uploaded = (init?.body as FormData).get('file') as File;
    expect(uploaded.name).toBe(file.name);
    expect(await uploaded.arrayBuffer()).toEqual(await file.arrayBuffer());
    expect(init?.headers).toBeUndefined();
  });

  it('rejects missing, empty, oversized, and non-character files before sending', () => {
    expect(testerSaveError(undefined)).toContain('Choose');
    for (const file of [new File([], 'Empty.d2s'), new File(['stash'], 'stash.d2i'),
      new File([new Uint8Array(1024 * 1024 + 1)], 'Large.d2s')]) {
      expect(() => uploadTesterSave('hidden-id', file)).toThrow();
    }
    expect(() => uploadTesterSave('', new File(['save'], 'Test.d2s'))).toThrow('Choose a hidden');
    expect(apiRequest).not.toHaveBeenCalled();
    expect(testerSaveError(new File(['save'], 'Test.D2S'))).toBeNull();
  });

  it('preserves server conflict and access errors for the page', async () => {
    vi.mocked(apiRequest).mockRejectedValue(new Error('Already exists'));
    await expect(uploadTesterSave('hidden-id', new File(['save'], 'Test.d2s'))).rejects.toThrow('Already exists');
  });
});
