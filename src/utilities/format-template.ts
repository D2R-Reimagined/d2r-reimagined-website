// Renderer for D2R-style positional templates.
//
// The exporter (d2r-multi-export-tool) ships every property line as
// `{ key, args[] }` after all numerics are finalized. The active-language
// strings file maps `key -> template`. This function splats `args` into the
// template at render time. No descfunc math, no language-specific logic.
//
// Supported tokens (subset that occurs in D2R itemstatcost / synthetic strings):
//   %%               literal '%'
//   %d %D            decimal int from next positional arg
//   %s %S            string from next positional arg
//   %+d              decimal int with explicit sign
//   %i               integer (treated same as %d)
//   %0 .. %9         indexed positional arg (allows reordering across languages,
//                    e.g. ruRU's «%1» %0-го уровня (%2/%3 зарядов))
//   %c1 .. %c9       D2R color codes -> stripped (the export pipeline already
//                    stripped these but tolerate stragglers)
//
// If the template references an arg index/position that is missing, the token
// is left in place so missing data is visible during development.

export type TemplateArg = string | number | boolean | null | undefined;

const SEQ = /%(?:\+d|d|D|s|S|i|c\d|\d|%)/g;

export function formatTemplate(template: string, args: ReadonlyArray<TemplateArg> = []): string {
    if (!template) return '';

    // Count sequential (non-indexed, non-color, non-literal) placeholders.
    // When args carries exactly twice as many values as sequential placeholders,
    // each consumed token represents a [min, max] pair and should render as a
    // "min-max" range. This is how the exporter ships ranged item properties
    // (e.g. `strModEnhancedDamage` with args [150, 250] for "+150-250%
    // Enhanced Weapon Damage").
    const tokens = template.match(SEQ) ?? [];
    const sequentialCount = tokens.filter(
        (m) => m !== '%%' && !/^%\d$/.test(m) && !/^%c\d$/.test(m),
    ).length;
    const rangeMode = sequentialCount > 0 && args.length === sequentialCount * 2;

    let seqIndex = 0;
    return template.replace(SEQ, (match) => {
        // Literal percent.
        if (match === '%%') return '%';
        // Indexed positional (%0..%9) — language reordering.
        if (/^%\d$/.test(match)) {
            const i = Number(match.charAt(1));
            return formatArg(args[i], match);
        }
        // Color codes — strip.
        if (/^%c\d$/.test(match)) return '';
        // Sequential tokens consume from a running cursor.
        if (rangeMode) {
            const min = args[seqIndex++];
            const max = args[seqIndex++];
            const minStr = formatArg(min, match);
            if (
                typeof min === 'number' &&
                typeof max === 'number' &&
                Number.isFinite(min) &&
                Number.isFinite(max) &&
                min !== max
            ) {
                // Max half of the range never carries an explicit sign; emit
                // it with the same numeric formatting as the min half.
                const maxToken = match === '%+d' ? '%d' : match;
                return `${minStr}-${formatArg(max, maxToken)}`;
            }
            return minStr;
        }
        const value = args[seqIndex++];
        return formatArg(value, match);
    });
}

function formatArg(value: TemplateArg, token: string): string {
    if (value === null || value === undefined) return '';
    switch (token) {
        case '%+d': {
            const n = Number(value);
            if (!Number.isFinite(n)) return String(value);
            return (n >= 0 ? '+' : '') + n.toString();
        }
        case '%d':
        case '%D':
        case '%i': {
            const n = Number(value);
            return Number.isFinite(n) ? Math.trunc(n).toString() : String(value);
        }
        case '%s':
        case '%S':
            return String(value);
        default:
            // Indexed %0..%9: stringify directly; numbers print their natural form.
            return String(value);
    }
}
