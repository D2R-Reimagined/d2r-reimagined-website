import { bindable, watch } from 'aurelia';

import { debounce, DebouncedFunction } from '../../utilities/debounce';
import json from '../item-jsons/uniques.json';

export class Uniques {
    uniques = json;

    @bindable search: string;
    @bindable selectedClass: string;
    @bindable selectedType: string;
    @bindable selectedEquipmentName: string;

    private _debouncedSearchItem!: DebouncedFunction;

    attached() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._debouncedSearchItem = debounce(this.updateList.bind(this), 350);
        this.updateList();
    }
    @watch('selectedClass')
    handleSelectedClassChanged() {
        this.updateList();
    }

    @watch('search')
    handleSearchChanged() {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        }
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
    }
    
    @watch('selectedEquipmentName')
    handleEquipmentNameChanged() {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        }
    }

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

    types = this.getUniqueTypes();
    equipmentNames = [];

    getUniqueTypes() {
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
}
