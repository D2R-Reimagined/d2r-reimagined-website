import { apiRequest } from '#lib/auth.js';

export interface MtxItem {
  id: string;
  name: string;
  slot: string;
  unlock: string;
  owned: boolean;
  equipped: boolean;
}

export interface MtxLoadout {
  enabled: boolean;
  /** The equipped helmet skin id; the API omits it when nothing is equipped. */
  helmet?: string | null;
  /** Every slot with something equipped: `{ slot: itemId }`. */
  loadout: Record<string, string>;
  items: MtxItem[];
  menu: string;
}

export interface MtxSlot {
  slot: string;
  label: string;
  items: MtxItem[];
  equipped: MtxItem | null;
}

const slotLabels: Record<string, string> = { helmet: 'Helmet', portal: 'Town Portal' };

// Item id -> image name in static/images/mtx. Helmets are turntable renders (d2rr-models
// mtx/render_previews.py + assemble_previews.py); portals are in-game recordings (d2rl-plugins
// plugins/supporter-portals/tools/assemble_portal_previews.py).
const previewFiles: Record<string, string> = {
  pumpkin: 'pumpkin',
  'pumpkin-lit': 'pumpkin-lit',
  'pumpkin-inferno': 'pumpkin-inferno',
  classic: 'portal-classic',
  green: 'portal-green',
  violet: 'portal-violet',
  red: 'portal-red',
  teal: 'portal-teal',
  ember: 'portal-ember',
  gold: 'portal-gold',
  rainbow: 'portal-rainbow'
};

/** The animated preview and its still frame, or null for catalog items without a render yet. */
export function mtxPreview(id: string): { animated: string; still: string } | null {
  const file = Object.hasOwn(previewFiles, id) ? previewFiles[id] : null;
  return file ? { animated: `/images/mtx/${file}.webp`, still: `/images/mtx/${file}-still.webp` } : null;
}

// The portals a supporter tier unlocks (SupporterPortalPolicy in the API). Ember is a special
// reward and the pumpkins come from a ladder, so a membership would not unlock those.
const supporterItems = new Set(['green', 'violet', 'red', 'teal', 'gold', 'rainbow']);

/** True for a locked item that a supporter membership would unlock, so the card can link to /support. */
export function unlockedBySupport(item: Pick<MtxItem, 'id' | 'owned'>): boolean {
  return !item.owned && supporterItems.has(item.id);
}

/** A slot's free default is what taking something off goes back to; it cannot itself be taken off. */
export function canTakeOff(item: Pick<MtxItem, 'id'>): boolean {
  return item.id !== 'classic';
}

export function slotLabel(slot: string): string {
  return slotLabels[slot] ?? slot.charAt(0).toUpperCase() + slot.slice(1);
}

/** Groups the catalog by slot in catalog order; owned items stay ahead of locked ones. */
export function groupBySlot(state: Pick<MtxLoadout, 'items' | 'loadout'>): MtxSlot[] {
  const slots = new Map<string, MtxItem[]>();
  for (const item of state.items) slots.set(item.slot, [...(slots.get(item.slot) ?? []), item]);
  return [...slots].map(([slot, items]) => ({
    slot,
    label: slotLabel(slot),
    items: [...items.filter((item) => item.owned), ...items.filter((item) => !item.owned)],
    equipped: items.find((item) => item.id === state.loadout[slot]) ?? null
  }));
}

export function ownedCount(items: MtxItem[]): number {
  return items.filter((item) => item.owned).length;
}

export function fetchMtx(): Promise<MtxLoadout> {
  return apiRequest<MtxLoadout>('/cosmetics/mtx/me', { cache: 'no-store' }, true);
}

/** Equips `itemId` in `slot`, or takes the slot off with null. Returns the new loadout. */
export function equipMtx(slot: string, itemId: string | null): Promise<MtxLoadout> {
  return apiRequest<MtxLoadout>(
    '/cosmetics/mtx/me/loadout',
    { method: 'POST', body: JSON.stringify({ slot, itemId }) },
    true
  );
}
