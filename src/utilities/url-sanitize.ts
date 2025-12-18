/**
 * Global URL sanitation utilities.
 * - stripBadParams: removes any query params whose values are '', 'undefined', or 'null' (case-insensitive)
 * - cleanCurrentUrl: applies stripBadParams to the current URL and replaces state (no reload)
 */

export function isBlankOrInvalid(v: unknown): boolean {
    if (v === undefined || v === null) return true;
    let s: string;
    if (typeof v === 'string') s = v;
    else if (typeof v === 'number' || typeof v === 'boolean') s = String(v);
    else return true; // treat non-primitive as invalid for URL param purposes
    s = s.trim();
    if (s.length === 0) return true;
    const lower = s.toLowerCase();
    return lower === 'undefined' || lower === 'null';
}

/**
 * Remove invalid params from given URLSearchParams in-place. Returns true if any change was made.
 */
export function stripBadParams(params: URLSearchParams): boolean {
    let changed = false;
    // Collect keys to potentially remove (avoid modifying during iteration side effects)
    const toDelete: string[] = [];
    params.forEach((value, key) => {
        if (isBlankOrInvalid(value)) {
            toDelete.push(key);
        }
    });
    if (toDelete.length) {
        for (const k of toDelete) params.delete(k);
        changed = true;
    }
    return changed;
}

/**
 * Clean the current window URL by stripping invalid params and replacing history state without reload.
 */
export function cleanCurrentUrl(): void {
    try {
        const url = new URL(window.location.href);
        const changed = stripBadParams(url.searchParams);
        if (changed) {
            window.history.replaceState({}, '', url.toString());
        }
    } catch {
    // no-op
    }
}
