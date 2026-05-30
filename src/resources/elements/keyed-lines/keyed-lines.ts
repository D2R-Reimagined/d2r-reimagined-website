// `<keyed-lines lines.bind="x.Lines">` — renderer for the keyed wire format.
// Entries are `IKeyedLine`s: simple rows, or pool parents whose `pickMode`
// distinguishes guaranteed groups (`"0"`) from chance-weighted pools
// (anything else, rendered as a bordered box with per-child chance %).

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
