// Normalizes D2R-exported localization strings by collapsing gender/number
// variants into a single rendered form.
//
// Why: Diablo II's `.tbl` files (and therefore the JSON exported by
// d2r-multi-export-tool) encode multiple grammatical forms in a single value
// using two-letter tags, e.g.:
//
//   "[ms]Le %s[fs]La %s[pl]Les %s"
//
// The website only ever displays one form, so we pick the first non-empty
// segment and discard the rest. This is a *source-data* concern, not a
// rendering one — once the bundle is normalized, downstream code (lookup,
// formatTemplate, value converters) can treat every value as a plain string.
//
// Running the pass once per language load (instead of on every `lookup` call)
// removes work from the hot path: pages like `runewords` invoke `t()` many
// thousands of times per render.

const GENDER_TAG = /\[[a-z]{2}\]/g;
const OPEN_BRACKET = 91; // '['

/**
 * Returns the first non-empty variant of a gender-tagged string, or the
 * input unchanged if it does not start with a tag.
 */
export function stripGenderTags(value: string): string {
    if (!value || value.charCodeAt(0) !== OPEN_BRACKET) return value;
    const parts = value.split(GENDER_TAG);
    for (const p of parts) {
        if (p.length > 0) return p;
    }
    return value;
}

/**
 * In-place variant: rewrites every tagged value in `map` to its first
 * non-empty variant. Untagged values are left untouched.
 */
export function stripGenderTagsInPlace(map: Record<string, string>): void {
    for (const k in map) {
        const v = map[k];
        if (v && v.charCodeAt(0) === OPEN_BRACKET) {
            map[k] = stripGenderTags(v);
        }
    }
}
