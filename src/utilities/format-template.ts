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

    // Sequential (non-indexed, non-color, non-literal) placeholders are filled
    // left-to-right from `args`. The exporter ships ranged item properties as a
    // `[min, max]` pair per ranged value (e.g. `strModEnhancedDamage` args
    // [150, 250] -> "+150-250% Enhanced Damage"); equal min/max collapse to a
    // single number (the exporter already drops the max in that case).
    //
    // Templates mix a single numeric token with string tokens (e.g. descfunc
    // 16/20/28: "Level %d %s ...", shipped as `[min, max, skillName]`). Here
    // `args` carries one extra value beyond the placeholder count — the
    // "surplus" — and that surplus must be absorbed by the numeric tokens, each
    // of which then consumes a `[min, max]` pair. String tokens always consume a
    // single arg. We only collapse as many leading numeric tokens as the surplus
    // allows, so a fixed `%d` followed by a `%s` skill name renders correctly
    // whether or not the numeric value is a range.
    const tokens = template.match(SEQ) ?? [];
    const sequential = tokens.filter(
        (m) => m !== '%%' && !/^%\d$/.test(m) && !/^%c\d$/.test(m),
    );
    const isNumericToken = (m: string) => m === '%+d' || /^%[dDi]$/.test(m);
    const numericCount = sequential.filter(isNumericToken).length;
    // Number of numeric tokens that should consume a [min, max] pair.
    let pairBudget = Math.max(0, Math.min(args.length - sequential.length, numericCount));

    // Indexed positional templates (e.g. `%0%% Reanimate as: %1`) address logical
    // argument slots, but the exporter still ships ranged numerics as `[min, max]`
    // pairs. When `args` carries more values than there are distinct indices, the
    // surplus comes from those pairs, so resolve each index to its logical slot
    // first (collapsing leading numeric ranges to `min-max`). Without this, an
    // index past the first range would read the wrong flat element (rendering
    // "5% Reanimate as: 10" for args `[5, 10, "Voltshade"]`).
    const indexedTokens = tokens.filter((m) => /^%\d$/.test(m));
    const indexedSlots = indexedTokens.reduce(
        (mx, m) => Math.max(mx, Number(m.charAt(1)) + 1),
        0,
    );
    const resolvedIndexed =
        indexedTokens.length > 0 && args.length > indexedSlots
            ? resolveIndexedArgs(args, indexedSlots, args.length - indexedSlots)
            : null;

    let seqIndex = 0;
    return template.replace(SEQ, (match) => {
        // Literal percent.
        if (match === '%%') return '%';
        // Indexed positional (%0..%9) — language reordering.
        if (/^%\d$/.test(match)) {
            const i = Number(match.charAt(1));
            if (resolvedIndexed) return resolvedIndexed[i] ?? '';
            return formatArg(args[i], match);
        }
        // Color codes — strip.
        if (/^%c\d$/.test(match)) return '';
        // Numeric tokens absorb a [min, max] pair while the surplus budget lasts.
        if (isNumericToken(match) && pairBudget > 0) {
            pairBudget--;
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

// Map indexed templates onto logical slots, collapsing leading numeric `[min, max]`
// pairs to `min-max` while the surplus (one extra arg per ranged value) lasts.
function resolveIndexedArgs(
    args: ReadonlyArray<TemplateArg>,
    slots: number,
    surplus: number,
): string[] {
    const resolved: string[] = [];
    let p = 0;
    let budget = surplus;
    for (let i = 0; i < slots; i++) {
        const min = args[p];
        const max = args[p + 1];
        if (
            budget > 0 &&
            typeof min === 'number' &&
            typeof max === 'number' &&
            Number.isFinite(min) &&
            Number.isFinite(max)
        ) {
            const minStr = formatArg(min, '%d');
            resolved.push(min === max ? minStr : `${minStr}-${formatArg(max, '%d')}`);
            p += 2;
            budget--;
        } else {
            resolved.push(formatArg(args[p], '%0'));
            p += 1;
        }
    }
    return resolved;
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
