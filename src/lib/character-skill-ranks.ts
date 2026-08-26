import type { CharacterSaveDetails, SaveItem, SaveStat } from '$lib/characters';
import type { Skill, SkillClass } from '$lib/types';

export interface CharacterSkillRanks {
  base: Record<number, number>;
  effective: Record<number, number>;
}

const carriedCharmCodes = new Set(['cm1', 'cm2', 'cm3']);
const elementByLayer = new Map([
  [1, 'fire'],
  [2, 'ltng'],
  [3, 'mag'],
  [4, 'cold'],
  [5, 'pois']
]);

function isActiveItem(item: SaveItem, weaponSwitch: number): boolean {
  if (item.position.mode === 'Equipped') {
    const location = item.position.bodyLocation;
    if (!/arm/i.test(location)) return true;
    const secondary = /secondary|alternate|swap/i.test(location);
    return secondary === (weaponSwitch !== 0);
  }

  return item.position.mode === 'Stored'
    && item.position.storePage === 'Inventory'
    && carriedCharmCodes.has(item.codeText.toLowerCase());
}

function itemStats(item: SaveItem): SaveStat[] {
  return [
    ...item.stats,
    ...(item.runewordStats ?? []),
    ...item.setBonusStats.flat(),
    ...item.sockets.flatMap((socket) => socket ? itemStats(socket) : [])
  ];
}

function add(ranks: Record<number, number>, skill: Skill, amount: number): void {
  ranks[skill.Id] = Math.max(0, (ranks[skill.Id] ?? 0) + amount);
}

export function characterSkillRanks(
  save: CharacterSaveDetails,
  skillClass: SkillClass,
  classes: SkillClass[]
): CharacterSkillRanks {
  const base = Object.fromEntries(save.skills.entries.map((skill) => [skill.id, skill.points]));
  const effective = { ...base };
  const classId = classes.findIndex(
    (entry) => entry.Class.toLowerCase() === skillClass.Class.toLowerCase()
  );
  const skills = skillClass.Tabs.flatMap((tab) => tab.Skills);
  const tabBySkill = new Map(
    skillClass.Tabs.flatMap((tab) => tab.Skills.map((skill) => [skill.Id, tab.Page] as const))
  );
  const skillsById = new Map(skills.map((skill) => [skill.Id, skill]));
  const learnedSkills = skills.filter((skill) => (base[skill.Id] ?? 0) > 0);

  const stats = save.items.entries
    .filter((item) => isActiveItem(item, save.character.weaponSwitch))
    .flatMap(itemStats);

  for (const stat of stats) {
    if (!stat.value) continue;

    if (stat.name === 'item_allskills') {
      for (const skill of learnedSkills) add(effective, skill, stat.value);
      continue;
    }

    if (stat.name === 'item_addclassskills' && stat.layer === classId) {
      for (const skill of learnedSkills) add(effective, skill, stat.value);
      continue;
    }

    if (stat.name === 'item_addskill_tab') {
      for (const skill of learnedSkills) {
        const tab = tabBySkill.get(skill.Id);
        if (tab !== undefined && stat.layer === classId * 8 + tab - 1) {
          add(effective, skill, stat.value);
        }
      }
      continue;
    }

    if (stat.name === 'item_elemskill') {
      const element = elementByLayer.get(stat.layer);
      if (element) {
        for (const skill of learnedSkills) {
          if (skill.ElementType?.toLowerCase() === element) add(effective, skill, stat.value);
        }
      }
      continue;
    }

    if (stat.name === 'item_singleskill') {
      const skill = skillsById.get(stat.layer);
      if (skill && (base[skill.Id] ?? 0) > 0) add(effective, skill, stat.value);
      continue;
    }

    if (stat.name === 'item_nonclassskill') {
      const skill = skillsById.get(stat.layer);
      if (skill) add(effective, skill, stat.value);
    }
  }

  return { base, effective };
}
