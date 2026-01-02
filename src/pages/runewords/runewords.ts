import { bindable, watch } from 'aurelia';

import {
    ANCESTOR_ONLY_WHEN_EXACT_OFF,
    getChainForTypeNameReadonly,
    IFilterOption,
    type_filtering_options,
} from '../../resources/constants';
import { debounce, IDebouncedFunction } from '../../utilities/debounce';
import { prependTypeResetOption, tokenizeSearch } from '../../utilities/filter-helpers';
import { isBlankOrInvalid, syncParamsToUrl } from '../../utilities/url-sanitize';
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
    selectedType: string = '';

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

        // Collect EXPLICIT base type names present in data (Runewords-only behavior)
        const presentExplicitBases = new Set<string>();
        try {
            for (const rw of this.runewords || []) {
                const types = Array.isArray(rw?.Types) ? rw.Types : [];
                for (const t of types) {
                    const chain = getChainForTypeNameReadonly(t?.Name ?? '');
                    const base = chain && chain.length ? chain[0] : '';
                    if (base) presentExplicitBases.add(base);
                }
            }
        } catch {
            // keep defaults on error
        }

        // Build options WITHOUT pulling in implied parents (e.g., Amazon Bow → Bow)
        this.types = type_filtering_options.filter((opt) => {
            // Always keep a placeholder
            if (!opt.value || opt.value.length === 0) return true;

            const base = opt.value[0];

            // Aggregates: include it only if they actually match something in this dataset
            if (
                opt.id === 'any-armor' ||
                opt.id === 'any-weapon' ||
                opt.id === 'melee-weapon' ||
                opt.id === 'missile-weapon' ||
                opt.id === 'any-helm' ||
                opt.id === 'any-shield'
            ) {
                return opt.value.some((v) => presentExplicitBases.has(v));
            }

            // Non-aggregates: ONLY show if the base explicitly exists
            return presentExplicitBases.has(base);
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

        // Map URL 'type' (id)
        const typeParam = urlParams.get('type');
        if (typeParam && !isBlankOrInvalid(typeParam)) {
            const opt = this.types.find((o) => o.id === typeParam);
            this.selectedType = opt ? opt.id : '';
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
        this.updateUrl();
    }

    // Push current filters to URL
    private updateUrl() {
        syncParamsToUrl({
            search: this.search,
            runes: this.searchRunes,
            type: this.selectedType,
            sockets: this.selectedAmount,
            exact: this.exclusiveType,
            hideVanilla: this.hideVanilla,
        }, false);
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
            const opt = this.types.find((o) => o.id === this.selectedType);
            if (opt && opt.value && opt.value.length > 0) {
                const selectedBase = opt.value[0];
                let selectedSet: Set<string>;

                if (!this.exclusiveType && opt.id && ANCESTOR_ONLY_WHEN_EXACT_OFF.includes(opt.id)) {
                    selectedSet = new Set(getChainForTypeNameReadonly(selectedBase));
                } else {
                    selectedSet = new Set<string>(opt.value);
                }

                filteringRunewords = filteringRunewords.filter((rw) => {
                    const types = Array.isArray(rw.Types) ? rw.Types : [];
                    for (let i = 0; i < types.length; i++) {
                        const raw = types[i]?.Name != null ? String(types[i].Name) : '';
                        const chain = getChainForTypeNameReadonly(raw);
                        if (!chain || chain.length === 0) continue;
                        const itemBase = chain[0];

                        if (this.exclusiveType) {
                            // Exact: compare only the base of the item type
                            if (itemBase === selectedBase) return true;
                        } else {
                            // Full semantics: match if the item base is in the selected option's value set
                            // (which includes ancestors and descendants for non-exact options)
                            if (selectedSet.has(itemBase)) return true;
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
        const searchTokens = tokenizeSearch(this.search);
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
                return searchTokens.some((group) =>
                    group.every((t) => hay.includes(t)),
                );
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
        this.selectedType = '';
        this.selectedAmount = undefined;
        this.exclusiveType = false;
        this.hideVanilla = false;

        this.updateList();
        this.updateUrl();
    }

    // Note: no type name transformations; use the names as exported by the game data.
}
