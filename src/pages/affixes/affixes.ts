import { bindable, watch } from 'aurelia';
import { isBlankOrInvalid } from '../../utilities/url-sanitize';
import { debounce, DebouncedFunction } from '../../utilities/debounce';
import prefixes from '../item-jsons/magicprefix.json';
import suffixes from '../item-jsons/magicsuffix.json';
import propertyGroups from '../item-jsons/property_groups.json';
import {
    type_filtering_options,
    getChainForTypeName,
    buildOptionsForPresentTypes,
    resolveBaseTypeName,
    FilterOption
} from '../../resources/constants/item-type-filters';

type PType = 'Prefix' | 'Suffix';

interface PropertyGroupEntry {
    group: number;
    items: { description: string }[];
}

export class Affixes {
    // Data
    allAffixes: any[] = [];
    filteredAffixes: any[] = [];

    // Search text
    @bindable search: string;
    private _debouncedFilter!: DebouncedFunction;

    // Prefix/Suffix dropdown
    pTypeOptions = [
        { value: '', label: 'Any' },
        { value: 'Prefix', label: 'Prefix' },
        { value: 'Suffix', label: 'Suffix' }
    ];
    @bindable selectedPType: PType | undefined;

    // Group dropdown (built from property_groups.json by description)
    groupOptions: { value: string | undefined; label: string }[] = [
        { value: '', label: 'Any' }
    ];
    @bindable selectedGroupDescription: string | undefined;
    private descToGroups: Map<string, Set<number>> = new Map();

    // Item Type dropdown (reuse centralized options, narrowed per data)
    types: ReadonlyArray<FilterOption> = type_filtering_options.slice();
    // Selected type: scalar base token
    @bindable selectedType: string | undefined;

    // Exact type only toggle
    @bindable exclusiveType: boolean;

    // rLvl dropdown options (1–99). "Any" will be represented by an empty string option in the view.
    rLevelOptions: { value: string; label: string }[] = Array.from({ length: 99 }, (_, i) => {
        const v = String(i + 1);
        return { value: v, label: v };
    });

    // Required Level filters
    // Note: bound via <moo-text-field>, which provides string values. Accept string as well.
    @bindable minRequiredLevel: number | string | undefined;
    @bindable maxRequiredLevel: number | string | undefined;

    binding() {
        // Read search query parameters from URL before first render
        const urlParams = new URLSearchParams(window.location.search);

        const searchParam = urlParams.get('search');
        if (searchParam && !isBlankOrInvalid(searchParam)) this.search = searchParam;

        const ptypeParam = urlParams.get('ptype');
        if (ptypeParam === 'Prefix' || ptypeParam === 'Suffix') {
            this.selectedPType = ptypeParam as PType;
        }

        const groupParam = urlParams.get('group');
        if (groupParam && !isBlankOrInvalid(groupParam)) this.selectedGroupDescription = groupParam;

        const typeParam = urlParams.get('type');
        // Defer mapping of type until after options are built (scalar base)
        let typeBaseFromUrl: string | undefined;
        if (typeParam && !isBlankOrInvalid(typeParam)) typeBaseFromUrl = typeParam.split(',')[0];

        const minrl = urlParams.get('minrl');
        if (minrl !== null && !isBlankOrInvalid(minrl)) this.minRequiredLevel = minrl;

        const maxrl = urlParams.get('maxrl');
        if (maxrl !== null && !isBlankOrInvalid(maxrl)) this.maxRequiredLevel = maxrl;

        const exactParam = urlParams.get('exact');
        if (exactParam && !isBlankOrInvalid(exactParam)) this.exclusiveType = exactParam === 'true';

        // Default the selects to "Any" when no URL value is provided
        if (this.minRequiredLevel === undefined) this.minRequiredLevel = '';
        if (this.maxRequiredLevel === undefined) this.maxRequiredLevel = '';

        // Normalize prefix/suffix arrays, ensure PType set explicitly (source JSON already has it, but keep consistent)
        const normalized = (arr: any[], pType: PType) =>
            arr.map((a) => ({
                ...a,
                PType: pType
            }));

        this.allAffixes = [
            ...normalized(prefixes as any[], 'Prefix'),
            ...normalized(suffixes as any[], 'Suffix')
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
        // Enable base de-duplication so identical-base entries like 'Helm' and 'Any Helm'
        // collapse to a single visible option (prefer labels starting with 'Any ').
        this.types = buildOptionsForPresentTypes(
            type_filtering_options,
            present,
            { dedupeByBase: true, preferLabelStartsWith: 'Any ' }
        );

        // Map URL 'type' (serialized as base) to a scalar base token
        if (typeBaseFromUrl) {
            const opt = this.types.find(o => o.value && o.value[0] === typeBaseFromUrl);
            this.selectedType = opt ? typeBaseFromUrl : undefined;
        }

        // Build group description → group IDs mapping and options
        this.buildGroupOptions(propertyGroups as unknown as PropertyGroupEntry[]);

        // Set up debounced filter
        this._debouncedFilter = debounce(this.applyFilters.bind(this), 350);

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
        if (this.search && this.search.trim() !== '') url.searchParams.set('search', this.search);
        else url.searchParams.delete('search');

        // ptype
        if (this.selectedPType) url.searchParams.set('ptype', this.selectedPType);
        else url.searchParams.delete('ptype');

        // group (by description)
        if (this.selectedGroupDescription && this.selectedGroupDescription.trim() !== '') {
            url.searchParams.set('group', this.selectedGroupDescription);
        } else url.searchParams.delete('group');

        // type (serialize as base token only)
        if (this.selectedType && this.selectedType !== '') {
            url.searchParams.set('type', this.selectedType);
        } else url.searchParams.delete('type');

        // min/max required level
        const minStr = this.minRequiredLevel as any;
        if (minStr !== undefined && minStr !== null && String(minStr).trim() !== '') {
            url.searchParams.set('minrl', String(minStr).trim());
        } else url.searchParams.delete('minrl');

        const maxStr = this.maxRequiredLevel as any;
        if (maxStr !== undefined && maxStr !== null && String(maxStr).trim() !== '') {
            url.searchParams.set('maxrl', String(maxStr).trim());
        } else url.searchParams.delete('maxrl');

        // exact
        if (this.exclusiveType) url.searchParams.set('exact', 'true');
        else url.searchParams.delete('exact');

        // push state without reload
        window.history.pushState({}, '', url.toString());
    }

    private buildGroupOptions(groups: PropertyGroupEntry[]) {
        const descMap = new Map<string, Set<number>>();
        for (const entry of groups) {
            const g = entry.group;
            for (const item of entry.items || []) {
                const desc = item.description?.trim();
                if (!desc) continue;
                if (!descMap.has(desc)) descMap.set(desc, new Set<number>());
                descMap.get(desc)!.add(g);
            }
        }

        this.descToGroups = descMap;
        const descriptions = Array.from(descMap.keys()).sort((a, b) => a.localeCompare(b));
        this.groupOptions = [{ value: '', label: 'Any' }, ...descriptions.map(d => ({ value: d, label: d }))];
    }

    @watch('search')
    handleSearchChanged() {
        if (this._debouncedFilter) this._debouncedFilter();
        this.updateUrl();
    }

    @watch('selectedPType')
    handlePTypeChanged() {
        this.applyFilters();
        this.updateUrl();
    }

    @watch('selectedGroupDescription')
    handleGroupChanged() {
        this.applyFilters();
        this.updateUrl();
    }

    @watch('selectedType')
    handleTypeChanged() {
        this.applyFilters();
        this.updateUrl();
    }

    @watch('minRequiredLevel')
    handleMinReqChanged() {
        if (this._debouncedFilter) this._debouncedFilter();
        this.updateUrl();
    }

    @watch('maxRequiredLevel')
    handleMaxReqChanged() {
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

        const selectedGroups: Set<number> | undefined = this.selectedGroupDescription
            ? this.descToGroups.get(this.selectedGroupDescription)
            : undefined;

        // Default min to 1 when empty; max defaults to 99 to match UI range
        const minRLRaw = this.normalizeLevel(this.minRequiredLevel, 1);
        const maxRLRaw = this.normalizeLevel(this.maxRequiredLevel, 99);
        const minRL = Math.min(minRLRaw, maxRLRaw);
        const maxRL = Math.max(minRLRaw, maxRLRaw);

        this.filteredAffixes = this.allAffixes.filter((a) => {
            // PType filter
            if (this.selectedPType && a.PType !== this.selectedPType) return false;

            // Group filter via description mapping (must match one of the groups when selected)
            if (selectedGroups) {
                if (!selectedGroups.has(a.Group)) return false;
            }

            // Item Type filter (mirror Runewords behavior: parent vs. leaf semantics + Exact toggle)
            if (this.selectedType) {
                const selectedBase = resolveBaseTypeName(this.selectedType ?? '');
                if (selectedBase) {
                    const selectedChain = getChainForTypeName(selectedBase);
                    const selectedChainSet = new Set<string>(selectedChain);

                    // Determine if the selected type has descendants present in data. If so and Exact is OFF,
                    // selecting it should include descendants (affix type chain contains selectedBase). If not,
                    // treat selection as a leaf and include only the ancestor line (affix base is in selectedChainSet).
                    let hasDescendantInData = false;
                    if (!this.exclusiveType) {
                        try {
                            outer: for (const aff of this.allAffixes as any[]) {
                                const types = Array.isArray(aff?.Types) ? aff.Types : [];
                                for (let i = 0; i < types.length; i++) {
                                    const raw = types[i] != null ? String(types[i]) : '';
                                    const chain = getChainForTypeName(raw);
                                    if (!chain || chain.length === 0) continue;
                                    const base = chain[0];
                                    if (base !== selectedBase && chain.indexOf(selectedBase) !== -1) {
                                        hasDescendantInData = true;
                                        break outer;
                                    }
                                }
                            }
                        } catch {
                            hasDescendantInData = false;
                        }
                    }

                    // Allowed by Types (if Types present). If absent, treat as general (allowed).
                    const types = Array.isArray(a.Types) ? a.Types : [];
                    if (types.length > 0) {
                        const allowed = types.some((t: any) => {
                            const chain = getChainForTypeName(t != null ? String(t) : '');
                            if (!chain || chain.length === 0) return false;
                            const itemBase = chain[0];
                            if (this.exclusiveType) {
                                // Exact: only match the exact base
                                return itemBase === selectedBase;
                            } else if (hasDescendantInData) {
                                // Parent selected: include descendants (type chain contains selectedBase)
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
                        const excluded = e.some((t: any) => {
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
            if (rl < minRL || rl > maxRL) return false;

            // Text search (tokenized AND; search across Name, Properties, and Types only). ETypes are excluded.
            if (hasQuery) {
                const hay = [
                    String(a?.Name || ''),
                    ...((a?.Properties || []).map((p: any) => (p && p.PropertyString ? String(p.PropertyString) : ''))),
                    ...((a?.Types || []).map((t: any) => (t != null ? String(t) : ''))),
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                if (!tokens.every(t => hay.includes(t))) return false;
            }

            return true;
        });
    }

    // Reset all filters to defaults and refresh URL/list
    resetFilters() {
        this.search = '';
        this.selectedPType = undefined;
        this.selectedGroupDescription = undefined;
        this.selectedType = undefined;
        this.exclusiveType = false;
        // Set to empty string so the dropdowns select the "Any" option explicitly
        this.minRequiredLevel = '';
        this.maxRequiredLevel = '';

        this.applyFilters();
        this.updateUrl();
    }

    private normalizeLevel(val: number | string | undefined | null, fallback: number): number {
        // Treat empty/whitespace strings as 'nothing in the box' → use fallback
        if (val === undefined || val === null) return fallback;
        if (typeof val === 'string') {
            if (val.trim() === '') return fallback;
        }

        const n = Number(val);
        if (Number.isFinite(n)) {
            // clamp between 0 and 100 per existing behavior
            return Math.max(0, Math.min(100, Math.floor(n)));
        }
        return fallback;
    }
}
