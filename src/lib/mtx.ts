import { apiRequest } from '$lib/auth';

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

const slotLabels: Record<string, string> = { helmet: 'Helmet' };

// Turntable renders in static/images/mtx (d2rr-models mtx/render_previews.py + assemble_previews.py).
const previewIds = new Set(['pumpkin', 'pumpkin-lit', 'pumpkin-inferno']);

/** The animated preview and its still frame, or null for catalog items without a render yet. */
export function mtxPreview(id: string): { animated: string; still: string } | null {
  return previewIds.has(id) ? { animated: `/images/mtx/${id}.webp`, still: `/images/mtx/${id}-still.webp` } : null;
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
