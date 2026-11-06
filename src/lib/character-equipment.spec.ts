import { describe, expect, it } from 'vitest';

import type { SaveItem } from './characters';
import { equipmentSlot, isInHandWeapon, isOtherWeapon } from './character-equipment';

function equipped(bodyLocationId: number, bodyLocation: string): SaveItem {
  return { position: { mode: 'Equipped', bodyLocationId, bodyLocation } } as unknown as SaveItem;
}

describe('character equipment slots', () => {
  it('draws the other weapon set in the arm slots, as the API names it', () => {
    const right = equipped(11, 'RightHand');
    const left = equipped(12, 'LeftHand');

    expect(isOtherWeapon(right) && isOtherWeapon(left)).toBe(true);
    expect(isInHandWeapon(right) || isInHandWeapon(left)).toBe(false);
    expect(equipmentSlot(right)).toBe('RightArm');
    expect(equipmentSlot(left)).toBe('LeftArm');
  });

  it('keeps the weapons in hand in their own slots', () => {
    const right = equipped(4, 'RightArm');
    const left = equipped(5, 'LeftArm');

    expect(isInHandWeapon(right) && isInHandWeapon(left)).toBe(true);
    expect(isOtherWeapon(right) || isOtherWeapon(left)).toBe(false);
    expect(equipmentSlot(right)).toBe('RightArm');
    expect(equipmentSlot(left)).toBe('LeftArm');
  });

  it('leaves armor alone', () => {
    const head = equipped(1, 'Head');

    expect(isInHandWeapon(head) || isOtherWeapon(head)).toBe(false);
    expect(equipmentSlot(head)).toBe('Head');
  });
});
