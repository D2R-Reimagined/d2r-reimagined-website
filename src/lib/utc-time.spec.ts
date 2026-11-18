import { describe, expect, it } from 'vitest';

import {
  formatChatTimestamp,
  formatLocalDateTime,
  formatUtcIso,
  parseUtc,
  relativeAge
} from './utc-time.js';

describe('parseUtc', () => {
  it('reads a timestamp with no offset as UTC', () => {
    expect(parseUtc('2026-11-05T21:45:57.666368').toISOString()).toBe('2026-11-05T21:45:57.666Z');
    expect(parseUtc('2026-11-12').toISOString()).toBe('2026-11-12T00:00:00.000Z');
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

describe('local chat timestamp formatting', () => {
  it('treats offset-less API timestamps identically to Z-suffixed timestamps', () => {
    const withoutZ = '2026-11-12T03:15:00';
    const withZ = '2026-11-12T03:15:00Z';
    expect(formatLocalDateTime(withoutZ, 'en-US')).toBe(formatLocalDateTime(withZ, 'en-US'));
    expect(formatUtcIso(withoutZ)).toBe('2026-11-12T03:15:00.000Z');
  });

  it('formats same-day, earlier-in-year, and cross-year chat timestamps in viewer local time', () => {
    const now = new Date(2026, 10, 12, 16, 0, 0);
    const sameDayLocal = new Date(2026, 10, 12, 9, 5, 0);
    const previousDayLocal = new Date(2026, 10, 11, 21, 30, 0);
    const previousYearLocal = new Date(2025, 11, 31, 23, 45, 0);
    const toOffsetlessUtc = (date: Date) => date.toISOString().replace(/Z$/, '');

    const sameDayText = formatChatTimestamp(toOffsetlessUtc(sameDayLocal), now, 'en-US');
    expect(sameDayText).toBe(
      new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(sameDayLocal)
    );
    expect(sameDayText).not.toContain('Nov');

    expect(formatChatTimestamp(toOffsetlessUtc(previousDayLocal), now, 'en-US')).toContain('Nov 11');
    expect(formatChatTimestamp(toOffsetlessUtc(previousYearLocal), now, 'en-US')).toContain('2025');
  });

  it('handles empty or invalid timestamp values without throwing', () => {
    expect(formatChatTimestamp('')).toBe('');
    expect(formatChatTimestamp(null)).toBe('');
    expect(formatChatTimestamp('not-a-date')).toBe('');
    expect(formatLocalDateTime('not-a-date')).toBe('');
    expect(formatUtcIso('')).toBeUndefined();
    expect(formatUtcIso('not-a-date')).toBeUndefined();
  });
});
