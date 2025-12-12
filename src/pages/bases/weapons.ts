import { bindable, watch, resolve } from 'aurelia';
import { isBlankOrInvalid } from '../../utilities/url-sanitize';
import { IRouter } from '@aurelia/router';

import json from '../item-jsons/weapons.json';
import {
    type_filtering_options,
    buildOptionsForPresentTypes,
    resolveBaseTypeName,
    getChainForTypeName,
    getDescendantBaseNames,
    FilterOption
} from '../../resources/constants/item-type-filters';

type DamageType = { Type: number; DamageString: string };

// New automagic property schema (legacy no longer supported)
type NewPropGroup = { Name: string; Level?: number; RequiredLevel?: number; PropertyStrings: string[]; Index?: number };

type WeaponBase = {
    Name: string;
    DamageTypes?: DamageType[] | null;
    Speed?: number | null;
    StrBonus?: number;
    DexBonus?: number;
    EquipmentType?: number;
    BaseRequiredLevel?: number;
    RequiredStrength?: number;
    RequiredDexterity?: number;
    Durability?: number;
    ItemLevel?: number;
    Type?: { Name?: string; Index?: string; Class?: string } | null;
    NormCode?: string | null;
    UberCode?: string | null;
    UltraCode?: string | null;
    GemSockets?: number | null;
    AutoPrefix?: string | null;
    RequiredClass?: string | null;
    AutoMagicGroups?: NewPropGroup[] | null;
    __index?: number; // synthetic index based on array order
};

type Family = { familyKey: string; items: WeaponBase[]; minIndex: number };
type Group = { typeName: string; families: Family[] };

export class Weapons {
    // Aurelia router
    private readonly router = resolve(IRouter);
    // dataset switcher (for banner dropdown)
    datasetOptions = [
        { value: 'armors', label: 'Armors' },
        { value: 'weapons', label: 'Weapons' },
    ];
    selectedDataset = 'weapons';

    // Full list from JSON
    items: WeaponBase[] = (json as unknown as WeaponBase[]).map((it, idx) => ({ ...it, __index: idx }));

    @bindable search: string;
    // Selected type option value: base token (scalar)
    @bindable selectedType: string | undefined;
    @bindable selectedTier: 'Normal' | 'Exceptional' | 'Elite' | undefined;

    tierOptions = [
        { value: '' as any, label: 'Any' },
        { value: 'Normal', label: 'Normal' },
        { value: 'Exceptional', label: 'Exceptional' },
        { value: 'Elite', label: 'Elite' },
    ];

    // Sockets filter options (colon labels per GemSockets notation)
    socketOptions = [
        { value: '' as any, label: 'Any' },
        { value: 1, label: '1 Socket' },
        { value: 2, label: '2 Sockets' },
        { value: 3, label: '3 Sockets' },
        { value: 4, label: '4 Sockets' },
        { value: 5, label: '5 Sockets' },
        { value: 6, label: '6 Sockets' },
    ];
    @bindable selectedSockets: number | undefined;

    // Centralized, data-driven type options filtered to present types in bases data
    types: ReadonlyArray<FilterOption> = type_filtering_options.slice();

    binding() {
            try {
            const present = new Set<string>();
            (json as WeaponBase[]).forEach(i => {
                const base = resolveBaseTypeName(i?.Type?.Name ?? '');
                if (base) present.add(base);
            });
            this.types = buildOptionsForPresentTypes(type_filtering_options, present, { dedupeByBase: true, preferLabelStartsWith: 'Any ' });
        } catch {
            // keep default preset
        }

        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        if (searchParam && !isBlankOrInvalid(searchParam)) this.search = searchParam;
        const tierParam = urlParams.get('tier');
        if (tierParam === 'Normal' || tierParam === 'Exceptional' || tierParam === 'Elite') {
            this.selectedTier = tierParam as any;
        }
        const socketsParam = urlParams.get('sockets');
        if (socketsParam && !isBlankOrInvalid(socketsParam)) {
            const n = parseInt(socketsParam, 10);
            if (!Number.isNaN(n) && n >= 1 && n <= 6) this.selectedSockets = n as 1|2|3|4|5|6 as number;
        }
        const typeParam = urlParams.get('type');
        if (typeParam && !isBlankOrInvalid(typeParam)) {
            const base = typeParam.split(',')[0];
            const opt = this.types.find(o => o.value && o.value[0] === base);
            this.selectedType = opt ? base : undefined;
        }
    }

    attached() {
        this.selectedDataset = 'weapons';
    }

    @watch('selectedDataset')
    handleDatasetChanged() {
        this.onDatasetChange();
    }

    // Reflect filters into URL (no reload)
    private updateUrl() {
        const url = new URL(window.location.href);
        // search
        if (this.search && this.search.trim() !== '') {
            url.searchParams.set('search', this.search);
        } else {
            url.searchParams.delete('search');
        }
        // type (base token)
        if (this.selectedType && this.selectedType !== '') {
            url.searchParams.set('type', this.selectedType);
        } else {
            url.searchParams.delete('type');
        }
        // tier
        if (this.selectedTier) {
            url.searchParams.set('tier', this.selectedTier);
        } else {
            url.searchParams.delete('tier');
        }
        // sockets
        if (this.selectedSockets && this.selectedSockets >= 1 && this.selectedSockets <= 6) {
            url.searchParams.set('sockets', String(this.selectedSockets));
        } else {
            url.searchParams.delete('sockets');
        }
        window.history.pushState({}, '', url.toString());
    }

    @watch('search')
    handleSearchChanged() {
        this.updateUrl();
    }

    @watch('selectedType')
    handleTypeChanged() {
        if (this.selectedType === '') this.selectedType = undefined;
        this.updateUrl();
    }

    @watch('selectedTier')
    handleTierChanged() {
        if (this.selectedTier === '' as any) this.selectedTier = undefined;
        this.updateUrl();
    }

    @watch('selectedSockets')
    handleSocketsChanged() {
        if (typeof this.selectedSockets !== 'number' || !Number.isFinite(this.selectedSockets) || this.selectedSockets < 1 || this.selectedSockets > 6) {
            this.selectedSockets = undefined;
        }
        this.updateUrl();
    }

    onDatasetChange() {
        // Use Aurelia router to actually switch components, preserving current query params
        const target = this.selectedDataset === 'armors' ? '/armors' : '/weapons';

        const url = new URL(window.location.href);
        if (url.pathname === target) return;

        // Sanitize params before preserving
        const params = url.searchParams;
        const remove: string[] = [];
        params.forEach((v, k) => { if (isBlankOrInvalid(v)) remove.push(k); });
        remove.forEach(k => params.delete(k));
        const qs = params.toString() ? `?${params.toString()}` : '';
        void this.router.load(`${target}${qs}`);
    }

    // Reset filters to defaults and refresh
    resetFilters() {
        this.search = '';
        this.selectedType = undefined;
        this.selectedTier = undefined;
        this.selectedSockets = undefined as any;
        this.updateUrl();
    }

    // Type options provided via this.types property

    get filteredAndGrouped(): Group[] {
        const searchRaw = (this.search || '').trim().toLowerCase();
        const searchTokens = searchRaw.length ? searchRaw.split(/\s+/) : [];
        const typeFilter = this.selectedType;
        const tierFilter = this.selectedTier;

        const allItems = this.items || [];

        const matchesSearch = (i: WeaponBase) => {
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
            return searchTokens.every(t => hay.includes(t));
        };

        const primary = searchTokens.length ? allItems.filter(matchesSearch) : allItems.slice();

        let combinedSet: Set<WeaponBase>;
        if (searchTokens.length) {
            const codeSet = new Set<string>();
            for (const i of primary) {
                if (i.NormCode) codeSet.add(i.NormCode.toLowerCase());
                if (i.UberCode) codeSet.add(i.UberCode.toLowerCase());
                if (i.UltraCode) codeSet.add(i.UltraCode.toLowerCase());
            }
            const associated = allItems.filter(i => {
                const codes = [i.NormCode, i.UberCode, i.UltraCode].filter(Boolean).map(c => (c as string).toLowerCase());
                return codes.some(c => codeSet.has(c));
            });
            combinedSet = new Set<WeaponBase>([...primary, ...associated]);
        } else {
            combinedSet = new Set<WeaponBase>(primary);
        }

        const sockets = this.selectedSockets;
        // Precompute allowed type set from the selected base: include base and its descendants for aggregates
        const allowedTypeSet: Set<string> | null = ((): Set<string> | null => {
            if (!typeFilter) return null;
            const set = new Set<string>();
            set.add(typeFilter);
            const descendants = getDescendantBaseNames(typeFilter);
            for (let i = 0; i < descendants.length; i++) set.add(descendants[i]);
            return set;
        })();

        const filtered = Array.from(combinedSet).filter(i => {
            const byType = !allowedTypeSet || ((): boolean => {
                const base = getChainForTypeName(i?.Type?.Name ?? '')[0] || (i?.Type?.Name ?? '');
                return allowedTypeSet.has(base);
            })();
            if (!byType) return false;
            const byTier = !tierFilter || (this.getTier(i) === tierFilter);
            if (!byTier) return false;
            // Sockets filter: supports numeric and string GemSockets representations
            if (!sockets) return true;
            const gs: unknown = (i as any).GemSockets as any;
            if (typeof gs === 'number') return gs === sockets;
            if (typeof gs === 'string') {
                // Match ": N" with no trailing digit to avoid ": 1" matching ": 10"
                const re = new RegExp(`:\\s*${sockets}(?!\\d)`);
                return re.test(gs);
            }
            return false;
        });

        const typeMap = new Map<string, WeaponBase[]>();
        filtered.forEach(i => {
            const t = i?.Type?.Name || 'Other';
            if (!typeMap.has(t)) typeMap.set(t, []);
            typeMap.get(t)!.push(i);
        });

        const tierOrder = new Map([
            ['Normal', 0],
            ['Exceptional', 1],
            ['Elite', 2],
        ] as const);

        const groups: Group[] = Array.from(typeMap.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([typeName, items]) => {
                const famMap = new Map<string, WeaponBase[]>();
                for (const it of items) {
                    const key = `${it.NormCode || ''}|${it.UberCode || ''}|${it.UltraCode || ''}`;
                    if (!famMap.has(key)) famMap.set(key, []);
                    famMap.get(key)!.push(it);
                }

                const families: Family[] = Array.from(famMap.entries()).map(([familyKey, members]) => {
                    members.sort((a, b) => {
                        const ta = this.getTier(a) ?? '';
                        const tb = this.getTier(b) ?? '';
                        const oa = tierOrder.has(ta as any) ? (tierOrder.get(ta as any) as number) : 99;
                        const ob = tierOrder.has(tb as any) ? (tierOrder.get(tb as any) as number) : 99;
                        if (oa !== ob) return oa - ob;
                        return (a.__index ?? 0) - (b.__index ?? 0);
                    });
                    const minIndex = members.reduce((min, it) => Math.min(min, it.__index ?? Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER);
                    return { familyKey, items: members, minIndex };
                }).sort((a, b) => a.minIndex - b.minIndex);

                return { typeName, families };
            });

        return groups;
    }

    get totalCount() {
        return this.filteredAndGrouped.reduce((acc, g) => acc + g.families.reduce((s, f) => s + f.items.length, 0), 0);
    }

    getDamageTypeString(type: number) {
        switch (type) {
            case 3:
                return 'Damage: ';
            case 2:
                return 'Throw Damage: ';
            case 1:
                return 'Two-Handed Damage: ';
            default:
                return 'Damage: ';
        }
    }

    // Expose item tier for template usage (highlighting codes line)
    itemTier(i: WeaponBase): 'Normal' | 'Exceptional' | 'Elite' | undefined {
        return this.getTier(i);
    }

    private getTier(i: WeaponBase): 'Normal' | 'Exceptional' | 'Elite' | undefined {
        const name = i?.Name || '';
        const m = name.match(/\[(N|X|E)\]/i);
        if (m) {
            const ch = m[1].toUpperCase();
            if (ch === 'N') return 'Normal';
            if (ch === 'X') return 'Exceptional';
            if (ch === 'E') return 'Elite';
        }
        const famKey = [i.NormCode || '', i.UberCode || '', i.UltraCode || ''].join('|');
        if (!famKey.trim()) return undefined;
        const family = (this.items || []).filter(x =>
            x.NormCode === i.NormCode && x.UberCode === i.UberCode && x.UltraCode === i.UltraCode
        );
        if (family.length >= 3) {
            const sorted = family.slice().sort((a, b) => (a.__index ?? 0) - (b.__index ?? 0));
            const pos = sorted.findIndex(x => x === i);
            if (pos === 0) return 'Normal';
            if (pos === 1) return 'Exceptional';
            if (pos === 2) return 'Elite';
        }
        return undefined;
    }

    groupedProperties(item: WeaponBase) {
        const raw = (item?.AutoMagicGroups || []).slice();
        if (!raw.length) return [] as { name: string; propertyStrings: string[]; requiredLevel?: number; minIndex: number }[];

        const splitLines = (s: string) => s.split(',').map(x => x.trim()).filter(x => x.length > 0);

        const map = new Map<string, { name: string; propertyStrings: string[]; requiredLevel?: number; minIndex: number }>();
        (raw as NewPropGroup[]).forEach((g, idx) => {
            const name = (g.Name && g.Name.trim() !== '') ? g.Name : 'Other';
            const minIdx = (g.Level ?? g.Index ?? idx ?? Number.MAX_SAFE_INTEGER) as number;
            if (!map.has(name)) map.set(name, { name, propertyStrings: [], requiredLevel: g.RequiredLevel, minIndex: minIdx });
            const entry = map.get(name)!;
            if (g.RequiredLevel !== undefined) entry.requiredLevel = g.RequiredLevel;
            (g.PropertyStrings || []).forEach(ps => {
                splitLines(ps).forEach(line => entry.propertyStrings.push(line));
            });
            if (minIdx < entry.minIndex) entry.minIndex = minIdx;
        });
        return Array.from(map.values()).sort((a, b) => {
            if (a.minIndex !== b.minIndex) return a.minIndex - b.minIndex;
            return a.name.localeCompare(b.name);
        });
    }

    
}
