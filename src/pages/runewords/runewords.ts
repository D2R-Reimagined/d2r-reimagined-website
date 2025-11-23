import { bindable, watch } from 'aurelia';

import { debounce, DebouncedFunction } from '../../utilities/debounce';
import json from '../item-jsons/runewords.json';
import {
    type_filtering_options,
    getChainForTypeName,
    buildOptionsForPresentTypes,
    resolveBaseTypeName,
    FilterOption
} from '../../resources/constants/item-type-filters';

export class Runewords {
    runewords = json;

    @bindable search: string;
    @bindable searchRunes: string;
    @bindable exclusiveType: boolean;

    private _debouncedSearchItem!: DebouncedFunction;

    filteredRunewords = [];

    // Centralized options, narrowed at runtime to types present in data
    types: ReadonlyArray<FilterOption> = type_filtering_options.slice();

    selectedType: string[];

    amounts = [
        { value: undefined, label: 'Any' },
        { value: 2, label: '2 Sockets' },
        { value: 3, label: '3 Sockets' },
        { value: 4, label: '4 Sockets' },
        { value: 5, label: '5 Sockets' },
        { value: 6, label: '6 Sockets' }
    ];

    selectedAmount: number;

    attached() {
        // Read search query parameters from URL when component is initialized
        const urlParams = new URLSearchParams(window.location.search);

        // Collect base type names present in data
        const present = new Set<string>();
        try {
            for (const rw of this.runewords as any[]) {
                const types = Array.isArray(rw?.Types) ? rw.Types : [];
                for (const t of types) {
                    const base = resolveBaseTypeName(t?.Name ?? '');
                    if (base) present.add(base);
                }
            }
        } catch {
            // keep defaults on error
        }
        // Filter the shared preset to only show options relevant to this page's data
        this.types = buildOptionsForPresentTypes(type_filtering_options, present);

        const searchParam = urlParams.get('search');
        if (searchParam) {
            this.search = searchParam;
        }

        const runesParam = urlParams.get('runes');
        if (runesParam) {
            this.searchRunes = runesParam;
        }

        const typeParam = urlParams.get('type');
        if (typeParam) {
            this.selectedType = typeParam.split(',');
        }

        const socketsParam = urlParams.get('sockets');
        if (socketsParam) {
            this.selectedAmount = parseInt(socketsParam, 10);
        }

        const exactParam = urlParams.get('exact');
        if (exactParam) {
            this.exclusiveType = exactParam === 'true';
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._debouncedSearchItem = debounce(this.updateList.bind(this), 350);
        this.updateList();
    }

    // Push current filters to URL
    private updateUrl() {
        const url = new URL(window.location.href);

        // Update search parameter
        if (this.search && this.search.trim() !== '') {
            url.searchParams.set('search', this.search);
        } else {
            url.searchParams.delete('search');
        }

        // Update runes parameter
        if (this.searchRunes && this.searchRunes.trim() !== '') {
            url.searchParams.set('runes', this.searchRunes);
        } else {
            url.searchParams.delete('runes');
        }

        // Update type parameter
        if (this.selectedType && this.selectedType.length > 0) {
            url.searchParams.set('type', this.selectedType.join(','));
        } else {
            url.searchParams.delete('type');
        }

        // Update sockets parameter
        if (this.selectedAmount) {
            url.searchParams.set('sockets', this.selectedAmount.toString());
        } else {
            url.searchParams.delete('sockets');
        }

        // Update exact parameter
        if (this.exclusiveType) {
            url.searchParams.set('exact', 'true');
        } else {
            url.searchParams.delete('exact');
        }

        // Update the URL without reloading the page
        window.history.pushState({}, '', url.toString());
    }

    @watch('searchRunes')
    handleSearchRunesChanged() {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        }
        this.updateUrl();
    }

    @watch('search')
    handleSearchChanged() {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        }
        this.updateUrl();
    }

    @watch('selectedType')
    selectedTypeChanged() {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        }
        this.updateUrl();
    }

    @watch('selectedAmount')
    selectedAmountChanged() {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        }
        this.updateUrl();
    }

    @watch('exclusiveType')
    handleExclusiveTypeChanged() {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        }
        this.updateUrl();
    }

    normalizeRuneName(name: string): string {
        // Remove " Rune" suffix and trim any extra spaces
        return name.replace(/ rune$/i, '').trim().toLowerCase();
    }

    updateList() {
        let filteringRunewords = this.runewords;

        // Type filtering
        if (this.selectedType?.length > 0) {
            // For "Exact Type Only", only use the base entry of the option; otherwise include its parents.
            const selected = this.exclusiveType ? [this.selectedType[0]] : this.selectedType;
            const selectedSet = new Set<string>(selected);

            // Normalize a token to its base node (case-insensitive); no parent expansion
            const normalizeBase = (t: any) => {
                const raw = t?.Name != null ? String(t.Name) : '';
                const chain = getChainForTypeName(raw);
                return chain && chain.length > 0 ? chain[0] : raw;
            };

            filteringRunewords = filteringRunewords.filter((rw) => {
                const types = Array.isArray(rw.Types) ? rw.Types : [];
                return types.some((t) => selectedSet.has(normalizeBase(t)));
            });
        }

        // Socket count filter
        if (this.selectedAmount) {
            filteringRunewords = filteringRunewords.filter((x) => x.Runes.length === this.selectedAmount);
        }

        // Apply text + rune filters
        let found = filteringRunewords;

        // Text search (name, props, types)
        if (this.search) {
            found = found.filter((runeword) => {
                if (runeword.Name.toLowerCase().includes(this.search.toLowerCase())) {
                    return true;
                }
                for (const property of runeword.Properties) {
                    if (property.PropertyString.toLowerCase().includes(this.search.toLowerCase())) {
                        return true;
                    }
                }
                for (const type of runeword.Types) {
                    if (type.Name.toLowerCase().includes(this.search.toLowerCase())) {
                        return true;
                    }
                }
                return false;
            });
        }

        // Rune search filter
        if (this.searchRunes) {
            const inputRuneList = this.searchRunes.split(' ')
                .map((rune) => rune.trim().toLowerCase())
                .filter((rune) => rune.length > 0);

            found = found.filter((runeword) => {
                const runewordRuneNames = runeword.Runes.map((rune) => this.normalizeRuneName(rune.Name));
                return inputRuneList.every((inputRune) =>
                    runewordRuneNames.includes(inputRune)
                );
            });
        }

        // Set the filtered runewords at the end
        this.filteredRunewords = found;
    }

    // Note: no type name transformations; use the names as exported by the game data.
}
