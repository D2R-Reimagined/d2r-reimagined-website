// The API stores UTC, but sends many timestamps without an offset. Browsers read those as
// local time, which puts them hours off for everyone outside UTC.
const hasOffset = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i;

export function parseUtc(value: string): Date {
  const text = value.trim();
  return new Date(hasOffset.test(text) ? text : `${text}Z`);
}

export function relativeAge(value: string, now = Date.now()): string {
  const seconds = Math.floor((now - parseUtc(value).getTime()) / 1000);
  if (!(seconds >= 60)) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
