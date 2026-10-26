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
    // Older exports shipped the line without its calc pair; current ones include it.
    const { valuesCalc: _shipped, ...tableOnly } = entry.Descriptions!.Synergies.find((line) => line.key === 'SynergyCap')!;
    expect(skillLineCalcValues(tableOnly, entry, skills, {})).toEqual([]);
    expect(skillLineCalcValues({ ...tableOnly, valuesCalc: ["skill('Missing'.blvl)", null] }, entry, skills, {}))
      .toEqual([undefined, undefined]);

    initializeI18n({ SynergyCap: 'Synergy cap: %d / %d' });
    const render = (line: SkillDescriptionLine, ranks: Record<number, number>) => {
      const live = skillLineCalcValues(line, entry, skills, ranks);
      return get(i18n).skillLine(line, { hard: 1, bonus: 0 }, (value, index) => live[index] ?? value);
    };
    const ranks = { [ravenMembers.find((member) => member !== entry)!.Id]: 12 };
    expect(render(tableOnly, ranks)).toBe('Synergy cap: 0 / 100');
    expect(render({ ...tableOnly, valuesCalc: ["skill('Missing'.blvl)", null] }, ranks)).toBe('Synergy cap: 0 / 100');
    expect(render(capLine(entry), ranks)).toBe('Synergy cap: 12 / 100');
  });

  it('evaluates the calc pair the active export ships, where it ships one', () => {
    for (const entry of capped) {
      const shipped = entry.Descriptions!.Synergies.find((line) => line.key === 'SynergyCap')!;
      if (!shipped.valuesCalc) continue;
      expect(skillLineCalcValues(shipped, entry, skills, {}), entry.Code).toEqual(skillLineCalcValues(capLine(entry), entry, skills, {}));
      const ranks = Object.fromEntries(ravenMembers.map((member) => [member.Id, 7]));
      expect(skillLineCalcValues(shipped, entry, skills, ranks), entry.Code).toEqual(skillLineCalcValues(capLine(entry), entry, skills, ranks));
    }
  });
});

describe('skillcalc.txt formula codes in shipped valuesCalc', () => {
  const classes = skillClasses as SkillClass[];
  const skills = classes.flatMap((entry) => entry.Tabs.flatMap((tab) => tab.Skills));
  const byCode = (code: string) => skills.find((entry) => entry.Code === code)!;
  const lineOf = (entry: Skill, key: string) =>
    [...entry.Descriptions!.Stats, ...entry.Descriptions!.Details, ...entry.Descriptions!.Synergies]
      .find((line) => line.key === key && line.valuesCalc)!;
  const shipped = skills.flatMap((entry) =>
    [...(entry.Descriptions?.Stats ?? []), ...(entry.Descriptions?.Details ?? []), ...(entry.Descriptions?.Synergies ?? [])]
      .filter((line) => line.valuesCalc)
      .map((line) => ({ entry, line })));
  const at = <T>(table: T[], index: number): T => table[Math.min(index, table.length - 1)];

  it('reproduces the exported no-other-points tables at every level for every expression it evaluates', () => {
    const mismatches: string[] = [];
    let evaluated = 0;
    for (const { entry, line } of shipped) {
      if (line.valuesUlvl) continue;
      const hardCap = entry.Descriptions!.HardPointCap ?? entry.MaxLevel;
      for (let level = 1; level <= entry.Descriptions!.MaxLevel; level++) {
        const hard = Math.min(level, hardCap);
        const live = skillLineCalcValues(line, entry, skills, { [entry.Id]: level }, { [entry.Id]: hard }, 1);
        live.forEach((value, index) => {
          if (value === undefined) return;
          evaluated++;
          const expected = line.values2d
            ? at(at(line.values2d[index], hard), level - hard)
            : at(line.values![index], level - 1);
          if (value !== expected && mismatches.length < 10) {
            mismatches.push(`${entry.Code} ${line.key}[${index}] level ${level}: ${value} != ${expected}`);
          }
        });
      }
    }
    expect(mismatches).toEqual([]);
    expect(evaluated).toBeGreaterThan(5000);
  });

  it('falls back only for expressions that need source data the export does not carry', () => {
    // pstN/astN: skills.txt passivecalc/aurastatcalc cells; pnma/pxma/edmn/edmx: damage columns;
    // sklvl/miss: rows outside the export. See docs/SKILL-PLANNER.md.
    const missing = /\b(?:pst\d|ps1\d|ast\d|pnma|pxma|edmn|edmx)\b|\b(?:sklvl|miss)\(/;
    const unresolved: string[] = [];
    for (const { entry, line } of shipped) {
      const ranks = { [entry.Id]: 10 };
      skillLineCalcValues(line, entry, skills, ranks, ranks, 50).forEach((value, index) => {
        const expression = line.valuesCalc![index];
        if (value === undefined && expression && !missing.test(expression)) unresolved.push(`${entry.Code}: ${expression}`);
      });
    }
    expect(unresolved).toEqual([]);
  });

  it('follows invested points of the synergy skills behind Strafe ln12, not their +skills', () => {
    const strafe = byCode('Strafe');
    const line = lineOf(strafe, 'StrSkillDamagePercent');
    const guided = byCode('Guided Arrow');
    const multiple = byCode('Multiple Shot');
    // ln12 = par1 + (lvl - 1) * par2 reads Strafe's effective level; the synergies read blvl.
    const ranks = { [strafe.Id]: 10, [guided.Id]: 20, [multiple.Id]: 2 };
    const hard = { [strafe.Id]: 8, [guided.Id]: 4, [multiple.Id]: 2 };
    expect(skillLineCalcValues(line, strafe, skills, ranks, hard)).toEqual([5 + 9 * 5 + 4 * 10 + 2 * 5]);
    expect(skillLineCalcValues(line, strafe, skills, { [strafe.Id]: 10 }, { [strafe.Id]: 8 })).toEqual([at(line.values![0], 9)]);
  });

  it('evaluates the truncating dmXY form against live synergy points', () => {
    const findItem = byCode('Find Item');
    const findPotion = byCode('Find Potion');
    // dm12 at level 10: (110*10)/(10+6) = 68, then 68*(60-5)/100 + 5 = 42.
    expect(skillLineCalcValues(lineOf(findItem, 'StrSkill24'), findItem, skills, { [findItem.Id]: 10, [findPotion.Id]: 6 }))
      .toEqual([42 + 6]);

    const bindDemon = byCode('Bind Demon');
    const deathMark = byCode('Death Mark');
    // dm34 at level 10: 68*(64-12)/100 + 12 = 47, plus Death Mark blvl*par8/100.
    expect(skillLineCalcValues(lineOf(bindDemon, 'StrSkillChanceToSucceed'), bindDemon, skills,
      { [bindDemon.Id]: 10, [deathMark.Id]: 9 }, { [bindDemon.Id]: 10, [deathMark.Id]: 5 })).toEqual([47 + 5]);
  });

  it('reads clc0 as Calc10 and the Param11/Param12 progression ln21', () => {
    const echoing = byCode('Echoing Strike');
    const mirrored = byCode('Mirrored Blades');
    const warp = byCode('Blade Warp');
    const line = lineOf(echoing, 'StrSkillDamagePercentage');
    expect(line.valuesCalc).toEqual(['ln12+clc0']);
    expect(skillLineCalcValues(line, echoing, skills, { [echoing.Id]: 10, [mirrored.Id]: 3, [warp.Id]: 2 }))
      .toEqual([25 + 9 * 5 + (3 + 2) * 5]);

    const hexPurge = byCode('Hex Purge');
    const sigil = byCode('Sigil Death');
    // clc2 = (ln21 + Sigil Death blvl * pa10) / 100, ln21 = pa11 + (lvl - 1) * pa12.
    expect(skillLineCalcValues(lineOf(hexPurge, 'StrSkillExplodeChance'), hexPurge, skills, { [hexPurge.Id]: 10, [sigil.Id]: 2 }))
      .toEqual([Math.trunc((6900 + 9 * 50 + 2 * 100) / 100)]);
  });

  it('keeps the exported tables where a cell needs data the export does not carry', () => {
    const grizzly = byCode('Summon Grizzly');
    // pnma (skills.txt physical damage columns) and pst3 (passivecalc3) are not exported.
    expect(skillLineCalcValues(lineOf(grizzly, 'StrSkill4'), grizzly, skills, { [grizzly.Id]: 10 })).toEqual([undefined, undefined]);
    const abyss = byCode('Abyss');
    expect(skillLineCalcValues(lineOf(abyss, 'StrSkill18'), abyss, skills, { [abyss.Id]: 10 })).toEqual([undefined]);
    const skeleton = byCode('Raise Skeleton');
    expect(skillLineCalcValues(lineOf(skeleton, 'StrSkill42'), skeleton, skills, { [skeleton.Id]: 10 })).toEqual([undefined]);
  });
});

describe('skillcalc.txt formula codes', () => {
  it('evaluate in the scope that names them', () => {
    const mastery = skill(1, 'Golem Mastery', { Calculation: { Params: { 5: 20, 6: 5 }, Calcs: {} } });
    const golem = skill(2, 'IronGolem', { Calculation: { Params: { 5: 1, 6: 1, 8: 3 }, Calcs: {} } });
    const ranks = { 1: 4, 2: 10 };
    expect(evaluateSkillCalc('ln56', golem, [mastery, golem], ranks)).toBe(1 + 9 * 1);
    expect(evaluateSkillCalc("skill('Golem Mastery'.ln56) + (lvl*par8)", golem, [mastery, golem], ranks)).toBe(20 + 3 * 5 + 30);
    expect(evaluateSkillCalc('ln91', skill(3, 'X', { Calculation: { Params: { 9: 7, 10: 2 }, Calcs: {} } }), [], { 3: 3 })).toBe(11);
    expect(() => evaluateSkillCalc('ln99', golem, [golem], ranks)).toThrow();
    expect(() => evaluateSkillCalc('constructor', golem, [golem], ranks)).toThrow();
  });
});
