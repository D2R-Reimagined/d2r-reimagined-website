import { afterEach, describe, expect, it, vi } from 'vitest';
import { get } from 'svelte/store';

vi.mock('$app/environment', () => ({ browser: true }));
vi.mock('$env/dynamic/public', () => ({ env: { PUBLIC_API_BASE_URL: 'https://api.example' } }));
import { authState, completeSteamSignIn, refreshProfile, updateProfile } from './auth';

afterEach(() => {
  vi.unstubAllGlobals();
  authState.set({ ready: false, user: null });
});

describe('Steam username setup', () => {
  it('keeps the signup requirement when completing sign-in and reloading the profile', async () => {
    const user = { id: 'new-user', displayName: 'Steam-12345678', email: '', requiresUsername: true };
    const fetch = vi.fn()
      .mockResolvedValueOnce(Response.json({ accessToken: 'token', user }))
      .mockResolvedValueOnce(Response.json(user));
    vi.stubGlobal('fetch', fetch);
    vi.stubGlobal('localStorage', { getItem: () => 'token', setItem: vi.fn() });
    expect((await completeSteamSignIn()).requiresUsername).toBe(true);
    expect((await refreshProfile()).requiresUsername).toBe(true);
    expect(get(authState).user?.requiresUsername).toBe(true);
  });

  it('saves a username without sending an empty email and updates the session', async () => {
    const user = { id: 'new-user', displayName: 'NewPlayer', email: '', requiresUsername: false };
    const fetch = vi.fn().mockResolvedValue(Response.json(user));
    vi.stubGlobal('fetch', fetch);
    vi.stubGlobal('localStorage', { getItem: () => 'token' });
    await updateProfile(undefined, 'NewPlayer');
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ displayName: 'NewPlayer' });
    expect(get(authState).user).toEqual(user);
  });

  it('keeps the prompt active when a username is taken', async () => {
    const user = { id: 'new-user', requiresUsername: true };
    authState.set({ ready: true, user: user as never });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ detail: 'That display name is already in use.' }, { status: 409 })));
    vi.stubGlobal('localStorage', { getItem: () => 'token' });
    await expect(updateProfile(undefined, 'Taken')).rejects.toThrow('already in use');
    expect(get(authState).user?.requiresUsername).toBe(true);
  });
});
