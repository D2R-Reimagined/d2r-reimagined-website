import { describe, expect, it } from 'vitest';
import skillClasses from '../../static/data/keyed/skills.json';
import type { Skill, SkillClass } from '$lib/types';
import { applySkillSynergy, evaluateSkillCalc, skillSynergyBonus } from './skill-calculation';

function skill(id: number, code: string, overrides: Partial<Skill> = {}): Skill {
  return {
    Id: id,
    Code: code,
    NameKey: code,
    Row: 1,
    Column: 1,
    RequiredLevel: 1,
    MaxLevel: 25,
    PrerequisiteIds: [],
    Calculation: {
      Params: {},
      Calcs: {}
    },
    ...overrides
  };
}

describe('skill synergy calculation', () => {
  it('evaluates Lightning Fury from the exact EDmgSymPerCalc expression', () => {
    const lightningBolt = skill(20, 'Lightning Bolt');
    const chargedStrike = skill(24, 'Charged Strike');
    const lightningStrike = skill(34, 'Lightning Strike');
    const lightningFury = skill(35, 'Lightning Fury');
    lightningFury.Calculation!.Params[8] = 1;
    lightningFury.Calculation!.ElementalDamage =
      "(skill('Charged Strike'.blvl)+skill('Lightning Bolt'.blvl)+skill('Lightning Strike'.blvl)) * par8";

    const ranks = { 20: 10, 24: 5, 34: 2, 35: 1 };
    const bonus = skillSynergyBonus(
      lightningFury,
      'elemental',
      [lightningBolt, chargedStrike, lightningStrike, lightningFury],
      ranks
    );

    expect(bonus).toBe(17);
    expect(applySkillSynergy(240, bonus)).toBe(280);
  });

  it('resolves cross-skill Calc and Param references with hard-point ranks', () => {
    const firestorm = skill(225, 'Firestorm');
    const armageddon = skill(249, 'Armageddon');
    const volcano = skill(244, 'Volcano');
    firestorm.Calculation!.Calcs[5] =
      "skill('Firestorm'.blvl)+skill('Armageddon'.blvl)+skill('Volcano'.blvl)";
    volcano.Calculation!.Params[8] = 3;
    volcano.Calculation!.ElementalDamage = "(skill('Firestorm'.clc5)-blvl)*par8";

    expect(skillSynergyBonus(
      volcano,
      'elemental',
      [firestorm, armageddon, volcano],
      { 225: 5, 249: 4, 244: 2 }
    )).toBe(27);
  });

  it('uses game-style integer division and treats unavailable character stats as zero', () => {
    const teeth = skill(67, 'Teeth');
    const boneWall = skill(78, 'Bone Wall');
    teeth.Calculation!.Params[7] = 4;
    teeth.Calculation!.Params[8] = 7;
    teeth.Calculation!.ElementalDamage =
      "(stat('energy'.accr)/par7)+(skill('Bone Wall'.blvl)*par8)";

    expect(skillSynergyBonus(teeth, 'elemental', [teeth, boneWall], { 67: 1, 78: 3 })).toBe(21);
  });

  it('supports every damage synergy expression in the exported Reimagined skill bundle', () => {
    const classes = skillClasses as SkillClass[];
    const skills = classes.flatMap((entry) => entry.Tabs.flatMap((tab) => tab.Skills));
    const ranks = Object.fromEntries(skills.map((entry) => [entry.Id, Math.min(entry.MaxLevel, 10)]));

    const failures: string[] = [];
    for (const entry of skills) {
      const expressions = [
        entry.Calculation?.PhysicalDamage,
        entry.Calculation?.ElementalDamage,
        entry.Calculation?.ElementalLength
      ].filter((value): value is string => Boolean(value));
      for (const expression of expressions) {
        try {
          evaluateSkillCalc(expression, entry, skills, ranks);
        } catch (error) {
          failures.push(`${entry.Code}: ${expression} (${error instanceof Error ? error.message : error})`);
        }
      }
    }
    expect(failures).toEqual([]);
  });
});
