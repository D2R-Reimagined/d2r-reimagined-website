/** What returning to Find an item does with the item calculation kept while the simulator was shown. */
export type ItemModeResume = 'keep' | 'calculate' | 'none';

export interface ItemCalculationState<T> {
  selected: T | null;
  calculatedItem: T | null;
  hasResults: boolean;
  busy: boolean;
  error: string;
}

/** Results are kept only for the item they were calculated for; a selection without results (or with
 * results for another item) calculates once, unless a calculation is still running or just failed. */
export function resumeItemMode<T>(state: ItemCalculationState<T>): ItemModeResume {
  if (!state.selected) return 'none';
  if (state.busy) return 'keep';
  if (state.hasResults && state.calculatedItem === state.selected) return 'keep';
  if (state.error && !state.hasResults) return 'keep';
  return 'calculate';
}
