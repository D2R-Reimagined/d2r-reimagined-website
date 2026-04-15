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
    IDamageType,
} from '../../utilities/damage-types';
import { prependTypeResetOption, tokenizeSearch } from '../../utilities/filter-helpers';
import { isBlankOrInvalid, syncParamsToUrl } from '../../utilities/url-sanitize';
import armorsJson from '../item-jsons/armors.json';
import weaponsJson from '../item-jsons/weapons.json';

// Shared shape for union; add a discriminator so the template can branch UI
interface IBaseItem {
    __index?: number;
    __kind: 'armor' | 'weapon';
    Name: string;
    Type?: { Name?: string; Index?: string; Class?: string } | null;
    GemSockets?: number | string | null;
    BaseRequiredLevel?: number;
    RequiredStrength?: string;
    RequiredDexterity?: string;
    Durability?: number;
    StrBonus?: number;
    DexBonus?: number;
    NormCode?: string | null;
    UberCode?: string | null;
    UltraCode?: string | null;
    AutoMagicGroups?:
        | {
        Name: string;
        Level?: number;
        RequiredLevel?: number;
        PropertyStrings: string[];
        Index?: number;
    }[]
        | null;
    // armor-only
    ArmorString?: string | null;
    DamageString?: string | null;
    DamageStringPrefix?: string | null;
    Block?: number | null;
    // weapon-only
    DamageTypes?: IDamageType[];
    Speed?: number | null;
}

export class Bases {

    // Category: "" (both), "armors", "weapons"
    categoryOptions: Array<{ value: '' | 'armors' | 'weapons'; label: string; }> = [
        { value: '', label: '-' },
        { value: 'armors', label: 'Armors' },
        { value: 'weapons', label: 'Weapons' }];

    @bindable selectedCategory: '' | 'armors' | 'weapons' = '';

    @bindable search: string;
    @bindable selectedType: string = '';
    @bindable selectedTier: 'Normal' | 'Exceptional' | 'Elite' | undefined;
    @bindable selectedSockets: number | undefined;

    tierOptions: Array<{ value: '' | 'Normal' | 'Exceptional' | 'Elite' | undefined; label: string; }> = [
        { value: '', label: '-' },
        { value: 'Normal', label: 'Normal' },
        { value: 'Exceptional', label: 'Exceptional' },
        { value: 'Elite', label: 'Elite' }];

    socketOptions: Array<{ value: number | ''; label: string }> = [
        { value: '', label: '-' },
        { value: 1, label: '1 Socket' },
        { value: 2, label: '2 Sockets' },
        { value: 3, label: '3 Sockets' },
        { value: 4, label: '4 Sockets' },
        { value: 5, label: '5 Sockets' },
        { value: 6, label: '6 Sockets' },
    ];

    types: ReadonlyArray<IFilterOption> = type_filtering_options.slice();

    private _tierMap = new Map<IBaseItem, 'Normal' | 'Exceptional' | 'Elite' | undefined>();
    private _searchMap = new Map<IBaseItem, string>();
    private _familyMap = new Map<string, IBaseItem[]>();
    private _allBases: IBaseItem[] = [];

    itemsArmor: IBaseItem[] = (Array.isArray(armorsJson) ? (armorsJson as unknown as IBaseItem[]) : []).map((it, __index) => ({
        ...it, __kind: 'armor' as const, __index,
    }));

    itemsWeapon: IBaseItem[] = (Array.isArray(weaponsJson) ? (weaponsJson as unknown as IBaseItem[]) : []).map((it, __index) => ({
        ...it, __kind: 'weapon' as const, __index,
    }));

    // Build type options and hydrate from URL
    binding() {
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
                const base = resolveBaseTypeName(i?.Type?.Name ?? '');
                if (base) present.add(base);
            }
        }
        const options = buildOptionsForPresentTypes(
            type_filtering_options,
            present,
        );
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
            const matches = !searchTokens.length || searchTokens.some((group) =>
                group.every((t) => hay.includes(t)),
            );
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
                const base = getChainForTypeNameReadonly(i?.Type?.Name ?? '')[0] || (i?.Type?.Name ?? '');
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

        // 5. Group by Type.Name, then cluster into code families
        const typeMap = new Map<string, Map<string, IBaseItem[]>>();
        for (const i of filtered) {
            const t = i?.Type?.Name || 'Other';
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

    getDamageLabel(i: IBaseItem) {
        if (!i) return '';
        if (i.DamageString) {
            const prefix =
                i.DamageStringPrefix && String(i.DamageStringPrefix).trim() !== ''
                    ? `${i.DamageStringPrefix}:`
                    : 'Damage:';
            return `${prefix} ${i.DamageString}`;
        }
        return '';
    }

    private calculateTier(i: IBaseItem): 'Normal' | 'Exceptional' | 'Elite' | undefined {
        const name: string = i?.Name ?? '';
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
        return [
            i.Name,
            i.Type?.Name,
            i.NormCode ?? '',
            i.UberCode ?? '',
            i.UltraCode ?? '',
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
    }

    groupedProperties(item: IBaseItem) {
        const raw = (item?.AutoMagicGroups || []).slice();
        if (!raw.length)
            return [] as {
                name: string;
                propertyStrings: string[];
                requiredLevel?: number;
                minIndex: number;
            }[];

        const splitLines = (s: string) =>
            s
                .split(',')
                .map((x) => x.trim())
                .filter((x) => x.length > 0);

        const map = new Map<
            string,
            {
                name: string;
                propertyStrings: string[];
                requiredLevel?: number;
                minIndex: number;
            }
        >();
        raw.forEach((g, idx) => {
            const name = g.Name && g.Name.trim() !== '' ? g.Name : 'Other';
            const minIdx = g.Level ?? g.Index ?? idx ?? Number.MAX_SAFE_INTEGER;
            if (!map.has(name))
                map.set(name, {
                    name,
                    propertyStrings: [],
                    requiredLevel: g.RequiredLevel,
                    minIndex: minIdx,
                });
            const entry = map.get(name);
            if (entry) {
                if (g.RequiredLevel !== undefined)
                    entry.requiredLevel = g.RequiredLevel;
                (g.PropertyStrings || []).forEach((ps) => {
                    splitLines(ps).forEach((line) => entry.propertyStrings.push(line));
                });
                if (minIdx < entry.minIndex) entry.minIndex = minIdx;
            }
        });
        return Array.from(map.values()).sort((a, b) => {
            if (a.minIndex !== b.minIndex) return a.minIndex - b.minIndex;
            return a.name.localeCompare(b.name);
        });
    }

    getDamageTypeString = getDamageTypeStringUtil;
}
