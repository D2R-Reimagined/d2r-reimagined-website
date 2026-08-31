import { describe, expect, it } from 'vitest';

import { defaultLadder, isLadderRunning, type LadderSummary } from './ladder-schedule';

const now = new Date('2026-06-15T00:00:00Z');

function ladder(id: string, start: string, end: string): LadderSummary {
  return { id, name: id, startDateUtc: start, endDateUtc: end, allowedExtensions: [] };
}

const finished = ladder('finished', '2026-01-01T00:00:00Z', '2026-03-01T00:00:00Z');
const running = ladder('running', '2026-06-01T00:00:00Z', '2026-09-01T00:00:00Z');
const scheduled = ladder('scheduled', '2026-11-01T00:00:00Z', '2027-01-01T00:00:00Z');
const recentlyFinished = ladder('recent', '2026-04-01T00:00:00Z', '2026-05-01T00:00:00Z');

describe('isLadderRunning', () => {
  it('includes the start instant and excludes the end instant', () => {
    const window = ladder('window', '2026-06-15T00:00:00Z', '2026-07-01T00:00:00Z');

    expect(isLadderRunning(window, new Date('2026-06-15T00:00:00Z'))).toBe(true);
    expect(isLadderRunning(window, new Date('2026-07-01T00:00:00Z'))).toBe(false);
  });

  it('excludes ladders that have not started', () => {
    expect(isLadderRunning(scheduled, now)).toBe(false);
  });
});

describe('defaultLadder', () => {
  it('prefers a running ladder over a finished or scheduled one', () => {
    expect(defaultLadder([finished, scheduled, running], now)?.id).toBe('running');
  });

  it('picks the most recently started ladder when several are running', () => {
    const earlier = ladder('earlier', '2026-05-01T00:00:00Z', '2026-09-01T00:00:00Z');

    expect(defaultLadder([earlier, running], now)?.id).toBe('running');
  });

  it('falls back to the most recently finished ladder', () => {
    expect(defaultLadder([finished, recentlyFinished, scheduled], now)?.id).toBe('recent');
  });

  // A ladder that has not started has no standings, so it is never the board a
  // visitor lands on.
  it('returns null when only scheduled ladders exist', () => {
    expect(defaultLadder([scheduled], now)).toBeNull();
  });

  it('returns null when there are no ladders at all', () => {
    expect(defaultLadder([], now)).toBeNull();
  });
});
