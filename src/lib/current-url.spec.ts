import { afterEach, describe, expect, it, vi } from 'vitest';
import { currentUrl } from './current-url';

describe('current address bar URL', () => {
  afterEach(() => vi.unstubAllGlobals());
  it('prefers the location over a stale navigation URL', () => {
    vi.stubGlobal('location', { href: 'https://example.com/data/drop-calculator?type=rune' });
    const url = currentUrl(new URL('https://example.com/data/drop-calculator?item=unique%3AHarlequin%20Crest'));
    expect(url.search).toBe('?type=rune');
  });
  it('falls back to the given URL without a browser and returns a copy', () => {
    const fallback = new URL('https://example.com/data/drop-calculator?item=x');
    const url = currentUrl(fallback);
    expect(url.href).toBe(fallback.href);
    url.searchParams.delete('item');
    expect(fallback.searchParams.get('item')).toBe('x');
  });
});
