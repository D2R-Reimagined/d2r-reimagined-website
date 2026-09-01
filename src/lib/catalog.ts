import type { CatalogItem, CatalogSlug, KeyedLine } from './types';

export function itemTitle(item: CatalogItem, slug: CatalogSlug): string | number {
  if (slug === 'bases' || slug === 'affixes') return item.NameKey ?? item.Index ?? 'Unknown';
  if (slug === 'cube-recipes' || slug === 'orbs') return item.Description || `Recipe ${item.Index ?? ''}`;
  return item.Index ?? item.NameKey ?? 'Unknown';
}

export function isVanilla(item: CatalogItem): boolean {
  return String(item.Vanilla ?? '').toUpperCase() === 'Y';
}

export function itemType(item: CatalogItem): string {
  if (typeof item.Type === 'string') return item.Type;
  return item.Type?.Index ?? item.Type?.Name ?? '';
}

export function itemClass(item: CatalogItem): string {
  return item.RequiredClass
    ?? item.ClassSpecific
    ?? item.Equipment?.RequiredClass
    ?? (typeof item.Type === 'object' ? item.Type?.Class : '')
    ?? '';
}

export function linesFrom(item: CatalogItem): KeyedLine[] {
  return [
    ...(item.Equipment?.Lines ?? []),
    ...(item.Lines ?? []),
    ...(item.DamageTypes ?? []).flatMap((damage) => damage.Lines ?? []),
    ...(item.Equipment?.DamageTypes ?? []).flatMap((damage) => damage.Lines ?? [])
  ];
}

/** The pieces of the `$i18n` store `collectText` needs to build a searchable haystack. */
export interface SearchTools {
  code: string;
  t: (key: string | number | undefined | null) => string;
  line: (value: KeyedLine | undefined | null) => string;
}

function isKeyedLine(entry: object): entry is KeyedLine {
  return typeof (entry as KeyedLine).key === 'string' && (entry as KeyedLine).key !== '';
}

/**
 * Flattens an item into the text a search runs against: every raw value, its translation,
 * and — for `KeyedLine`s — the line as the card actually renders it.
 *
 * Rendering matters because the numbers live apart from the text they belong to. A line is
 * stored as `{ key: 'ModStr3k', args: [5] }`, so translating the key alone only ever yields
 * the template `"+%d to All Skills"`; searching "5 to" could never reach the "+5 to All
 * Skills" a player is reading on the card.
 *
 * Parts are newline-joined rather than space-joined so a phrase cannot straddle two
 * unrelated values — "…required level 25, base code tow…" used to match "5 to". Search
 * across separate fields with the `+` (AND) operator instead.
 */
export function collectText(
  value: unknown,
  translate: (key: string | number | undefined | null) => string,
  renderLine?: (line: KeyedLine) => string
): string {
  const parts: string[] = [];
  const walk = (entry: unknown): void => {
    if (entry == null) return;
    if (typeof entry === 'string' || typeof entry === 'number') {
      const raw = String(entry);
      parts.push(raw, translate(raw));
      return;
    }
    if (Array.isArray(entry)) {
      entry.forEach(walk);
      return;
    }
    if (typeof entry === 'object') {
      // Property-group parents carry an empty key and render nothing; their children are
      // picked up by the walk below like any other line.
      if (renderLine && isKeyedLine(entry)) parts.push(renderLine(entry));
      Object.values(entry as Record<string, unknown>).forEach(walk);
    }
  };
  walk(value);
  return parts.join('\n').toLowerCase();
}

// Building a haystack means walking every nested line of an item and translating it, which
// is far too much to redo for all ~2,400 uniques on each keystroke. The text only changes
// when the language does, so cache it per item and re-derive on a language switch.
const haystacks = new WeakMap<object, { code: string; text: string }>();

/** Cached {@link collectText} for one catalog item, keyed on the active language. */
export function searchText(item: object, tools: SearchTools): string {
  const cached = haystacks.get(item);
  if (cached?.code === tools.code) return cached.text;

  const text = collectText(item, tools.t, tools.line);
  haystacks.set(item, { code: tools.code, text });
  return text;
}

export function uniqueOptions(values: Array<string | undefined>, translate: (value: string) => string) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))]
    .sort((a, b) => translate(a).localeCompare(translate(b)));
}
