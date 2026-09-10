import type { Skill, SkillClass } from './types';

export function findBuildSkill(classes: SkillClass[], id: number) {
  for (const entry of classes) {
    const skills = entry.Tabs.flatMap(tab => tab.Skills);
    const skill = skills.find(skill => skill.Id === id);
    if (skill) return { skill, skills };
  }
  return undefined;
}

export function skillPreviewRank(skill: Skill, rank: number): number {
  return Math.min(Math.max(Math.trunc(rank) || 1, 1), skill.Descriptions?.MaxLevel ?? skill.MaxLevel ?? 1);
}

export function insertSkillReference(body: string, start: number, end: number, id: number, rank: number): string {
  return `${body.slice(0, start)}[[skill:${id}:${rank}]]${body.slice(end)}`;
}
