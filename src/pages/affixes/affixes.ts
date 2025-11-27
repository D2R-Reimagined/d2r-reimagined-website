import { bindable, watch } from 'aurelia';
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
        { value: undefined, label: '-' },
        { value: 'Prefix', label: 'Prefix' },
        { value: 'Suffix', label: 'Suffix' }
    ];
    @bindable selectedPType: PType | undefined;

    // Group dropdown (built from property_groups.json by description)
    groupOptions: { value: string | undefined; label: string }[] = [
        { value: undefined, label: '-' }
    ];
    @bindable selectedGroupDescription: string | undefined;
    private descToGroups: Map<string, Set<number>> = new Map();

    // Item Type dropdown (reuse centralized options, narrowed per data)
    types: ReadonlyArray<FilterOption> = type_filtering_options.slice();
    @bindable selectedType: string[] | undefined;

    // Exact type only toggle
    @bindable exclusiveType: boolean;

    // Required Level filters
    // Note: bound via <moo-text-field>, which provides string values. Accept string as well.
    @bindable minRequiredLevel: number | string | undefined;
    @bindable maxRequiredLevel: number | string | undefined;

    attached() {
        // Read search query parameters from URL when component is initialized
        const urlParams = new URLSearchParams(window.location.search);

        const searchParam = urlParams.get('search');
        if (searchParam) this.search = searchParam;

        const ptypeParam = urlParams.get('ptype');
        if (ptypeParam === 'Prefix' || ptypeParam === 'Suffix') {
            this.selectedPType = ptypeParam as PType;
        }

        const groupParam = urlParams.get('group');
        if (groupParam) this.selectedGroupDescription = groupParam;

        const typeParam = urlParams.get('type');
        if (typeParam) this.selectedType = typeParam.split(',');

        const minrl = urlParams.get('minrl');
        if (minrl !== null) this.minRequiredLevel = minrl;

        const maxrl = urlParams.get('maxrl');
        if (maxrl !== null) this.maxRequiredLevel = maxrl;

        const exactParam = urlParams.get('exact');
        if (exactParam) this.exclusiveType = exactParam === 'true';
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
        this.types = buildOptionsForPresentTypes(type_filtering_options, present);

        // Build group description → group IDs mapping and options
        this.buildGroupOptions(propertyGroups as unknown as PropertyGroupEntry[]);

        // Set up debounced filter
        this._debouncedFilter = debounce(this.applyFilters.bind(this), 350);

        // Initial filter
        this.applyFilters();
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

        // type (comma-separated)
        if (this.selectedType && this.selectedType.length > 0) {
            url.searchParams.set('type', this.selectedType.join(','));
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
        this.groupOptions = [{ value: undefined, label: '-' }, ...descriptions.map(d => ({ value: d, label: d }))];
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
        const hasQuery = q.length > 0;

        const selectedGroups: Set<number> | undefined = this.selectedGroupDescription
            ? this.descToGroups.get(this.selectedGroupDescription)
            : undefined;

        // Default min to 1 when the box is empty; max defaults to 100
        const minRL = this.normalizeLevel(this.minRequiredLevel, 1);
        const maxRL = this.normalizeLevel(this.maxRequiredLevel, 100);

        this.filteredAffixes = this.allAffixes.filter((a) => {
            // PType filter
            if (this.selectedPType && a.PType !== this.selectedPType) return false;

            // Group filter via description mapping (must match one of the groups when selected)
            if (selectedGroups) {
                if (!selectedGroups.has(a.Group)) return false;
            }

            // Item Type filter (exact-or-parent matching + respects ETypes exclusions)
            if (this.selectedType && this.selectedType.length > 0) {
                // For exact mode, only use the base entry from option value; otherwise include base + parents/descendants per option
                const selected = this.exclusiveType ? [this.selectedType[0]] : this.selectedType;
                const selectedSet = new Set<string>(selected);

                // Helper: normalize a raw type token to our known node name (case-insensitive).
                // We intentionally do NOT expand the affix's type to its parents; we only compare
                // the raw type (normalized for case) against the selected chain. This ensures:
                //  - Selecting "Hand to Hand" matches affixes tagged as [Hand to Hand], [Melee Weapon], or [Weapon]
                //  - It does NOT match sibling specifics like [Axe], [Mace], etc.
                const normalize = (t: any) => {
                    const raw = t != null ? String(t) : '';
                    const chain = getChainForTypeName(raw);
                    // First element is the node name we resolved (case-corrected); if unknown, raw
                    return chain && chain.length > 0 ? chain[0] : raw;
                };

                // Allowed by Types (if Types present). If absent, treat as general (allowed).
                let allowed = true;
                if (Array.isArray(a.Types) && a.Types.length > 0) {
                    allowed = a.Types.some((t: any) => selectedSet.has(normalize(t)));
                }
                if (!allowed) return false;

                // Excluded by ETypes: if any excluded type (or its parents) matches selection, reject.
                if (Array.isArray(a.ETypes) && a.ETypes.length > 0) {
                    const excluded = a.ETypes.some((t: any) => selectedSet.has(normalize(t)));
                    if (excluded) return false;
                }
            }

            // Required Level range
            const rl = typeof a.RequiredLevel === 'number' ? a.RequiredLevel : 0;
            if (rl < minRL || rl > maxRL) return false;

            // Text search (Name, Properties, and Types only). ETypes are display-only and excluded from search.
            if (hasQuery) {
                const name: string = (a.Name || '').toString().toLowerCase();
                const props: string = (a.Properties || [])
                    .map((p: any) => (p && p.PropertyString ? String(p.PropertyString) : ''))
                    .join('\n')
                    .toLowerCase();
                const types: string = (a.Types || [])
                    .map((t: any) => (t != null ? String(t) : ''))
                    .join('\n')
                    .toLowerCase();
                if (!(name.includes(q) || props.includes(q) || types.includes(q))) return false;
            }

            return true;
        });
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
