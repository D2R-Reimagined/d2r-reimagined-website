import type { BuildItemReference } from './builds';

export const gearSlots = {
  head: 'Helm', neck: 'Amulet', body: 'Armor', mainHand: 'Main hand', offHand: 'Off hand',
  gloves: 'Gloves', belt: 'Belt', boots: 'Boots', ring1: 'Ring 1', ring2: 'Ring 2',
  swapMain: 'Weapon swap · main hand', swapOff: 'Weapon swap · off hand', inventory: 'Inventory'
} as const;
export type GearSlot = keyof typeof gearSlots;
export interface BuildGearEntry {
  slot: GearSlot;
  item: BuildItemReference | null;
  name: string;
  notes: string;
  quantity: number;
}
export function emptyGear(slot: GearSlot): BuildGearEntry {
  return { slot, item: null, name: '', notes: '', quantity: 1 };
}
export function gearErrors(entries: BuildGearEntry[]): string[] {
  const errors: string[] = [];
  if (!entries.length) errors.push('add at least one gear or inventory item.');
  if (entries.length > 52) errors.push('use at most 52 gear and inventory entries.');
  const seen = new Set<string>();
  for (const entry of entries) {
    if (!(entry.slot in gearSlots)) errors.push('choose a valid equipment slot.');
    if (entry.slot !== 'inventory' && seen.has(entry.slot)) errors.push('use one item per equipment slot.');
    seen.add(entry.slot);
    if (!entry.item && !entry.name.trim()) errors.push('choose a catalog item or name your custom gear.');
    if (!Number.isInteger(entry.quantity) || entry.quantity < 1 || entry.quantity > 40 || (entry.slot !== 'inventory' && entry.quantity !== 1)) errors.push('use a quantity of 1 for equipment or 1–40 for inventory.');
  }
  return [...new Set(errors)];
}
