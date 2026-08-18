import type { CatalogItem, CatalogSlug, KeyedLine } from './types';

export function itemTitle(item: CatalogItem, slug: CatalogSlug): string | number {
  if (slug === 'bases' || slug === 'affixes') return item.NameKey ?? item.Index ?? 'Unknown';
  if (slug === 'cube-recipes') return item.Description || `Recipe ${item.Index ?? ''}`;
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

export function collectText(value: unknown, translate: (key: string | number | undefined | null) => string): string {
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
    if (typeof entry === 'object') Object.values(entry as Record<string, unknown>).forEach(walk);
  };
  walk(value);
  return parts.join(' ').toLowerCase();
}

export function uniqueOptions(values: Array<string | undefined>, translate: (value: string) => string) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))]
    .sort((a, b) => translate(a).localeCompare(translate(b)));
}
