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

/** A propertygroups.txt child chance, read against its parent's `pickMode`. */
export type ChildSelection =
  | { kind: 'weight'; value: number }
  | { kind: 'percent'; value: number };

export interface AutoMagicChildView {
  text: string;
  selection: ChildSelection | null;
  /** Localized annotation for `selection`; empty when no chance was exported. */
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
 * Exporter contract: under `pickMode` "2" a child's `chance` is a relative pick weight;
 * under every other mode it is a direct percentage. Weights are reported as weights only,
 * because turning them into odds would need the group's draw count and full row set.
 */
export function childSelection(child: KeyedLine, pickMode: string | undefined): ChildSelection | null {
  if (typeof child.chance !== 'number' || !Number.isFinite(child.chance)) return null;
  return pickMode === '2' ? { kind: 'weight', value: child.chance } : { kind: 'percent', value: child.chance };
}

function selectionText(selection: ChildSelection | null, t: AutoMagicTools['t']): string {
  if (!selection) return '';
  return t(selection.kind === 'weight' ? 'automagic_weight' : 'label_chance', [selection.value]);
}

function presentLine(keyedLine: KeyedLine, tools: AutoMagicTools): AutoMagicLineView | null {
  if (keyedLine.children?.length) {
    const nameKey = (keyedLine as KeyedLine & { nameKey?: string }).nameKey ?? 'strPropertyGroupsProperty';
    return {
      text: tools.t(nameKey),
      children: keyedLine.children.map((child) => {
        const selection = childSelection(child, keyedLine.pickMode);
        return { text: tools.line(child), selection, selectionText: selectionText(selection, tools.t) };
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
