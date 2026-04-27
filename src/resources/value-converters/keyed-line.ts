// Aurelia value converters that bridge `IKeyedLine` rows from the keyed bundle
// (data/keyed/*.json) into rendered text using the active-language string map.
//
// Usage:
//   <li repeat.for="line of unique.lines | keyedLines">${line}</li>
//   <span>${{ key: 'strDefense', args: [240] } | keyedLine}</span>

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
        return lines.map((l: IKeyedLine) => format(l));
    }
}
