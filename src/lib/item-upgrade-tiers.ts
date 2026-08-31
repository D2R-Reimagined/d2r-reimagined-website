import { loadCatalog } from './catalog-sources';
import type { CatalogItem } from './types';

/**
 * Every base code that shares a normal → exceptional → elite upgrade chain, keyed by each
 * member of that chain. The cube's upgrade recipes rewrite an item's base code and leave the
 * unique or set row it rolled from untouched, so an upgraded Diadem still carries the file
 * index of a Coronet unique.
 */
export type ItemUpgradeTiers = Map<string, Set<string>>;

/**
 * Walks the `NormCode`/`UberCode`/`UltraCode` columns of the base catalogs. Each row names its
 * own chain, and rows that name one another are merged so every tier resolves to the same
 * family regardless of which one an item was upgraded from.
 */
export function buildItemUpgradeTiers(bases: CatalogItem[]): ItemUpgradeTiers {
  const links: ItemUpgradeTiers = new Map();

  for (const base of bases) {
    const chain = [base.NameKey, base.NormCode, base.UberCode, base.UltraCode]
      .filter((code): code is string => Boolean(code))
      .map((code) => code.toLowerCase());
    for (const code of chain) {
      const linked = links.get(code) ?? new Set<string>();
      for (const sibling of chain) linked.add(sibling);
      links.set(code, linked);
    }
  }

  const tiers: ItemUpgradeTiers = new Map();
  for (const code of links.keys()) {
    if (tiers.has(code)) continue;
    const family = new Set<string>();
    const pending = [code];
    while (pending.length) {
      const next = pending.pop() as string;
      if (family.has(next)) continue;
      family.add(next);
      for (const sibling of links.get(next) ?? []) pending.push(sibling);
    }
    for (const member of family) tiers.set(member, family);
  }

  return tiers;
}

/** Loads the base catalogs once and reduces them to their upgrade families. */
export function loadItemUpgradeTiers(fetcher: typeof fetch = fetch): Promise<ItemUpgradeTiers> {
  return loadCatalog('bases', fetcher).then(buildItemUpgradeTiers);
}
