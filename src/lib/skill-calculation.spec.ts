import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import skillClasses from '../../static/data/keyed/skills.json';
import type { Skill, SkillClass, SkillDescriptionLine } from '$lib/types';
import { i18n, initializeI18n } from './i18n';
import {
  applySkillSynergy,
  evaluateSkillCalc,
  skillLineCalcValues,
  skillLineSynergyBonus,
  skillLineUnavailableStats,
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

  it('reports the stat() references a line counted as zero', () => {
    const teeth = skill(67, 'Teeth');
    const boneWall = skill(78, 'Bone Wall');
    teeth.Calculation!.Params[7] = 4;
    teeth.Calculation!.ElementalDamage =
      "(stat('energy'.accr)/par7)+(skill('Bone Wall'.blvl)*par8)";
    teeth.Calculation!.Calcs[1] = "1 + stat('extra_teeth'.accr)";
    const skills = [teeth, boneWall];

    expect(skillLineUnavailableStats({ key: 'k', scale: 'elemental' }, teeth, skills, {})).toEqual(['energy']);
    expect(skillLineUnavailableStats({ key: 'k', scale: 'physical' }, teeth, skills, {})).toEqual([]);
    expect(skillLineUnavailableStats({ key: 'k', valuesCalc: ['clc1', "skill('Bone Wall'.blvl)"] }, teeth, skills, {}))
      .toEqual(['extra_teeth']);
    // An expression that cannot be evaluated keeps the exported table, so it reads no stats.
    expect(skillLineUnavailableStats({ key: 'k', valuesCalc: ["stat('energy'.accr)+ulvl"] }, teeth, skills, {}))
      .toEqual([]);
  });

  it('reads ulvl only from a supplied character level', () => {
    const vines = skill(1, 'Vines');
    const expression = 'ulvl * 3 / 4 + lvl';

    expect(evaluateSkillCalc(expression, vines, [vines], { 1: 5 }, { 1: 5 }, 30)).toBe(22 + 5);
    expect(evaluateSkillCalc("skill('Vines'.ulvl)", vines, [vines], {}, {}, 12)).toBe(12);
    expect(() => evaluateSkillCalc(expression, vines, [vines], { 1: 5 })).toThrow();
    expect(skillLineCalcValues({ key: 'k', valuesCalc: [expression] }, vines, [vines], { 1: 5 })).toEqual([undefined]);
    expect(skillLineCalcValues({ key: 'k', valuesCalc: [expression] }, vines, [vines], { 1: 5 }, { 1: 5 }, 30))
      .toEqual([27]);
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

describe('live description line calculations', () => {
  const classes = skillClasses as SkillClass[];
  const skills = classes.flatMap((entry) => entry.Tabs.flatMap((tab) => tab.Skills));
  // The skilldesc.txt calc pair behind every SynergyCap line, as the exporter preserves it.
  const valuesCalc = ["min(clc6+(skill('Raven'.clc5)-blvl),pa10)", 'pa10'];
  const capped = skills.filter((entry) => entry.Descriptions?.Synergies.some((line) => line.key === 'SynergyCap'));
  const capLine = (entry: Skill): SkillDescriptionLine =>
    ({ ...entry.Descriptions!.Synergies.find((line) => line.key === 'SynergyCap')!, valuesCalc });
  // Every summon's cap counts the same Raven clc5 plus its own clc6 list; read their members from the data.
  const referenced = (expression: string) =>
    [...expression.matchAll(/skill\('([^']+)'\.blvl\)/g)].map(([, code]) => skills.find((entry) => entry.Code === code)!);
  const counterCode = /skill\('([^']+)'\.clc5\)/.exec(valuesCalc[0])![1];
  const counter = skills.find((entry) => entry.Code === counterCode)!;
  const ravenMembers = referenced(counter.Calculation!.Calcs[5]);

  it('ships SynergyCap on the three Druid summons with the cap in Param10', () => {
    expect(capped).toHaveLength(3);
    for (const entry of capped) expect(entry.Calculation!.Params[10]).toBe(100);
  });

  it('reads zero with no synergy points and the own rank cancelled out', () => {
    for (const entry of capped) {
      expect(skillLineCalcValues(capLine(entry), entry, skills, {}), entry.Code).toEqual([0, 100]);
      // The summon is itself a Raven clc5 member; `- blvl` removes it again.
      expect(ravenMembers).toContain(entry);
      const own = { [entry.Id]: 20 };
      expect(skillLineCalcValues(capLine(entry), entry, skills, { [entry.Id]: 40 }, own), entry.Code).toEqual([0, 100]);
    }
  });

  it('follows the hard points of the relevant synergy skills', () => {
    for (const entry of capped) {
      const own = referenced(entry.Calculation!.Calcs[6])[0];
      const shared = ravenMembers.find((member) => member !== entry)!;
      const line = capLine(entry);
      const base = { [entry.Id]: 10, [own.Id]: 7, [shared.Id]: 4 };
      expect(skillLineCalcValues(line, entry, skills, base, base)[0], entry.Code).toBe(11);
      // +skills on a synergy source do not count: the cap reads hard points (blvl) only.
      expect(skillLineCalcValues(line, entry, skills, { ...base, [own.Id]: 30 }, base)[0]).toBe(11);
      expect(skillLineCalcValues(line, entry, skills, { ...base, [own.Id]: 2 }, { ...base, [own.Id]: 2 })[0]).toBe(6);
    }
  });

  it('caps the counted synergy points at Param10', () => {
    const ranks = Object.fromEntries(skills.map((entry) => [entry.Id, 25]));
    for (const entry of capped) {
      expect(skillLineCalcValues(capLine(entry), entry, skills, ranks), entry.Code).toEqual([100, 100]);
    }
  });

  it('keeps the exported table where no expression is shipped or it cannot be evaluated', () => {
    const entry = capped[0];
    const exported = entry.Descriptions!.Synergies.find((line) => line.key === 'SynergyCap')!;
    expect(skillLineCalcValues(exported, entry, skills, {})).toEqual([]);
    expect(skillLineCalcValues({ ...exported, valuesCalc: ["skill('Missing'.blvl)", null] }, entry, skills, {}))
      .toEqual([undefined, undefined]);

    initializeI18n({ SynergyCap: 'Synergy cap: %d / %d' });
    const render = (line: SkillDescriptionLine, ranks: Record<number, number>) => {
      const live = skillLineCalcValues(line, entry, skills, ranks);
      return get(i18n).skillLine(line, { hard: 1, bonus: 0 }, (value, index) => live[index] ?? value);
    };
    const ranks = { [ravenMembers.find((member) => member !== entry)!.Id]: 12 };
    expect(render(exported, ranks)).toBe('Synergy cap: 0 / 100');
    expect(render(capLine(entry), ranks)).toBe('Synergy cap: 12 / 100');
  });
});
