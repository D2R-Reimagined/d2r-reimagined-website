import type { SkillClass } from '$lib/types';

let classesPromise: Promise<SkillClass[]> | undefined;

export function loadSkillClasses(): Promise<SkillClass[]> {
  classesPromise ??= fetch('/data/keyed/skills.json').then(async (response) => {
    if (!response.ok) throw new Error(`Unable to load skill trees (${response.status})`);
    return await response.json() as SkillClass[];
  });
  return classesPromise;
}
