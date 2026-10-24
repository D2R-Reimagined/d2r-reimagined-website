import type { Skill, SkillDescriptionLine } from '$lib/types';

/**
 * Highest combined level (hard + `+skills` bonus) the previews offer. The export does not carry
 * a limit yet, so this is a site-side constant until one is exported.
 */
export const SKILL_LEVEL_CAP = 100;

/** A skill level split the way skillcalc.txt sees it: `blvl` = hard, `lvl` = hard + bonus. */
export interface SkillPoints {
  hard: number;
  bonus: number;
  /** Character level (`ulvl`). Omitted means the highest level the export covers. */
  characterLevel?: number;
}

/** The skill's own hard-point cap — the first axis of `values2d` runs `0..HardPointCap`. */
export function skillHardPointCap(skill: Skill | undefined): number {
  return skill?.Descriptions?.HardPointCap ?? (skill?.MaxLevel || 20);
}

/** Bonus levels still available once `hard` points are spent, keeping the total within the cap. */
export function skillBonusCap(hard: number): number {
  return Math.max(SKILL_LEVEL_CAP - Math.max(0, Math.trunc(hard) || 0), 0);
}

/**
 * Normalises a preview: hard points are clamped to `0..cap` (0 is an item-granted oskill),
 * bonus to whatever remains of `SKILL_LEVEL_CAP`, and a skill always has at least one level.
 * Hard points win, so raising them trims the bonus.
 */
export function clampSkillPoints(skill: Skill | undefined, points: SkillPoints): SkillPoints {
  const hard = clampInteger(points.hard, 0, Math.min(skillHardPointCap(skill), SKILL_LEVEL_CAP));
  const bonus = clampInteger(points.bonus, hard === 0 ? 1 : 0, skillBonusCap(hard));
  return { hard, bonus };
}

/**
 * Splits one effective rank (e.g. a build guide's "Fire Ball 45") into hard points up to the
 * skill's cap and the remainder as bonus levels.
 */
export function skillPointsFromRank(skill: Skill | undefined, rank: number): SkillPoints {
  const level = Math.max(Math.trunc(rank) || 1, 1);
  const hard = Math.min(level, skillHardPointCap(skill));
  return clampSkillPoints(skill, { hard, bonus: level - hard });
}

/**
 * Splits a save's base and effective ranks. Negative `+skills` cannot be expressed on the
 * `values2d` bonus axis, so they lower the hard points instead.
 */
export function skillPointsFromRanks(skill: Skill | undefined, base: number, effective: number): SkillPoints {
  const hard = Math.max(0, Math.min(base, effective));
  return clampSkillPoints(skill, { hard, bonus: Math.max(0, effective - hard) });
}

/** Hard / bonus points the reader chose in the planner preview, tied to the skill and rank they were chosen at. */
export interface SkillPreviewOverride {
  skillId: number;
  rank: number;
  points: SkillPoints;
}

/**
 * Planner preview points: the reader's override while the same skill is shown at the same rank,
 * otherwise the allocated rank (at least 1) with no bonus. Another skill shown in between (a
 * hover preview) does not discard the override.
 */
export function skillPreviewPoints(skill: Skill | undefined, rank: number, override: SkillPreviewOverride | null): SkillPoints {
  const own = override && skill && override.skillId === skill.Id && override.rank === rank ? override.points : null;
  return clampSkillPoints(skill, own ?? { hard: Math.max(rank, 1), bonus: 0 });
}

/** An override goes stale once its own skill's allocation changes; other skills shown meanwhile keep it. */
export function keepSkillPreviewOverride(
  override: SkillPreviewOverride | null,
  skill: Skill | undefined,
  rank: number
): SkillPreviewOverride | null {
  return override && skill?.Id === override.skillId && rank !== override.rank ? null : override;
}

/** True when any of the skill's description lines depends on the character level. */
export function skillReadsCharacterLevel(skill: Skill | undefined): boolean {
  const descriptions = skill?.Descriptions;
  return [...(descriptions?.Stats ?? []), ...(descriptions?.Details ?? []), ...(descriptions?.Synergies ?? [])]
    .some((line) => !!line.valuesUlvl?.length);
}

/**
 * Reads every numeric argument of a description line at the given points. `valuesUlvl` wins
 * when present (`ulvl`-sensitive lines), then `values2d` (`blvl`-sensitive lines); otherwise
 * the flat table is indexed by the total level. Every axis is clamped because the exporter
 * trims constant tails.
 */
export function skillLineNumbers(line: SkillDescriptionLine, points: SkillPoints): number[] {
  const hard = Math.max(0, Math.trunc(points.hard));
  const bonus = Math.max(0, Math.trunc(points.bonus));
  if (line.valuesUlvl?.length) {
    const level = Math.max(hard + bonus, 1) - 1;
    const characterLevel = points.characterLevel === undefined
      ? Number.POSITIVE_INFINITY
      : Math.max(Math.trunc(points.characterLevel) || 1, 1) - 1;
    return line.valuesUlvl.map((rows) => {
      const row = rows[Math.min(level, rows.length - 1)] ?? [];
      return row[Math.min(characterLevel, row.length - 1)] ?? 0;
    });
  }
  if (line.values2d?.length) {
    return line.values2d.map((rows) => {
      const row = rows[Math.min(hard, rows.length - 1)] ?? [];
      return row[Math.min(bonus, row.length - 1)] ?? 0;
    });
  }
  const index = Math.max(hard + bonus, 1) - 1;
  return (line.values ?? []).map((table) => table[Math.min(index, table.length - 1)] ?? 0);
}

function clampInteger(value: number, min: number, max: number): number {
  const integer = Number.isFinite(value) ? Math.trunc(value) : min;
  return Math.min(Math.max(integer, min), Math.max(min, max));
}
