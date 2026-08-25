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
    item_nonclassskill: { ValueShift: 0 },
    item_openwounds: { PositiveKey: 'ModStr3m', Function: 19, ValueShift: 0 },
    item_replenish_quantity: { PositiveKey: 'ModStre9v', Function: 19, ValueShift: 0 },
    maxhp: { PositiveKey: 'ModStr1u', Function: 19, ValueShift: 8 },
    item_skillongethit: { PositiveKey: 'ItemExpansiveChanc2', Function: 15, ValueShift: 0 }
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

  it('hides the internal charm-weight passive without hiding other granted skills', () => {
    const lines = displayStatLines([
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
});
