import { bindable, watch } from 'aurelia';

import { debounce, DebouncedFunction } from '../../utilities/debounce';
import json from '../item-jsons/uniques.json';

export class Uniques {
    uniques = json;

    @bindable search: string;
    @bindable selectedClass: string;
    @bindable selectedType: string;
    @bindable selectedEquipmentName: string;

    equipmentNames = [];

    private _debouncedSearchItem!: DebouncedFunction;

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
            this.selectedType = typeParam;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._debouncedSearchItem = debounce(this.updateList.bind(this), 350);
        this.updateList();
    }


    get types() {
        const uniqueTypes = new Set();
        json.forEach(unique => {
            if (unique.Type) {
                uniqueTypes.add(unique.Type);
            }
        });

        const typeOptions = [{ value: undefined, label: '-' }];
        Array.from(uniqueTypes).sort().forEach(type => {
            typeOptions.push({ value: type, label: type });
        });

        return typeOptions;
    }

    @watch('class')
    handleClassChanged() {
        this.updateList();
        this.updateUrl();
    }

    @watch('search')
    handleSearchChanged() {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        }
        this.updateUrl();
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
        this.updateUrl();
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
        if (this.selectedType) {
            url.searchParams.set('type', this.selectedType);
        } else {
            url.searchParams.delete('type');
        }

        // Update the URL without reloading the page
        window.history.pushState({}, '', url.toString());
    }

    updateList() {
        const isMatchingClass = (unique) => {
            return !this.selectedClass || unique.Equipment.RequiredClass?.toLowerCase().includes(this.selectedClass?.toLowerCase());
        }
        const isMatchingSearch = (unique) => {
            if (!this.search) return true;
            const search = this.search.toLowerCase();
            const uniqueName = unique.Name.toLowerCase();
            const properties = unique.Properties.map((property) => property.PropertyString.toLowerCase());
            const baseName = unique.Equipment.Name.toLowerCase();
            return uniqueName.includes(search) || properties.find(p => p.includes(search)) || baseName.includes(search);
        }
        const isMatchingType = (unique) => {
            return !this.selectedType || unique.Type === this.selectedType;
        }
        const isMatchingEquipmentName = (unique) => {
            return !this.selectedEquipmentName || unique.Equipment.Name === this.selectedEquipmentName;
        }

        // Update the equipment names list if type is selected
        if (this.selectedType && (!this.equipmentNames || this.equipmentNames.length <= 1)) {
            this.equipmentNames = this.getUniqueEquipmentNames();
        }

        this.uniques = json.filter(unique =>
            !unique.Name.toLowerCase().includes('grabber') &&
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
        // Filter uniques based on the selected type
        const filteredUniques = json.filter(unique =>
            !this.selectedType || unique.Type === this.selectedType
        );

        // Extract unique Equipment.Name values
        const uniqueEquipmentNames = new Set();
        filteredUniques.forEach(unique => {
            if (unique.Equipment && unique.Equipment.Name) {
                uniqueEquipmentNames.add(unique.Equipment.Name);
            }
        });

        // Create options array
        const equipmentNameOptions = [{ value: undefined, label: '-' }];
        Array.from(uniqueEquipmentNames).sort().forEach(name => {
            equipmentNameOptions.push({ value: name, label: name });
        });

        return equipmentNameOptions;
    }
}