import type { TemplateArg } from '../utilities/format-template';
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
 * A group's own heading: its code when that has a translation, otherwise the exported
 * `nameKey` label. Untranslated propertygroups.txt codes ("Incendiary-Affix1") are engine
 * identifiers and are never shown; an empty string means the group has no usable label.
 */
export function groupHeading(line: KeyedLine, t: Translate): string {
  return translated(line.code, t) || translated(line.nameKey, t);
}

/** Localized disclosure summary for `count` groups. */
export function propertyGroupsTitle(count: number, t: Translate): string {
  return count === 1 ? t('property_groups_title_one') : t('property_groups_title', [count]);
}

/**
 * The existing card annotation for a group child: its chance as a share of the chances of
 * its own siblings (a missing chance counts as 1), or nothing when no chance was exported.
 */
export function childChance(line: KeyedLine, siblings: KeyedLine[]): string {
  if (line.chance == null) return '';
  const total = siblings.reduce((sum, sibling) => sum + (sibling.chance ?? 1), 0);
  return total > 0 ? ` (${((line.chance / total) * 100).toFixed(1)}%)` : '';
}
