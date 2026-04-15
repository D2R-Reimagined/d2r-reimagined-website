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

/** A single search token that may be negated (prefixed with '-' or '!'). */
export interface SearchToken {
    term: string;
    negated: boolean;
}

/** Tokenize a search string into OR groups (split by ',' or '|') of AND terms (split by '+').
 *  Within each '+'-delimited segment, phrases starting with '-' or '!' are negated.
 *  A negation prefix applies to all following words until the next negation or end of segment.
 *  Example: 'fire skill damage -cold skill damage' → phrase "fire skill damage" + negated "cold skill damage". */
export function tokenizeSearch(input: string | undefined | null): SearchToken[][] {
    const raw = (input || '').trim().toLowerCase();
    if (!raw) return [];
    // Split by OR operators: ',' or '|'
    return raw
        .split(/[,|]/)
        .map((group) => {
            const tokens: SearchToken[] = [];
            // Split by '+' for explicit AND
            for (const segment of group.split('+')) {
                // Split segment into phrase chunks at negation boundaries.
                // A negation boundary is a '-' or '!' preceded by whitespace (or at start)
                // followed by a non-space character.
                const parts = segment.trim().split(/\s+(?=[-!]\S)/);
                for (const part of parts) {
                    const trimmed = part.trim();
                    if (!trimmed) continue;
                    // Check if this part starts with a negation prefix
                    if (/^[-!]\S/.test(trimmed)) {
                        const term = trimmed.slice(1).trim();
                        if (term) tokens.push({ term, negated: true });
                    } else {
                        tokens.push({ term: trimmed, negated: false });
                    }
                }
            }
            return tokens;
        })
        .filter((group) => group.length > 0);
}

/** Check whether a haystack string matches at least one OR-group of search tokens.
 *  Each group is an AND-list: every non-negated token must be present and every negated token must be absent. */
export function matchesTokenGroups(hay: string, groups: SearchToken[][]): boolean {
    return groups.some((group) =>
        group.every((t) => (t.negated ? !hay.includes(t.term) : hay.includes(t.term))),
    );
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
