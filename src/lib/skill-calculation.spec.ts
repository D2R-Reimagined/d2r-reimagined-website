import { describe, expect, it } from 'vitest';
import skillClasses from '../../static/data/keyed/skills.json';
import type { Skill, SkillClass } from '$lib/types';
import {
  applySkillSynergy,
  evaluateSkillCalc,
  skillLineSynergyBonus,
  skillSynergyBonus
} from './skill-calculation';

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

  it('reads blvl from hard points and lvl from levels including +skills', () => {
    const fireMastery = skill(1, 'Fire Mastery');
    fireMastery.Calculation!.Params = { 1: 10, 2: 2, 3: 30 };
    const expression = 'blvl*par1 + min((lvl-blvl)*par2, par3)';

    expect(evaluateSkillCalc(expression, fireMastery, [fireMastery], { 1: 25 }, { 1: 5 })).toBe(50 + 30);
    expect(evaluateSkillCalc(expression, fireMastery, [fireMastery], { 1: 10 }, { 1: 10 })).toBe(100);
    expect(evaluateSkillCalc("skill('Fire Mastery'.blvl)", fireMastery, [fireMastery], { 1: 9 }, { 1: 0 })).toBe(0);
    // A single rank map still means both, which keeps the old call shape working.
    expect(evaluateSkillCalc(expression, fireMastery, [fireMastery], { 1: 4 })).toBe(40);
  });

  it('prefers a line scaleCalc over the skill-level scale expression', () => {
    const inferno = skill(41, 'Inferno');
    const meteor = skill(56, 'Meteor');
    meteor.Calculation!.Params[8] = 99;
    meteor.Calculation!.ElementalDamage = 'par8';
    const skills = [inferno, meteor];
    const ranks = { 41: 20, 56: 1 };
    const base = { 41: 4, 56: 1 };

    expect(skillLineSynergyBonus(
      { key: 'k', scale: 'elemental', scaleCalc: "skill('Inferno'.blvl)*3" }, meteor, skills, ranks, base
    )).toBe(12);
    expect(skillLineSynergyBonus({ key: 'k', scale: 'elemental' }, meteor, skills, ranks, base)).toBe(99);
    expect(skillLineSynergyBonus({ key: 'k' }, meteor, skills, ranks, base)).toBe(0);
  });

  it('supports every line scaleCalc expression in the exported Reimagined skill bundle', () => {
    const classes = skillClasses as SkillClass[];
    const skills = classes.flatMap((entry) => entry.Tabs.flatMap((tab) => tab.Skills));
    const ranks = Object.fromEntries(skills.map((entry) => [entry.Id, Math.min(entry.MaxLevel, 10)]));

    const failures: string[] = [];
    for (const entry of skills) {
      const lines = [
        ...(entry.Descriptions?.Stats ?? []),
        ...(entry.Descriptions?.Details ?? []),
        ...(entry.Descriptions?.Synergies ?? [])
      ];
      for (const line of lines) {
        if (!line.scaleCalc) continue;
        try {
          evaluateSkillCalc(line.scaleCalc, entry, skills, ranks);
        } catch (error) {
          failures.push(`${entry.Code}: ${line.scaleCalc} (${error instanceof Error ? error.message : error})`);
        }
      }
    }
    expect(failures).toEqual([]);
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

  it('cancels the self term of shared synergy counters such as Raven and Firestorm clc5', () => {
    const classes = skillClasses as SkillClass[];
    const skills = classes.flatMap((entry) => entry.Tabs.flatMap((tab) => tab.Skills));
    const shared = skills.filter((entry) => [
      entry.Calculation?.PhysicalDamage,
      entry.Calculation?.ElementalDamage,
      entry.Calculation?.ElementalLength
    ].some((expression) => /skill\('(?:Raven|Firestorm)'\.clc5\)/i.test(expression ?? '')));
    expect(shared.length).toBeGreaterThan(10);

    for (const entry of shared) {
      // Only the viewed skill allocated: the counter holds just its own level, which `- blvl` removes.
      const alone = { [entry.Id]: 20 };
      for (const scale of ['physical', 'elemental', 'elementalLength'] as const) {
        expect(skillSynergyBonus(entry, scale, skills, alone), `${entry.Code} ${scale}`).toBeGreaterThanOrEqual(0);
      }
    }

    const byCode = (code: string) => skills.find((entry) => entry.Code === code)!;
    const vines = byCode('Vines');
    const raven = byCode('Raven');
    const ranks = { [vines.Id]: 20, [raven.Id]: 5 };
    expect(skillSynergyBonus(vines, 'physical', skills, { [vines.Id]: 20 })).toBe(0);
    expect(skillSynergyBonus(vines, 'physical', skills, ranks))
      .toBe(5 * (vines.Calculation!.Params[8] ?? 0));
  });
});
