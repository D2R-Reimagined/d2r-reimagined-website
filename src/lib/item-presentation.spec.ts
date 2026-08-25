import { describe, expect, it } from 'vitest';
import type { SaveItem } from '$lib/characters';
import { itemSprite, itemVariant, type ItemPresentation } from './item-presentation';

function presentation(
  code: string,
  fileIndex?: number,
  nameKey?: string,
  sprite?: string
): ItemPresentation {
  return {
    Code: code,
    NameKey: code,
    Width: 2,
    Height: 3,
    UniqueSprites: fileIndex === undefined || !nameKey
      ? []
      : [{ FileIndex: fileIndex, NameKey: nameKey, Sprite: sprite }],
    SetSprites: []
  };
}

describe('item presentation', () => {
  it('resolves Skin of the Vipermagi by the save table ID instead of its raw row position', () => {
    const savedBase = presentation('xea', 210, 'Skin of the Vipermagi');
    const spiritShroud = presentation('xui', 209, 'The Spirit Shroud');
    const presentations = new Map([
      [savedBase.Code, savedBase],
      [spiritShroud.Code, spiritShroud]
    ]);
    const item = {
      codeText: 'xea',
      quality: 'Unique',
      qualityData: { fileIndex: 210 }
    } as SaveItem;

    expect(itemVariant(item, savedBase, presentations)?.NameKey).toBe('Skin of the Vipermagi');
  });

  it('uses Magefist artwork selected by unique name instead of the next positional asset', () => {
    const savedBase = presentation(
      'tgl',
      105,
      'Magefist',
      'sprites/items/armor-glove-light_gauntlets.webp'
    );
    const presentations = new Map([[savedBase.Code, savedBase]]);
    const item = {
      codeText: 'tgl',
      quality: 'Unique',
      qualityData: { fileIndex: 105 }
    } as SaveItem;

    expect(itemVariant(item, savedBase, presentations)?.NameKey).toBe('Magefist');
    expect(itemSprite(item, savedBase, presentations)).toBe(
      '/data/sprites/items/armor-glove-light_gauntlets.webp'
    );
  });

  it('resolves later modded uniques by the save row index instead of the drifting *ID column', () => {
    const savedBase = presentation('ci1', 1015, "Sorcerer's Cache");
    const belt = presentation('ulc', 1137, 'Duskwreath');
    const boots = presentation('xvb', 1102, "Asheara's Slippers");
    const presentations = new Map([savedBase, belt, boots].map((entry) => [entry.Code, entry]));
    const item = {
      codeText: 'ci1',
      quality: 'Unique',
      qualityData: { fileIndex: 1015 }
    } as SaveItem;

    const beltItem = {
      codeText: 'ulc',
      quality: 'Unique',
      qualityData: { fileIndex: 1137 }
    } as SaveItem;
    const bootsItem = {
      codeText: 'xvb',
      quality: 'Unique',
      qualityData: { fileIndex: 1102 }
    } as SaveItem;

    expect(itemVariant(item, savedBase, presentations)?.NameKey).toBe("Sorcerer's Cache");
    expect(itemVariant(beltItem, belt, presentations)?.NameKey)
      .toBe('Duskwreath');
    expect(itemVariant(bootsItem, boots, presentations)?.NameKey)
      .toBe("Asheara's Slippers");
  });
});
