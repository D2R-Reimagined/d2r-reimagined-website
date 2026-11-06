import { describe, expect, it } from 'vitest';

import { sellerPresence } from './seller-presence.js';

describe('sellerPresence', () => {
  const now = Date.parse('2026-11-05T12:00:00Z');
  const minutesAgo = (minutes: number) => new Date(now - minutes * 60_000).toISOString();

  it('is online within the hour', () => {
    expect(sellerPresence(minutesAgo(0), now)).toEqual({ online: true, label: 'Online within the last hour' });
    expect(sellerPresence(minutesAgo(59), now).online).toBe(true);
  });

  it('is online for a time rounded up past the viewer clock', () => {
    expect(sellerPresence(minutesAgo(-14), now).online).toBe(true);
  });

  it('is offline from one hour on, and says when they were last seen', () => {
    expect(sellerPresence(minutesAgo(60), now)).toEqual({ online: false, label: 'Last online 1h ago' });
    expect(sellerPresence(minutesAgo(3 * 24 * 60), now)).toEqual({ online: false, label: 'Last online 3d ago' });
  });

  it('reads the offset the API sends', () => {
    expect(sellerPresence('2026-11-05T11:30:00+00:00', now).online).toBe(true);
    expect(sellerPresence('2026-11-05T06:30:00-05:00', now).online).toBe(true);
    expect(sellerPresence('2026-11-05T05:30:00-05:00', now).online).toBe(false);
  });

  it('is plainly offline with no time, or a time it cannot read', () => {
    for (const value of [undefined, null, '', 'not a date']) {
      expect(sellerPresence(value, now)).toEqual({ online: false, label: 'Offline' });
    }
  });
});
