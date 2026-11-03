import type { DisplayStatLine } from '#lib/item-stat-presentation.js';
import type { TradePropertyFilterGroup } from '#lib/trades.js';

/**
 * The stats a search filtered on, as `name` (any layer) or `name:layer` keys, so a listing
 * can point out which of its lines matched.
 */
export function tradeStatHighlights(groups: TradePropertyFilterGroup[] | undefined): Set<string> {
  const keys = new Set<string>();
  for (const group of groups ?? []) {
    for (const filter of group.filters) {
      if (!filter.stat) continue;
      keys.add(filter.layer == null ? filter.stat : `${filter.stat}:${filter.layer}`);
    }
  }
  return keys;
}

/** True when any stat behind this displayed line is one the search filtered on. */
export function lineMatchesHighlights(line: DisplayStatLine, highlights: Set<string>): boolean {
  if (!highlights.size) return false;
  return (line.sources ?? []).some((source) =>
    highlights.has(source.name) || highlights.has(`${source.name}:${source.layer}`));
}

