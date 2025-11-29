import { bindable } from 'aurelia';

import json from '../item-jsons/uniques.json';

interface ISelectOption {
    value: string | undefined;
    label: string;
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
    Type?: string | { Name?: string };
    ArmorString?: string;
    DamageTypes?: IDamageType[];
    RequiredStrength?: number;
    RequiredDexterity?: number;
    Durability?: number;
    RequiredClass?: string;
}

interface IUniqueItem {
    Name: string;
    Type?: string;
    Class?: string;
    Rarity?: string;
    RequiredLevel?: number;
    Equipment: IEquipment;
    Properties?: IProperty[];
}

export class Grail {
    uniques: IUniqueItem[] = json as IUniqueItem[];
    filteredUniques: IUniqueItem[] = [];
    filteredFoundCount: number = 0;

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

    equipmentNames: ISelectOption[] = [{ value: undefined, label: '-' }];


    @bindable search: string;
    @bindable selectedClass: string;
    @bindable selectedType: string;
    @bindable selectedEquipmentName: string | undefined;

    @bindable showFoundItems: boolean = true;
    
    @bindable foundItems: Record<string, boolean> = {};
    foundCount: number = 0;
    
    binding(): void {
        // Load found items from local storage
        this.loadFoundItems();
        this.filteredUniques = [...this.uniques];
        
        // Update the count after loading data
        this.updateFoundCount();
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
    
    selectedClassChanged(): void {
        this.updateList();
    }
    
    selectedTypeChanged(): void {
        // Update equipment names when type changes
        this.equipmentNames = this.getUniqueEquipmentNames();
        // Reset selected equipment name when type changes
        this.selectedEquipmentName = undefined as unknown as string;

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
            const properties = (unique.Properties?.map((property) => property.PropertyString.toLowerCase())) ?? [];
            const baseName = unique.Equipment?.Name?.toLowerCase() ?? '';
            return uniqueName.includes(search) || properties.find(p => p.includes(search)) || baseName.includes(search);
        }
        const isMatchingType = (unique) => {
            return !this.selectedType || unique.Type === this.selectedType;
        }
        const isMatchingEquipmentName = (unique) => {
            return !this.selectedEquipmentName || unique.Equipment.Name === this.selectedEquipmentName;
        }

        // Build base filtered list without mutating the original uniques
        const baseFiltered = this.uniques.filter(unique =>
            !unique.Name.toLowerCase().includes('grabber') &&
            isMatchingSearch(unique) &&
            isMatchingClass(unique) &&
            isMatchingType(unique) &&
            isMatchingEquipmentName(unique)
        );

        // Count of found items among the base filtered set (regardless of hide toggle)
        this.filteredFoundCount = baseFiltered.reduce((count, u) => count + (this.foundItems[u.Name] ? 1 : 0), 0);

        // Apply "Hide Found Uniques" toggle
        this.filteredUniques = baseFiltered.filter(u => !this.showFoundItems || !this.foundItems[u.Name]);
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
        // The checked.bind already updated foundItems, just persist and refresh
        this.saveFoundItems();

        // Update counts and filtered list (to hide found when toggle is on)
        this.updateFoundCount();
        this.updateList();
    }
    
    updateFoundCount(): void {
        this.foundCount = Object.values(this.foundItems).filter(value => value).length;
    }
    
    resetGrail(): void {
        if (confirm('Are you sure you want to reset your Grail progress? This cannot be undone.')) {
            this.foundItems = {};
            this.saveFoundItems();
            this.updateFoundCount();
            this.updateList();
        }
    }
    
    getDamageTypeString(type: number): string {
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

    getUniqueEquipmentNames(): ISelectOption[] {
        // Filter uniques based on the selected type
        const filtered = this.uniques.filter(unique =>
            !this.selectedType || unique.Type === this.selectedType
        );

        // Extract unique Equipment.Name values
        const uniqueEquipmentNames = new Set<string>();
        filtered.forEach(unique => {
            if (unique.Equipment && unique.Equipment.Name) {
                uniqueEquipmentNames.add(unique.Equipment.Name);
            }
        });

        // Create options array
        const equipmentNameOptions: ISelectOption[] = [{ value: undefined, label: '-' }];
        Array.from(uniqueEquipmentNames).sort().forEach(name => {
            equipmentNameOptions.push({ value: name, label: name });
        });

        return equipmentNameOptions;
    }
}