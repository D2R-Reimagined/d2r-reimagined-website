import { bindable, watch } from 'aurelia';

import {
    ANCESTOR_ONLY_WHEN_EXACT_OFF,
    buildOptionsForPresentTypes,
    getChainForTypeNameReadonly,
    IFilterOption,
    normalizeClassItemCode,
    resolveBaseTypeName,
    type_filtering_options,
} from '../../resources/constants';
import { debounce, IDebouncedFunction } from '../../utilities/debounce';
import { matchesTokenGroups, prependTypeResetOption, tokenizeSearch } from '../../utilities/filter-helpers';
import { IKeyedLine } from '../../utilities/i-keyed-line';
import { IncrementalRenderer, tagIds } from '../../utilities/incremental-render';
import { format, t } from '../../utilities/translation-store.js';
import { isBlankOrInvalid, syncParamsToUrl } from '../../utilities/url-sanitize';

interface IRuneOption {
    id: string;
    label: string;
    n: number;
}

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
    // Incrementally-rendered slice of `filteredRunewords` bound in the template.
    visibleRunewords: IRunewordData[] = [];
    sentinelEl?: HTMLElement;
    private _inc = new IncrementalRenderer<IRunewordData>(60);
    private _searchStrings = new Map<IRunewordData, string>();

    @bindable search: string = '';
    @bindable selectedRuneKeys: string[] = [];
    @bindable exclusiveType: boolean = false;
    @bindable hideVanilla: boolean = false;
    @bindable selectedType: string = '';
    @bindable selectedAmount: number | '' = '';

    private _debouncedSearchItem!: IDebouncedFunction;
    private _debouncedUpdateUrl!: IDebouncedFunction;

    // Options for the rune-only multi-select dropdown, ordered by numeric r##.
    runeOptions: IRuneOption[] = [];

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

    // Build options and hydrate from URL BEFORE controls render
    async binding() {
        // Fetch keyed runewords data
        try {
            const resp = await fetch('/data/keyed/runewords.json');
            this.allRunewords = (await resp.json()) as IRunewordData[];
        } catch (e) {
            console.error('Failed to load runewords:', e);
            this.allRunewords = [];
        }

        // Stable ids for keyed repeat (view reuse across filter/sort/grow).
        tagIds(this.allRunewords);

        // Pre-calculate searchable strings
        this.allRunewords.forEach(rw => {
            this._searchStrings.set(rw, this.buildSearchableStringForRuneword(rw));
        });

        const urlParams = new URLSearchParams(window.location.search);

        const searchParam = urlParams.get('search');
        if (searchParam && !isBlankOrInvalid(searchParam)) {
            this.search = searchParam;
        }

        // Boolean param: hideVanilla=true
        const hv = urlParams.get('hideVanilla');
        if (hv === 'true' || hv === '1') this.hideVanilla = true;

        // Collect base type codes present in data, normalizing single-leaf class
        // items so generic and leaf spellings surface the same option.
        const present = new Set<string>();
        try {
            for (const rw of this.allRunewords || []) {
                const types = Array.isArray(rw?.Types) ? rw.Types : [];
                for (const ty of types) {
                    const base = resolveBaseTypeName(normalizeClassItemCode(ty?.Index ?? ''));
                    if (base) present.add(base);
                }
            }
        } catch {
            // keep defaults on error
        }

        // Narrow the shared preset to present types; ancestor matching off so broad
        // types (e.g. weapitype) don't surface leaves runewords can't use (javelins).
        this.types = buildOptionsForPresentTypes(type_filtering_options, present, false).map(opt => ({
            ...opt,
            label: t(opt.label),
        }));

        // Prepend a uniform reset option so users can clear the selection with '-'
        this.types = prependTypeResetOption(this.types);

        // Build the rune options list from unique NameKeys present in the data,
        // ordered by the numeric portion of `r##` (e.g. r01, r02, ..., r33).
        const runeKeys = new Set<string>();
        for (const rw of this.allRunewords || []) {
            const runes = Array.isArray(rw?.Runes) ? rw.Runes : [];
            for (const r of runes) {
                if (r?.NameKey) runeKeys.add(r.NameKey);
            }
        }
        this.runeOptions = Array.from(runeKeys)
            .map((key) => {
                const m = /^r(\d+)$/i.exec(key);
                const n = m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
                return { id: key, label: t(key), n };
            })
            .sort((a, b) => (a.n - b.n) || a.id.localeCompare(b.id));

        // Map URL 'runes' (multi)
        const runesParam = urlParams.get('runes');
        if (runesParam && !isBlankOrInvalid(runesParam)) {
            const validKeys = new Set(this.runeOptions.map((o) => o.id));
            this.selectedRuneKeys = runesParam
                .split(',')
                .map((s) => s.trim())
                .filter((s) => validKeys.has(s));
        }

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

        this._inc.attach(this.sentinelEl, () => this.loadMore());
    }

    detached() {
        this._inc.detach();
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem.cancel();
        }
        if (this._debouncedUpdateUrl) {
            this._debouncedUpdateUrl.cancel();
        }
    }

    private applyVisible() {
        this._inc.reset();
        this.visibleRunewords = this._inc.visible(this.filteredRunewords);
    }

    loadMore() {
        if (this._inc.grow(this.filteredRunewords)) {
            this.visibleRunewords = this._inc.visible(this.filteredRunewords);
        }
    }

    // Push current filters to URL
    private updateUrl() {
        const runesParam = (this.selectedRuneKeys || []).join(',');
        syncParamsToUrl({
            search: this.search,
            runes: runesParam,
            type: this.selectedType,
            sockets: this.selectedAmount,
            exact: this.exclusiveType,
            hideVanilla: this.hideVanilla,
        }, false);
    }

    @watch('selectedRuneKeys')
    handleSelectedRuneKeysChanged() {
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

        // Rune-only filter setup: list of selected NameKeys (e.g. ['r15','r28']).
        const selectedRunes: string[] = Array.isArray(this.selectedRuneKeys)
            ? this.selectedRuneKeys.filter(Boolean)
            : [];

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
                    // Filter by the itemtypes.txt Code column (Type.Index), normalized
                    // so Exact matches both class-item spellings.
                    const raw = types[i]?.Index != null ? normalizeClassItemCode(String(types[i].Index)) : '';
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

            // 5. Rune-only filter (match by NameKey; require all selected runes
            //    to appear in this runeword).
            if (selectedRunes.length > 0) {
                const runewordRuneKeys = (rw.Runes ?? []).map((rune) => rune.NameKey);
                const hasAll = selectedRunes.every((k) => runewordRuneKeys.includes(k));
                if (!hasAll) return false;
            }

            return true;
        });

        // Reset to the first page: new results always show from the top.
        this.applyVisible();
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
        this.selectedRuneKeys = [];
        this.selectedType = '';
        this.selectedAmount = '';
        this.exclusiveType = false;
        this.hideVanilla = false;

        this.updateList();
        this.updateUrl();
    }

    // Note: no type name transformations; use the names as exported by the game data.
}
