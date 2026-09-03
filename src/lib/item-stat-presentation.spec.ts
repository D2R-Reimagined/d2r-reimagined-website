import { describe, expect, it } from 'vitest';

import type { SaveStat } from './characters';
import {
  displayStatLines,
  type ItemStatPresentationBundle
} from './item-stat-presentation';

const bundle: ItemStatPresentationBundle = {
  Stats: {
    poisonresist: { PositiveKey: 'ModStr1n', Function: 19, ValueShift: 0 },
    firemindam: { PositiveKey: 'ModStr1p', Function: 19, ValueShift: 0 },
    firemaxdam: { PositiveKey: 'ModStr1o', Function: 19, ValueShift: 0 },
    poisonmindam: { PositiveKey: 'ModStr4i', Function: 19, ValueShift: 0 },
    poisonmaxdam: { PositiveKey: 'ModStr4h', Function: 19, ValueShift: 0 },
    poisonlength: { ValueShift: 0 },
    poison_count: { ValueShift: 0 },
    charm_weight: { PositiveKey: 'mod_weight', Function: 19, ValueShift: 0 },
    item_nonclassskill: { ValueShift: 0 },
    item_nonclassskill_display: {
      PositiveKey: 'ItemModifierNonClassSkill',
      Function: 28,
      ValueShift: 0
    },
    item_aura: { PositiveKey: 'ModitemAura', Function: 16, ValueShift: 0 },
    item_openwounds: { PositiveKey: 'ModStr3m', Function: 19, ValueShift: 0 },
    item_replenish_quantity: { PositiveKey: 'ModStre9v', Function: 19, ValueShift: 0 },
    maxhp: { PositiveKey: 'ModStr1u', Function: 19, ValueShift: 8 },
    item_skillongethit: { PositiveKey: 'ItemExpansiveChanc2', Function: 15, ValueShift: 0 },
    hpregen_perlevel: {
      Priority: 56,
      PositiveKey: 'ModStr2l',
      NegativeKey: 'ModStr2w',
      Function: 19,
      ValueShift: 0
    },
    item_allskills: { Priority: 158, PositiveKey: 'ModStr3k', Function: 19, ValueShift: 0 },
    item_corrupted: { Priority: 300, PositiveKey: 'Corrupted', Function: 20, ValueShift: 0 },
    upgrade_medium: { Priority: 301, PositiveKey: 'MediumUpgrades', Function: 19, ValueShift: 0 },
    soulstone_weight: { Priority: 2, PositiveKey: 'uber_mod', Function: 19, ValueShift: 0 }
  },
  Skills: {
    '387': {
      NameKey: 'PsychicWardName',
      FallbackName: 'Psychic Ward',
      LineKey: 'strSkillRandomFromSkillClass',
      ClassOnlyKey: 'WarOnly'
    },
    '449': {
      NameKey: 'charmweight1',
      FallbackName: 'Hidden Charm Passive',
      LineKey: 'strSkillRandomFromSkill'
    },
    '9': {
      NameKey: 'skillname9',
      FallbackName: 'Critical Strike',
      LineKey: 'strSkillRandomFromSkillClass',
      ClassOnlyKey: 'AmaOnly'
    },
    '120': {
      NameKey: 'skillname120',
      FallbackName: 'Meditation',
      LineKey: 'strSkillRandomFromSkillClass',
      ClassOnlyKey: 'PalOnly'
    }
  },
  CompositeKeys: {
    FireDamage: 'strModFireDamageRange',
    PoisonDamage: 'strModPoisonDamageRange'
  }
};

function stat(id: number, name: string, value: number, layer = 0): SaveStat {
  return { id, name, layer, value };
}

describe('displayStatLines', () => {
  it('formats and combines the decoded arrow properties using keyed game strings', () => {
    const lines = displayStatLines([
      stat(45, 'poisonresist', 9),
      stat(48, 'firemindam', 1),
      stat(49, 'firemaxdam', 3),
      stat(57, 'poisonmindam', 30),
      stat(58, 'poisonmaxdam', 50),
      stat(59, 'poisonlength', 100),
      stat(326, 'poison_count', 1),
      stat(97, 'item_nonclassskill', 1, 449),
      stat(135, 'item_openwounds', 6),
      stat(253, 'item_replenish_quantity', 25)
    ], bundle);

    expect(lines.map((line) => line.keyed)).toEqual([
      { key: 'ModStr1n', args: [9] },
      { key: 'strModFireDamageRange', args: [1, 3] },
      { key: 'strModPoisonDamageRange', args: [12, 20, 4] },
      { key: 'ModStr3m', args: [6] },
      { key: 'ModStre9v', args: [25] }
    ]);
  });

  it('hides internal charm-weight stats without hiding other granted skills', () => {
    const lines = displayStatLines([
      stat(359, 'charm_weight', 5),
      stat(97, 'item_nonclassskill', 1, 449),
      stat(97, 'item_nonclassskill', 1, 387)
    ], bundle);

    expect(lines.map((line) => line.keyed)).toEqual([
      { key: 'strSkillRandomFromSkillClass', args: [1, 'PsychicWardName', 'WarOnly'] }
    ]);
  });

  it('applies ItemStatCost value shifts and decodes packed proc skill layers', () => {
    const lines = displayStatLines([
      stat(7, 'maxhp', 2048),
      stat(201, 'item_skillongethit', 27, 387 + 4 * 512)
    ], bundle);

    expect(lines.map((line) => line.keyed)).toEqual([
      { key: 'ModStr1u', args: [8] },
      { key: 'ItemExpansiveChanc2', args: [27, 4, 'PsychicWardName'] }
    ]);
  });

  it('resolves equipped aura and oskill display layers to their skill names', () => {
    const lines = displayStatLines([
      stat(97, 'item_nonclassskill', 4, 9),
      stat(151, 'item_aura', 15, 120),
      stat(387, 'item_nonclassskill_display', 4, 9)
    ], bundle);

    expect(lines.map((line) => line.keyed)).toEqual([
      { key: 'ModitemAura', args: [15, 'skillname120'] },
      { key: 'ItemModifierNonClassSkill', args: [4, 'skillname9'] }
    ]);
  });

  it('sorts stats by the game priority and exposes their in-game color role', () => {
    const lines = displayStatLines([
      stat(127, 'item_allskills', 1),
      stat(395, 'item_corrupted', -2),
      stat(394, 'upgrade_medium', 3)
    ], bundle);

    expect(lines.map((line) => [line.keyed?.key, line.tone])).toEqual([
      ['MediumUpgrades', 'enchantment'],
      ['Corrupted', 'corrupted'],
      ['ModStr3k', 'magic']
    ]);
  });

  it('resolves class skill levels from the encoded class layer', () => {
    const classBundle: ItemStatPresentationBundle = {
      ...bundle,
      Stats: {
        ...bundle.Stats,
        item_addclassskills: {
          Priority: 150,
          PositiveKey: 'ModStr3a',
          Function: 13,
          ValueShift: 0
        }
      }
    };

    const lines = displayStatLines([
      stat(83, 'item_addclassskills', 1, 0),
      stat(83, 'item_addclassskills', 1, 1),
      stat(83, 'item_addclassskills', 1, 2),
      stat(83, 'item_addclassskills', 1, 3),
      stat(83, 'item_addclassskills', 1, 4),
      stat(83, 'item_addclassskills', 1, 5),
      stat(83, 'item_addclassskills', 1, 6)
    ], classBundle);

    expect(lines.map((line) => line.keyed)).toEqual([
      { key: 'ModStr3a', args: [1] },
      { key: 'ModStr3d', args: [1] },
      { key: 'ModStr3c', args: [1] },
      { key: 'ModStr3b', args: [1] },
      { key: 'ModStr3e', args: [1] },
      { key: 'ModStre8a', args: [1] },
      { key: 'ModStre8b', args: [1] }
    ]);
  });

  it('renders flavor-only weight text without exposing the backing value', () => {
    const [line] = displayStatLines([stat(398, 'soulstone_weight', 1)], bundle);

    expect(line.keyed).toEqual({ key: 'uber_mod', args: [1] });
    expect(line.tone).toBe('flavor');
  });

  it('applies per-level save encoding at the character level', () => {
    const [line] = displayStatLines(
      [stat(74, 'hpregen_perlevel', -12)],
      bundle,
      { characterLevel: 99 }
    );

    expect(line.keyed).toEqual({
      key: 'ModStr2w',
      args: [-297],
      perLevel: true
    });
  });
});
