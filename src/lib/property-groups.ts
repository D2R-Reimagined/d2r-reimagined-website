import type { TemplateArg } from '../utilities/format-template';
import { childSelection, selectionPercent } from './automagic';
import type { KeyedLine } from './types';

type Translate = (key: string | number | undefined | null, args?: ReadonlyArray<TemplateArg>) => string;

/**
 * A propertygroups.txt parent whose children are alternatives the game picks from
 * (`pickMode` other than "0"). sortModifierLines already moves these after the ordinary
 * lines, so collapsing them never reorders anything that stays visible. Pick-mode "0" groups
 * (none in the current export) keep their inline presentation.
 */
export function isAlternateGroup(line: KeyedLine): boolean {
  return Boolean(line.children?.length) && Number(line.pickMode ?? 0) !== 0;
}

/** Splits already-ordered lines into the always-visible lines and the alternate groups. */
export function splitPropertyGroups(lines: KeyedLine[]): { visible: KeyedLine[]; groups: KeyedLine[] } {
  const visible: KeyedLine[] = [];
  const groups: KeyedLine[] = [];
  for (const line of lines) (isAlternateGroup(line) ? groups : visible).push(line);
  return { visible, groups };
}

function translated(key: string | undefined, t: Translate): string {
  if (!key) return '';
  const text = t(key);
  return text && text !== key ? text : '';
}

/**
 * Localized suffix for how many times a group rolls, such as " (1 roll)" or " (1-3 rolls)".
 * Empty when the exporter shipped no roll count or one that is not a whole-number range.
 */
export function groupRollCount(line: KeyedLine, t: Translate): string {
  const min = line.rollCount?.min;
  const max = line.rollCount?.max;
  if (typeof min !== 'number' || typeof max !== 'number') return '';
  if (!Number.isInteger(min) || !Number.isInteger(max) || min < 0 || max < 1 || min > max) return '';
  if (min === 1 && max === 1) return t('property_group_rolls_one');
  return t('property_group_rolls', min === max ? [max] : [min, max]);
}

/**
 * A group's own heading: its code when that has a translation, otherwise the exported
 * `nameKey` label, followed by the group's roll count when one was exported. Untranslated
 * propertygroups.txt codes ("Incendiary-Affix1") are engine identifiers and are never
 * shown; an empty string means the group has no usable label.
 */
export function groupHeading(line: KeyedLine, t: Translate): string {
  const label = translated(line.code, t) || translated(line.nameKey, t);
  return (label + groupRollCount(line, t)).trim();
}

/** Localized disclosure summary for `count` groups. */
export function propertyGroupsTitle(count: number, t: Translate): string {
  return count === 1 ? t('property_groups_title_one') : t('property_groups_title', [count]);
}

/**
 * The card annotation for a child of `group`: its share of the group's selection tickets,
 * the first-draw probability under pick mode 1 and the per-draw probability under pick
 * mode 2. Nothing is shown for all-selected (mode 0) or unknown groups, or when the group's
 * weights are incomplete or invalid.
 */
export function childChance(line: KeyedLine, group: KeyedLine): string {
  const selection = childSelection(line, group);
  return selection ? ` (${selectionPercent(selection)})` : '';
}
