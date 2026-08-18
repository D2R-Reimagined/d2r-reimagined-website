import skills from '../../../../static/data/keyed/skills.json';
import type { SkillClass } from '$lib/types';

export function load() {
  return { classes: skills as SkillClass[] };
}
