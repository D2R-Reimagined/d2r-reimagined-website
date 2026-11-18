import type { SaveItem } from '#lib/characters.js';
import type { SharedStash, SharedStashTab } from '#lib/trades.js';
import type { ItemPresentation } from '#lib/item-presentation.js';

/** Reimagined shared stash dimensions (`Big Bank Page 1` / `bankexpansionlayouthd.json`). */
export const STASH_COLUMNS = 16;
export const STASH_ROWS = 13;
export const MIN_CURRENCY_STASH_ROWS = 4;

export interface PositionedStashItem {
  key: string;
  item: SaveItem;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StashGridLayout {
  columns: number;
  rows: number;
  entries: PositionedStashItem[];
}

function normalizedTabType(tab: Pick<SharedStashTab, 'type'> | string | null | undefined): string {
  const raw = typeof tab === 'string' ? tab : tab?.type;
  return (raw ?? '').trim().toLowerCase();
}

export function isChronicleStashTab(tab: Pick<SharedStashTab, 'type'> | string | null | undefined): boolean {
  return normalizedTabType(tab) === 'chronicle';
}

export function isCurrencyStashTab(tab: Pick<SharedStashTab, 'type'> | string | null | undefined): boolean {
  return normalizedTabType(tab) === 'advancedstash';
}

export function visibleStashTabs(stash: SharedStash | null | undefined): SharedStashTab[] {
  return (stash?.tabs ?? []).filter((tab) => !isChronicleStashTab(tab));
}

export function stashTabItems(tab: SharedStashTab | null | undefined): SaveItem[] {
  if (!tab) return [];
  if (isCurrencyStashTab(tab)) {
    return tab.items.filter((item) => (item.advancedStashStackSize ?? 0) > 0);
  }
  return tab.items;
}

export function stashTabLabel(tab: SharedStashTab, allVisibleTabs?: readonly SharedStashTab[]): string {
  const count = stashTabItems(tab).length;
  const noun = count === 1 ? 'item' : 'items';
  if (isCurrencyStashTab(tab)) return `Currency · ${count} ${noun}`;
  const normalOrdinal = allVisibleTabs
    ? allVisibleTabs.filter((entry) => !isCurrencyStashTab(entry)).findIndex((entry) => entry.index === tab.index) + 1
    : 0;
  const tabNumber = normalOrdinal > 0 ? normalOrdinal : tab.index + 1;
  return `Tab ${tabNumber} · ${count} ${noun}`;
}

export function layoutStashItems(
  items: SaveItem[],
  presentations: ReadonlyMap<string, ItemPresentation>,
  tabType?: string | null
): StashGridLayout {
  if (isCurrencyStashTab(tabType)) {
    const nonEmpty = items.filter((item) => (item.advancedStashStackSize ?? 0) > 0);
    const columns = STASH_COLUMNS;
    const rows = Math.max(MIN_CURRENCY_STASH_ROWS, Math.ceil(nonEmpty.length / columns));
    const entries = nonEmpty.map((item, index) => {
      const x = index % columns;
      const y = Math.floor(index / columns);
      return {
        key: `currency:${index}:${item.codeText}:${item.advancedStashStackSize ?? 0}`,
        item,
        x,
        y,
        width: 1,
        height: 1
      };
    });
    return { columns, rows, entries };
  }

  let columns = STASH_COLUMNS;
  let rows = STASH_ROWS;
  const entries = items.map((item, index) => {
    const presentation = presentations.get(item.codeText.toLowerCase());
    const width = Math.max(1, presentation?.Width ?? 1);
    const height = Math.max(1, presentation?.Height ?? 1);
    const x = Math.max(0, item.position.inventoryX);
    const y = Math.max(0, item.position.inventoryY);
    columns = Math.max(columns, x + width);
    rows = Math.max(rows, y + height);
    return {
      key: `${index}:${item.codeText}:${item.seed}:${x}:${y}`,
      item,
      x,
      y,
      width,
      height
    };
  });

  return { columns, rows, entries };
}

export function isSameSaveItem(
  selected: SaveItem | null | undefined,
  candidate: SaveItem,
  selectedSeedFallback?: number | null
): boolean {
  if (selected) {
    return selected.codeText === candidate.codeText
      && selected.seed === candidate.seed
      && selected.position.mode === candidate.position.mode
      && selected.position.storePage === candidate.position.storePage
      && selected.position.bodyLocation === candidate.position.bodyLocation
      && selected.position.inventoryX === candidate.position.inventoryX
      && selected.position.inventoryY === candidate.position.inventoryY;
  }
  return selectedSeedFallback != null && selectedSeedFallback !== 0 && candidate.seed === selectedSeedFallback;
}
