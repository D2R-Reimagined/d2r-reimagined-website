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
import json from '../item-jsons/uniques.json';

// Minimal shapes for uniques JSON used by this page. Only type what we read.
interface IUniqueProperty {
    PropertyString?: string;
}

interface IUniqueEquipment {
    Name?: string;
    RequiredClass?: string;
}

interface IUniqueItem {
    Name?: string;
    Type?: string;
    Equipment?: IUniqueEquipment;
    Properties?: IUniqueProperty[];
    Vanilla?: string | number | boolean;
}

export class Uniques {
    uniques: IUniqueItem[] = json as unknown as IUniqueItem[];

    @bindable search: string;
    @bindable selectedClass: string | undefined;
    // When true, hide items where Vanilla === 'Y'
    @bindable hideVanilla: boolean = false;
    // Selected type value from dropdown: base token (scalar)
    @bindable selectedType: string | undefined;
    @bindable selectedEquipmentName: string | undefined;

    equipmentNames: Array<{ value: string | undefined; label: string }> = [];

    // Centralized, data-driven type options (filtered to present types)
    types: ReadonlyArray<IFilterOption> = type_filtering_options.slice();

    private _debouncedSearchItem!: IDebouncedFunction;
    private _debouncedUpdateUrl!: IDebouncedFunction;

    classes = [
        { value: '', label: '-' },
        { value: 'Amazon', label: 'Amazon' },
        { value: 'Assassin', label: 'Assassin' },
        { value: 'Barbarian', label: 'Barbarian' },
        { value: 'Druid', label: 'Druid' },
        { value: 'Necromancer', label: 'Necromancer' },
        { value: 'Paladin', label: 'Paladin' },
        { value: 'Sorceress', label: 'Sorceress' },
    ];

    // Hydrate state from URL and build type options BEFORE the controls render
    binding() {
        const urlParams = new URLSearchParams(window.location.search);

        const searchParam = urlParams.get('search');
        if (searchParam && !isBlankOrInvalid(searchParam)) {
            this.search = searchParam;
        }

        const classParam = urlParams.get('selectedClass');
        if (classParam && !isBlankOrInvalid(classParam)) {
            this.selectedClass = classParam;
        }

        // Boolean param: hideVanilla=true
        const hv = urlParams.get('hideVanilla');
        if (hv === 'true' || hv === '1') this.hideVanilla = true;

        // Build data-driven options from present types in uniques data
        try {
            const present = new Set<string>();
            for (const u of (json as unknown as IUniqueItem[]) || []) {
                const base = resolveBaseTypeName(u?.Type ?? '');
                if (base) present.add(base);
            }
            this.types = buildOptionsForPresentTypes(type_filtering_options, present);
            // Prepend a uniform reset option so users can clear the selection with '-'
            this.types = prependTypeResetOption(this.types);
        } catch {
            // keep default preset on error
        }

        // Map URL 'type' (serialized as base) to a scalar base token
        const typeParam = urlParams.get('type');
        if (typeParam && !isBlankOrInvalid(typeParam)) {
            const base = typeParam.split(',')[0]; // support legacy multi-token by taking first
            const opt = this.types.find((o) => o.value && o.value[0] === base);
            this.selectedType = opt ? base : undefined;
        }

        // Equipment name (exact match)
        const eqParam = urlParams.get('equipment');
        if (eqParam && !isBlankOrInvalid(eqParam)) {
            this.selectedEquipmentName = eqParam;
        }
    }

    attached() {
        this._debouncedSearchItem = debounce(() => this.updateList(), 350);
        this._debouncedUpdateUrl = debounce(() => this.updateUrl(), 150);

        // Prebuild Equipment options if type preselected
        if (this.selectedType) {
            this.equipmentNames = this.getUniqueEquipmentNames();
        }
        this.updateList();
    }

    @watch('selectedClass')
    handleClassChanged() {
        this.updateList();
        if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
    }

    @watch('hideVanilla')
    handleHideVanillaChanged() {
        this.updateList();
        if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
    }

    @watch('search')
    handleSearchChanged() {
        if (this._debouncedSearchItem) this._debouncedSearchItem();
        if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
    }

    @watch('selectedType')
    handleTypeChanged() {
        // Update equipment names when type changes
        this.equipmentNames = this.getUniqueEquipmentNames();
        // Reset selected equipment name when type changes
        this.selectedEquipmentName = undefined;

        if (this._debouncedSearchItem) this._debouncedSearchItem();
        if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
    }

    @watch('selectedEquipmentName')
    handleEquipmentNameChanged() {
        if (this._debouncedSearchItem) this._debouncedSearchItem();
    }

    // Helper method to update URL with current search parameters
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

        // Update hideVanilla parameter (omit when false)
        if (this.hideVanilla) {
            url.searchParams.set('hideVanilla', 'true');
        } else {
            url.searchParams.delete('hideVanilla');
        }

        // Update equipment name parameter (exact match)
        if (this.selectedEquipmentName && !isBlankOrInvalid(this.selectedEquipmentName)) {
            url.searchParams.set('equipment', this.selectedEquipmentName);
        } else {
            url.searchParams.delete('equipment');
        }

        // Update the URL without reloading the page
        window.history.pushState({}, '', url.toString());
    }

    updateList() {
        const searchRaw = (this.search || '').trim().toLowerCase();
        const searchTokens = searchRaw.length ? searchRaw.split(/\s+/) : [];
        const selectedClassLower = (this.selectedClass || '').toLowerCase();
        // Build an allowed set from the selected base + its descendants (aggregates)
        const allowedTypeSet: Set<string> | null = ((): Set<string> | null => {
            if (!this.selectedType) return null;
            const set = new Set<string>();
            set.add(this.selectedType);
            const descendants = getDescendantBaseNames(this.selectedType);
            for (let i = 0; i < descendants.length; i++) set.add(descendants[i]);
            return set;
        })();

        const isMatchingClass = (unique: IUniqueItem) => {
            if (!selectedClassLower) return true;
            const req = unique?.Equipment?.RequiredClass
                ? String(unique.Equipment.RequiredClass).toLowerCase()
                : '';
            return req.includes(selectedClassLower);
        };
        const isMatchingSearch = (unique: IUniqueItem) => {
            if (!searchTokens.length) return true;
            const hay = [
                String(unique?.Name || ''),
                ...(Array.isArray(unique?.Properties)
                    ? unique.Properties.map((p) => String(p?.PropertyString || ''))
                    : []),
                String(unique?.Equipment?.Name || ''),
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return searchTokens.every((t) => hay.includes(t));
        };
        const isMatchingType = (unique: IUniqueItem) => {
            if (!allowedTypeSet) return true;
            const base =
                getChainForTypeName(unique?.Type ?? '')[0] || (unique?.Type ?? '');
            return allowedTypeSet.has(base);
        };
        const isMatchingEquipmentName = (unique: IUniqueItem) => {
            return (
                !this.selectedEquipmentName ||
                String(unique?.Equipment?.Name || '') === this.selectedEquipmentName
            );
        };
        const isMatchingVanilla = (unique: IUniqueItem) => {
            if (!this.hideVanilla) return true;
            const v: unknown = unique?.Vanilla as unknown;
            const vStr =
                typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean'
                    ? String(v).toUpperCase()
                    : '';
            return vStr !== 'Y';
        };

        // Update the equipment names list if a type is selected
        if (
            this.selectedType &&
            (!this.equipmentNames || this.equipmentNames.length <= 1)
        ) {
            this.equipmentNames = this.getUniqueEquipmentNames();
        }

        this.uniques = (json as unknown as IUniqueItem[]).filter(
            (unique: IUniqueItem) =>
                !String(unique?.Name || '')
                    .toLowerCase()
                    .includes('grabber') &&
                isMatchingSearch(unique) &&
                isMatchingClass(unique) &&
                isMatchingType(unique) &&
                isMatchingEquipmentName(unique) &&
                isMatchingVanilla(unique),
        );
    }

    getDamageTypeString = getDamageTypeStringUtil;

    getUniqueEquipmentNames() {
        // Filter uniques based on the selected base (include descendants)
        const allowedTypeSet: Set<string> | null = ((): Set<string> | null => {
            if (!this.selectedType) return null;
            const set = new Set<string>();
            set.add(this.selectedType);
            const descendants = getDescendantBaseNames(this.selectedType);
            for (let i = 0; i < descendants.length; i++) set.add(descendants[i]);
            return set;
        })();
        const filteredUniques = (json as unknown as IUniqueItem[]).filter(
            (unique: IUniqueItem) => {
                if (!allowedTypeSet) return true;
                const base =
                    getChainForTypeName(unique?.Type ?? '')[0] || (unique?.Type ?? '');
                return allowedTypeSet.has(base);
            },
        );

        // Extract unique Equipment.Name values
        const uniqueEquipmentNames = new Set<string>();
        filteredUniques.forEach((unique) => {
            if (unique.Equipment && unique.Equipment.Name) {
                uniqueEquipmentNames.add(unique.Equipment.Name);
            }
        });

        // Create options array
        const equipmentNameOptions: Array<{
            value: string | undefined;
            label: string;
        }> = [{ value: '', label: '-' }];
        Array.from(uniqueEquipmentNames)
            .sort()
            .forEach((name) => {
                equipmentNameOptions.push({ value: name, label: name });
            });

        return equipmentNameOptions;
    }

    // Reset all filters to their default values and refresh
    resetFilters() {
        this.search = '';
        this.selectedClass = undefined;
        this.hideVanilla = false;
        this.selectedType = undefined;
        this.selectedEquipmentName = undefined;
        this.equipmentNames = [{ value: '', label: '-' }];

        this.updateList();
        this.updateUrl();
    }
}
