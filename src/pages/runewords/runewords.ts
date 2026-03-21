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
    'group-properties'?: Record<string, IRunewordProperty[]>;
    pickmode?: number;
    Index?: number;
    Chance?: number;
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
    allRunewords: IRunewordData[] = json as unknown as IRunewordData[];
    filteredRunewords: IRunewordData[] = [];
    private _searchStrings = new Map<IRunewordData, string>();

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

        // Pre-calculate searchable strings
        this.allRunewords.forEach(rw => {
            this._searchStrings.set(rw, this.buildSearchableStringForRuneword(rw));
        });

        // Collect EXPLICIT base type names present in data (Runewords-only behavior)
        const presentExplicitBases = new Set<string>();
        try {
            for (const rw of this.allRunewords || []) {
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
                opt.id === 'thrown-weapon' ||
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

    detached() {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem.cancel();
        }
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

    formatGroupName(name: string) {
        return name.replace(/-/g, ' ').replace(/([a-z])([0-9])/g, '$1 $2');
    }

    updateList() {
        const searchTokens = tokenizeSearch(this.search);

        // Type filtering setup
        let selectedSet: Set<string> | undefined;
        let selectedBase: string | undefined;
        if (this.selectedType) {
            const opt = this.types.find((o) => o.id === this.selectedType);
            if (opt && opt.value && opt.value.length > 0) {
                selectedBase = opt.value[0];
                if (!this.exclusiveType && opt.id && ANCESTOR_ONLY_WHEN_EXACT_OFF.includes(opt.id)) {
                    selectedSet = new Set(getChainForTypeNameReadonly(selectedBase));
                } else {
                    selectedSet = new Set<string>(opt.value);
                }
            }
        }

        // Rune search filter setup
        let runeGroups: string[][] = [];
        if (this.searchRunes) {
            const normalized = (this.searchRunes || '')
                .trim()
                .toLowerCase()
                .replace(/\s*[,|]\s*/g, '|')
                .replace(/\s*\+\s*/g, ' ')
                .replace(/\s+/g, ' ');

            runeGroups = normalized
                .split(' ')
                .map((group) =>
                    group
                        .split('|')
                        .map((tok) => this.normalizeRuneName(tok))
                        .filter(Boolean),
                )
                .filter((g) => g.length > 0);
        }

        this.filteredRunewords = this.allRunewords.filter((rw) => {
            // 1. Vanilla filter
            if (this.hideVanilla && String(rw?.Vanilla || '').toUpperCase() === 'Y') {
                return false;
            }

            // 2. Socket count filter
            if (this.selectedAmount && (rw.Runes?.length ?? 0) !== this.selectedAmount) {
                return false;
            }

            // 3. Type filtering
            if (selectedBase) {
                const types = Array.isArray(rw.Types) ? rw.Types : [];
                let hasTypeMatch = false;
                for (let i = 0; i < types.length; i++) {
                    const raw = types[i]?.Name != null ? String(types[i].Name) : '';
                    const chain = getChainForTypeNameReadonly(raw);
                    if (!chain || chain.length === 0) continue;
                    const itemBase = chain[0];

                    if (this.exclusiveType) {
                        if (itemBase === selectedBase) {
                            hasTypeMatch = true;
                            break;
                        }
                    } else if (selectedSet && selectedSet.has(itemBase)) {
                        hasTypeMatch = true;
                        break;
                    }
                }
                if (!hasTypeMatch) return false;
            }

            // 4. Text search
            if (searchTokens.length > 0) {
                const hay = this._searchStrings.get(rw) || '';
                if (!searchTokens.some((group) => group.every((t) => hay.includes(t)))) {
                    return false;
                }
            }

            // 5. Rune search
            if (runeGroups.length > 0) {
                const runewordRuneNames = (rw.Runes ?? []).map((rune) =>
                    this.normalizeRuneName(String(rune.Name)),
                );
                const hasRuneMatch = runeGroups.every((orGroup) =>
                    orGroup.some((token) => runewordRuneNames.includes(token)),
                );
                if (!hasRuneMatch) return false;
            }

            return true;
        });
    }

    private buildSearchableStringForRuneword(rw: IRunewordData): string {
        const parts: string[] = [
            String(rw.Name || ''),
            ...(rw.Properties || []).flatMap((p: IRunewordProperty) => {
                const res = [p?.PropertyString || ''];
                if (p['group-properties']) {
                    Object.values(p['group-properties']).forEach(pool => {
                        pool.forEach(affix => {
                            if (affix.PropertyString) res.push(affix.PropertyString);
                        });
                    });
                }
                return res;
            }),
            ...(rw.Types || []).map((t: IRunewordType) => String(t?.Name || '')),
        ];
        return parts.filter(Boolean).join(' ').toLowerCase();
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
