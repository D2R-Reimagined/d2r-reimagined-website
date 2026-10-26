/** The URL shown in the address bar. After shallow navigations, SvelteKit's `page.url`
 * still holds the last navigated URL, so URL writers must start from the location instead or they
 * restore parameters the user already changed. Outside the browser the fallback is used. Always
 * returns a mutable copy, since `page.url` is readonly. */
export function currentUrl(fallback: { readonly href: string }): URL {
  return new URL(typeof location === 'undefined' ? fallback.href : location.href);
}
