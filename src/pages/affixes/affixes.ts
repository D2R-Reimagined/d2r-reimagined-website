import { bindable, watch } from 'aurelia';

import {
    ANCESTOR_ONLY_WHEN_EXACT_OFF,
    buildOptionsForPresentTypes,
    getChainForTypeNameReadonly,
    IFilterOption,
    resolveBaseTypeName,
    type_filtering_options,
} from '../../resources/constants';
import propertyGroups from '../../resources/property_groups.json';
import { debounce, IDebouncedFunction } from '../../utilities/debounce';
import {
    matchesTokenGroups,
    prependTypeResetOption,
    swapMinMax,
    tokenizeSearch,
    toOptionalNumber,
} from '../../utilities/filter-helpers';
import { IKeyedLine } from '../../utilities/i-keyed-line';
import { format, t } from '../../utilities/translation-store.js';
import { isBlankOrInvalid, syncParamsToUrl } from '../../utilities/url-sanitize';

type PType = 'Prefix' | 'Suffix';

interface IPropertyGroupEntry {
    group: number;
    items: { description: string }[];
}

// Shapes for the new keyed affix JSON files
interface IAffixItem {
    NameKey: string;
    PType: PType;
    Group: number;
    Types: string[];
    ETypes: string[];
    RequiredLevel: number;
    Lines: IKeyedLine[];
}

export class Affixes {
    // Data
    allAffixes: IAffixItem[] = [];
    filteredAffixes: IAffixItem[] = [];

    // Search text
    @bindable search: string;
    private _debouncedFilter!: IDebouncedFunction;
    private _isCoercing = false;

    // Prefix/Suffix dropdown
    pTypeOptions = [
        { value: '', label: '-' },
        { value: 'Prefix', label: 'label_prefix' },
        { value: 'Suffix', label: 'label_suffix' },
    ];
    @bindable selectedPType: PType | undefined;

    // Group dropdown (built from property_groups.json by description)
    groupOptions: { value: string | undefined; label: string }[] = [
        { value: '', label: '-' },
    ];
    @bindable selectedGroupDescription: string | undefined;
    private descToGroups: Map<string, Set<number>> = new Map();

    // Item Type dropdown (reuse centralized options, narrowed per data)
    types: ReadonlyArray<IFilterOption> = type_filtering_options.slice();
    // Selected type: scalar base token
    @bindable selectedType: string = '';

    // Exact type-only toggle
    @bindable exclusiveType: boolean;

    // rLvl dropdown options ("-" empty first option; then 1–99)
    rLevelOptions: { value: string; label: string }[] = [
        { value: '', label: '-' },
        ...Array.from({ length: 99 }, (_, i) => {
            const v = String(i + 1);
            return { value: v, label: v };
        }),
    ];

    // Required Level filters
    // Note: bound via <moo-text-field>, which provides string values. Accept string as well.
    @bindable minRequiredLevel: number | string | undefined;
    @bindable maxRequiredLevel: number | string | undefined;

    // Read search query parameters from URL before the first render
    async binding() {
        // Fetch keyed affix data
        try {
            const [pResp, sResp] = await Promise.all([
                fetch('/data/keyed/magicprefix.json'),
                fetch('/data/keyed/magicsuffix.json'),
            ]);
            const p = (await pResp.json()) as IAffixItem[];
            const s = (await sResp.json()) as IAffixItem[];
            this.allAffixes = [...p, ...s];
        } catch (e) {
            console.error('Failed to load affixes:', e);
            this.allAffixes = [];
        }

        const urlParams = new URLSearchParams(window.location.search);

        const searchParam = urlParams.get('search');
        if (searchParam && !isBlankOrInvalid(searchParam))
            this.search = searchParam;

        const ptypeParam = urlParams.get('ptype');
        if (ptypeParam === 'Prefix' || ptypeParam === 'Suffix') {
            this.selectedPType = ptypeParam;
        }

        const groupParam = urlParams.get('group');
        if (groupParam && !isBlankOrInvalid(groupParam))
            this.selectedGroupDescription = groupParam;

        const typeParam = urlParams.get('type');
        // Defer mapping of a type until after options are built (scalar base)
        let typeBaseFromUrl: string | undefined;
        if (typeParam && !isBlankOrInvalid(typeParam))
            typeBaseFromUrl = typeParam.split(',')[0];

        const minrl = urlParams.get('minrl');
        if (minrl !== null && !isBlankOrInvalid(minrl))
            this.minRequiredLevel = minrl;

        const maxrl = urlParams.get('maxrl');
        if (maxrl !== null && !isBlankOrInvalid(maxrl))
            this.maxRequiredLevel = maxrl;

        const exactParam = urlParams.get('exact');
        if (exactParam && !isBlankOrInvalid(exactParam))
            this.exclusiveType = exactParam === 'true';

        // Default the selection to '-' (empty) when no URL value is provided, so labels rest centered
        // For PType, keep undefined to select the "-" option without introducing unsafe casts
        if (this.selectedPType === undefined) this.selectedPType = undefined;
        if (this.selectedGroupDescription === undefined)
            this.selectedGroupDescription = '';
        if (this.selectedType === undefined) this.selectedType = '';
        if (this.minRequiredLevel === undefined) this.minRequiredLevel = '';
        if (this.maxRequiredLevel === undefined) this.maxRequiredLevel = '';

        // Build the set of base type names present across all affixes (Types only)
        const present = new Set<string>();
        try {
            for (const a of this.allAffixes) {
                const types = Array.isArray(a?.Types) ? a.Types : [];
                for (const t of types) {
                    const base = resolveBaseTypeName(t != null ? String(t) : '');
                    if (base) present.add(base);
                }
            }
        } catch {
            // keep default options if something unexpected occurs
        }
        // Filter the shared preset to only show options relevant to affix data
        this.types = buildOptionsForPresentTypes(type_filtering_options, present).map(opt => ({
            ...opt,
            label: t(opt.label),
        }));

        // Prepend a uniform reset option to types
        this.types = prependTypeResetOption(this.types);

        // Map URL 'type' (id)
        if (typeBaseFromUrl) {
            const opt = this.types.find((o) => o.id === typeBaseFromUrl);
            this.selectedType = opt ? opt.id : '';
        }

        // Build group description → group IDs mapping and options
        this.buildGroupOptions(propertyGroups);

        // Set up a debounced filter (arrow wrapper avoids unsafe bind typing)
        this._debouncedFilter = debounce(() => this.applyFilters(), 350);

        // Initial filter
        this.applyFilters();
    }

    attached() {
        // Push initial state into URL (removes stale params when empty)
        this.updateUrl();
    }

    // Helper method to update URL with current search parameters
    private updateUrl() {
        syncParamsToUrl({
            search: this.search,
            ptype: this.selectedPType,
            group: this.selectedGroupDescription,
            type: this.selectedType,
            minrl: this.minRequiredLevel,
            maxrl: this.maxRequiredLevel,
            exact: this.exclusiveType,
        }, false);
    }

    private buildGroupOptions(groups: IPropertyGroupEntry[]) {
        const descMap = new Map<string, Set<number>>();
        for (const entry of groups) {
            const g = entry.group;
            for (const item of entry.items || []) {
                const desc = item.description?.trim();
                if (!desc) continue;
                let set = descMap.get(desc);
                if (!set) {
                    set = new Set<number>();
                    descMap.set(desc, set);
                }
                set.add(g);
            }
        }

        this.descToGroups = descMap;
        const descriptions = Array.from(descMap.keys()).sort((a, b) =>
            a.localeCompare(b),
        );
        this.groupOptions = [
            { value: '', label: '-' },
            ...descriptions.map((d) => ({ value: d, label: d })),
        ];
    }

    @watch('search')
    handleSearchChanged() {
        if (this._debouncedFilter) this._debouncedFilter();
        this.updateUrl();
    }

    @watch('selectedPType')
    handlePTypeChanged() {
        if (this._debouncedFilter) this._debouncedFilter();
        this.updateUrl();
    }

    @watch('selectedGroupDescription')
    handleGroupChanged() {
        if (this._debouncedFilter) this._debouncedFilter();
        this.updateUrl();
    }

    @watch('selectedType')
    handleTypeChanged() {
        if (this._debouncedFilter) this._debouncedFilter();
        this.updateUrl();
    }

    @watch('minRequiredLevel')
    handleMinReqChanged() {
        if (this._isCoercing) return;
        // If min exceeds max, coerce max to min so the UI stays consistent
        const minNum = toOptionalNumber(this.minRequiredLevel);
        const maxNum = toOptionalNumber(this.maxRequiredLevel);
        if (
            typeof minNum === 'number' &&
            typeof maxNum === 'number' &&
            minNum > maxNum
        ) {
            this._isCoercing = true;
            // Preserve the original bound type (string/number) for consistency with select binding
            this.maxRequiredLevel = this.minRequiredLevel;
            this._isCoercing = false;
        }

        if (this._debouncedFilter) this._debouncedFilter();
        this.updateUrl();
    }

    @watch('maxRequiredLevel')
    handleMaxReqChanged() {
        if (this._isCoercing) return;
        // If max is below min, coerce min to max so the UI stays consistent
        const minNum = toOptionalNumber(this.minRequiredLevel);
        const maxNum = toOptionalNumber(this.maxRequiredLevel);
        if (
            typeof minNum === 'number' &&
            typeof maxNum === 'number' &&
            maxNum < minNum
        ) {
            this._isCoercing = true;
            // Preserve the original bound type (string/number) for consistency with select binding
            this.minRequiredLevel = this.maxRequiredLevel;
            this._isCoercing = false;
        }

        if (this._debouncedFilter) this._debouncedFilter();
        this.updateUrl();
    }

    @watch('exclusiveType')
    handleExclusiveTypeChanged() {
        if (this._debouncedFilter) this._debouncedFilter();
        this.updateUrl();
    }

    applyFilters() {
        const tokens = tokenizeSearch(this.search);
        const hasQuery = tokens.length > 0;

        const selectedGroups: Set<number> | undefined = this
            .selectedGroupDescription
            ? this.descToGroups.get(this.selectedGroupDescription)
            : undefined;

        // Optional bounds: '-' (empty) means no lower/upper bound
        let minOpt = toOptionalNumber(this.minRequiredLevel);
        let maxOpt = toOptionalNumber(this.maxRequiredLevel);
        [minOpt, maxOpt] = swapMinMax(minOpt, maxOpt);

        // Precompute the allowed type set (base + descendants + ancestors)
        let selectedBase: string | undefined;
        let selectedSet: Set<string> | undefined;
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

        this.filteredAffixes = this.allAffixes.filter((a) => {
            // PType filter
            if (this.selectedPType && a.PType !== this.selectedPType) return false;

            // Group filter via description mapping (must match one of the groups when selected)
            if (selectedGroups) {
                const grp = a?.Group;
                if (grp == null || !selectedGroups.has(grp)) return false;
            }

            // Item Type filter (parent vs. leaf semantics + Exact toggle)
            if (this.selectedType && selectedBase && selectedSet) {
                // Allowed by Types (if Types present). If absent, treat as any (allowed).
                const types = Array.isArray(a.Types) ? a.Types : [];
                if (types.length > 0) {
                    const allowed = types.some((t) => {
                        const chain = getChainForTypeNameReadonly(
                            t != null ? String(t) : '',
                        );
                        if (!chain || chain.length === 0) return false;
                        const itemBase = chain[0];
                        if (this.exclusiveType) {
                            // Exact: only match the exact base
                            return itemBase === selectedBase;
                        } else {
                            return selectedSet.has(itemBase);
                        }
                    });
                    if (!allowed) return false;
                }

                // Excluded by ETypes: if any excluded type matches selection per the same rules, reject.
                const e = Array.isArray(a.ETypes) ? a.ETypes : [];
                if (e.length > 0) {
                    const excluded = e.some((t) => {
                        const chain = getChainForTypeNameReadonly(
                            t != null ? String(t) : '',
                        );
                        if (!chain || chain.length === 0) return false;
                        const itemBase = chain[0];
                        if (this.exclusiveType) {
                            return itemBase === selectedBase;
                        } else {
                            return selectedSet.has(itemBase);
                        }
                    });
                    if (excluded) return false;
                }
            }

            // Required Level range
            const rl = typeof a.RequiredLevel === 'number' ? a.RequiredLevel : 0;
            if (typeof minOpt === 'number' && rl < minOpt) return false;
            if (typeof maxOpt === 'number' && rl > maxOpt) return false;

            // Text search (tokenized AND; search across Name, Properties, and Types only). ETypes are excluded.
            if (hasQuery) {
                const hayParts = [
                    t(a.NameKey),
                    ...(a?.Lines || []).map(l => format(l)),
                    ...(a?.Types || []).flatMap(ty => {
                        const index = String(ty);
                        const chain = getChainForTypeNameReadonly(index);
                        return [index, ...(chain || []), ...(chain || []).map(c => t(c))];
                    }),
                ];
                const hay = hayParts.filter(Boolean).join(' ').toLowerCase();
                if (!matchesTokenGroups(hay, tokens)) return false;
            }

            return true;
        });
    }

    formatGroupName(name: string) {
        return name.replace(/-/g, ' ').replace(/([a-z])([0-9])/g, '$1 $2');
    }

    // Reset all filters to defaults and refresh URL/list
    resetFilters() {
        this.search = '';
        this.selectedPType = undefined;
        this.selectedGroupDescription = '';
        this.selectedType = '';
        this.exclusiveType = false;
        this.minRequiredLevel = '';
        this.maxRequiredLevel = '';

        this.applyFilters();
        this.updateUrl();
    }
}
