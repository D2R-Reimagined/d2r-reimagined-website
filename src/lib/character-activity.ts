const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;
const month = 30 * day;

function elapsedLabel(value: number, unit: string): string {
  return `${value} ${unit}${value === 1 ? '' : 's'} ago`;
}

export function formatLastLogged(timestamp: string | null, now = Date.now()): string {
  if (!timestamp) return 'Unknown';

  const loggedAt = Date.parse(timestamp);
  if (!Number.isFinite(loggedAt)) return 'Unknown';

  const elapsed = Math.max(0, now - loggedAt);
  if (elapsed <= 60 * minute) {
    return elapsedLabel(Math.max(1, Math.floor(elapsed / minute)), 'minute');
  }
  if (elapsed <= 24 * hour) {
    return elapsedLabel(Math.max(1, Math.floor(elapsed / hour)), 'hour');
  }
  if (elapsed <= 30 * day) {
    return elapsedLabel(Math.max(1, Math.floor(elapsed / day)), 'day');
  }
  return elapsedLabel(Math.max(1, Math.floor(elapsed / month)), 'month');
}
