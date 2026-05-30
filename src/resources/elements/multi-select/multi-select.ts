import { bindable, BindingMode, ICustomElementViewModel, INode, resolve } from 'aurelia';

export interface IMultiSelectOption {
    id?: string | number;
    value?: string | number;
    label?: string;
    name?: string;
}

export class MultiSelect implements ICustomElementViewModel {
    @bindable({ mode: BindingMode.twoWay }) values: (string | number)[] = [];
    @bindable options: IMultiSelectOption[] = [];
    @bindable label: string = '';
    @bindable id: string = '';
    @bindable disabled: boolean = false;

    searchText: string = '';
    isOpen: boolean = false;
    searchInput: HTMLInputElement | null = null;

    private element: HTMLElement = resolve(INode) as HTMLElement;
    private _boundDocClick: ((ev: MouseEvent) => void) | null = null;

    get filteredOptions() {
        if (!this.searchText) return this.options;
        const search = this.searchText.toLowerCase();
        return this.options.filter(opt => this.getOptLabel(opt).toLowerCase().includes(search));
    }

    /**
     * Reactive set of currently-selected keys (stringified).
     * Using a getter (instead of an `isSelected(opt)` method) ensures Aurelia
     * re-evaluates template bindings when `this.values` mutates — method calls
     * in template expressions are NOT observed for property accesses inside
     * their bodies, but getters ARE.
     */
    get selectedKeySet(): Set<string> {
        const arr = Array.isArray(this.values) ? this.values : [];
        return new Set(arr.map(v => String(v)));
    }

    get selectedOptions(): IMultiSelectOption[] {
        const sel = Array.isArray(this.values) ? this.values : [];
        if (sel.length === 0) return [];
        // Preserve user-selection order based on values array.
        const byKey = new Map<string, IMultiSelectOption>();
        for (const opt of this.options) {
            byKey.set(String(this.getOptValue(opt)), opt);
        }
        const result: IMultiSelectOption[] = [];
        for (const v of sel) {
            const opt = byKey.get(String(v));
            if (opt) result.push(opt);
        }
        return result;
    }

    get displayLabel() {
        const opts = this.selectedOptions;
        if (opts.length === 0) return '';
        return opts.map(o => this.getOptLabel(o)).join(', ');
    }

    get selectedCount(): number {
        return Array.isArray(this.values) ? this.values.length : 0;
    }

    attached() {
        this._boundDocClick = (ev: MouseEvent) => {
            if (this.isOpen && !this.element.contains(ev.target as Node)) {
                this.isOpen = false;
                this._syncTooltipDisabled();
            }
        };
        document.addEventListener('click', this._boundDocClick, false);
    }

    detaching() {
        if (this._boundDocClick) {
            document.removeEventListener('click', this._boundDocClick, false);
            this._boundDocClick = null;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toggle(_ev: Event) {
        if (this.disabled) return;
        this.isOpen = !this.isOpen;
        this._syncTooltipDisabled();
        if (this.isOpen) {
            this.searchText = '';
            void Promise.resolve().then(() => this.searchInput?.focus());
        }
    }

    isSelected(opt: IMultiSelectOption): boolean {
        const v = this.getOptValue(opt);
        const arr = Array.isArray(this.values) ? this.values : [];
        return arr.some(x => String(x) === String(v));
    }

    toggleOption(opt: IMultiSelectOption, ev: Event) {
        ev.stopPropagation();
        const v = this.getOptValue(opt);
        if (v === undefined) return;
        const arr = Array.isArray(this.values) ? this.values.slice() : [];
        const idx = arr.findIndex(x => String(x) === String(v));
        if (idx >= 0) {
            arr.splice(idx, 1);
        } else {
            arr.push(v);
        }
        // Reassign to trigger change notifications on consumers
        this.values = arr;
    }

    clearAll(ev: Event) {
        ev.stopPropagation();
        this.values = [];
    }

    close() {
        this.isOpen = false;
        this._syncTooltipDisabled();
    }

    panelClick(ev: Event) {
        ev.stopPropagation();
    }

    getOptValue(opt: IMultiSelectOption): string | number | undefined {
        return opt.id !== undefined ? opt.id : opt.value;
    }

    getOptLabel(opt: IMultiSelectOption): string {
        return opt.label ?? opt.name ?? '';
    }

    private _syncTooltipDisabled() {
        if (this.isOpen) {
            this.element.setAttribute('data-tooltip-disabled', '');
        } else {
            this.element.removeAttribute('data-tooltip-disabled');
        }
    }
}
