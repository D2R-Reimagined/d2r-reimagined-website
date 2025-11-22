import { bindable, watch } from 'aurelia';
import { debounce, DebouncedFunction } from '../../utilities/debounce';
import prefixes from '../item-jsons/magicprefix.json';
import suffixes from '../item-jsons/magicsuffix.json';
import propertyGroups from '../item-jsons/PropertyGroups.json';

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

    // Group dropdown (built from PropertyGroups.json by description)
    groupOptions: { value: string | undefined; label: string }[] = [
        { value: undefined, label: '-' }
    ];
    @bindable selectedGroupDescription: string | undefined;
    private descToGroups: Map<string, Set<number>> = new Map();

    // Required Level filters
    // Note: bound via <moo-text-field>, which provides string values. Accept string as well.
    @bindable minRequiredLevel: number | string | undefined;
    @bindable maxRequiredLevel: number | string | undefined;

    attached() {
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

        // Build group description → group IDs mapping and options
        this.buildGroupOptions(propertyGroups as unknown as PropertyGroupEntry[]);

        // Set up debounced filter
        this._debouncedFilter = debounce(this.applyFilters.bind(this), 350);

        // Initial filter
        this.applyFilters();
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
    }

    @watch('selectedPType')
    handlePTypeChanged() {
        this.applyFilters();
    }

    @watch('selectedGroupDescription')
    handleGroupChanged() {
        this.applyFilters();
    }

    @watch('minRequiredLevel')
    handleMinReqChanged() {
        if (this._debouncedFilter) this._debouncedFilter();
    }

    @watch('maxRequiredLevel')
    handleMaxReqChanged() {
        if (this._debouncedFilter) this._debouncedFilter();
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
