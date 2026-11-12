// The API stores UTC, but sends many timestamps without an offset. Browsers read those as
// local time, which puts them hours off for everyone outside UTC.
const hasOffset = /T[^Z+-]*(?:Z|[+-]\d{2}(?::?\d{2})?)$/i;

export function parseUtc(value: string): Date {
  const text = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return new Date(`${text}T00:00:00Z`);
  return new Date(hasOffset.test(text) ? text : `${text}Z`);
}

export function formatUtcIso(value: string | null | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  const parsed = parseUtc(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

export function relativeAge(value: string, now = Date.now()): string {
  const seconds = Math.floor((now - parseUtc(value).getTime()) / 1000);
  if (!(seconds >= 60)) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function sameLocalDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

export function formatLocalDateTime(
  value: string | null | undefined,
  locales?: Intl.LocalesArgument,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!value?.trim()) return '';
  const date = parseUtc(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locales, options ?? {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

export function formatChatTimestamp(
  value: string | null | undefined,
  now: Date = new Date(),
  locales?: Intl.LocalesArgument
): string {
  if (!value?.trim()) return '';
  const date = parseUtc(value);
  if (Number.isNaN(date.getTime())) return '';
  if (sameLocalDay(date, now)) {
    return new Intl.DateTimeFormat(locales, {
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  }
  if (date.getFullYear() === now.getFullYear()) {
    return new Intl.DateTimeFormat(locales, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  }
  return new Intl.DateTimeFormat(locales, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
}
