import { getContext, setContext } from 'svelte';

import type { KeyedLine, SkillClass } from './types';

/**
 * Compact data for naming restricted `item_singleskill` pools: each class's contiguous
 * skill-identifier block plus name keys for only the identifiers a page actually needs.
 *
 * `item_singleskill` (engine function 12) bounds are inclusive skill identifiers; the game
 * picks one identifier from them. Only the bounds are exported, so no weighting is implied
 * and none is shown. A pool covering a whole class adds nothing to "+N Random <Class> Skill"
 * and is left alone. Skill-tab selections mix two identifier encodings under one stat
 * (function-12 `class * 8 + tab` and grouped `class * 3 + tab`), and every class selection
 * covers all classes, so neither gains an indicator.
 */
export interface SkillPoolLookup {
  classes: Array<{ key: string; min: number; max: number }>;
  names: Record<number, string>;
}

export const SINGLE_SKILL_STAT = 'item_singleskill';

/** Classes whose skill identifiers form one gap-free block; anything else stays unsupported. */
export function skillClassRanges(classes: SkillClass[]): SkillPoolLookup['classes'] {
  return classes.flatMap((skillClass) => {
    const ids = [...new Set(skillClass.Tabs.flatMap((tab) => tab.Skills.map((skill) => skill.Id)))]
      .sort((a, b) => a - b);
    if (!ids.length) return [];
    const min = ids[0];
    const max = ids[ids.length - 1];
    return max - min + 1 === ids.length ? [{ key: skillClass.NameKey, min, max }] : [];
  });
}

function bounds(line: KeyedLine): [number, number] | null {
  const selection = line.selection;
  if (selection?.stat !== SINGLE_SKILL_STAT) return null;
  const { min, max } = selection;
  if (!Number.isInteger(min) || !Number.isInteger(max) || (min as number) > (max as number)) return null;
  return [min as number, max as number];
}

function restrictedClass(line: KeyedLine, ranges: SkillPoolLookup['classes']) {
  const range = bounds(line);
  if (!range) return null;
  const [min, max] = range;
  const owner = ranges.find((entry) => min >= entry.min && max <= entry.max);
  if (!owner || (min === owner.min && max === owner.max)) return null;
  // The visible text names the class; refuse a pool that contradicts it.
  const named = (line.args ?? []).filter((arg): arg is string => typeof arg === 'string');
  if (named.length && !named.includes(owner.key)) return null;
  return { min, max };
}

/**
 * Name keys of every skill a restricted `item_singleskill` pool can grant, in identifier
 * order. Returns null when there is nothing meaningful to add (no metadata, another stat,
 * a full-class pool) or when any identifier cannot be named reliably.
 */
export function resolveSkillPool(line: KeyedLine | undefined | null, lookup: SkillPoolLookup | undefined | null): string[] | null {
  if (!line || !lookup) return null;
  const pool = restrictedClass(line, lookup.classes);
  if (!pool) return null;
  const keys: string[] = [];
  for (let id = pool.min; id <= pool.max; id++) {
    const key = lookup.names[id];
    if (typeof key !== 'string' || !key) return null;
    keys.push(key);
  }
  return keys;
}

function collectLines(value: unknown, into: KeyedLine[]): void {
  if (Array.isArray(value)) {
    for (const entry of value) collectLines(entry, into);
    return;
  }
  if (!value || typeof value !== 'object') return;
  if ((value as KeyedLine).selection) into.push(value as KeyedLine);
  for (const entry of Object.values(value)) collectLines(entry, into);
}

const contextKey = Symbol('skill-pool-lookup');

/** Opt a page into pool details; pages that never call this (e.g. Grail) render unchanged. */
export function setSkillPoolLookup(lookup: () => SkillPoolLookup | undefined): void {
  setContext(contextKey, lookup);
}

export function getSkillPoolLookup(): () => SkillPoolLookup | undefined {
  return getContext<(() => SkillPoolLookup | undefined) | undefined>(contextKey) ?? (() => undefined);
}

/** The smallest lookup that names every restricted pool found anywhere inside `source`. */
export function buildSkillPoolLookup(classes: SkillClass[], source: unknown): SkillPoolLookup {
  const ranges = skillClassRanges(classes);
  const skillKeys = new Map<number, string>();
  for (const skillClass of classes) {
    for (const tab of skillClass.Tabs) for (const skill of tab.Skills) skillKeys.set(skill.Id, skill.NameKey);
  }

  const lines: KeyedLine[] = [];
  collectLines(source, lines);
  const names: Record<number, string> = {};
  for (const line of lines) {
    const pool = restrictedClass(line, ranges);
    if (!pool) continue;
    for (let id = pool.min; id <= pool.max; id++) {
      const key = skillKeys.get(id);
      if (key) names[id] = key;
    }
  }
  return { classes: ranges, names };
}
