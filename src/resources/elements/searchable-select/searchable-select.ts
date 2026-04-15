import { bindable, BindingMode, ICustomElementViewModel, INode, resolve } from 'aurelia';

export interface ISelectOption {
    id?: string | number;
    value?: string | number;
    label?: string;
    name?: string;
}

export class SearchableSelect implements ICustomElementViewModel {
    @bindable({ mode: BindingMode.twoWay }) value: any;
    @bindable options: ISelectOption[] = [];
    @bindable label: string = '';
    @bindable id: string = '';
    @bindable disabled: boolean = false;
    @bindable exact: boolean = false;

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

    get selectedOption() {
        return this.options.find(opt => String(this.getOptValue(opt)) === String(this.value));
    }

    get displayLabel() {
        return this.selectedOption ? this.getOptLabel(this.selectedOption) : '';
    }

    attached() {
        this._boundDocClick = (ev: MouseEvent) => {
            if (this.isOpen && !this.element.contains(ev.target as Node)) {
                this.isOpen = false;
            }
        };
        // Bubble phase: internal clicks that stopPropagation won't reach here
        document.addEventListener('click', this._boundDocClick, false);
    }

    detaching() {
        if (this._boundDocClick) {
            document.removeEventListener('click', this._boundDocClick, false);
            this._boundDocClick = null;
        }
    }

    toggle(ev: Event) {
        if (this.disabled) return;
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.searchText = '';
            // Use a microtask so the DOM (if.bind) renders the input first
            Promise.resolve().then(() => this.searchInput?.focus());
        }
    }

    selectOption(opt: ISelectOption, ev: Event) {
        ev.stopPropagation();
        this.value = this.getOptValue(opt);
        this.isOpen = false;
    }

    panelClick(ev: Event) {
        ev.stopPropagation();
    }

    getOptValue(opt: ISelectOption): any {
        return opt.id !== undefined ? opt.id : opt.value;
    }

    getOptLabel(opt: ISelectOption): string {
        return opt.label ?? opt.name ?? '';
    }
}
