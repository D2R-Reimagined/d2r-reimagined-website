import type { DropData, DropItem, DropQuality } from './drop-calculator';

export type DropCategory = DropQuality | 'all';
export const dropCategories: readonly DropCategory[] = ['all', 'unique', 'set', 'rune', 'misc'];
export const MIN_DROP_QUERY_LENGTH = 2;
export const DROP_SUGGESTION_LIMIT = 50;

/** One searchable item with its translated display and base names, normalized once per language. */
export interface DropSearchEntry {
  item: DropItem;
  name: string;
  base: string;
  normalizedName: string;
  normalizedBase: string;
}
export interface DropSearchResult { matches: DropSearchEntry[]; total: number }

export const normalizeDropQuery = (value: string) => value.trim().toLocaleLowerCase();

export function isDropCategory(value: unknown): value is DropCategory {
  return typeof value === 'string' && (dropCategories as readonly string[]).includes(value);
}

export function categoryAllows(category: DropCategory, item: DropItem): boolean {
  return category === 'all' || item.Quality === category;
}

/** Builds the index from exported items and base metadata; rebuild only when items or language change. */
export function buildDropSearchIndex(items: DropItem[], bases: DropData['Bases'], translate: (key: string) => string): DropSearchEntry[] {
  const baseKeys = new Map(bases.map(base => [base.Code.toLowerCase(), base.NameKey ?? base.Code]));
  return items.map(item => {
    const name = translate(item.NameKey);
    const baseKey = baseKeys.get(item.Code.toLowerCase());
    const translatedBase = baseKey ? translate(baseKey) : '';
    // An untranslated key is an internal code, not a name players would search for.
    const base = translatedBase && translatedBase !== baseKey ? translatedBase : '';
    return { item, name, base, normalizedName: normalizeDropQuery(name), normalizedBase: normalizeDropQuery(base) };
  });
}

/** Lower is better: exact name, exact base, name prefix, base prefix, name substring, base substring. */
export function dropMatchRank(entry: DropSearchEntry, text: string): number {
  const { normalizedName: name, normalizedBase: base } = entry;
  if (name === text) return 0;
  if (base && base === text) return 1;
  if (name.startsWith(text)) return 2;
  if (base && base.startsWith(text)) return 3;
  if (name.includes(text)) return 4;
  if (base && base.includes(text)) return 5;
  return -1;
}

export function searchDropItems(index: DropSearchEntry[], query: string, category: DropCategory = 'all', limit = DROP_SUGGESTION_LIMIT): DropSearchResult {
  const text = normalizeDropQuery(query);
  if (text.length < MIN_DROP_QUERY_LENGTH) return { matches: [], total: 0 };
  const ranked: { entry: DropSearchEntry; rank: number }[] = [];
  for (const entry of index) {
    if (!categoryAllows(category, entry.item)) continue;
    const rank = dropMatchRank(entry, text);
    if (rank >= 0) ranked.push({ entry, rank });
  }
  ranked.sort((a, b) => a.rank - b.rank ||
    a.entry.name.localeCompare(b.entry.name) ||
    a.entry.base.localeCompare(b.entry.base) ||
    (a.entry.item.Id < b.entry.item.Id ? -1 : a.entry.item.Id > b.entry.item.Id ? 1 : 0));
  return { matches: ranked.slice(0, Math.max(0, limit)).map(match => match.entry), total: ranked.length };
}

/** The base name adds information only when it differs from the displayed name (runes name themselves). */
export function showsDropBase(entry: DropSearchEntry): boolean {
  return !!entry.base && entry.normalizedBase !== entry.normalizedName;
}

export const dropCategoryLabels: Record<DropQuality, string> = { unique: 'Unique', set: 'Set', rune: 'Rune', misc: 'Misc' };

export function dropSuggestionLabel(entry: DropSearchEntry): string {
  const parts = [entry.name, `${dropCategoryLabels[entry.item.Quality]} item`];
  if (showsDropBase(entry)) parts.push(`base ${entry.base}`);
  return parts.join(', ');
}
