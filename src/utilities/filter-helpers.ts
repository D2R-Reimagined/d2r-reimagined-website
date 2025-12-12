// Small reusable helpers for filter UIs (select reset options, numeric parsing, etc.).

import type { FilterOption } from '../resources/constants/item-type-filters';

export type LabeledStringOption = { value: string; label: string };

// Build a standard reset option for string-valued selects: visible label '-', empty value ''
export function makeStringResetOption(label: string = '-'): LabeledStringOption {
  return { value: '', label };
}

// Prepend the standard reset option to an array of string-valued options
export function prependStringResetOption(
  options: ReadonlyArray<LabeledStringOption>,
  label: string = '-'
): LabeledStringOption[] {
  return [makeStringResetOption(label), ...options];
}

// For the Item Type options (FilterOption uses string[] for value), prepend the reset option
export function prependTypeResetOption(
  options: ReadonlyArray<FilterOption>,
  label: string = '-'
): ReadonlyArray<FilterOption> {
  const reset: FilterOption = { label, value: [] };
  return [reset, ...options];
}

// Convert bound values to optional numbers, treating ''/null/undefined as no bound
export function toOptionalNumber(
  val: number | string | undefined | null,
  clampMin: number = 0,
  clampMax: number = 100
): number | undefined {
  if (val === undefined || val === null) return undefined;
  if (typeof val === 'string') {
    const t = val.trim();
    if (t === '') return undefined;
    const n = Number(t);
    return Number.isFinite(n)
      ? Math.max(clampMin, Math.min(clampMax, Math.floor(n)))
      : undefined;
  }
  if (typeof val === 'number' && Number.isFinite(val)) {
    return Math.max(clampMin, Math.min(clampMax, Math.floor(val)));
  }
  return undefined;
}

// Ensure min <= max when both are numbers; otherwise return unchanged
export function swapMinMax<T extends number | undefined>(
  min: T,
  max: T
): [T, T] {
  if (typeof min === 'number' && typeof max === 'number' && min > max) {
    return [max as T, min as T];
  }
  return [min, max];
}
