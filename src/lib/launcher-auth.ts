export interface LauncherAuthorizationParameters {
  redirectUri: string;
  codeChallenge: string;
  state: string;
}

const base64UrlPattern = /^[A-Za-z0-9_-]{43}$/;
const statePattern = /^[A-Za-z0-9._~-]{32,256}$/;

export function readLauncherAuthorizationParameters(
  searchParams: URLSearchParams
): LauncherAuthorizationParameters | null {
  const redirectUri = searchParams.get('redirect_uri');
  const codeChallenge = searchParams.get('code_challenge');
  const state = searchParams.get('state');
  if (!redirectUri || !codeChallenge || !state) return null;

  let redirect: URL;
  try {
    redirect = new URL(redirectUri);
  } catch {
    return null;
  }

  const isLoopback = redirect.hostname === '127.0.0.1' || redirect.hostname === '[::1]';
  if (
    redirect.protocol !== 'http:' ||
    !isLoopback ||
    !redirect.port ||
    redirect.pathname !== '/oauth/callback' ||
    redirect.search ||
    redirect.hash ||
    !base64UrlPattern.test(codeChallenge) ||
    !statePattern.test(state)
  ) {
    return null;
  }

  return { redirectUri: redirect.href, codeChallenge, state };
}

export function safeInternalReturnTo(value: string | null): string | null {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return null;
  try {
    const parsed = new URL(value, 'https://www.d2r-reimagined.com');
    return parsed.origin === 'https://www.d2r-reimagined.com'
      ? `${parsed.pathname}${parsed.search}${parsed.hash}`
      : null;
  } catch {
    return null;
  }
}

export function launcherCancellationUrl(
  parameters: LauncherAuthorizationParameters
): string {
  const callback = new URL(parameters.redirectUri);
  callback.searchParams.set('error', 'access_denied');
  callback.searchParams.set('state', parameters.state);
  return callback.href;
}
