import type { CatalogItem } from './types';
import type { GrailCategory } from './grail-query';

export type GrailFoundMap = Record<string, boolean>;

/** The name-level key every Grail save used before same-name variants were told apart. */
export function legacyGrailKey(item: CatalogItem): string {
  return String(item.Index ?? item.NameKey ?? 'Unknown');
}

/** Progress key for one row: its own `GrailKey` when it shares a name, else the legacy key. */
export function grailKey(item: CatalogItem): string {
  return typeof item.GrailKey === 'string' ? item.GrailKey : legacyGrailKey(item);
}

/** Keyed-each identity; categories are namespaced so switching tabs never reuses a row. */
export function grailRenderKey(category: GrailCategory, item: CatalogItem): string {
  return `${category}:${grailKey(item)}`;
}

function variantSignature(item: CatalogItem): string {
  const runes = (item.Runes ?? []).map((rune) => rune.NameKey ?? '').join('-');
  const types = (item.Types ?? [])
    .map((type) => typeof type === 'string' ? type : type.Index ?? type.Name ?? '')
    .filter(Boolean)
    .sort()
    .join('+');
  return `${legacyGrailKey(item)}|${runes}|${types}`;
}

/**
 * Some rows share a name but differ in recipe (e.g. two Zephyr or Purity runewords). Rows
 * with a unique name keep the legacy key so existing saves still match; each same-name
 * variant gets a key built from its own runes and item types, which depends only on the
 * data, never on its position in a filtered list. Identical signatures fall back to their
 * order in the data file.
 */
export function assignGrailKeys(items: CatalogItem[]): CatalogItem[] {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(legacyGrailKey(item), (counts.get(legacyGrailKey(item)) ?? 0) + 1);
  const seen = new Map<string, number>();
  return items.map((item) => {
    if (counts.get(legacyGrailKey(item)) === 1) return item;
    const signature = variantSignature(item);
    const occurrence = (seen.get(signature) ?? 0) + 1;
    seen.set(signature, occurrence);
    return { ...item, GrailKey: occurrence === 1 ? signature : `${signature}#${occurrence}` };
  });
}

/** The name inside a same-name variant key (`name|runes|types`, optionally `#n`). */
function variantKeyName(key: string): string | undefined {
  const parts = key.split('|');
  return parts.length >= 3 ? parts.slice(0, -2).join('|') : undefined;
}

/**
 * Older saves and export strings marked a shared name once, which showed every variant of
 * that name as found. Keep that meaning by marking each variant found. A variant key saved
 * while an export had several rows of that name moves back to the name once only one row of
 * that name remains. Other keys this catalog does not know are left untouched.
 */
export function migrateGrailProgress(found: GrailFoundMap, items: CatalogItem[]): GrailFoundMap {
  const keys = new Set(items.map(grailKey));
  const variants = new Map<string, string[]>();
  const single = new Set<string>();
  for (const item of items) {
    const legacy = legacyGrailKey(item);
    if (typeof item.GrailKey !== 'string') {
      single.add(legacy);
      continue;
    }
    variants.set(legacy, [...(variants.get(legacy) ?? []), item.GrailKey]);
  }
  const migrated: GrailFoundMap = {};
  for (const [key, value] of Object.entries(found)) {
    const expanded = keys.has(key) ? undefined : variants.get(key);
    const name = keys.has(key) || expanded ? undefined : variantKeyName(key);
    if (expanded) {
      if (value) for (const variant of expanded) migrated[variant] = true;
    } else if (name !== undefined && single.has(name)) migrated[name] = migrated[name] || value;
    else migrated[key] = migrated[key] || value;
  }
  return migrated;
}

/** Found rows among `items`; stale keys for rows no longer in the catalog do not count. */
export function countGrailFound(items: CatalogItem[], found: GrailFoundMap): number {
  return items.filter((item) => found[grailKey(item)]).length;
}
