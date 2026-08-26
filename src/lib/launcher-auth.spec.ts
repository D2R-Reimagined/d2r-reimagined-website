import { describe, expect, it } from 'vitest';
import {
  launcherCancellationUrl,
  readLauncherAuthorizationParameters,
  safeInternalReturnTo
} from './launcher-auth';

const challenge = 'A'.repeat(43);
const state = 'B'.repeat(43);

describe('launcher authorization helpers', () => {
  it('accepts an IPv4 loopback callback with PKCE', () => {
    const query = new URLSearchParams({
      redirect_uri: 'http://127.0.0.1:49152/oauth/callback',
      code_challenge: challenge,
      state
    });

    expect(readLauncherAuthorizationParameters(query)).toEqual({
      redirectUri: 'http://127.0.0.1:49152/oauth/callback',
      codeChallenge: challenge,
      state
    });
  });

  it('rejects non-loopback and malformed callbacks', () => {
    for (const redirectUri of [
      'https://example.com/oauth/callback',
      'http://localhost:49152/oauth/callback',
      'http://127.0.0.1:49152/other',
      'http://127.0.0.1/oauth/callback'
    ]) {
      expect(readLauncherAuthorizationParameters(new URLSearchParams({
        redirect_uri: redirectUri,
        code_challenge: challenge,
        state
      }))).toBeNull();
    }
  });

  it('only permits same-site return paths', () => {
    expect(safeInternalReturnTo('/launcher/authorize?state=abc')).toBe('/launcher/authorize?state=abc');
    expect(safeInternalReturnTo('//example.com')).toBeNull();
    expect(safeInternalReturnTo('https://example.com')).toBeNull();
  });

  it('creates a state-bound cancellation callback', () => {
    const url = launcherCancellationUrl({
      redirectUri: 'http://127.0.0.1:49152/oauth/callback',
      codeChallenge: challenge,
      state
    });
    expect(url).toBe(`http://127.0.0.1:49152/oauth/callback?error=access_denied&state=${state}`);
  });
});
