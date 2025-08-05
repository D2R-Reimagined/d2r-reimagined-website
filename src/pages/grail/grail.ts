import { bindable } from 'aurelia';

import json from '../item-jsons/uniques.json';

interface ISelectOption {
    id: string;
    name: string;
}

interface IDamageType {
    Type: number;
    DamageString: string;
}

interface IProperty {
    PropertyString: string;
}

interface IEquipment {
    Name?: string;
    Type?: string;
    ArmorString?: string;
    DamageTypes?: IDamageType[];
    RequiredStrength?: number;
    RequiredDexterity?: number;
    Durability?: number;
}

interface IUniqueItem {
    Name: string;
    Class?: string;
    Rarity?: string;
    RequiredLevel?: number;
    Equipment: IEquipment;
    Properties?: IProperty[];
}

export class Grail {
    uniques: IUniqueItem[] = json as IUniqueItem[];
    filteredUniques: IUniqueItem[] = [];

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

    equipmentNames: ISelectOption[] = [{ id: '', name: 'All Equipment' }];


    @bindable search: string;
    @bindable selectedClass: string;
    @bindable selectedType: string;
    @bindable selectedEquipmentName: string;

    @bindable showFoundItems: boolean = true;
    
    @bindable foundItems: Record<string, boolean> = {};
    foundCount: number = 0;
    
    binding(): void {
        // Load found items from local storage
        this.loadFoundItems();
        this.filteredUniques = [...this.uniques];
        
        // Update the count after loading data
        this.updateFoundCount();
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
    
    selectedClassChanged(): void {
        this.updateList();
    }
    
    selectedTypeChanged(): void {
        // Reset equipment selection
        this.selectedEquipmentName = '';
        this.equipmentNames = [{ id: '', name: 'All Equipment' }];
        
        if (!this.selectedType) {
            this.updateList();
            return;
        }
        
        // Extract equipment names for the selected type
        const equipmentSet = new Set<string>();
        this.uniques.forEach(unique => {
            if (unique.Equipment && 
                unique.Equipment.Type === this.selectedType && 
                unique.Equipment.Name) {
                equipmentSet.add(unique.Equipment.Name);
            }
        });
        
        // Add equipment names to dropdown
        equipmentSet.forEach(name => {
            this.equipmentNames.push({ id: name, name });
        });
        
        this.updateList();
    }
    
    selectedEquipmentNameChanged(): void {
        this.updateList();
    }
    
    searchChanged(): void {
        this.updateList();
    }
    
    showFoundItemsChanged(): void {
        this.updateList();
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
            isMatchingEquipmentName(unique) &&
            (!this.showFoundItems || !this.foundItems[unique.Name]));
    }
    
    loadFoundItems(): void {
        const savedItems = localStorage.getItem('d2r-grail-items');
        if (savedItems) {
            this.foundItems = JSON.parse(savedItems) as Record<string, boolean>;
        }
    }
    
    saveFoundItems(): void {
        localStorage.setItem('d2r-grail-items', JSON.stringify(this.foundItems));
    }
    
    updateFoundStatus(itemName: string): void {
        // Toggle found status\
        this.foundItems[itemName] = !!this.foundItems[itemName];
        
        // Save to local storage
        this.saveFoundItems();
        
        // Update count
        this.updateFoundCount();
    }
    
    updateFoundCount(): void {
        this.foundCount = Object.values(this.foundItems).filter(value => value).length;
    }
    
    resetGrail(): void {
        if (confirm('Are you sure you want to reset your Grail progress? This cannot be undone.')) {
            this.foundItems = {};
            this.saveFoundItems();
            this.updateFoundCount();
        }
    }
    
    getDamageTypeString(type: number): string {
        switch (type) {
            case 0:
                return 'Damage:';
            case 1:
                return 'One-Hand Damage:';
            case 2:
                return 'Two-Hand Damage:';
            case 3:
                return 'Throw Damage:';
            default:
                return 'Damage:';
        }
    }
}