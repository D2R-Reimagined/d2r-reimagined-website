import { bindable, watch } from 'aurelia';

import {
    buildOptionsForPresentTypes,
    getChainForTypeName,
    IFilterOption,
    resolveBaseTypeName,
    type_filtering_options,
} from '../../resources/constants';
import { debounce, IDebouncedFunction } from '../../utilities/debounce';
import { prependTypeResetOption } from '../../utilities/filter-helpers';
import { isBlankOrInvalid } from '../../utilities/url-sanitize';
import json from '../item-jsons/runewords.json';

// Minimal types used by the Runewords page (only fields actually read)
interface IRunewordProperty {
    PropertyString?: string;
}

interface IRunewordType {
    Name: string;
}

interface IRunewordRune {
    Name: string;
}

interface IRunewordData {
    Name: string;
    Types?: IRunewordType[];
    Runes: IRunewordRune[];
    Properties?: IRunewordProperty[];
    Vanilla?: string | number | boolean;
}

export class Runewords {
    runewords: IRunewordData[] = json as unknown as IRunewordData[];

    @bindable search: string;
    @bindable searchRunes: string;
    @bindable exclusiveType: boolean = false;
    @bindable hideVanilla: boolean = false;

    private _debouncedSearchItem!: IDebouncedFunction;

    filteredRunewords: IRunewordData[] = [];

    // Centralized options, narrowed at runtime to types present in data
    types: ReadonlyArray<IFilterOption> = type_filtering_options.slice();

    // Selected type: base token (scalar)
    selectedType: string | undefined;

    amounts: Array<{ value: number | ''; label: string }> = [
        { value: '', label: '-' },
        { value: 2, label: '2 Runes' },
        { value: 3, label: '3 Runes' },
        { value: 4, label: '4 Runes' },
        { value: 5, label: '5 Runes' },
        { value: 6, label: '6 Runes' },
    ];

    selectedAmount: number | undefined;

    // Build options and hydrate filters from URL before controls render
    binding() {
        const urlParams = new URLSearchParams(window.location.search);

        // Collect base type names present in data
        const present = new Set<string>();
        try {
            for (const rw of this.runewords || []) {
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
        // Enable base deduplication to collapse identical-base entries like 'Helm' and 'Any Helm'.
        this.types = buildOptionsForPresentTypes(type_filtering_options, present, {
            dedupeByBase: true,
            preferLabelStartsWith: 'Any ',
        });
        // Prepend a uniform reset option so users can clear the selection with '-'
        this.types = prependTypeResetOption(this.types);

        const searchParam = urlParams.get('search');
        if (searchParam && !isBlankOrInvalid(searchParam)) {
            this.search = searchParam;
        }

        const runesParam = urlParams.get('runes');
        if (runesParam && !isBlankOrInvalid(runesParam)) {
            this.searchRunes = runesParam;
        }

        // Boolean param: hideVanilla=true
        const hv = urlParams.get('hideVanilla');
        if (hv === 'true' || hv === '1') this.hideVanilla = true;

        // Map URL 'type' (now serialized as base only) to a scalar base token
        const typeParam = urlParams.get('type');
        if (typeParam && !isBlankOrInvalid(typeParam)) {
            const base = typeParam.split(',')[0]; // support legacy comma list by taking the first token
            const opt = this.types.find((o) => o.value && o.value[0] === base);
            this.selectedType = opt ? base : undefined;
        }

        const socketsParam = urlParams.get('sockets');
        if (socketsParam && !isBlankOrInvalid(socketsParam)) {
            const n = parseInt(socketsParam, 10);
            if (Number.isFinite(n) && n >= 2 && n <= 6) this.selectedAmount = n;
        }

        const exactParam = urlParams.get('exact');
        if (exactParam && !isBlankOrInvalid(exactParam)) {
            this.exclusiveType = exactParam === 'true';
        }
    }

    attached() {
        this._debouncedSearchItem = debounce(() => this.updateList(), 350);
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

        // Update type parameter (serialize as base token only)
        if (this.selectedType && this.selectedType !== '') {
            url.searchParams.set('type', this.selectedType);
        } else {
            url.searchParams.delete('type');
        }

        // Update sockets parameter
        if (
            typeof this.selectedAmount === 'number' &&
            Number.isFinite(this.selectedAmount) &&
            this.selectedAmount >= 2 &&
            this.selectedAmount <= 6
        ) {
            url.searchParams.set('sockets', String(this.selectedAmount));
        } else {
            url.searchParams.delete('sockets');
        }

        // Update exact parameter
        if (this.exclusiveType) {
            url.searchParams.set('exact', 'true');
        } else {
            url.searchParams.delete('exact');
        }

        // Update hideVanilla parameter
        if (this.hideVanilla) {
            url.searchParams.set('hideVanilla', 'true');
        } else {
            url.searchParams.delete('hideVanilla');
        }

        // Update the URL without reloading the page
        window.history.pushState({}, '', url.toString());
    }

    @watch('searchRunes')
    handleSearchRunesChanged() {
        if (this._debouncedSearchItem) this._debouncedSearchItem();
        this.updateUrl();
    }

    @watch('search')
    handleSearchChanged() {
        if (this._debouncedSearchItem) this._debouncedSearchItem();
        this.updateUrl();
    }

    @watch('selectedType')
    selectedTypeChanged() {
        if (this._debouncedSearchItem) this._debouncedSearchItem();
        this.updateUrl();
    }

    @watch('selectedAmount')
    selectedAmountChanged() {
        // Coerce from string to number when coming from <select>
        if (typeof this.selectedAmount !== 'number') {
            const v = Number(this.selectedAmount);
            if (Number.isFinite(v) && v >= 2 && v <= 6) {
                this.selectedAmount = v;
            } else {
                this.selectedAmount = undefined;
            }
        }
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        }
        this.updateUrl();
    }

    @watch('exclusiveType')
    handleExclusiveTypeChanged() {
        if (this._debouncedSearchItem) this._debouncedSearchItem();
        this.updateUrl();
    }

    @watch('hideVanilla')
    handleHideVanillaChanged() {
        if (this._debouncedSearchItem) this._debouncedSearchItem();
        this.updateUrl();
    }

    normalizeRuneName(name: string): string {
        // Remove " Rune" suffix and trim any extra spaces
        return name
            .replace(/ rune$/i, '')
            .trim()
            .toLowerCase();
    }

    updateList() {
        let filteringRunewords: IRunewordData[] = this.runewords;

        // Type filtering
        if (this.selectedType) {
            const selectedBase = resolveBaseTypeName(this.selectedType ?? '');
            if (selectedBase) {
                const selectedChain = getChainForTypeName(selectedBase);
                const selectedChainSet = new Set<string>(selectedChain);

                /** Decide the direction of inheritance when Exact is OFF:
                 *  - If the selected type has descendants present in data (e.g., Bow -> Amazon Bow),
                 *  then selecting it should include its descendants (itemChain includes selectedBase).
                 *  - If it is a leaf (e.g., Amazon Spear, Hand to Hand), selecting it should include
                 *  only its ancestor line (itemBase is in selectedChainSet) to avoid sibling leakage
                 *  via shared parents like Melee Weapon/Weapon.
                 *  */
                let hasDescendantInData = false;
                if (!this.exclusiveType) {
                    try {
                        outer: for (const rw of this.runewords) {
                            const types = Array.isArray(rw?.Types) ? rw.Types : [];
                            for (let i = 0; i < types.length; i++) {
                                const raw = types[i]?.Name != null ? String(types[i].Name) : '';
                                const chain = getChainForTypeName(raw);
                                if (!chain || chain.length === 0) continue;
                                const base = chain[0];
                                if (
                                    base !== selectedBase &&
                                    chain.indexOf(selectedBase) !== -1
                                ) {
                                    hasDescendantInData = true;
                                    break outer;
                                }
                            }
                        }
                    } catch {
                        // On error, default to conservative (ancestor-only) behavior
                        hasDescendantInData = false;
                    }
                }

                filteringRunewords = filteringRunewords.filter((rw) => {
                    const types = Array.isArray(rw.Types) ? rw.Types : [];
                    for (let i = 0; i < types.length; i++) {
                        const raw = types[i]?.Name != null ? String(types[i].Name) : '';
                        const chain = getChainForTypeName(raw);
                        if (!chain || chain.length === 0) continue;
                        const itemBase = chain[0];

                        if (this.exclusiveType) {
                            // Exact: compare only the base of the item type
                            if (itemBase === selectedBase) return true;
                        } else if (hasDescendantInData) {
                            // Parent selected: include descendants (item has selectedBase in its chain)
                            if (chain.indexOf(selectedBase) !== -1) return true;
                        } else {
                            // Leaf selected: include only the ancestor line (no sibling leakage)
                            if (selectedChainSet.has(itemBase)) return true;
                        }
                    }
                    return false;
                });
            }
        }

        // Socket count filter
        if (this.selectedAmount) {
            filteringRunewords = filteringRunewords.filter(
                (x) => (x.Runes?.length ?? 0) === this.selectedAmount,
            );
        }

        // Apply text + rune filters
        let found = filteringRunewords;

        // Text search (tokenized AND across name, properties, types)
        const searchRaw = (this.search || '').trim().toLowerCase();
        const searchTokens = searchRaw.length ? searchRaw.split(/\s+/) : [];
        if (searchTokens.length) {
            found = found.filter((runeword) => {
                const hay = [
                    String(runeword.Name || ''),
                    ...(runeword.Properties || []).map((p: IRunewordProperty) =>
                        String(p?.PropertyString || ''),
                    ),
                    ...(runeword.Types || []).map((t: IRunewordType) =>
                        String(t?.Name || ''),
                    ),
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                return searchTokens.every((t) => hay.includes(t));
            });
        }

        // Rune search filter (AND-of-OR groups)
        if (this.searchRunes) {
            // Normalize operators:
            // - Space and '+' are AND (become spaces)
            // - ',' and '|' are OR (become '|')
            // Also normalize remaining whitespace to single spaces.
            const normalized = (this.searchRunes || '')
                .trim()
                .toLowerCase()
                // Treat ',' and '|' as OR
                .replace(/\s*[,|]\s*/g, '|')
                // Treat '+' and whitespace as AND (space)
                .replace(/\s*\+\s*/g, ' ')
                .replace(/\s+/g, ' ');

            // Split into AND groups by spaces; within each group, tokens separated by '|' are OR options.
            const groups: string[][] = normalized
                .split(' ')
                .map((group) =>
                    group
                        .split('|')
                        .map((tok) => this.normalizeRuneName(tok))
                        .filter(Boolean),
                )
                .filter((g) => g.length > 0);

            if (groups.length) {
                found = found.filter((runeword) => {
                    const runewordRuneNames = (runeword.Runes ?? []).map((rune) =>
                        this.normalizeRuneName(String(rune.Name)),
                    );
                    // For each AND group, at least one OR token must be present in the runeword
                    return groups.every((orGroup) =>
                        orGroup.some((token) => runewordRuneNames.includes(token)),
                    );
                });
            }
        }

        // Hide Vanilla filter
        if (this.hideVanilla) {
            found = found.filter(
                (rw) => String(rw?.Vanilla || '').toUpperCase() !== 'Y',
            );
        }

        // Set the filtered runewords at the end
        this.filteredRunewords = found;
    }

    // Reset all filters and refresh URL/list
    resetFilters() {
        this.search = '';
        this.searchRunes = '';
        this.selectedType = undefined;
        this.selectedAmount = undefined;
        this.exclusiveType = false;
        this.hideVanilla = false;

        this.updateList();
        this.updateUrl();
    }

    // Note: no type name transformations; use the names as exported by the game data.
}
