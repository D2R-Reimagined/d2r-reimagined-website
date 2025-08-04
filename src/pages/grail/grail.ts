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
    
    selectedClass: string = '';
    selectedType: string = '';
    selectedEquipmentName: string = '';
    search: string = '';
    showFoundItems: boolean = false;
    
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
        this.filterUniques();
    }
    
    selectedTypeChanged(): void {
        // Reset equipment selection
        this.selectedEquipmentName = '';
        this.equipmentNames = [{ id: '', name: 'All Equipment' }];
        
        if (!this.selectedType) {
            this.filterUniques();
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
        
        this.filterUniques();
    }
    
    selectedEquipmentNameChanged(): void {
        this.filterUniques();
    }
    
    searchChanged(): void {
        this.filterUniques();
    }
    
    showFoundItemsChanged(): void {
        this.filterUniques();
    }
    
    filterUniques(): void {
        this.filteredUniques = this.uniques.filter(unique => {
            // Filter by class
            if (this.selectedClass && unique.Class !== this.selectedClass) {
                return false;
            }
            
            // Filter by type
            if (this.selectedType && 
                (!unique.Equipment || unique.Equipment.Type !== this.selectedType)) {
                return false;
            }
            
            // Filter by equipment name
            if (this.selectedEquipmentName && 
                (!unique.Equipment || unique.Equipment.Name !== this.selectedEquipmentName)) {
                return false;
            }
            
            // Filter by found status (hide found items by default unless showFoundItems is true)
            if (!this.showFoundItems && this.foundItems[unique.Name]) {
                return false;
            }
            
            // Filter by search text
            if (this.search) {
                const searchLower = this.search.toLowerCase();
                const nameMatch = unique.Name.toLowerCase().includes(searchLower);
                const equipmentMatch = unique.Equipment && unique.Equipment.Name && 
                    unique.Equipment.Name.toLowerCase().includes(searchLower);
                const propertyMatch = unique.Properties && unique.Properties.some(prop => 
                    prop.PropertyString.toLowerCase().includes(searchLower));
                
                if (!nameMatch && !equipmentMatch && !propertyMatch) {
                    return false;
                }
            }
            
            return true;
        });
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
        // Toggle found status
        console.log('Updating found status for', itemName);
        this.foundItems[itemName] = !this.foundItems[itemName];
        
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