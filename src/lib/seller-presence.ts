import { parseUtc, relativeAge } from './utc-time.js';

const onlineWindowMs = 60 * 60 * 1000;

export interface SellerPresence {
  online: boolean;
  label: string;
}

// The API rounds this time up to a quarter hour and leaves it out for a seller
// it has not seen, so it can be slightly ahead of the clock or missing entirely.
export function sellerPresence(lastSeenAtUtc: string | null | undefined, now = Date.now()): SellerPresence {
  const lastSeen = lastSeenAtUtc ? parseUtc(lastSeenAtUtc).getTime() : Number.NaN;
  if (Number.isNaN(lastSeen)) return { online: false, label: 'Offline' };
  if (now - lastSeen < onlineWindowMs) return { online: true, label: 'Online within the last hour' };
  return { online: false, label: `Last online ${relativeAge(lastSeenAtUtc!, now)}` };
}
