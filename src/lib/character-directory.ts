import type { CharacterDirectoryEntry } from '$lib/characters';
import type { SkillClass } from '$lib/types';

export interface SkillTreeAllocation {
  page: number;
  nameKey: string;
  points: number;
}

export function characterSkillTreeAllocations(
  entry: CharacterDirectoryEntry,
  classes: SkillClass[]
): SkillTreeAllocation[] {
  const skillClass = classes.find(
    (candidate) => candidate.Class.toLowerCase() === entry.character.class.toLowerCase()
  );
  if (!skillClass) return [];

  const pointsBySkillId = new Map(
    entry.skills
      .filter((allocation) => allocation.points > 0)
      .map((allocation) => [allocation.skillId, allocation.points])
  );

  return skillClass.Tabs.map((tab) => ({
    page: tab.Page,
    nameKey: tab.NameKey,
    points: tab.Skills.reduce(
      (total, skill) => total + (pointsBySkillId.get(skill.Id) ?? 0),
      0
    )
  }));
}
