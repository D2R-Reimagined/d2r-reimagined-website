/** The URL shown in the address bar. After shallow `replaceState` updates, SvelteKit's `page.url`
 * still holds the last navigated URL, so URL writers must start from the location instead or they
 * restore parameters the user already changed. Outside the browser the fallback is used. */
export function currentUrl(fallback: URL): URL {
  return new URL(typeof location === 'undefined' ? fallback : location.href);
}
