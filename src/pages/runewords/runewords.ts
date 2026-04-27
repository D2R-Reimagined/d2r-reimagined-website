import { bindable, watch } from 'aurelia';

import {
    ANCESTOR_ONLY_WHEN_EXACT_OFF,
    getChainForTypeNameReadonly,
    IFilterOption,
    type_filtering_options,
} from '../../resources/constants';
import { debounce, IDebouncedFunction } from '../../utilities/debounce';
import { matchesTokenGroups, prependTypeResetOption, tokenizeSearch } from '../../utilities/filter-helpers';
import { IKeyedLine } from '../../utilities/i-keyed-line';
import { format, t } from '../../utilities/translation-store.js';
import { isBlankOrInvalid, syncParamsToUrl } from '../../utilities/url-sanitize';

// Shapes for the new keyed runewords.json
interface IRunewordData {
    Index: string;
    Vanilla: string;
    Runes: { NameKey: string }[];
    Types: { Index: string }[];
    Lines: IKeyedLine[];
    RequiredLevel: number;
}

export class Runewords {
    allRunewords: IRunewordData[] = [];
    filteredRunewords: IRunewordData[] = [];
    private _searchStrings = new Map<IRunewordData, string>();

    @bindable search: string = '';
    @bindable searchRunes: string = '';
    @bindable exclusiveType: boolean = false;
    @bindable hideVanilla: boolean = false;
    @bindable selectedType: string = '';
    @bindable selectedAmount: number | '' = '';

    private _debouncedSearchItem!: IDebouncedFunction;
    private _debouncedUpdateUrl!: IDebouncedFunction;

    // Centralized options, narrowed at runtime to types present in data
    types: ReadonlyArray<IFilterOption> = type_filtering_options.slice();

    amounts: Array<{ value: number | ''; label: string }> = [
        { value: '', label: '-' },
        { value: 2, label: 'label_runes_count' },
        { value: 3, label: 'label_runes_count' },
        { value: 4, label: 'label_runes_count' },
        { value: 5, label: 'label_runes_count' },
        { value: 6, label: 'label_runes_count' },
    ];

    // Build options and hydrate filters from URL before controls render
    async binding() {
        // Fetch keyed runewords data
        try {
            const resp = await fetch('/data/keyed/runewords.json');
            this.allRunewords = (await resp.json()) as IRunewordData[];
        } catch (e) {
            console.error('Failed to load runewords:', e);
            this.allRunewords = [];
        }

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
                    // Use the canonical itemtypes.txt Code column (carried in
                    // Type.Index) for graph lookups; Type.Name is the English
                    // display label and is no longer used as a key.
                    const chain = getChainForTypeNameReadonly(t?.Index ?? '');
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
        }).map(opt => ({
            ...opt,
            label: t(opt.label),
        }));

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
        this._debouncedUpdateUrl = debounce(() => this.updateUrl(), 150);
        this.updateList();
        this.updateUrl();
    }

    detached() {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem.cancel();
        }
        if (this._debouncedUpdateUrl) {
            this._debouncedUpdateUrl.cancel();
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
        if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
    }

    @watch('search')
    handleSearchChanged() {
        if (this._debouncedSearchItem) this._debouncedSearchItem();
        if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
    }

    @watch('selectedType')
    handleTypeChanged() {
        if (this._debouncedSearchItem) this._debouncedSearchItem();
        if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
    }

    @watch('selectedAmount')
    handleAmountChanged() {
        // Coerce from string to number when coming from <select>
        if (typeof this.selectedAmount !== 'number' && this.selectedAmount !== '') {
            const v = Number(this.selectedAmount);
            if (Number.isFinite(v) && v >= 2 && v <= 6) {
                this.selectedAmount = v;
            } else {
                this.selectedAmount = '';
            }
        }

        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        }
        if (this._debouncedUpdateUrl) {
            this._debouncedUpdateUrl();
        }
    }

    @watch('exclusiveType')
    handleExclusiveTypeChanged() {
        if (this._debouncedSearchItem) this._debouncedSearchItem();
        if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
    }

    @watch('hideVanilla')
    handleHideVanillaChanged() {
        if (this._debouncedSearchItem) this._debouncedSearchItem();
        if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
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
                    // Filter by the itemtypes.txt Code column (Type.Index).
                    const raw = types[i]?.Index != null ? String(types[i].Index) : '';
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
                if (!matchesTokenGroups(hay, searchTokens)) {
                    return false;
                }
            }

            // 5. Rune search
            if (runeGroups.length > 0) {
                const runewordRuneNames = (rw.Runes ?? []).map((rune) =>
                    this.normalizeRuneName(t(rune.NameKey)),
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
            t(rw.Index),
        ];
        if (Array.isArray(rw.Lines)) {
            for (const l of rw.Lines) {
                parts.push(format(l));
            }
        }
        if (Array.isArray(rw.Types)) {
            for (const typeInfo of rw.Types) {
                const index = typeInfo?.Index != null ? String(typeInfo.Index) : '';
                parts.push(index);
                const chain = getChainForTypeNameReadonly(index);
                if (chain) {
                    parts.push(...chain);
                    parts.push(...chain.map(c => t(c)));
                }
            }
        }
        if (Array.isArray(rw.Runes)) {
            for (const rune of rw.Runes) {
                parts.push(t(rune.NameKey));
            }
        }
        return parts.filter(Boolean).join(' ').toLowerCase();
    }

    // Reset all filters and refresh URL/list
    resetFilters() {
        this.search = '';
        this.searchRunes = '';
        this.selectedType = '';
        this.selectedAmount = '';
        this.exclusiveType = false;
        this.hideVanilla = false;

        this.updateList();
        this.updateUrl();
    }

    // Note: no type name transformations; use the names as exported by the game data.
}
