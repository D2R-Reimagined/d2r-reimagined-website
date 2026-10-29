import { sortModifierLines } from './catalog-controls';
import type { TemplateArg } from '../utilities/format-template';
import type { CatalogItem, KeyedLine } from './types';

/**
 * One automagic.txt affix row a base item can roll, as exported on base armor/weapon rows.
 * Every entry on a base shares that base's `AutoPrefix` automagic group, so the entries are
 * alternatives: an item carries at most one of them, gated by item level. The exporter ships
 * the row's minimum item level and required level but neither its `frequency` nor its
 * `maxlevel`, so no selection odds can be derived from this data.
 */
export interface AutoMagicGroup {
  /** Structural automagic.txt row name; never shown to players. */
  Code: string;
  /** Present only when the row name has a translation. */
  NameKey?: string;
  Level?: number;
  RequiredLevel?: number;
  Lines?: KeyedLine[];
}

/**
 * A propertygroups.txt child's share of its group's selection tickets, as a percentage.
 * Pick mode 1 draws without replacement, so the share is the first-draw probability; pick
 * mode 2 draws independently, so the share holds for every draw.
 */
export type ChildSelection = { kind: 'first-draw' | 'per-draw'; percent: number };

export interface AutoMagicChildView {
  text: string;
  selection: ChildSelection | null;
  /** Percentage annotation for `selection`; empty when no reliable share exists. */
  selectionText: string;
}

export interface AutoMagicLineView {
  text: string;
  /** Property-group parents keep their children separate from the affix's other lines. */
  children?: AutoMagicChildView[];
}

export interface AutoMagicEntryView {
  /** Translated affix name, or null when the row has no translation. */
  name: string | null;
  /** The name, or for unnamed rows a description derived from the translated lines. */
  label: string;
  /** Localized item-level and required-level gates. */
  meta: string[];
  lines: AutoMagicLineView[];
}

export interface AutoMagicTools {
  t: (key: string | number | undefined | null, args?: ReadonlyArray<TemplateArg>) => string;
  line: (value: KeyedLine | undefined | null) => string;
}

/** The automagic entries a catalog item carries, or none for anything but a base with groups. */
export function autoMagicGroups(item: CatalogItem): AutoMagicGroup[] {
  const groups = item.AutoMagicGroups;
  if (!Array.isArray(groups)) return [];
  return (groups as AutoMagicGroup[]).filter((group) => group && Array.isArray(group.Lines) && group.Lines.length > 0);
}

/**
 * Selection shares for each child of a propertygroups.txt `group`, in child order. In pick
 * modes 1 and 2 a child's `chance` is a ticket weight, so its share is
 * `chance / sum(positive sibling chances)`. Mode 0 selects every property and unknown modes
 * have no defined draw, so neither gets shares. A missing, non-finite or negative weight
 * leaves the whole group without shares, and a zero-weight child is never selected.
 */
export function groupSelections(group: KeyedLine): (ChildSelection | null)[] {
  const children = group.children ?? [];
  const none = children.map(() => null);
  const mode = Number(group.pickMode);
  if (mode !== 1 && mode !== 2) return none;
  const weights: number[] = [];
  for (const child of children) {
    if (typeof child.chance !== 'number' || !Number.isFinite(child.chance) || child.chance < 0) return none;
    weights.push(child.chance);
  }
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  if (!(total > 0) || !Number.isFinite(total)) return none;
  const kind = mode === 1 ? 'first-draw' : 'per-draw';
  return weights.map((weight) => (weight > 0 ? { kind, percent: (weight / total) * 100 } : null));
}

/** The selection share of one child of `group`, or null when none can be stated reliably. */
export function childSelection(child: KeyedLine, group: KeyedLine): ChildSelection | null {
  const index = (group.children ?? []).indexOf(child);
  return index < 0 ? null : groupSelections(group)[index];
}

/** A concise percentage such as "33.3%" or "60%"; empty without a selection. */
export function selectionPercent(selection: ChildSelection | null): string {
  if (!selection) return '';
  const rounded = Number(selection.percent.toFixed(1));
  return rounded > 0 ? `${rounded}%` : '<0.1%';
}

function presentLine(keyedLine: KeyedLine, tools: AutoMagicTools): AutoMagicLineView | null {
  if (keyedLine.children?.length) {
    const nameKey = (keyedLine as KeyedLine & { nameKey?: string }).nameKey ?? 'strPropertyGroupsProperty';
    const selections = groupSelections(keyedLine);
    return {
      text: tools.t(nameKey),
      children: keyedLine.children.map((child, index) => {
        const selection = selections[index];
        return { text: tools.line(child), selection, selectionText: selectionPercent(selection) };
      })
    };
  }
  if (!keyedLine.key) return null;
  return { text: tools.line(keyedLine) };
}

/** Display model for a base item's automagic alternatives, in exporter order. */
export function presentAutoMagic(item: CatalogItem, tools: AutoMagicTools): AutoMagicEntryView[] {
  return autoMagicGroups(item).map((group) => {
    const lines = sortModifierLines(group.Lines)
      .map((keyedLine) => presentLine(keyedLine, tools))
      .filter((value): value is AutoMagicLineView => value != null && value.text !== '');
    const name = group.NameKey ? tools.t(group.NameKey) || null : null;
    const meta: string[] = [];
    if (typeof group.Level === 'number') meta.push(tools.t('automagic_item_level', [group.Level]));
    if (typeof group.RequiredLevel === 'number') meta.push(tools.t('strRequiredLevel', [group.RequiredLevel]));
    return { name, label: name ?? lines.map((value) => value.text).join(', '), meta, lines };
  }).filter((entry) => entry.lines.length > 0);
}
