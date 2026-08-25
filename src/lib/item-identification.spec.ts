import { describe, expect, it } from 'vitest';
import type { SaveItem } from '$lib/characters';
import { isItemIdentified, itemDisplayLabel } from './item-identification';

function item(flagNames: string[]): SaveItem {
  return {
    flags: { value: 0, names: flagNames },
    baseName: 'Hawk Helm',
    codeText: 'dr2',
    personalizedName: 'Hidden Rare Name'
  } as SaveItem;
}

describe('item identification', () => {
  it('treats an item without the Identified save flag as unidentified', () => {
    expect(isItemIdentified(item(['JustSaved']))).toBe(false);
  });

  it('does not reveal a decoded unique, set, or generated name while unidentified', () => {
    expect(itemDisplayLabel(item(['JustSaved']), 'Hidden Unique Name')).toBe('Hawk Helm');
  });

  it('uses the resolved identity after the save marks the item identified', () => {
    expect(itemDisplayLabel(item(['Identified', 'JustSaved']), 'Revealed Unique Name'))
      .toBe('Revealed Unique Name');
  });
});
