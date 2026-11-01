import { defaultLadder, type LadderSummary } from './ladder-schedule.js';

export const lastTradeRealmStorageKey = 'd2r_reimagined_last_trade_realm';

export interface TradeLadder {
  id: string;
  name: string;
  slug: string;
  startDateUtc?: string;
  endDateUtc?: string;
}

type TradeLadderEntry = Omit<TradeLadder, 'slug'>;

export type TradeRealmKind = 'all' | 'standard' | 'ladder';

export interface TradeRealm {
  kind: TradeRealmKind;
  path: string;
  label: string;
  ladder: TradeLadder | null;
}

export interface TradeMarketplacePageData {
  initialListings: import('#lib/trades.js').TradeListingPage | null;
  ladders: TradeLadder[];
  realm: TradeRealm;
  /** The game mode initialListings were filtered by; null for both (always so on the server). */
  initialGameMode?: import('#lib/trades.js').TradeGameMode | null;
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

export function buildTradeLadders(entries: TradeLadderEntry[]): TradeLadder[] {
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
  if (path === '/trade/standard') return path;
  return ladders.some((ladder) => tradeLadderPath(ladder) === path) ? path : null;
}

/** The running ladder that started last, else the newest one by start date. */
export function latestTradeLadder(ladders: TradeLadder[], now = new Date()): TradeLadder | null {
  const dated = ladders.filter((ladder): ladder is TradeLadder & LadderSummary =>
    !!ladder.startDateUtc && !!ladder.endDateUtc
  );
  const running = defaultLadder(dated, now);
  if (running) return running;
  if (!dated.length) return ladders[0] ?? null;
  return dated.reduce((latest, ladder) =>
    new Date(ladder.startDateUtc) > new Date(latest.startDateUtc) ? ladder : latest
  );
}

/**
 * Where a bare /trade visit lands: the realm the visitor last picked, or the
 * latest ladder when nothing valid is saved. Null keeps the all-realms page.
 */
export function preferredTradePath(stored: string | null, ladders: TradeLadder[], now = new Date()): string | null {
  const saved = stored ? validStoredTradePath(stored, ladders) : null;
  if (saved) return saved;
  const latest = latestTradeLadder(ladders, now);
  return latest ? tradeLadderPath(latest) : null;
}
