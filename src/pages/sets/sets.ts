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
import { debounce, IDebouncedFunction } from '../../utilities/debounce';
import { prependTypeResetOption } from '../../utilities/filter-helpers';
import { isBlankOrInvalid } from '../../utilities/url-sanitize';
import json from '../item-jsons/sets.json';

import { ISetData } from './set-types';

export class Sets {
    sets: ISetData[] = json;
    @bindable search: string;
    // Selected type: base token (scalar)
    @bindable selectedType: string | undefined;
    @bindable selectedEquipmentName: string | undefined;
    // When true, exclude items where Vanilla === 'Y'
    @bindable hideVanilla: boolean = false;

    private _debouncedSearchItem!: IDebouncedFunction;

    equipmentNames: Array<{ value: string | undefined; label: string }> = [];

    // Centralized type options, narrowed to types present in data
    types: ReadonlyArray<IFilterOption> = type_filtering_options.slice();

    // Build options and hydrate from URL BEFORE controls render
    binding(): void {
        const urlParams = new URLSearchParams(window.location.search);

        const searchParam = urlParams.get('search');
        if (searchParam && !isBlankOrInvalid(searchParam)) {
            this.search = searchParam;
        }

        const classParam = urlParams.get('selectedClass');
        if (classParam && !isBlankOrInvalid(classParam)) {
            this.selectedClass = classParam;
        }

        // Boolean param
        const hv = urlParams.get('hideVanilla');
        if (hv === 'true' || hv === '1') this.hideVanilla = true;

        // Collect base type names present in data and build options
        try {
            const present = new Set<string>();
            for (const set of (json as unknown as ISetData[]) || []) {
                for (const item of set?.SetItems || []) {
                    const base = resolveBaseTypeName(item?.Type ?? '');
                    if (base) present.add(base);
                }
            }
            this.types = buildOptionsForPresentTypes(
                type_filtering_options,
                present,
                { dedupeByBase: true, preferLabelStartsWith: 'Any ' },
            );
            // Prepend a uniform reset option so users can clear the selection with '-'
            this.types = prependTypeResetOption(this.types);
        } catch {
            // keep defaults on error
        }

        // Map URL 'type' (serialized as base) to a scalar base token
        const typeParam = urlParams.get('type');
        if (typeParam && !isBlankOrInvalid(typeParam)) {
            const base = typeParam.split(',')[0];
            const opt = this.types.find((o) => o.value && o.value[0] === base);
            this.selectedType = opt ? base : undefined;
        }
        // Equipment (exact)
        const eqParam = urlParams.get('equipment');
        if (eqParam && !isBlankOrInvalid(eqParam))
            this.selectedEquipmentName = eqParam;
    }

    attached(): void {
        this._debouncedSearchItem = debounce(() => this.updateList(), 350);
        // Prebuild Equipment options if type preselected
        if (this.selectedType) {
            this.equipmentNames = this.getSetEquipmentNames();
        }
        this.updateList();
    }

    // Types provided via shared preset (this.types)

    // Push current filters to URL
    private updateUrl() {
        const url = new URL(window.location.href);

        // Update search parameter
        if (this.search && this.search.trim() !== '') {
            url.searchParams.set('search', this.search);
        } else {
            url.searchParams.delete('search');
        }

        // Update selectedClass parameter
        if (this.selectedClass && !isBlankOrInvalid(this.selectedClass)) {
            url.searchParams.set('selectedClass', this.selectedClass);
        } else {
            url.searchParams.delete('selectedClass');
        }

        // Update type parameter (serialize as base token only)
        if (this.selectedType && this.selectedType !== '') {
            url.searchParams.set('type', this.selectedType);
        } else {
            url.searchParams.delete('type');
        }

        // Equipment name
        if (
            this.selectedEquipmentName &&
            !isBlankOrInvalid(this.selectedEquipmentName)
        ) {
            url.searchParams.set('equipment', this.selectedEquipmentName);
        } else {
            url.searchParams.delete('equipment');
        }

        // Update hideVanilla parameter
        if (this.hideVanilla) {
            url.searchParams.set('hideVanilla', 'true');
        } else {
            url.searchParams.delete('hideVanilla');
        }

        // Update the URL without reloading the page
        window.history.pushState({}, '', url.toString());
    }

    @watch('search')
    handleSearchChanged(): void {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        }
        this.updateUrl();
    }

    @bindable selectedClass: string | undefined;

    classes: Array<{ value: string | null; label: string }> = [
        { value: '', label: '-' },
        { value: 'Amazon', label: 'Amazon' },
        { value: 'Assassin', label: 'Assassin' },
        { value: 'Barbarian', label: 'Barbarian' },
        { value: 'Druid', label: 'Druid' },
        { value: 'Necromancer', label: 'Necromancer' },
        { value: 'Paladin', label: 'Paladin' },
        { value: 'Sorceress', label: 'Sorceress' },
    ];

    classChanged(): void {
        this.sets = json;
        this.updateList();
        this.updateUrl();
    }

    @watch('hideVanilla')
    handleHideVanillaChanged(): void {
        this.updateList();
        this.updateUrl();
    }

    selectedTypeChanged(): void {
        // Update equipment names when type changes and reset selection
        this.equipmentNames = this.getSetEquipmentNames();
        this.selectedEquipmentName = undefined;
        if (this._debouncedSearchItem) this._debouncedSearchItem();
        this.updateUrl();
    }

    selectedEquipmentNameChanged(): void {
        if (this._debouncedSearchItem) this._debouncedSearchItem();
        this.updateUrl();
    }

    updateList(): void {
        try {
            const searchRaw = (this.search || '').trim().toLowerCase();
            const searchTokens = searchRaw.length ? searchRaw.split(/\s+/) : [];
            const classText = this.selectedClass?.toLowerCase();

            const matchesType = (set: ISetData) => {
                // Build an allowed set from selected base + descendants
                if (!this.selectedType) return true;
                const allowed = new Set<string>();
                allowed.add(this.selectedType);
                const desc = getDescendantBaseNames(this.selectedType);
                for (let i = 0; i < desc.length; i++) allowed.add(desc[i]);
                return (set.SetItems ?? []).some((si) => {
                    const base = getChainForTypeName(si?.Type ?? '')[0] || (si?.Type ?? '');
                    return allowed.has(base);
                });
            };

            const matchesEquipment = (set: ISetData) => {
                if (!this.selectedEquipmentName) return true;
                return (set.SetItems ?? []).some(
                    (si) => si.Equipment?.Name === this.selectedEquipmentName,
                );
            };

            const matchesSearch = (set: ISetData) => {
                if (!searchTokens.length) return true;
                const hayParts: string[] = [];
                if (set.Name) hayParts.push(String(set.Name));
                const allProps = set.AllProperties ?? [
                    ...(set.FullProperties || []),
                    ...(set.PartialProperties || []),
                ];
                for (const p of allProps || [])
                    hayParts.push(String(p?.PropertyString || ''));
                for (const si of set.SetItems ?? []) {
                    hayParts.push(String(si?.Name || ''));
                    hayParts.push(String(si?.Equipment?.Name || ''));
                    for (const p of si?.Properties || [])
                        hayParts.push(String(p?.PropertyString || ''));
                    for (const s of si?.SetPropertiesString || [])
                        hayParts.push(String(s || ''));
                }
                const hay = hayParts.filter(Boolean).join(' ').toLowerCase();
                return searchTokens.every((t) => hay.includes(t));
            };

            const matchesVanilla = (set: ISetData) => {
                if (!this.hideVanilla) return true;
                // Hide the entire set based on a set-level Vanilla flag (tolerate missing field)
                const v: unknown = (set as unknown as Record<string, unknown>)[
                    'Vanilla'
                ];
                const vStr = typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' ? String(v).toUpperCase() : '';
                return vStr !== 'Y';
            };

            const matchesClass = (set: ISetData) => {
                if (!classText) return true;
                const allProps = set.AllProperties ?? [
                    ...(set.FullProperties || []),
                    ...(set.PartialProperties || []),
                ];
                if (
                    allProps?.some((p) =>
                        p.PropertyString?.toLowerCase()?.includes(classText),
                    )
                )
                    return true;
                for (const si of set.SetItems ?? []) {
                    if (si.Name?.toLowerCase().includes(classText)) return true;
                    if (si.Equipment?.Name?.toLowerCase().includes(classText))
                        return true;
                    if (
                        si.Properties?.some((p) =>
                            p.PropertyString?.toLowerCase()?.includes(classText),
                        )
                    )
                        return true;
                    if (
                        si.SetPropertiesString?.some((s) =>
                            s?.toLowerCase()?.includes(classText),
                        )
                    )
                        return true;
                }
                return false;
            };

            // If no filters at all (including hideVanilla), show all
            // Important: do NOT early-return when hideVanilla is true, so the vanilla filter can take effect
            if (
                !this.search &&
                !this.selectedClass &&
                !this.selectedType &&
                !this.selectedEquipmentName &&
                !this.hideVanilla
            ) {
                this.sets = json;
                return;
            }

            this.sets = json.filter(
                (set) =>
                    matchesType(set) &&
                    matchesEquipment(set) &&
                    matchesSearch(set) &&
                    matchesClass(set) &&
                    matchesVanilla(set),
            );
        } catch (e) {
            // ignore
        }
    }

    getDamageTypeString = getDamageTypeStringUtil;

    // Partial set bonus count display by index 0-1 = 2, 2-3 = 3, 4-5 = 4, 6+ = 5
    getItemCount(indexPassed: number): number {
        if (indexPassed < 2) return 2;
        if (indexPassed < 4) return 3;
        if (indexPassed < 6) return 4;
        return 5;
    }

    // Build equipment names options for the selected type
    getSetEquipmentNames(): Array<{
        value: string | undefined;
        label: string;
    }> {
        const names = new Set<string>();
        // Allowed set from selected base + descendants
        const allowed: Set<string> | null = ((): Set<string> | null => {
            if (!this.selectedType) return null;
            const set = new Set<string>();
            set.add(this.selectedType);
            const desc = getDescendantBaseNames(this.selectedType);
            for (let i = 0; i < desc.length; i++) set.add(desc[i]);
            return set;
        })();
        for (const set of (json as unknown as ISetData[]) || []) {
            for (const si of set.SetItems ?? []) {
                if (allowed) {
                    const base =
                        getChainForTypeName(si?.Type ?? '')[0] || (si?.Type ?? '');
                    if (!allowed.has(base)) continue;
                }
                const name = si.Equipment?.Name;
                if (name) names.add(name);
            }
        }
        const options: Array<{ value: string | undefined; label: string }> = [
            { value: '', label: '-' },
        ];
        Array.from(names)
            .sort()
            .forEach((n) => options.push({ value: n, label: n }));
        return options;
    }

    // Reset all filters to defaults and refresh
    resetFilters(): void {
        this.search = '';
        this.selectedClass = undefined;
        this.selectedType = undefined;
        this.selectedEquipmentName = undefined;
        this.hideVanilla = false;
        this.equipmentNames = [{ value: '', label: '-' }];

        this.updateList();
        this.updateUrl();
    }
}
