import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import { get, writable } from 'svelte/store';

const tokenStorageKey = 'd2r_reimagined_access_token';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  battleTag: string | null;
  battleNetId: string | null;
  steamId: string | null;
  roles: string[];
  createdAtUtc: string;
}

interface AuthResponse {
  accessToken: string;
  expiresAtUtc: string;
  user: UserProfile;
}

interface AccountLinkTicketResponse {
  url: string;
}

interface AuthState {
  ready: boolean;
  user: UserProfile | null;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

export const authState = writable<AuthState>({ ready: false, user: null });

let initialization: Promise<void> | null = null;

function apiBaseUrl(): string {
  return (env.PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
}

function accessToken(): string | null {
  return browser ? localStorage.getItem(tokenStorageKey) : null;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  authenticated: boolean | 'optional' = false
): Promise<T> {
  const headers = new Headers(init.headers);
  const isFormData = typeof FormData !== 'undefined' && init.body instanceof FormData;
  if (init.body && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (authenticated) {
    const token = accessToken();
    if (!token && authenticated === true) throw new ApiError('You need to sign in first.', 401);
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    headers
  });
  if (!response.ok) {
    const problem = await response.json().catch(() => null) as { detail?: string; title?: string } | null;
    throw new ApiError(
      problem?.detail || problem?.title || `Request failed with status ${response.status}.`,
      response.status
    );
  }

  if (response.status === 204) return undefined as T;
  return await response.json() as T;
}

function storeSession(response: AuthResponse): UserProfile {
  localStorage.setItem(tokenStorageKey, response.accessToken);
  authState.set({ ready: true, user: response.user });
  return response.user;
}

export function initializeAuth(): Promise<void> {
  if (!browser) return Promise.resolve();
  if (initialization) return initialization;

  initialization = (async () => {
    if (!accessToken()) {
      authState.set({ ready: true, user: null });
      return;
    }

    try {
      await refreshProfile();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        localStorage.removeItem(tokenStorageKey);
        authState.set({ ready: true, user: null });
        return;
      }

      authState.update((state) => ({ ...state, ready: true }));
    }
  })();

  return initialization;
}

export async function register(
  email: string,
  password: string,
  displayName: string,
  battleTag: string
): Promise<UserProfile> {
  const response = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      displayName,
      battleTag: battleTag.trim() || null
    })
  });
  return storeSession(response);
}

export async function signIn(email: string, password: string): Promise<UserProfile> {
  try {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    return storeSession(response);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      throw new Error('The email or password is incorrect.');
    }
    throw error;
  }
}

export async function refreshProfile(): Promise<UserProfile> {
  const user = await apiRequest<UserProfile>('/users/me', {}, true);
  authState.set({ ready: true, user });
  return user;
}

export async function updateProfile(email: string, displayName: string): Promise<UserProfile> {
  const user = await apiRequest<UserProfile>(
    '/users/me',
    {
      method: 'PATCH',
      body: JSON.stringify({ email, displayName })
    },
    true
  );
  authState.set({ ready: true, user });
  return user;
}

export function signOut(): void {
  if (browser) localStorage.removeItem(tokenStorageKey);
  authState.set({ ready: true, user: null });
}

export function beginSteamSignIn(returnUrl: string): void {
  const url = new URL('/auth/steam/login', `${apiBaseUrl()}/`);
  url.searchParams.set('returnUrl', returnUrl);
  window.location.assign(url);
}

export async function completeSteamSignIn(): Promise<UserProfile> {
  const response = await apiRequest<AuthResponse>('/auth/steam/session', {
    method: 'POST',
    credentials: 'include'
  });
  return storeSession(response);
}

export async function beginSteamLink(returnUrl: string): Promise<void> {
  const result = await apiRequest<AccountLinkTicketResponse>(
    '/auth/steam/link-ticket',
    {
      method: 'POST',
      body: JSON.stringify({ returnUrl })
    },
    true
  );
  window.location.assign(result.url);
}

export async function unlinkSteam(): Promise<UserProfile> {
  await apiRequest('/auth/steam/link', { method: 'DELETE' }, true);
  return await refreshProfile();
}

export async function beginBattleNetLink(returnUrl: string): Promise<void> {
  const result = await apiRequest<AccountLinkTicketResponse>(
    '/auth/battlenet/link-ticket',
    {
      method: 'POST',
      body: JSON.stringify({ returnUrl })
    },
    true
  );
  window.location.assign(result.url);
}

export async function unlinkBattleNet(): Promise<UserProfile> {
  await apiRequest('/auth/battlenet/link', { method: 'DELETE' }, true);
  return await refreshProfile();
}

export function currentUser(): UserProfile | null {
  return get(authState).user;
}
