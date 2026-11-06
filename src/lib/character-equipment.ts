import type { SaveItem } from '#lib/characters.js';

// Body location ids as the save stores them. Switching weapons physically
// exchanges the items between these pairs, so 4/5 always hold the set in hand
// and 11/12 the other one. Which of the in-game tabs I and II the set in hand
// belongs to is character.weaponSwitch (0 = I, 1 = II).
const inHandWeaponSlots = new Set([4, 5]);
const otherWeaponSlots = new Map([
  [11, 'RightArm'],
  [12, 'LeftArm']
]);

export function isInHandWeapon(item: SaveItem): boolean {
  return inHandWeaponSlots.has(item.position.bodyLocationId);
}

export function isOtherWeapon(item: SaveItem): boolean {
  return otherWeaponSlots.has(item.position.bodyLocationId);
}

/** The slot an equipped item is drawn in; both weapon sets share the two arm slots. */
export function equipmentSlot(item: SaveItem): string {
  return otherWeaponSlots.get(item.position.bodyLocationId) ?? item.position.bodyLocation;
}
