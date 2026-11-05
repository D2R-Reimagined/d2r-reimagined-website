import { describe, expect, it } from 'vitest';

import { parseUtc, relativeAge } from './utc-time.js';

describe('parseUtc', () => {
  it('reads a timestamp with no offset as UTC', () => {
    expect(parseUtc('2026-11-05T21:45:57.666368').toISOString()).toBe('2026-11-05T21:45:57.666Z');
  });

  it('keeps an offset the timestamp already has', () => {
    expect(parseUtc('2026-11-05T21:45:57Z').toISOString()).toBe('2026-11-05T21:45:57.000Z');
    expect(parseUtc('2026-11-05T16:45:57-05:00').toISOString()).toBe('2026-11-05T21:45:57.000Z');
  });
});

describe('relativeAge', () => {
  const now = Date.parse('2026-11-05T12:00:00Z');
  const before = (seconds: number) => new Date(now - seconds * 1000).toISOString().replace('Z', '');

  it.each([
    [0, 'just now'],
    [59, 'just now'],
    [60, '1m ago'],
    [5 * 60, '5m ago'],
    [17 * 60 + 30, '17m ago'],
    [59 * 60 + 59, '59m ago'],
    [3600, '1h ago'],
    [23 * 3600, '23h ago'],
    [86400, '1d ago'],
    [10 * 86400, '10d ago']
  ])('words an age of %i seconds as "%s"', (seconds, label) => {
    expect(relativeAge(before(seconds), now)).toBe(label);
  });

  it('treats a slightly ahead clock or a bad value as just now', () => {
    expect(relativeAge(before(-30), now)).toBe('just now');
    expect(relativeAge('not a date', now)).toBe('just now');
  });
});
