// Small reusable helpers for filter UIs (select reset options, numeric parsing, etc.).

import type { IFilterOption } from '../resources/constants';

export type LabeledStringOption = { value: string; label: string };

// Build a standard reset option for string-valued selecting: visible label '-', empty value ''
export function makeStringResetOption(
    label: string = '-',
): LabeledStringOption {
    return { value: '', label };
}

// Prepend the standard reset option to an array of string-valued options
export function prependStringResetOption(
    options: ReadonlyArray<LabeledStringOption>,
    label: string = '-',
): LabeledStringOption[] {
    return [makeStringResetOption(label), ...options];
}

// For the Item Type options (IFilterOption uses string[] for value), prepend the reset option
export function prependTypeResetOption(
    options: ReadonlyArray<IFilterOption>,
    label: string = '-',
): ReadonlyArray<IFilterOption> {
    const reset: IFilterOption = { id: '', label, value: undefined };
    return [reset, ...options];
}

// Convert bound values to optional numbers, treating ''/null/undefined as no bound
export function toOptionalNumber(
    val: number | string | undefined | null,
    clampMin: number = 0,
    clampMax: number = 100,
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
    if (Number.isFinite(val)) {
        return Math.max(clampMin, Math.min(clampMax, Math.floor(val)));
    }
    return undefined;
}

// Ensure min <= max when both are numbers; otherwise return unchanged
export function swapMinMax<T extends number | undefined>(
    min: T,
    max: T,
): [T, T] {
    if (typeof min === 'number' && typeof max === 'number' && min > max) {
        return [max as T, min as T];
    }
    return [min, max];
}

/** Tokenize a search string into OR groups (split by ',' or '|') of AND terms (split by '+'). */
export function tokenizeSearch(input: string | undefined | null): string[][] {
    const raw = (input || '').trim().toLowerCase();
    if (!raw) return [];
    // Split by OR operators: ',' or '|'
    return raw
        .split(/[,|]/)
        .map((group) =>
            group
                .split('+')
                .map((s) => s.trim())
                .filter(Boolean),
        )
        .filter((group) => group.length > 0);
}

/** Check if an item is 'vanilla' based on its Vanilla property (usually 'Y'). */
export function isVanillaItem(vanilla: unknown): boolean {
    if (vanilla === undefined || vanilla === null) return false;
    const vStr =
        typeof vanilla === 'string' ||
        typeof vanilla === 'number' ||
        typeof vanilla === 'boolean'
            ? String(vanilla).toUpperCase()
            : '';
    return vStr === 'Y';
}
