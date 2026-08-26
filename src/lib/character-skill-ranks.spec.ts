import { describe, expect, it } from 'vitest';

import type { CharacterSaveDetails, SaveItem, SaveStat } from './characters';
import { characterSkillRanks } from './character-skill-ranks';
import type { Skill, SkillClass } from './types';

function skill(id: number, element: string): Skill {
  return {
    Id: id,
    Code: `skill-${id}`,
    NameKey: `skill-${id}`,
    ElementType: element,
    Row: 1,
    Column: 1,
    RequiredLevel: 1,
    MaxLevel: 25,
    PrerequisiteIds: []
  };
}

const fire = skill(36, 'fire');
const cold = skill(64, 'cold');
const sorceress: SkillClass = {
  Class: 'Sorceress',
  ClassCode: 'sor',
  NameKey: 'Sorceress',
  Tabs: [
    { Page: 1, NameKey: 'Fire', Skills: [fire] },
    { Page: 2, NameKey: 'Lightning', Skills: [] },
    { Page: 3, NameKey: 'Cold', Skills: [cold] }
  ]
};
const classes = [
  { ...sorceress, Class: 'Amazon', ClassCode: 'ama' },
  sorceress
];

function stat(name: string, value: number, layer = 0): SaveStat {
  return { id: 0, name, value, layer };
}

function item(
  stats: SaveStat[],
  mode = 'Equipped',
  codeText = 'cap',
  bodyLocation = 'Head'
): SaveItem {
  return {
    codeText,
    stats,
    runewordStats: null,
    setBonusStats: [],
    sockets: [],
    position: { mode, storePage: 'Inventory', bodyLocation }
  } as unknown as SaveItem;
}

function save(items: SaveItem[]): CharacterSaveDetails {
  return {
    character: { weaponSwitch: 0 },
    skills: { entries: [
      { id: fire.Id, name: fire.Code, points: 4 },
      { id: cold.Id, name: cold.Code, points: 25 }
    ] },
    items: { entries: items }
  } as CharacterSaveDetails;
}

describe('characterSkillRanks', () => {
  it('applies active all, class, tab, element, and single-skill bonuses', () => {
    const result = characterSkillRanks(save([
      item([stat('item_allskills', 2)]),
      item([stat('item_addclassskills', 3, 1)]),
      item([stat('item_addskill_tab', 4, 10)]),
      item([stat('item_elemskill', 5, 1)]),
      item([stat('item_singleskill', 6, cold.Id)])
    ]), sorceress, classes);

    expect(result.effective[fire.Id]).toBe(14);
    expect(result.effective[cold.Id]).toBe(40);
    expect(result.base[cold.Id]).toBe(25);
  });

  it('includes carried charms and ignores stored gear and the inactive weapon set', () => {
    const result = characterSkillRanks(save([
      item([stat('item_allskills', 2)], 'Stored', 'cm2', 'None'),
      item([stat('item_allskills', 50)], 'Stored', 'amu', 'None'),
      item([stat('item_allskills', 50)], 'Equipped', 'sw2', 'RightArmSecondary')
    ]), sorceress, classes);

    expect(result.effective[fire.Id]).toBe(6);
    expect(result.effective[cold.Id]).toBe(27);
  });

  it('allows an oskill to grant an otherwise unlearned class skill', () => {
    const noFire = save([item([stat('item_nonclassskill', 1, fire.Id)])]);
    noFire.skills.entries[0].points = 0;

    expect(characterSkillRanks(noFire, sorceress, classes).effective[fire.Id]).toBe(1);
  });
});
