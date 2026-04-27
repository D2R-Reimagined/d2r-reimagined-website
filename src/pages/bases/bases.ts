import { bindable, watch } from 'aurelia';

import {
    buildOptionsForPresentTypes,
    getChainForTypeNameReadonly,
    IFilterOption,
    resolveBaseTypeName,
    type_filtering_options,
} from '../../resources/constants';
import {
    getDamageTypeString as getDamageTypeStringUtil,
} from '../../utilities/damage-types';
import { matchesTokenGroups, prependTypeResetOption, tokenizeSearch } from '../../utilities/filter-helpers';
import { IKeyedLine } from '../../utilities/i-keyed-line';
import { format, t } from '../../utilities/translation-store.js';
import { isBlankOrInvalid, syncParamsToUrl } from '../../utilities/url-sanitize';

// Shared shape for union; add a discriminator so the template can branch UI
interface IBaseItem {
    __index?: number;
    __kind: 'armor' | 'weapon';
    NameKey: string;
    Code: string;
    Tier?: 'Normal' | 'Exceptional' | 'Elite';
    NormCode?: string | null;
    UberCode?: string | null;
    UltraCode?: string | null;
    RequiredLevel?: number;
    GemSockets?: number | string;
    Lines: IKeyedLine[];
    Type: {
        Index: string;
        Name: string;
        Class?: string;
    };
    EquipmentType: number;
    RequiredClass: string;
    DamageTypes?: {
        Type: number;
        AverageDamage: number;
        Lines: IKeyedLine[];
    }[];
    AutoMagicGroups?: {
        NameKey: string;
        Level?: number;
        RequiredLevel?: number;
        Lines: IKeyedLine[];
    }[] | null;
}

// Shape returned by Bases.groupedProperties() — consumed by bases.html.
export interface IGroupedAutoMagic {
    nameKey: string;
    name: string;
    level: number;
    requiredLevel?: number;
    lines: IKeyedLine[];
    minIndex: number;
}

export class Bases {

    // Category: "" (both), "armors", "weapons"
    categoryOptions: Array<{ value: '' | 'armors' | 'weapons'; label: string; }> = [
        { value: '', label: '-' },
        { value: 'armors', label: 'label_armors' },
        { value: 'weapons', label: 'label_weapons' }];

    @bindable selectedCategory: '' | 'armors' | 'weapons' = '';

    @bindable search: string;
    @bindable selectedType: string = '';
    @bindable selectedTier: 'Normal' | 'Exceptional' | 'Elite' | undefined;
    @bindable selectedSockets: number | undefined;

    tierOptions: Array<{ value: '' | 'Normal' | 'Exceptional' | 'Elite' | undefined; label: string; }> = [
        { value: '', label: '-' },
        { value: 'Normal', label: 'label_normal' },
        { value: 'Exceptional', label: 'label_exceptional' },
        { value: 'Elite', label: 'label_elite' }];

    socketOptions: Array<{ value: number | ''; label: string }> = [
        { value: '', label: '-' },
        { value: 1, label: 'label_socket' },
        { value: 2, label: 'label_sockets' },
        { value: 3, label: 'label_sockets' },
        { value: 4, label: 'label_sockets' },
        { value: 5, label: 'label_sockets' },
        { value: 6, label: 'label_sockets' },
    ];

    types: ReadonlyArray<IFilterOption> = type_filtering_options.slice();

    private _tierMap = new Map<IBaseItem, 'Normal' | 'Exceptional' | 'Elite' | undefined>();
    private _searchMap = new Map<IBaseItem, string>();
    private _familyMap = new Map<string, IBaseItem[]>();
    private _allBases: IBaseItem[] = [];

    itemsArmor: IBaseItem[] = [];
    itemsWeapon: IBaseItem[] = [];

    // Build type options and hydrate from URL
    async binding() {
        // Fetch keyed bases data
        try {
            const [aResp, wResp] = await Promise.all([
                fetch('/data/keyed/armors.json'),
                fetch('/data/keyed/weapons.json'),
            ]);
            this.itemsArmor = ((await aResp.json()) as IBaseItem[]).map((it, __index) => ({
                ...it, __kind: 'armor' as const, __index,
                Code: it.Code || it.NameKey, // Fallback for missing Code
            }));
            this.itemsWeapon = ((await wResp.json()) as IBaseItem[]).map((it, __index) => ({
                ...it, __kind: 'weapon' as const, __index,
                Code: it.Code || it.NameKey, // Fallback for missing Code
            }));
        } catch (e) {
            console.error('Failed to load bases:', e);
            this.itemsArmor = [];
            this.itemsWeapon = [];
        }

        // Prepare base collections
        this._allBases = [...this.itemsArmor, ...this.itemsWeapon];

        // 1. Build family map for tier calculation
        this._familyMap.clear();
        for (const i of this._allBases) {
            const key = `${i.NormCode || ''}|${i.UberCode || ''}|${i.UltraCode || ''}`;
            if (key.replace(/\|/g, '').length > 0) {
                let list = this._familyMap.get(key);
                if (!list) {
                    list = [];
                    this._familyMap.set(key, list);
                }
                list.push(i);
            }
        }

        // 2. Pre-calculate tiers and searchable strings
        this._tierMap.clear();
        this._searchMap.clear();
        for (const i of this._allBases) {
            this._tierMap.set(i, this.calculateTier(i));
            this._searchMap.set(i, this.buildSearchString(i));
        }

        // Default category based on the path if a query is absent (supports /armors and /weapons routes)
        const path = window.location.pathname.toLowerCase();
        const urlParams = new URLSearchParams(window.location.search);
        const catParam = urlParams.get('category');
        if (catParam === 'armors' || catParam === 'weapons')
            this.selectedCategory = catParam;
        else if (path.endsWith('/armors')) this.selectedCategory = 'armors';
        else if (path.endsWith('/weapons')) this.selectedCategory = 'weapons';
        else this.selectedCategory = '';

        this.rebuildTypeOptions();

        const searchParam = urlParams.get('search');
        if (searchParam && !isBlankOrInvalid(searchParam))
            this.search = searchParam;

        const tierParam = urlParams.get('tier');
        if (tierParam === 'Normal' || tierParam === 'Exceptional' || tierParam === 'Elite') {
            this.selectedTier = tierParam;
        }

        const socketsParam = urlParams.get('sockets');
        if (socketsParam && !isBlankOrInvalid(socketsParam)) {
            const n = parseInt(socketsParam, 10);
            if (!Number.isNaN(n) && n >= 1 && n <= 6) this.selectedSockets = n;
        }

        const typeParam = urlParams.get('type');
        if (typeParam && !isBlankOrInvalid(typeParam)) {
            const opt = this.types.find((o) => o.id === typeParam);
            this.selectedType = opt ? opt.id : '';
        }
    }

    private rebuildTypeOptions() {
        // Build the present base set from the currently selected category (or both)
        const present = new Set<string>();
        const datasets = this.selectedCategory === 'armors' ? [this.itemsArmor] : this.selectedCategory === 'weapons' ? [this.itemsWeapon] : [this.itemsArmor, this.itemsWeapon];
        for (const ds of datasets) {
            for (const i of ds) {
                // Use Type.Index (itemtypes.txt Code column) — the canonical id the
                // filter graph is keyed by. Type.Name remains the English label.
                const base = resolveBaseTypeName(i?.Type?.Index ?? '');
                if (base) present.add(base);
            }
        }
        const options = buildOptionsForPresentTypes(
            type_filtering_options,
            present,
        ).map(opt => ({
            ...opt,
            label: t(opt.label),
        }));
        this.types = prependTypeResetOption(options);
    }

    attached() {
        this.updateUrl();
    }

    private updateUrl() {
        syncParamsToUrl({
            search: this.search,
            type: this.selectedType,
            tier: this.selectedTier,
            sockets: this.selectedSockets,
            category: this.selectedCategory,
        }, false);
    }

    handleCategoryChange() {
        // Rebuild types when a category changes; keep other filters, just reflect URL
        this.rebuildTypeOptions();
        // If the previously selected type is no longer present, clear it
        if (
            this.selectedType &&
            !this.types.some((o) => o.id === this.selectedType)
        ) {
            this.selectedType = '';
        }
        this.updateUrl();
    }

    @watch('search')
    onSearchChanged() {
        this.updateUrl();
    }

    @watch('selectedType')
    onTypeChanged() {
        this.updateUrl();
    }

    @watch('selectedTier')
    onTierChanged() {
        // Handle the common case where the select yields an empty string
        if ((this.selectedTier as unknown) === '') this.selectedTier = undefined;
        this.updateUrl();
    }

    @watch('selectedSockets')
    onSocketsChanged() {
        if (typeof this.selectedSockets !== 'number') {
            const v = Number(this.selectedSockets);
            if (Number.isFinite(v) && v >= 1 && v <= 6) this.selectedSockets = v;
            else this.selectedSockets = undefined;
        }
        if (
            typeof this.selectedSockets !== 'number' ||
            !Number.isFinite(this.selectedSockets) ||
            this.selectedSockets < 1 ||
            this.selectedSockets > 6
        ) {
            this.selectedSockets = undefined;
        }
        this.updateUrl();
    }

    resetFilters() {
        // Reset all filters, including category (Both)
        this.selectedCategory = '';
        this.search = '';
        this.selectedType = '';
        this.selectedTier = undefined;
        this.selectedSockets = undefined;
        // Rebuild type options to reflect the combined dataset again
        this.rebuildTypeOptions();
        // Ensure the URL is updated (category param removed when empty)
        this.updateUrl();
    }

    get allItems(): IBaseItem[] {
        if (this.selectedCategory === 'armors') return this.itemsArmor;
        if (this.selectedCategory === 'weapons') return this.itemsWeapon;
        return [...this.itemsArmor, ...this.itemsWeapon];
    }

    get filteredAndGrouped() {
        const searchTokens = tokenizeSearch(this.search);
        const typeFilter = this.selectedType;
        const tierFilter = this.selectedTier;
        const sockets = this.selectedSockets;

        const all = this.allItems || [];

        // 1. Primary matches by search
        const primary: IBaseItem[] = [];
        const codeSet = new Set<string>();

        for (const i of all) {
            const hay = this._searchMap.get(i) || '';
            const matches = !searchTokens.length || matchesTokenGroups(hay, searchTokens);
            if (matches) {
                primary.push(i);
                if (i.NormCode) codeSet.add(i.NormCode.toLowerCase());
                if (i.UberCode) codeSet.add(i.UberCode.toLowerCase());
                if (i.UltraCode) codeSet.add(i.UltraCode.toLowerCase());
            }
        }

        // 2. Include associated by code family
        const combinedSet = new Set<IBaseItem>(primary);
        if (codeSet.size > 0) {
            for (const i of all) {
                if (combinedSet.has(i)) continue;
                if (
                    (i.NormCode && codeSet.has(i.NormCode.toLowerCase())) ||
          (i.UberCode && codeSet.has(i.UberCode.toLowerCase())) ||
          (i.UltraCode && codeSet.has(i.UltraCode.toLowerCase()))
                ) {
                    combinedSet.add(i);
                }
            }
        }

        // 3. Precompute the allowed type set
        let allowedTypeSet: Set<string> | undefined;
        if (typeFilter) {
            const opt = this.types.find((o) => o.id === typeFilter);
            if (opt && opt.value) allowedTypeSet = new Set<string>(opt.value);
        }

        // 4. Final filter pass
        const filtered: IBaseItem[] = [];
        for (const i of combinedSet) {
            // Type filter
            if (allowedTypeSet) {
                // Filter against codes (Type.Index) so the comparison aligns with
                // the option value lists, which now hold codes.
                const base = getChainForTypeNameReadonly(i?.Type?.Index ?? '')[0] || (i?.Type?.Index ?? '');
                if (!allowedTypeSet.has(base)) continue;
            }

            // Tier filter
            if (tierFilter && this._tierMap.get(i) !== tierFilter) continue;

            // Socket filter
            if (sockets) {
                const gs = i.GemSockets;
                let match = false;
                if (typeof gs === 'number') match = (gs === sockets);
                else if (typeof gs === 'string') {
                    // Reuse simple regex or string check
                    match = gs.includes(`: ${sockets}`) || gs.includes(`:${sockets}`);
                }
                if (!match) continue;
            }

            filtered.push(i);
        }

        // 5. Group by Type.Index, then cluster into code families
        const typeMap = new Map<string, Map<string, IBaseItem[]>>();
        for (const i of filtered) {
            const t = i?.Type?.Index || 'Other';
            let familyMap = typeMap.get(t);
            if (!familyMap) {
                familyMap = new Map<string, IBaseItem[]>();
                typeMap.set(t, familyMap);
            }
            const fKey = `${i.NormCode || ''}|${i.UberCode || ''}|${i.UltraCode || ''}`;
            let members = familyMap.get(fKey);
            if (!members) {
                members = [];
                familyMap.set(fKey, members);
            }
            members.push(i);
        }

        const tierOrder: Record<string, number> = { 'Normal': 0, 'Exceptional': 1, 'Elite': 2 };

        const groups = Array.from(typeMap.entries())
            .map(([typeName, familyMap]) => {
                const families = Array.from(familyMap.entries())
                    .map(([familyKey, members]) => {
                        members.sort((a, b) => {
                            const oa = tierOrder[this._tierMap.get(a) || ''] ?? 99;
                            const ob = tierOrder[this._tierMap.get(b) || ''] ?? 99;
                            if (oa !== ob) return oa - ob;
                            return (a.__index ?? 0) - (b.__index ?? 0);
                        });
                        const minIndex = members.reduce(
                            (min, it) => Math.min(min, it.__index ?? 999999),
                            999999,
                        );
                        return { familyKey, items: members, minIndex };
                    })
                    .sort((a, b) => a.minIndex - b.minIndex);
                return { typeName, families };
            })
            .sort((a, b) => a.typeName.localeCompare(b.typeName));

        return groups;
    }

    get totalCount() {
        return this.filteredAndGrouped.reduce(
            (acc, g) => acc + g.families.reduce((s, f) => s + f.items.length, 0),
            0,
        );
    }

    private calculateTier(i: IBaseItem): 'Normal' | 'Exceptional' | 'Elite' | undefined {
        const name: string = t(i.NameKey);
        const m = name.match(/\[(N|X|E)\]/i);
        if (m) {
            const ch = m[1].toUpperCase();
            if (ch === 'N') return 'Normal';
            if (ch === 'X') return 'Exceptional';
            if (ch === 'E') return 'Elite';
        }
        const famKey = `${i.NormCode || ''}|${i.UberCode || ''}|${i.UltraCode || ''}`;
        if (famKey.replace(/\|/g, '').length === 0) return undefined;
        const family = this._familyMap.get(famKey);
        if (family && family.length >= 3) {
            const sorted = family
                .slice()
                .sort((a, b) => (a.__index ?? 0) - (b.__index ?? 0));
            const pos = sorted.indexOf(i);
            if (pos === 0) return 'Normal';
            if (pos === 1) return 'Exceptional';
            if (pos === 2) return 'Elite';
        }
        return undefined;
    }

    private buildSearchString(i: IBaseItem): string {
        const parts: string[] = [
            t(i.NameKey),
            t(i.Type.Index),
            i.Code || i.NameKey,
            i.NormCode ?? '',
            i.UberCode ?? '',
            i.UltraCode ?? '',
        ];

        if (Array.isArray(i.Lines)) {
            for (const l of i.Lines) parts.push(format(l));
        }

        if (Array.isArray(i.DamageTypes)) {
            for (const d of i.DamageTypes) {
                parts.push(getDamageTypeStringUtil(d.Type));
                if (Array.isArray(d.Lines)) {
                    for (const l of d.Lines) parts.push(format(l));
                }
            }
        }

        if (Array.isArray(i.AutoMagicGroups)) {
            for (const g of i.AutoMagicGroups) {
                if (g.NameKey) parts.push(t(g.NameKey));
                if (Array.isArray(g.Lines)) {
                    for (const l of g.Lines) parts.push(format(l));
                }
            }
        }

        return parts.filter(Boolean).join(' ').toLowerCase();
    }

    /**
     * Group `AutoMagicGroups` for display.
     *
     * The keyed bundle emits one entry per affix tier (e.g. "of Blight",
     * "of Venom", "of Pestilence", ...) — each carries its own `RequiredLevel`
     * and a `Lines` array describing the mods. The UI shows them as one block
     * per affix family with the lowest required level on the left and all
     * the lines stacked on the right (matching the master-branch layout).
     *
     * Strategy: bucket entries by `NameKey`, accumulate lines (deduped), keep
     * the smallest `RequiredLevel` and the `Level` for ordering, then return
     * the buckets sorted by min-level / order-of-appearance.
     */
    groupedProperties(item: IBaseItem): IGroupedAutoMagic[] {
        const raw = item?.AutoMagicGroups;
        if (!Array.isArray(raw) || raw.length === 0) return [];

        const map = new Map<string, IGroupedAutoMagic>();
        raw.forEach((g, idx) => {
            const nameKey = (g.NameKey && g.NameKey.trim() !== '') ? g.NameKey : `__auto_${idx}`;
            const minIdx = g.Level ?? idx;
            let entry = map.get(nameKey);
            if (!entry) {
                entry = {
                    nameKey,
                    name: t(nameKey),
                    level: g.Level ?? 0,
                    requiredLevel: g.RequiredLevel,
                    lines: [],
                    minIndex: minIdx,
                };
                map.set(nameKey, entry);
            } else {
                if (g.RequiredLevel !== undefined &&
                    (entry.requiredLevel === undefined || g.RequiredLevel < entry.requiredLevel)) {
                    entry.requiredLevel = g.RequiredLevel;
                }
                if (minIdx < entry.minIndex) entry.minIndex = minIdx;
            }

            if (Array.isArray(g.Lines)) {
                for (const l of g.Lines) {
                    // De-dupe identical formatted lines within the same bucket.
                    const rendered = format(l);
                    if (!entry.lines.some(existing => format(existing) === rendered)) {
                        entry.lines.push(l);
                    }
                }
            }
        });

        return Array.from(map.values()).sort((a, b) => {
            if (a.minIndex !== b.minIndex) return a.minIndex - b.minIndex;
            return a.name.localeCompare(b.name);
        });
    }

    getDamageTypeString = getDamageTypeStringUtil;
}
