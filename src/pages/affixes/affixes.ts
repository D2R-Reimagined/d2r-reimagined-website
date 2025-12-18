import { bindable, watch } from 'aurelia';

import {
    buildOptionsForPresentTypes,
    getChainForTypeName,
    IFilterOption,
    resolveBaseTypeName,
    type_filtering_options,
} from '../../resources/constants';
import { debounce, IDebouncedFunction } from '../../utilities/debounce';
import {
    prependTypeResetOption,
    swapMinMax,
    toOptionalNumber,
} from '../../utilities/filter-helpers';
import { isBlankOrInvalid } from '../../utilities/url-sanitize';
import prefixes from '../item-jsons/magicprefix.json';
import suffixes from '../item-jsons/magicsuffix.json';
import propertyGroups from '../item-jsons/property_groups.json';

type PType = 'Prefix' | 'Suffix';

interface IPropertyGroupEntry {
    group: number;
    items: { description: string }[];
}

// Minimal shape for affix JSON items used by this page.
// We only type the fields we read to avoid over-constraining the data.
interface IAffixItem {
    Name?: string;
    PType: PType;
    Group?: number;
    Types?: Array<string | number>;
    ETypes?: Array<string | number>;
    RequiredLevel?: number | string;
    Properties?: Array<{ PropertyString?: string }>;
}

export class Affixes {
    // Data
    allAffixes: IAffixItem[] = [];
    filteredAffixes: IAffixItem[] = [];

    // Search text
    @bindable search: string;
    private _debouncedFilter!: IDebouncedFunction;

    // Prefix/Suffix dropdown
    pTypeOptions = [
        { value: '', label: '-' },
        { value: 'Prefix', label: 'Prefix' },
        { value: 'Suffix', label: 'Suffix' },
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
    @bindable selectedType: string | undefined;

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

    binding() {
        // Read search query parameters from URL before the first render
        const urlParams = new URLSearchParams(window.location.search);

        const searchParam = urlParams.get('search');
        if (searchParam && !isBlankOrInvalid(searchParam))
            this.search = searchParam;

        const ptypeParam = urlParams.get('ptype');
        if (ptypeParam === 'Prefix' || ptypeParam === 'Suffix') {
            this.selectedPType = ptypeParam as PType;
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

        // Normalize prefix/suffix arrays, ensure PType set explicitly (source JSON already has it, but keep consistent)
        const normalized = (arr: ReadonlyArray<IAffixItem>, pType: PType) =>
            arr.map((a) => ({
                ...a,
                PType: pType,
            }));

        const prefixList = (prefixes as unknown as IAffixItem[]) || [];
        const suffixList = (suffixes as unknown as IAffixItem[]) || [];
        this.allAffixes = [
            ...normalized(prefixList, 'Prefix'),
            ...normalized(suffixList, 'Suffix'),
        ];

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
        // Enable base deduplication so identical-base entries like 'Helm' and 'Any Helm'
        // collapse to a single visible option (prefer labels starting with 'Any ').
        this.types = buildOptionsForPresentTypes(type_filtering_options, present, {
            dedupeByBase: true,
            preferLabelStartsWith: 'Any ',
        });

        // Prepend a uniform reset option to types
        this.types = prependTypeResetOption(this.types);

        // Map URL 'type' (serialized as base) to a scalar base token
        if (typeBaseFromUrl) {
            const opt = this.types.find(
                (o) => o.value && o.value[0] === typeBaseFromUrl,
            );
            this.selectedType = opt ? typeBaseFromUrl : undefined;
        }

        // Build group description → group IDs mapping and options
        this.buildGroupOptions(propertyGroups as unknown as IPropertyGroupEntry[]);

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
        const url = new URL(window.location.href);

        // search
        if (this.search && this.search.trim() !== '')
            url.searchParams.set('search', this.search);
        else url.searchParams.delete('search');

        // ptype
        if (this.selectedPType) url.searchParams.set('ptype', this.selectedPType);
        else url.searchParams.delete('ptype');

        // group (by description)
        if (
            this.selectedGroupDescription &&
            this.selectedGroupDescription.trim() !== ''
        ) {
            url.searchParams.set('group', this.selectedGroupDescription);
        } else url.searchParams.delete('group');

        // type (serialize as base token only)
        if (this.selectedType && this.selectedType !== '') {
            url.searchParams.set('type', this.selectedType);
        } else url.searchParams.delete('type');

        // min/max required level
        const minStr = this.minRequiredLevel;
        if (
            minStr !== undefined &&
            minStr !== null &&
            String(minStr).trim() !== ''
        ) {
            url.searchParams.set('minrl', String(minStr).trim());
        } else url.searchParams.delete('minrl');

        const maxStr = this.maxRequiredLevel;
        if (
            maxStr !== undefined &&
            maxStr !== null &&
            String(maxStr).trim() !== ''
        ) {
            url.searchParams.set('maxrl', String(maxStr).trim());
        } else url.searchParams.delete('maxrl');

        // exact
        if (this.exclusiveType) url.searchParams.set('exact', 'true');
        else url.searchParams.delete('exact');

        // push state without a reload
        window.history.pushState({}, '', url.toString());
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
        // If min exceeds max, coerce max to min so the UI stays consistent
        const minNum = toOptionalNumber(this.minRequiredLevel);
        const maxNum = toOptionalNumber(this.maxRequiredLevel);
        if (
            typeof minNum === 'number' &&
            typeof maxNum === 'number' &&
            minNum > maxNum
        ) {
            // Preserve the original bound type (string/number) for consistency with select binding
            this.maxRequiredLevel = this.minRequiredLevel;
        }

        if (this._debouncedFilter) this._debouncedFilter();
        this.updateUrl();
    }

    @watch('maxRequiredLevel')
    handleMaxReqChanged() {
        // If max is below min, coerce min to max so the UI stays consistent
        const minNum = toOptionalNumber(this.minRequiredLevel);
        const maxNum = toOptionalNumber(this.maxRequiredLevel);
        if (
            typeof minNum === 'number' &&
            typeof maxNum === 'number' &&
            maxNum < minNum
        ) {
            // Preserve the original bound type (string/number) for consistency with select binding
            this.minRequiredLevel = this.maxRequiredLevel;
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
        const q = (this.search || '').trim().toLowerCase();
        const tokens = q.length ? q.split(/\s+/) : [];
        const hasQuery = tokens.length > 0;

        const selectedGroups: Set<number> | undefined = this
            .selectedGroupDescription
            ? this.descToGroups.get(this.selectedGroupDescription)
            : undefined;

        // Optional bounds: '-' (empty) means no lower/upper bound
        let minOpt = toOptionalNumber(this.minRequiredLevel);
        let maxOpt = toOptionalNumber(this.maxRequiredLevel);
        [minOpt, maxOpt] = swapMinMax(minOpt, maxOpt);

        this.filteredAffixes = this.allAffixes.filter((a) => {
            // PType filter
            if (this.selectedPType && a.PType !== this.selectedPType) return false;

            // Group filter via description mapping (must match one of the groups when selected)
            if (selectedGroups) {
                const grp = a?.Group;
                if (grp == null || !selectedGroups.has(grp)) return false;
            }

            // Item Type filter (mirror Runewords behavior: parent vs. leaf semantics + Exact toggle)
            if (this.selectedType) {
                const selectedBase = resolveBaseTypeName(this.selectedType ?? '');
                if (selectedBase) {
                    const selectedChain = getChainForTypeName(selectedBase);
                    const selectedChainSet = new Set<string>(selectedChain);

                    /** Determine if the selected type has descendants present in data. If so and Exact is OFF,
                     *  selecting it should include descendants (affix type chain contains selectedBase). If not,
                     *  treat selection as a leaf and include only the ancestor line (affix base is in selectedChainSet).
                     **/
                    let hasDescendantInData = false;
                    if (!this.exclusiveType) {
                        try {
                            outer: for (const aff of this.allAffixes) {
                                const types = Array.isArray(aff?.Types) ? aff.Types : [];
                                for (let i = 0; i < types.length; i++) {
                                    const raw = types[i] != null ? String(types[i]) : '';
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
                            hasDescendantInData = false;
                        }
                    }

                    // Allowed by Types (if Types present). If absent, treat as any (allowed).
                    const types = Array.isArray(a.Types) ? a.Types : [];
                    if (types.length > 0) {
                        const allowed = types.some((t) => {
                            const chain = getChainForTypeName(t != null ? String(t) : '');
                            if (!chain || chain.length === 0) return false;
                            const itemBase = chain[0];
                            if (this.exclusiveType) {
                                // Exact: only match the exact base
                                return itemBase === selectedBase;
                            } else if (hasDescendantInData) {
                                // Parent selected: include descendants (the type chain contains selectedBase)
                                return chain.indexOf(selectedBase) !== -1;
                            } else {
                                // Leaf selected: include only ancestor line (no sibling leakage)
                                return selectedChainSet.has(itemBase);
                            }
                        });
                        if (!allowed) return false;
                    }

                    // Excluded by ETypes: if any excluded type matches selection per the same rules, reject.
                    const e = Array.isArray(a.ETypes) ? a.ETypes : [];
                    if (e.length > 0) {
                        const excluded = e.some((t) => {
                            const chain = getChainForTypeName(t != null ? String(t) : '');
                            if (!chain || chain.length === 0) return false;
                            const itemBase = chain[0];
                            if (this.exclusiveType) {
                                return itemBase === selectedBase;
                            } else if (hasDescendantInData) {
                                return chain.indexOf(selectedBase) !== -1;
                            } else {
                                return selectedChainSet.has(itemBase);
                            }
                        });
                        if (excluded) return false;
                    }
                }
            }

            // Required Level range
            const rl = typeof a.RequiredLevel === 'number' ? a.RequiredLevel : 0;
            if (typeof minOpt === 'number' && rl < minOpt) return false;
            if (typeof maxOpt === 'number' && rl > maxOpt) return false;

            // Text search (tokenized AND; search across Name, Properties, and Types only). ETypes are excluded.
            if (hasQuery) {
                const hay = [
                    String(a?.Name || ''),
                    ...(a?.Properties || []).map((p) =>
                        p && p.PropertyString ? String(p.PropertyString) : '',
                    ),
                    ...(a?.Types || []).map((t) => (t != null ? String(t) : '')),
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                if (!tokens.every((t) => hay.includes(t))) return false;
            }

            return true;
        });
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
