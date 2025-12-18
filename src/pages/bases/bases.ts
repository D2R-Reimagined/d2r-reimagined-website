import { bindable, watch } from 'aurelia';

import {
    buildOptionsForPresentTypes,
    getChainForTypeName,
    getDescendantBaseNames,
    IFilterOption,
    resolveBaseTypeName,
    type_filtering_options,
} from '../../resources/constants';
import { getDamageTypeString as getDamageTypeStringUtil } from '../../utilities/damage-type';
import { prependTypeResetOption } from '../../utilities/filter-helpers';
import { isBlankOrInvalid } from '../../utilities/url-sanitize';
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
    RequiredStrength?: number;
    RequiredDexterity?: number;
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
    DamageTypes?: { Type: number; DamageString: string }[];
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
    @bindable selectedType: string | undefined;
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

    itemsArmor: IBaseItem[] = (Array.isArray(armorsJson) ? (armorsJson as unknown as IBaseItem[]) : []).map((it, __index) => ({
        ...it, __kind: 'armor' as const, __index,
    }));

    itemsWeapon: IBaseItem[] = (Array.isArray(weaponsJson) ? (weaponsJson as unknown as IBaseItem[]) : []).map((it, __index) => ({
        ...it, __kind: 'weapon' as const, __index,
    }));

    // Build type options and hydrate from URL
    binding() {
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
            const base = typeParam.split(',')[0];
            const opt = this.types.find((o) => o.value && o.value[0] === base);
            this.selectedType = opt ? base : undefined;
        }
    }

    attached() {
        // no-op
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
            {
                dedupeByBase: true,
                preferLabelStartsWith: 'Any ',
            },
        );
        this.types = prependTypeResetOption(options);
    }

    private updateUrl() {
        const url = new URL(window.location.href);

        if (this.search && this.search.trim() !== '')
            url.searchParams.set('search', this.search);
        else url.searchParams.delete('search');
        if (this.selectedType && this.selectedType !== '')
            url.searchParams.set('type', this.selectedType);
        else url.searchParams.delete('type');
        if (this.selectedTier) url.searchParams.set('tier', this.selectedTier);
        else url.searchParams.delete('tier');
        if (this.selectedSockets && this.selectedSockets >= 1 && this.selectedSockets <= 6)
            url.searchParams.set('sockets', String(this.selectedSockets));
        else url.searchParams.delete('sockets');
        if (this.selectedCategory)
            url.searchParams.set('category', this.selectedCategory);
        else url.searchParams.delete('category');

        window.history.pushState({}, '', url.toString());
    }

    handleCategoryChange() {
        // Rebuild types when a category changes; keep other filters, just reflect URL
        this.rebuildTypeOptions();
        // If the previously selected type is no longer present, clear it
        if (
            this.selectedType &&
            !this.types.some((o) => o.value && o.value[0] === this.selectedType)
        ) {
            this.selectedType = undefined;
        }
        this.updateUrl();
    }

    @watch('search')
    onSearchChanged() {
        this.updateUrl();
    }

    @watch('selectedType')
    onTypeChanged() {
        if (this.selectedType === '') this.selectedType = undefined;
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
        this.selectedType = undefined;
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

    // Grouping, search, type/tier/socket all mirror existing logic
    get filteredAndGrouped() {
        const searchRaw = (this.search || '').trim().toLowerCase();
        const searchTokens = searchRaw.length ? searchRaw.split(/\s+/) : [];
        const typeFilter = this.selectedType;
        const tierFilter = this.selectedTier;
        const sockets = this.selectedSockets;

        // Search
        const matchesSearch = (i: IBaseItem) => {
            if (!searchTokens.length) return true;
            const hay = [
                i.Name,
                i.Type?.Name,
                i.NormCode ?? '',
                i.UberCode ?? '',
                i.UltraCode ?? '',
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return searchTokens.every((t) => hay.includes(t));
        };

        const primary = (this.allItems || []).filter(matchesSearch);

        // Include associated by code family
        const codeSet = new Set<string>();
        for (const i of primary) {
            if (i.NormCode) codeSet.add(i.NormCode.toLowerCase());
            if (i.UberCode) codeSet.add(i.UberCode.toLowerCase());
            if (i.UltraCode) codeSet.add(i.UltraCode.toLowerCase());
        }
        const associated = (this.allItems || []).filter((i) => {
            const codes = [i.NormCode, i.UberCode, i.UltraCode]
                .filter(Boolean)
                .map((c) => String(c).toLowerCase());
            return codes.some((c) => codeSet.has(c));
        });
        const combinedSet = new Set<IBaseItem>([...primary, ...associated]);

        // Precompute the allowed type set (base + descendants)
        const allowedTypeSet: Set<string> | null = (() => {
            if (!typeFilter) return null;
            const set = new Set<string>();
            set.add(typeFilter);
            const descendants = getDescendantBaseNames(typeFilter);
            for (const d of descendants) set.add(d);
            return set;
        })();

        const filtered = Array.from(combinedSet).filter((i) => {
            const byType =
                !allowedTypeSet ||
                (() => {
                    const base =
                        getChainForTypeName(i?.Type?.Name ?? '')[0] ||
                        (i?.Type?.Name ?? '');
                    return allowedTypeSet.has(base);
                })();
            if (!byType) return false;

            const byTier = !tierFilter || this.getTier(i) === tierFilter;
            if (!byTier) return false;

            if (!sockets) return true;
            const gs = i.GemSockets;
            if (typeof gs === 'number') return gs === sockets;
            if (typeof gs === 'string') {
                const re = new RegExp(`:\\s*${sockets}(?!\\d)`);
                return re.test(gs);
            }
            return false;
        });

        // Group by Type.Name, then cluster into code families
        const typeMap = new Map<string, IBaseItem[]>();
        filtered.forEach((i) => {
            const t = i?.Type?.Name || 'Other';
            let list = typeMap.get(t);
            if (!list) {
                list = [];
                typeMap.set(t, list);
            }
            list.push(i);
        });

        const tierOrder = new Map<string, number>([
            ['Normal', 0],
            ['Exceptional', 1],
            ['Elite', 2],
        ]);

        const groups = Array.from(typeMap.entries())
            .map(([typeName, items]) => {
                const familyMap = new Map<string, IBaseItem[]>();
                for (const it of items) {
                    const key = `${it.NormCode || ''}|${it.UberCode || ''}|${it.UltraCode || ''}`;
                    let list = familyMap.get(key);
                    if (!list) {
                        list = [];
                        familyMap.set(key, list);
                    }
                    list.push(it);
                }
                const families = Array.from(familyMap.entries())
                    .map(([familyKey, members]) => {
                        members.sort((a, b) => {
                            const ta = this.getTier(a) ?? '';
                            const tb = this.getTier(b) ?? '';
                            const oa = tierOrder.get(ta) ?? 99;
                            const ob = tierOrder.get(tb) ?? 99;
                            if (oa !== ob) return oa - ob;
                            return (a.__index ?? 0) - (b.__index ?? 0);
                        });
                        const minIndex = members.reduce(
                            (min, it) => Math.min(min, it.__index ?? Number.MAX_SAFE_INTEGER),
                            Number.MAX_SAFE_INTEGER,
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

    getTier(i: IBaseItem): 'Normal' | 'Exceptional' | 'Elite' | undefined {
        const name: string = i?.Name ?? '';
        // Valid in this use
        // noinspection RegExpSingleCharAlternation,RegExpRedundantEscape
        const m = name.match(/\[(N|X|E)\]/i);
        if (m) {
            const ch = m[1].toUpperCase();
            if (ch === 'N') return 'Normal';
            if (ch === 'X') return 'Exceptional';
            if (ch === 'E') return 'Elite';
        }
        const famKey = [i.NormCode || '', i.UberCode || '', i.UltraCode || ''].join(
            '|',
        );
        if (!famKey.trim()) return undefined;
        const family = (this.allItems || []).filter(
            (x) =>
                x.NormCode === i.NormCode &&
                x.UberCode === i.UberCode &&
                x.UltraCode === i.UltraCode,
        );
        if (family.length >= 3) {
            const sorted = family
                .slice()
                .sort((a, b) => (a.__index ?? 0) - (b.__index ?? 0));
            const pos = sorted.findIndex((x) => x === i);
            if (pos === 0) return 'Normal';
            if (pos === 1) return 'Exceptional';
            if (pos === 2) return 'Elite';
        }
        return undefined;
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
