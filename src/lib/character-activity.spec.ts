import { describe, expect, it } from 'vitest';

import { formatLastLogged } from './character-activity';

const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;
const now = Date.parse('2026-09-03T18:00:00Z');

function ago(duration: number): string {
  return new Date(now - duration).toISOString();
}

describe('formatLastLogged', () => {
  it('uses minute labels through 60 minutes', () => {
    expect(formatLastLogged(ago(30 * 1000), now)).toBe('1 minute ago');
    expect(formatLastLogged(ago(60 * minute), now)).toBe('60 minutes ago');
  });

  it('uses hour labels after 60 minutes through 24 hours', () => {
    expect(formatLastLogged(ago(61 * minute), now)).toBe('1 hour ago');
    expect(formatLastLogged(ago(24 * hour), now)).toBe('24 hours ago');
  });

  it('uses day labels after 24 hours through 30 days', () => {
    expect(formatLastLogged(ago(25 * hour), now)).toBe('1 day ago');
    expect(formatLastLogged(ago(30 * day), now)).toBe('30 days ago');
  });

  it('uses month labels after 30 days', () => {
    expect(formatLastLogged(ago(31 * day), now)).toBe('1 month ago');
    expect(formatLastLogged(ago(90 * day), now)).toBe('3 months ago');
  });

  it('handles missing, invalid, and future timestamps safely', () => {
    expect(formatLastLogged(null, now)).toBe('Unknown');
    expect(formatLastLogged('not-a-date', now)).toBe('Unknown');
    expect(formatLastLogged(new Date(now + hour).toISOString(), now)).toBe('1 minute ago');
  });
});
