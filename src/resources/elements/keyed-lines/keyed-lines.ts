// `<keyed-lines lines.bind="x.Lines">` — structural renderer for the
// keyed wire format, including pooled "property group" parents.
//
// Each entry in `lines` is an `IKeyedLine`:
//   - simple line  → `{ key, args, ... }`        rendered as a plain row;
//   - pool parent  → `{ key: "", pickMode, code, children: [...] }`:
//        * `pickMode === "0"`  → render every child plain (guaranteed group);
//        * `pickMode  != "0"`  → bordered box with the (translated) `code`
//          as a header and one row per child showing
//          `chance / sum(siblings.chance) * 100 %` next to the rendered text.
//
// This matches the original property-group render (commit 423905a) — only
// the wire shape differs (parent + `children` instead of legacy
// `group-properties`).

import { bindable, ICustomElementViewModel } from 'aurelia';

import type { IKeyedLine } from '../../../utilities/i-keyed-line';

export class KeyedLines implements ICustomElementViewModel {
    @bindable lines: IKeyedLine[] | null = null;

    /** True when the row is a pool-parent (has children). */
    isGroup(line: IKeyedLine | null | undefined): boolean {
        return !!line && Array.isArray(line.children) && line.children.length > 0;
    }

    /** True for pooled groups — the bordered/chance-prefixed render path. */
    isPooled(line: IKeyedLine | null | undefined): boolean {
        return this.isGroup(line) && line!.pickMode != null && line!.pickMode !== '0';
    }
}
