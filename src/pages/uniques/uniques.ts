import { bindable, watch } from 'aurelia';
import { isBlankOrInvalid } from '../../utilities/url-sanitize';

import { debounce, DebouncedFunction } from '../../utilities/debounce';
import json from '../item-jsons/uniques.json';
import {
    type_filtering_options,
    buildOptionsForPresentTypes,
    resolveBaseTypeName,
    getChainForTypeName,
    getDescendantBaseNames,
    FilterOption
} from '../../resources/constants/item-type-filters';
import { prependTypeResetOption } from '../../utilities/filter-helpers';

export class Uniques {
    uniques = json;

    @bindable search: string;
    @bindable selectedClass: string;
    // When true, hide items where Vanilla === 'Y'
    @bindable hideVanilla: boolean = false;
    // Selected type value from dropdown: base token (scalar)
    @bindable selectedType: string | undefined;
    @bindable selectedEquipmentName: string;

    equipmentNames: Array<{ value: string | undefined; label: string }> = [];

    // Centralized, data-driven type options (filtered to present types)
    types: ReadonlyArray<FilterOption> = type_filtering_options.slice();

    private _debouncedSearchItem!: DebouncedFunction;
    private _debouncedUpdateUrl!: DebouncedFunction;

    classes = [
        { value: '', label: '-' },
        { value: 'Amazon', label: 'Amazon' },
        { value: 'Assassin', label: 'Assassin' },
        { value: 'Barbarian', label: 'Barbarian' },
        { value: 'Druid', label: 'Druid' },
        { value: 'Necromancer', label: 'Necromancer' },
        { value: 'Paladin', label: 'Paladin' },
        { value: 'Sorceress', label: 'Sorceress' }
    ];

    // Hydrate state from URL and build type options BEFORE the controls render
    binding() {
        const urlParams = new URLSearchParams(window.location.search);

        const searchParam = urlParams.get('search');
        if (searchParam && !isBlankOrInvalid(searchParam)) {
            this.search = searchParam;
        }

        const classParam = urlParams.get('class');
        if (classParam && !isBlankOrInvalid(classParam)) {
            this.selectedClass = classParam;
        }

        // Boolean param: hideVanilla=true
        const hv = urlParams.get('hideVanilla');
        if (hv === 'true' || hv === '1') this.hideVanilla = true;

        // Build data-driven options from present types in uniques data
        try {
            const present = new Set<string>();
            for (const u of (json as any[])) {
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
            const opt = this.types.find(o => o.value && o.value[0] === base);
            this.selectedType = opt ? base : undefined;
        }

        // Equipment name (exact match)
        const eqParam = urlParams.get('equipment');
        if (eqParam && !isBlankOrInvalid(eqParam)) {
            this.selectedEquipmentName = eqParam;
        }
    }

    attached() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._debouncedSearchItem = debounce(this.updateList.bind(this), 350);
        this._debouncedUpdateUrl = debounce(this.updateUrl.bind(this), 150);

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
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        }
        if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
    }

    @watch('selectedType')
    handleTypeChanged() {
        // Update equipment names when type changes
        this.equipmentNames = this.getUniqueEquipmentNames();
        // Reset selected equipment name when type changes
        this.selectedEquipmentName = undefined;

        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        }
        if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
    }

    @watch('selectedEquipmentName')
    handleEquipmentNameChanged() {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        }
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

        // Update class parameter
        if (this.selectedClass && !isBlankOrInvalid(this.selectedClass)) {
            url.searchParams.set('class', this.selectedClass);
        } else {
            url.searchParams.delete('class');
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
        // Build allowed set from selected base + its descendants (aggregates)
        const allowedTypeSet: Set<string> | null = ((): Set<string> | null => {
            if (!this.selectedType) return null;
            const set = new Set<string>();
            set.add(this.selectedType);
            const descendants = getDescendantBaseNames(this.selectedType);
            for (let i = 0; i < descendants.length; i++) set.add(descendants[i]);
            return set;
        })();

        const isMatchingClass = (unique) => {
            if (!selectedClassLower) return true;
            const req = unique?.Equipment?.RequiredClass ? String(unique.Equipment.RequiredClass).toLowerCase() : '';
            return req.includes(selectedClassLower);
        };
        const isMatchingSearch = (unique) => {
            if (!searchTokens.length) return true;
            const hay = [
                String(unique?.Name || ''),
                ...(Array.isArray(unique?.Properties) ? unique.Properties.map((p: any) => String(p?.PropertyString || '')) : []),
                String(unique?.Equipment?.Name || ''),
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return searchTokens.every(t => hay.includes(t));
        };
        const isMatchingType = (unique) => {
            if (!allowedTypeSet) return true;
            const base = getChainForTypeName(unique?.Type ?? '')[0] || (unique?.Type ?? '');
            return allowedTypeSet.has(base);
        };
        const isMatchingEquipmentName = (unique) => {
            return !this.selectedEquipmentName || String(unique?.Equipment?.Name || '') === this.selectedEquipmentName;
        };
        const isMatchingVanilla = (unique) => {
            if (!this.hideVanilla) return true;
            const v = String(unique?.Vanilla || '').toUpperCase();
            return v !== 'Y';
        };

        // Update the equipment names list if type is selected
        if (this.selectedType && (!this.equipmentNames || this.equipmentNames.length <= 1)) {
            this.equipmentNames = this.getUniqueEquipmentNames();
        }

        this.uniques = json.filter(unique =>
            !String(unique?.Name || '').toLowerCase().includes('grabber') &&
            isMatchingSearch(unique) &&
            isMatchingClass(unique) &&
            isMatchingType(unique) &&
            isMatchingEquipmentName(unique) &&
            isMatchingVanilla(unique));
    }

    getDamageTypeString(type: number) {
        switch (type) {
            case 3:
                return 'Damage: ';
            case 2:
                return 'Throw Damage: ';
            case 1:
                return 'Two-Handed Damage: '
            default:
                return 'Damage: ';
        }
    }

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
        const filteredUniques = (json as any[]).filter(unique => {
            if (!allowedTypeSet) return true;
            const base = getChainForTypeName(unique?.Type ?? '')[0] || (unique?.Type ?? '');
            return allowedTypeSet.has(base);
        });

        // Extract unique Equipment.Name values
        const uniqueEquipmentNames = new Set<string>();
        filteredUniques.forEach(unique => {
            if (unique.Equipment && unique.Equipment.Name) {
                uniqueEquipmentNames.add(unique.Equipment.Name);
            }
        });

        // Create options array
        const equipmentNameOptions: Array<{ value: string | undefined; label: string }> = [{ value: '', label: '-' }];
        Array.from(uniqueEquipmentNames).sort().forEach(name => {
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