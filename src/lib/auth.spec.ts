import { afterEach, describe, expect, it, vi } from 'vitest';
import { get } from 'svelte/store';

vi.mock('$app/environment', () => ({ browser: true }));
vi.mock('$env/dynamic/public', () => ({ env: { PUBLIC_API_BASE_URL: 'https://api.example' } }));
import {
  authState,
  completeSteamSignIn,
  refreshProfile,
  requestPasswordReset,
  resetPassword,
  updateProfile
} from './auth';

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

describe('password reset', () => {
  it('asks the API to email a link back to the reset page without needing a session', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetch);
    vi.stubGlobal('localStorage', { getItem: () => null });
    await requestPasswordReset('  player@example.test ', 'https://www.d2r-reimagined.com/reset-password');
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe('https://api.example/auth/password/forgot');
    expect(init.method).toBe('POST');
    expect(new Headers(init.headers).has('Authorization')).toBe(false);
    expect(JSON.parse(init.body)).toEqual({
      email: 'player@example.test',
      resetUrl: 'https://www.d2r-reimagined.com/reset-password'
    });
  });

  it('explains rate limiting in plain words', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ title: 'Too many requests' }, { status: 429 })));
    vi.stubGlobal('localStorage', { getItem: () => null });
    await expect(requestPasswordReset('player@example.test', 'https://x.test/reset-password')).rejects.toThrow('wait a minute');
  });

  it('sets the new password and clears this browser\'s now-revoked session', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    const removeItem = vi.fn();
    vi.stubGlobal('fetch', fetch);
    vi.stubGlobal('localStorage', { getItem: () => 'old-token', removeItem });
    authState.set({ ready: true, user: { id: 'u' } as never });
    await resetPassword('3f2504e0-4f89-11d3-9a0c-0305e82c3301', '123.abc', 'New-password-1');
    expect(fetch.mock.calls[0][0]).toBe('https://api.example/auth/password/reset');
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
      userId: '3f2504e0-4f89-11d3-9a0c-0305e82c3301', token: '123.abc', newPassword: 'New-password-1'
    });
    expect(removeItem).toHaveBeenCalledWith('d2r_reimagined_access_token');
    expect(get(authState).user).toBeNull();
  });

  it('surfaces an expired link and keeps the session untouched', async () => {
    const detail = 'This password reset link is invalid or has expired. Request a new one and try again.';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ detail }, { status: 400 })));
    const removeItem = vi.fn();
    vi.stubGlobal('localStorage', { getItem: () => null, removeItem });
    await expect(resetPassword('id', 'bad', 'New-password-1')).rejects.toThrow('expired');
    expect(removeItem).not.toHaveBeenCalled();
  });
});