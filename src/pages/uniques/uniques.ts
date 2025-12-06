import { bindable, watch } from 'aurelia';

import { debounce, DebouncedFunction } from '../../utilities/debounce';
import json from '../item-jsons/uniques.json';
import {
    type_filtering_options,
    buildOptionsForPresentTypes,
    resolveBaseTypeName,
    getChainForTypeName,
    FilterOption
} from '../../resources/constants/item-type-filters';

export class Uniques {
    uniques = json;

    @bindable search: string;
    @bindable selectedClass: string;
    // Selected type value from dropdown: array of base + parent names
    @bindable selectedType: string[];
    @bindable selectedEquipmentName: string;

    equipmentNames: Array<{ value: string | undefined; label: string }> = [];

    // Centralized, data-driven type options (filtered to present types)
    types: ReadonlyArray<FilterOption> = type_filtering_options.slice();

    private _debouncedSearchItem!: DebouncedFunction;
    private _debouncedUpdateUrl!: DebouncedFunction;

    classes = [
        { value: undefined, label: '-' },
        { value: 'Amazon', label: 'Amazon' },
        { value: 'Assassin', label: 'Assassin' },
        { value: 'Barbarian', label: 'Barbarian' },
        { value: 'Druid', label: 'Druid' },
        { value: 'Necromancer', label: 'Necromancer' },
        { value: 'Paladin', label: 'Paladin' },
        { value: 'Sorceress', label: 'Sorceress' }
    ];

    attached() {
        // Read search query parameters from URL when component is initialized
        const urlParams = new URLSearchParams(window.location.search);

        const searchParam = urlParams.get('search');
        if (searchParam) {
            this.search = searchParam;
        }

        const classParam = urlParams.get('class');
        if (classParam) {
            this.selectedClass = classParam;
        }

        const typeParam = urlParams.get('type');
        if (typeParam) {
            this.selectedType = typeParam.split(',');
        }
        // Build data-driven options from present types in uniques data
        try {
            const present = new Set<string>();
            for (const u of (json as any[])) {
                const base = resolveBaseTypeName(u?.Type ?? '');
                if (base) present.add(base);
            }
            this.types = buildOptionsForPresentTypes(type_filtering_options, present);
        } catch {
            // keep default preset on error
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._debouncedSearchItem = debounce(this.updateList.bind(this), 350);
        this._debouncedUpdateUrl = debounce(this.updateUrl.bind(this), 150);
        this.updateList();
    }


    @watch('selectedClass')
    handleClassChanged() {
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
        if (this.selectedClass) {
            url.searchParams.set('class', this.selectedClass);
        } else {
            url.searchParams.delete('class');
        }

        // Update type parameter
        if (this.selectedType && this.selectedType.length > 0) {
            url.searchParams.set('type', this.selectedType.join(','));
        } else {
            url.searchParams.delete('type');
        }

        // Update the URL without reloading the page
        window.history.pushState({}, '', url.toString());
    }

    updateList() {
        const searchLower = (this.search || '').toLowerCase();
        const selectedClassLower = (this.selectedClass || '').toLowerCase();
        const selectedTypeSet = (this.selectedType && this.selectedType.length > 0)
            ? new Set<string>(this.selectedType)
            : null;

        const isMatchingClass = (unique) => {
            if (!selectedClassLower) return true;
            const req = unique?.Equipment?.RequiredClass ? String(unique.Equipment.RequiredClass).toLowerCase() : '';
            return req.includes(selectedClassLower);
        };
        const isMatchingSearch = (unique) => {
            if (!searchLower) return true;
            // Name
            if (String(unique?.Name || '').toLowerCase().includes(searchLower)) return true;
            // Properties
            const props = Array.isArray(unique?.Properties) ? unique.Properties : [];
            for (const p of props) {
                const s = String(p?.PropertyString || '').toLowerCase();
                if (s.includes(searchLower)) return true;
            }
            // Base name
            const baseName = String(unique?.Equipment?.Name || '').toLowerCase();
            return baseName.includes(searchLower);
        };
        const isMatchingType = (unique) => {
            if (!selectedTypeSet) return true;
            const base = getChainForTypeName(unique?.Type ?? '')[0] || (unique?.Type ?? '');
            return selectedTypeSet.has(base);
        };
        const isMatchingEquipmentName = (unique) => {
            return !this.selectedEquipmentName || String(unique?.Equipment?.Name || '') === this.selectedEquipmentName;
        };

        // Update the equipment names list if type is selected
        if (this.selectedType && this.selectedType.length > 0 && (!this.equipmentNames || this.equipmentNames.length <= 1)) {
            this.equipmentNames = this.getUniqueEquipmentNames();
        }

        this.uniques = json.filter(unique =>
            !String(unique?.Name || '').toLowerCase().includes('grabber') &&
            isMatchingSearch(unique) &&
            isMatchingClass(unique) &&
            isMatchingType(unique) &&
            isMatchingEquipmentName(unique));
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
        // Filter uniques based on the selected type set (base token)
        const selectedSet = new Set<string>(this.selectedType || []);
        const filteredUniques = (json as any[]).filter(unique => {
            if (!this.selectedType || this.selectedType.length === 0) return true;
            const base = getChainForTypeName(unique?.Type ?? '')[0] || (unique?.Type ?? '');
            return selectedSet.has(base);
        });

        // Extract unique Equipment.Name values
        const uniqueEquipmentNames = new Set<string>();
        filteredUniques.forEach(unique => {
            if (unique.Equipment && unique.Equipment.Name) {
                uniqueEquipmentNames.add(unique.Equipment.Name);
            }
        });

        // Create options array
        const equipmentNameOptions: Array<{ value: string | undefined; label: string }> = [{ value: undefined, label: '-' }];
        Array.from(uniqueEquipmentNames).sort().forEach(name => {
            equipmentNameOptions.push({ value: name, label: name });
        });

        return equipmentNameOptions;
    }

}