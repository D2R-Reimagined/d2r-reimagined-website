export const lastTradeRealmStorageKey = 'd2r_reimagined_last_trade_realm';

export interface TradeLadder {
  id: string;
  name: string;
  slug: string;
}

export type TradeRealmKind = 'all' | 'standard' | 'ladder';

export interface TradeRealm {
  kind: TradeRealmKind;
  path: string;
  label: string;
  ladder: TradeLadder | null;
}

export interface TradeMarketplacePageData {
  initialListings: import('$lib/trades').TradeListingPage | null;
  ladders: TradeLadder[];
  realm: TradeRealm;
}

export function tradeLadderSlug(name: string): string {
  const slug = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  return slug || 'Ladder';
}

export function buildTradeLadders(entries: Array<{ id: string; name: string }>): TradeLadder[] {
  const baseSlugs = entries.map((entry) => tradeLadderSlug(entry.name));
  const reserved = new Set(['standard', 'list', 'mine']);

  return entries.map((entry, index) => {
    const baseSlug = baseSlugs[index];
    const duplicated = baseSlugs.filter((slug) => slug.toLowerCase() === baseSlug.toLowerCase()).length > 1;
    const needsSuffix = duplicated || reserved.has(baseSlug.toLowerCase());
    const idSuffix = entry.id.replace(/[^A-Za-z0-9]/g, '').slice(0, 8);
    return {
      ...entry,
      slug: needsSuffix && idSuffix ? `${baseSlug}-${idSuffix}` : baseSlug
    };
  });
}

export function tradeLadderPath(ladder: TradeLadder): string {
  return `/trade/${encodeURIComponent(ladder.slug)}`;
}

export function resolveTradeRealm(
  ladders: TradeLadder[],
  segment?: string
): TradeRealm | null {
  if (!segment) return { kind: 'all', path: '/trade', label: 'All realms', ladder: null };
  if (segment.toLowerCase() === 'standard') {
    return { kind: 'standard', path: '/trade/standard', label: 'Standard', ladder: null };
  }

  const decoded = decodeURIComponent(segment);
  const ladder = ladders.find((candidate) =>
    candidate.slug.toLowerCase() === decoded.toLowerCase()
  );
  return ladder
    ? { kind: 'ladder', path: tradeLadderPath(ladder), label: ladder.name, ladder }
    : null;
}

export function validStoredTradePath(path: string, ladders: TradeLadder[]): string | null {
  if (path === '/trade' || path === '/trade/standard') return path;
  return ladders.some((ladder) => tradeLadderPath(ladder) === path) ? path : null;
}
