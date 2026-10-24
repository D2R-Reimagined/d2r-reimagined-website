import { describe, expect, it } from 'vitest';
import skillClasses from '../../static/data/keyed/skills.json';
import type { Skill, SkillClass, SkillDescriptionLine } from '$lib/types';
import {
  clampSkillPoints,
  keepSkillPreviewOverride,
  SKILL_LEVEL_CAP,
  skillBonusCap,
  skillHardPointCap,
  skillLineNumbers,
  skillPointsFromRank,
  skillPointsFromRanks,
  skillPreviewPoints,
  skillReadsCharacterLevel,
  type SkillPreviewOverride
} from './skill-points';

function skill(overrides: Partial<Skill> = {}): Skill {
  return {
    Id: 1,
    Code: 'Test',
    NameKey: 'Test',
    Row: 1,
    Column: 1,
    RequiredLevel: 1,
    MaxLevel: 20,
    PrerequisiteIds: [],
    Descriptions: { MaxLevel: 60, HardPointCap: 25, Stats: [], Details: [], Synergies: [] },
    ...overrides
  };
}

describe('skill points', () => {
  it('uses the exported hard-point cap and the site combined level cap', () => {
    expect(skillHardPointCap(skill())).toBe(25);
    expect(skillHardPointCap(skill({ Descriptions: undefined }))).toBe(20);
    expect(clampSkillPoints(skill(), { hard: 99, bonus: 999 })).toEqual({ hard: 25, bonus: 75 });
    expect(SKILL_LEVEL_CAP).toBe(100);
  });

  it('never lets hard + bonus exceed the combined cap, with hard points taking priority', () => {
    expect(skillBonusCap(25)).toBe(75);
    expect(skillBonusCap(0)).toBe(100);
    expect(clampSkillPoints(skill(), { hard: 25, bonus: 80 })).toEqual({ hard: 25, bonus: 75 });
    expect(clampSkillPoints(skill(), { hard: 0, bonus: 99 })).toEqual({ hard: 0, bonus: 99 });
    expect(clampSkillPoints(skill(), { hard: 1, bonus: 99 })).toEqual({ hard: 1, bonus: 99 });
    expect(clampSkillPoints(skill(), { hard: 5, bonus: 99 })).toEqual({ hard: 5, bonus: 95 });
    expect(clampSkillPoints(skill(), { hard: 0, bonus: 150 })).toEqual({ hard: 0, bonus: 100 });
    expect(clampSkillPoints(skill({ Descriptions: { MaxLevel: 200, HardPointCap: 150, Stats: [], Details: [], Synergies: [] } }), { hard: 150, bonus: 5 }))
      .toEqual({ hard: 100, bonus: 0 });
  });

  it('keeps zero hard points but requires at least one total level', () => {
    expect(clampSkillPoints(skill(), { hard: 0, bonus: 0 })).toEqual({ hard: 0, bonus: 1 });
    expect(clampSkillPoints(skill(), { hard: 0, bonus: 7 })).toEqual({ hard: 0, bonus: 7 });
    expect(clampSkillPoints(skill(), { hard: -3, bonus: -2 })).toEqual({ hard: 0, bonus: 1 });
  });

  it('splits a single rank at the hard-point cap', () => {
    expect(skillPointsFromRank(skill(), 12)).toEqual({ hard: 12, bonus: 0 });
    expect(skillPointsFromRank(skill(), 45)).toEqual({ hard: 25, bonus: 20 });
    expect(skillPointsFromRank(skill(), NaN)).toEqual({ hard: 1, bonus: 0 });
  });

  it('splits save ranks into base and gear levels, including item-only oskills', () => {
    expect(skillPointsFromRanks(skill(), 20, 27)).toEqual({ hard: 20, bonus: 7 });
    expect(skillPointsFromRanks(skill(), 0, 3)).toEqual({ hard: 0, bonus: 3 });
    expect(skillPointsFromRanks(skill(), 10, 8)).toEqual({ hard: 8, bonus: 0 });
  });
});

describe('planner preview overrides', () => {
  const pinned = skill({ Id: 1 });
  const hovered = skill({ Id: 2 });
  const override: SkillPreviewOverride = { skillId: 1, rank: 4, points: { hard: 9, bonus: 12 } };

  it('defaults to the allocated rank, at least 1, with no bonus', () => {
    expect(skillPreviewPoints(pinned, 4, null)).toEqual({ hard: 4, bonus: 0 });
    expect(skillPreviewPoints(pinned, 0, null)).toEqual({ hard: 1, bonus: 0 });
  });

  it('keeps the pinned override through a hover preview of another skill', () => {
    expect(skillPreviewPoints(pinned, 4, override)).toEqual({ hard: 9, bonus: 12 });
    // Hovering shows another skill at its own defaults without discarding the override.
    expect(skillPreviewPoints(hovered, 7, override)).toEqual({ hard: 7, bonus: 0 });
    expect(keepSkillPreviewOverride(override, hovered, 7)).toBe(override);
    expect(skillPreviewPoints(pinned, 4, keepSkillPreviewOverride(override, pinned, 4))).toEqual({ hard: 9, bonus: 12 });
  });

  it('drops the override once its own skill allocation changes', () => {
    expect(skillPreviewPoints(pinned, 5, override)).toEqual({ hard: 5, bonus: 0 });
    expect(keepSkillPreviewOverride(override, pinned, 5)).toBeNull();
  });
});

describe('skillLineNumbers', () => {
  const flat: SkillDescriptionLine = { key: 'k', values: [[10, 20, 30], [1]] };
  const grid: SkillDescriptionLine = {
    key: 'k',
    values: [[999]],
    values2d: [[[0, 5, 9], [6, 8]], [[0]]]
  };

  it('indexes flat tables by total level and clamps to the trimmed tail', () => {
    expect(skillLineNumbers(flat, { hard: 1, bonus: 0 })).toEqual([10, 1]);
    expect(skillLineNumbers(flat, { hard: 1, bonus: 1 })).toEqual([20, 1]);
    expect(skillLineNumbers(flat, { hard: 20, bonus: 80 })).toEqual([30, 1]);
    expect(skillLineNumbers(flat, { hard: 0, bonus: 0 })).toEqual([10, 1]);
  });

  it('prefers values2d, keeps row 0 and clamps both axes', () => {
    expect(skillLineNumbers(grid, { hard: 0, bonus: 2 })).toEqual([9, 0]);
    expect(skillLineNumbers(grid, { hard: 1, bonus: 0 })).toEqual([6, 0]);
    expect(skillLineNumbers(grid, { hard: 1, bonus: 50 })).toEqual([8, 0]);
    expect(skillLineNumbers(grid, { hard: 30, bonus: 0 })).toEqual([6, 0]);
  });

  it('reads valuesUlvl by skill level and character level, defaulting to the top level', () => {
    const ulvl: SkillDescriptionLine = { key: 'k', values: [[999]], valuesUlvl: [[[5, 6, 7], [10, 12]]] };
    expect(skillLineNumbers(ulvl, { hard: 1, bonus: 0, characterLevel: 1 })).toEqual([5]);
    expect(skillLineNumbers(ulvl, { hard: 1, bonus: 0, characterLevel: 2 })).toEqual([6]);
    expect(skillLineNumbers(ulvl, { hard: 1, bonus: 0 })).toEqual([7]);
    expect(skillLineNumbers(ulvl, { hard: 1, bonus: 1, characterLevel: 99 })).toEqual([12]);
    expect(skillLineNumbers(ulvl, { hard: 0, bonus: 40, characterLevel: 0 })).toEqual([10]);
  });

  it('ships Thorns as a character-level line whose top level matches the flat table', () => {
    const skills = (skillClasses as SkillClass[]).flatMap((entry) => entry.Tabs.flatMap((tab) => tab.Skills));
    const thorns = skills.find((entry) => entry.Code === 'Thorns');
    expect(skillReadsCharacterLevel(thorns)).toBe(true);
    expect(skills.filter(skillReadsCharacterLevel).map((entry) => entry.Code)).toEqual(['Thorns']);
    const line = [...thorns!.Descriptions!.Stats, ...thorns!.Descriptions!.Details].find((entry) => entry.valuesUlvl)!;
    for (const rank of [1, 20, 60]) {
      const points = { hard: Math.min(rank, 25), bonus: Math.max(rank - 25, 0) };
      expect(skillLineNumbers(line, points)).toEqual(skillLineNumbers({ ...line, valuesUlvl: undefined }, points));
      expect(skillLineNumbers(line, { ...points, characterLevel: 1 })[0])
        .toBeLessThan(skillLineNumbers(line, points)[0]);
    }
  });

  it('agrees with the flat table for pure hard points across the exported bundle', () => {
    const skills = (skillClasses as SkillClass[]).flatMap((entry) => entry.Tabs.flatMap((tab) => tab.Skills));
    const mismatches: string[] = [];
    for (const entry of skills) {
      const descriptions = entry.Descriptions;
      if (!descriptions) continue;
      const lines = [...descriptions.Stats, ...descriptions.Details, ...descriptions.Synergies];
      for (const line of lines) {
        if (!line.values2d) continue;
        expect(line.values2d.length).toBe(line.values?.length);
        for (let hard = 1; hard <= skillHardPointCap(entry); hard++) {
          const fromGrid = skillLineNumbers(line, { hard, bonus: 0 });
          const fromFlat = skillLineNumbers({ ...line, values2d: undefined }, { hard, bonus: 0 });
          if (fromGrid.join() !== fromFlat.join()) mismatches.push(`${entry.Code} ${line.key} @${hard}`);
        }
      }
    }
    expect(mismatches).toEqual([]);
  });
});
