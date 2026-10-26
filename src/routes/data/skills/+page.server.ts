import skills from '../../../../static/data/keyed/skills.json';
import type { SkillClass } from '#lib/types.js';

export function load() {
  return { classes: skills as SkillClass[] };
}
