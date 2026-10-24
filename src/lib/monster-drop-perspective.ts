import { categoryFilterLabel, type NotableLimitation } from './monster-drop-results';

/** Presentation model for the two ways of reading Monster drops & simulation results. Each
 * perspective maps onto the existing row-shape option `leaves`; no new calculation mode exists.
 * Item drops = `leaves` off (individual items, optionally collapsed); Treasure-class breakdown =
 * `leaves` on (items credited to the random-pick class that rolled them). */
export type ResultPerspective = 'items' | 'tc';

export const perspectiveOf = (leaves: boolean): ResultPerspective => leaves ? 'tc' : 'items';
export const leavesFor = (perspective: ResultPerspective) => perspective === 'tc';

export interface PerspectiveInfo { value: ResultPerspective; label: string; description: string }
export const RESULT_PERSPECTIVES: readonly PerspectiveInfo[] = [
  { value: 'items', label: 'Item drops', description: 'Individual items you can find, with their chance per kill.' },
  { value: 'tc', label: 'Treasure-class breakdown', description: 'Treasure-class contributions, not individual item drops: each item is credited to the random-pick class that rolled it, so individual uniques, sets and runes cannot be ranked.' },
];
export const perspectiveInfo = (perspective: ResultPerspective) => RESULT_PERSPECTIVES.find(p => p.value === perspective)!;

/** Which result controls apply to the current representation. Hidden controls keep their state. */
export interface ResultControls {
  /** The Uniques, sets & runes shortcut ranks individual items, which a breakdown cannot do. */
  notableShortcut: boolean;
  searchLabel: string; searchPlaceholder: string; categoryLabel: string;
}
export function resultControls(perspective: ResultPerspective): ResultControls {
  return perspective === 'items'
    ? { notableShortcut: true, searchLabel: 'Filter loot items by name', searchPlaceholder: 'Filter loot items…', categoryLabel: 'Loot category' }
    : { notableShortcut: false, searchLabel: 'Filter treasure classes and direct items by name', searchPlaceholder: 'Filter classes…', categoryLabel: 'Row type' };
}

export interface ResultFilterState { search: string; category: string; droppedOnly: boolean; simulated: boolean }
/** Human-readable list of the table filters that currently remove rows; empty when none apply. */
export function activeFilters(state: ResultFilterState): string[] {
  const list: string[] = [];
  if (state.search.trim()) list.push(`name contains “${state.search.trim()}”`);
  if (state.category !== 'all') list.push(categoryFilterLabel(state.category));
  if (state.simulated && state.droppedOnly) list.push('seen this run only');
  return list;
}

/** Whether the shown numbers come from a seeded simulation or only theoretical rates. */
export function resultBasis(report: { simulated: boolean; kills: number; seed: number }): string {
  return report.simulated
    ? `Simulation of ${report.kills.toLocaleString('en-US')} ${report.kills === 1 ? 'kill' : 'kills'} · seed ${report.seed} · chances per kill are still the calculated odds`
    : 'Drop rates · theoretical chances per kill, no random rolls';
}

/** Why an item the player looks for may be absent from the current view. */
export function missingItemHint(state: { perspective: ResultPerspective; collapse: boolean }): string {
  if (state.perspective === 'tc') return 'Most items appear under the treasure class that rolled them here; switch to Item drops to look for a particular item.';
  if (state.collapse) return 'Collapse similar combines uniques, sets and random bases into group rows; turn it off to look for a particular item.';
  return '';
}

/** Direct action offered by the notable-drops panel when the representation hides individual
 * uniques and sets. It only changes row-shape options; it never splits a group's chance. */
export interface NotableRecovery { action: 'show-items' | 'uncollapse'; label: string; explanation: string }
export function notableRecovery(limitation: NotableLimitation): NotableRecovery | null {
  if (limitation === 'leaves') return { action: 'show-items', label: 'Show item drops',
    explanation: 'The treasure-class breakdown credits items to the class that rolled them, so individual uniques, sets and runes from random-pick classes cannot be ranked here.' };
  if (limitation === 'collapsed') return { action: 'uncollapse', label: 'Turn off Collapse similar',
    explanation: "Collapse similar combines uniques and sets into group rows; a group's chance is not any one item's, so only individual runes are ranked." };
  return null;
}
