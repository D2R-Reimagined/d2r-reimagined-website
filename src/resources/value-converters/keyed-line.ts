// Aurelia value converters that bridge `IKeyedLine` rows from the keyed bundle
// (data/keyed/*.json) into rendered text using the active-language string map.
//
// Usage:
//   <li repeat.for="line of unique.lines | keyedLines">${line}</li>
//   <span>${{ key: 'strDefense', args: [240] } | keyedLine}</span>
//   <span>${child | keyedChance:siblings}%</span>
//
// Pool grouping (uniques.json) is rendered structurally by the
// `<keyed-lines>` custom element — these converters intentionally stay
// flat-string-only so that callers can keep using `| keyedLines` for
// arrays that contain no group parents.

import type { IKeyedLine } from '../../utilities/i-keyed-line';
import { format, t } from '../../utilities/translation-store';

export class TValueConverter {
    toView(key: string | null | undefined, ...args: unknown[]): string {
        return t(key ?? '', args);
    }
}

export class KeyedLineValueConverter {
    toView(line: IKeyedLine | null | undefined): string {
        return format(line);
    }
}

export class KeyedLinesValueConverter {
    toView(lines: ReadonlyArray<IKeyedLine> | null | undefined): string[] {
        if (!lines || !Array.isArray(lines)) return [];
        // Flatten any pool-parent rows so legacy callers that still pipe
        // through `| keyedLines` keep producing a printable string per
        // child (no chance prefix, no header). Structural rendering of
        // pools is the `<keyed-lines>` element's responsibility.
        const out: string[] = [];
        for (const l of lines) {
            if (!l) continue;
            if (Array.isArray(l.children) && l.children.length > 0) {
                for (const c of l.children) out.push(format(c));
            } else {
                out.push(format(l));
            }
        }
        return out;
    }
}

/**
 * Compute the per-child percentage for a pool group:
 * `child.chance / sum(siblings.chance) * 100`. Missing `chance` defaults
 * to `1`. Returns an integer when the result is whole, otherwise a
 * 1-decimal string. Used by the `<keyed-lines>` template to render the
 * `${pct}%` cell of each pooled row.
 */
export class KeyedChanceValueConverter {
    toView(
        child: IKeyedLine | null | undefined,
        siblings: ReadonlyArray<IKeyedLine> | null | undefined,
    ): number | string {
        if (!child || !siblings || siblings.length === 0) return 0;
        const total = siblings.reduce(
            (sum, s) => sum + (typeof s?.chance === 'number' ? s.chance : 1),
            0,
        );
        if (total <= 0) return 0;
        const weight = typeof child.chance === 'number' ? child.chance : 1;
        const pct = (weight / total) * 100;
        return Number.isInteger(pct) ? pct : Number(pct.toFixed(1));
    }
}
