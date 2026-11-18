import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { SaveItem } from '#lib/characters.js';
import { buildItemUpgradeTiers } from './item-upgrade-tiers';
import {
  baseItemSprite,
  hasUnknownItemVariant,
  itemSprite,
  itemVariant,
  type ItemPresentation
} from './item-presentation';

const circletTiers = buildItemUpgradeTiers([
  { NameKey: 'ci1', NormCode: 'ci1', UberCode: 'ci2', UltraCode: 'ci3' },
  { NameKey: 'ci3', NormCode: 'ci1', UberCode: 'ci2', UltraCode: 'ci3' }
]);

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
  it('does not publish item sprite URLs without the corresponding static asset', () => {
    const dataRoot = resolve('static/data');
    const entries = JSON.parse(
      readFileSync(resolve(dataRoot, 'keyed/item-presentation.json'), 'utf8')
    ) as ItemPresentation[];
    const missing: string[] = [];

    for (const entry of entries) {
      const sprites = [
        entry.Sprite,
        ...entry.UniqueSprites.map((variant) => variant.Sprite),
        ...entry.SetSprites.map((variant) => variant.Sprite)
      ];

      for (const sprite of sprites) {
        if (sprite && !existsSync(resolve(dataRoot, sprite))) {
          missing.push(`${entry.Code}: ${sprite}`);
        }
      }
    }

    expect(missing).toEqual([]);
  });

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

  it('resolves set names for miscellaneous bases such as rings', () => {
    const ring: ItemPresentation = {
      Code: 'rin',
      NameKey: 'rin',
      Width: 1,
      Height: 1,
      UniqueSprites: [],
      SetSprites: [
        { FileIndex: 52, NameKey: 'Angelic Halo' },
        { FileIndex: 307, NameKey: 'Draven Coil' }
      ]
    };
    const presentations = new Map([[ring.Code, ring]]);
    const item = {
      codeText: 'rin',
      quality: 'Set',
      qualityData: { fileIndex: 307 }
    } as SaveItem;

    expect(itemVariant(item, ring, presentations)?.NameKey).toBe('Draven Coil');
  });

  it('does not borrow an unrelated unique when a future item reuses its file index', () => {
    const labCharm = presentation('lab');
    const arrows = presentation('aqv', 1482, 'Enfeeblement Arrows', 'sprites/items/arrows.webp');
    const presentations = new Map([
      [labCharm.Code, labCharm],
      [arrows.Code, arrows]
    ]);
    const item = {
      codeText: 'lab',
      quality: 'Unique',
      qualityData: { fileIndex: 1482 }
    } as SaveItem;

    expect(itemVariant(item, labCharm, presentations)).toBeNull();
    expect(hasUnknownItemVariant(item, labCharm, presentations)).toBe(true);
    expect(itemSprite(item, labCharm, presentations)).toBeNull();
  });
  it('keeps a unique upgraded onto an elite base named after its original row', () => {
    const coronet = presentation(
      'ci1',
      1015,
      "Sorcerer's Cache",
      'sprites/items/armor-circlet-coronet.webp'
    );
    coronet.Sprite = 'sprites/items/armor-circlet-coronet.webp';
    const diadem = presentation('ci3');
    diadem.Sprite = 'sprites/items/armor-circlet-diadem.webp';
    const presentations = new Map([coronet, diadem].map((entry) => [entry.Code, entry]));
    const item = {
      codeText: 'ci3',
      quality: 'Unique',
      qualityData: { fileIndex: 1015 }
    } as SaveItem;

    expect(itemVariant(item, diadem, presentations, circletTiers)?.NameKey)
      .toBe("Sorcerer's Cache");
    expect(hasUnknownItemVariant(item, diadem, presentations, circletTiers)).toBe(false);
    // The row it was upgraded from carries no artwork of its own, so the elite base wins.
    expect(itemSprite(item, diadem, presentations, circletTiers))
      .toBe('/data/sprites/items/armor-circlet-diadem.webp');
  });

  it('carries bespoke unique artwork across an upgrade', () => {
    const coronet = presentation(
      'ci1',
      1015,
      "Sorcerer's Cache",
      'sprites/items/armor-circlet-sorcerers_cache.webp'
    );
    coronet.Sprite = 'sprites/items/armor-circlet-coronet.webp';
    const diadem = presentation('ci3');
    diadem.Sprite = 'sprites/items/armor-circlet-diadem.webp';
    const presentations = new Map([coronet, diadem].map((entry) => [entry.Code, entry]));
    const item = {
      codeText: 'ci3',
      quality: 'Unique',
      qualityData: { fileIndex: 1015 }
    } as SaveItem;

    expect(itemSprite(item, diadem, presentations, circletTiers))
      .toBe('/data/sprites/items/armor-circlet-sorcerers_cache.webp');
  });

  it('does not borrow a unique from a base outside the upgrade family', () => {
    const diadem = presentation('ci3');
    diadem.Sprite = 'sprites/items/armor-circlet-diadem.webp';
    const arrows = presentation('aqv', 1015, 'Enfeeblement Arrows', 'sprites/items/arrows.webp');
    const presentations = new Map([diadem, arrows].map((entry) => [entry.Code, entry]));
    const item = {
      codeText: 'ci3',
      quality: 'Unique',
      qualityData: { fileIndex: 1015 }
    } as SaveItem;

    expect(itemVariant(item, diadem, presentations, circletTiers)).toBeNull();
    expect(hasUnknownItemVariant(item, diadem, presentations, circletTiers)).toBe(true);
  });

  it('falls back to the base sprite when the unique row cannot be resolved at all', () => {
    const diadem = presentation('ci3');
    diadem.Sprite = 'sprites/items/armor-circlet-diadem.webp';
    const presentations = new Map([[diadem.Code, diadem]]);
    const item = {
      codeText: 'ci3',
      quality: 'Unique',
      qualityData: { fileIndex: 9999 }
    } as SaveItem;

    expect(hasUnknownItemVariant(item, diadem, presentations, circletTiers)).toBe(true);
    expect(itemSprite(item, diadem, presentations, circletTiers))
      .toBe('/data/sprites/items/armor-circlet-diadem.webp');
  });

  it('uses native D2R jewel graphics instead of diamond placeholders while keeping custom fragment art', () => {
    for (let index = 1; index <= 6; index++) {
      expect(existsSync(resolve('static/images/items', `jewels${index}.webp`))).toBe(true);
    }

    const jewelBase = presentation('jew', 392, 'Spring Facet', 'sprites/items/misc-gem-perfect_diamond.webp');
    jewelBase.Sprite = 'sprites/items/misc-gem-jewels.webp';
    const colossalBase = presentation('cjw', 420, "Defender's Bile", 'sprites/items/misc-body_part-fragment_poison.webp');
    colossalBase.Sprite = 'sprites/items/misc-gem-jewels.webp';
    const diamondBase = presentation('gpw');
    diamondBase.Sprite = 'sprites/items/misc-gem-perfect_diamond.webp';
    const presentations = new Map([jewelBase, colossalBase, diamondBase].map((entry) => [entry.Code, entry]));

    // Saved magic/rare jewels map variableGraphicsId 0..5 -> jewels1..6.webp
    for (let gfx = 0; gfx < 6; gfx++) {
      const magicJewel = {
        codeText: 'jew',
        quality: 'Magic',
        variableGraphicsId: gfx,
        seed: 99
      } as SaveItem;
      expect(itemSprite(magicJewel, jewelBase, presentations)).toBe(`/images/items/jewels${gfx + 1}.webp`);
    }

    // Unique Rainbow Facets (perfect_diamond placeholder in item-presentation.json) also use jewel graphics
    const facet = {
      codeText: 'jew',
      quality: 'Unique',
      qualityData: { fileIndex: 392 },
      variableGraphicsId: 3
    } as SaveItem;
    expect(itemSprite(facet, jewelBase, presentations)).toBe('/images/items/jewels4.webp');

    // Missing variableGraphicsId still picks a deterministic native jewel graphic rather than the diamond
    const legacySnapshotJewel = {
      codeText: 'jew',
      quality: 'Unique',
      qualityData: { fileIndex: 392 },
      variableGraphicsId: null
    } as SaveItem;
    expect(itemSprite(legacySnapshotJewel, jewelBase, presentations)).toBe('/images/items/jewels3.webp');
    expect(baseItemSprite(jewelBase)).toBe('/images/items/jewels5.webp');
    expect(baseItemSprite(colossalBase)).toBe('/images/items/jewels5.webp');

    // Unique Colossal Jewels keep their custom fragment sprites, and actual Perfect Diamonds stay diamonds
    const uniqueColossal = {
      codeText: 'cjw',
      quality: 'Unique',
      qualityData: { fileIndex: 420 },
      variableGraphicsId: 1
    } as SaveItem;
    expect(itemSprite(uniqueColossal, colossalBase, presentations))
      .toBe('/data/sprites/items/misc-body_part-fragment_poison.webp');

    const perfectDiamond = { codeText: 'gpw', quality: 'Normal' } as SaveItem;
    expect(itemSprite(perfectDiamond, diamondBase, presentations))
      .toBe('/data/sprites/items/misc-gem-perfect_diamond.webp');
    expect(baseItemSprite(diamondBase)).toBe('/data/sprites/items/misc-gem-perfect_diamond.webp');
  });
});
