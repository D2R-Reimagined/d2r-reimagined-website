import json from '../item-jsons/uniques.json';

export class Grail {
    uniques = json;
    filteredUniques;
    classes = [{ id: '', name: 'All Classes' }];
    types = [{ id: '', name: 'All Types' }];
    equipmentNames = [{ id: '', name: 'All Equipment' }];
    
    selectedClass = '';
    selectedType = '';
    selectedEquipmentName = '';
    search = '';
    
    foundItems = {};
    foundCount = 0;
    
    async binding() {
        // Load found items from local storage
        this.loadFoundItems();
        this.filteredUniques = [...this.uniques];
        
        // Update the count after loading data
        this.updateFoundCount();
        
        // Setup filter options
        this.setupFilterOptions();
    }
    
    setupFilterOptions() {
        // Extract unique classes
        const classSet = new Set();
        this.uniques.forEach(unique => {
            if (unique.Class) {
                classSet.add(unique.Class);
            }
        });
        
        // Add classes to dropdown
        classSet.forEach(className => {
            this.classes.push({ id: className, name: className });
        });
        
        // Extract unique types
        const typeSet = new Set();
        this.uniques.forEach(unique => {
            if (unique.Equipment && unique.Equipment.Type) {
                typeSet.add(unique.Equipment.Type);
            }
        });
        
        // Add types to dropdown
        typeSet.forEach(typeName => {
            this.types.push({ id: typeName, name: typeName });
        });
    }
    
    selectedClassChanged() {
        this.filterUniques();
    }
    
    selectedTypeChanged() {
        // Reset equipment selection
        this.selectedEquipmentName = '';
        this.equipmentNames = [{ id: '', name: 'All Equipment' }];
        
        if (!this.selectedType) {
            this.filterUniques();
            return;
        }
        
        // Extract equipment names for the selected type
        const equipmentSet = new Set();
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
    
    selectedEquipmentNameChanged() {
        this.filterUniques();
    }
    
    searchChanged() {
        this.filterUniques();
    }
    
    filterUniques() {
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
    
    loadFoundItems() {
        const savedItems = localStorage.getItem('d2r-grail-items');
        if (savedItems) {
            this.foundItems = JSON.parse(savedItems);
        }
    }
    
    saveFoundItems() {
        localStorage.setItem('d2r-grail-items', JSON.stringify(this.foundItems));
    }
    
    updateFoundStatus(itemName) {
        // Toggle found status
        this.foundItems[itemName] = !!this.foundItems[itemName];
        
        // Save to local storage
        this.saveFoundItems();
        
        // Update count
        this.updateFoundCount();
    }
    
    updateFoundCount() {
        this.foundCount = Object.values(this.foundItems).filter(value => value).length;
    }
    
    resetGrail() {
        if (confirm('Are you sure you want to reset your Grail progress? This cannot be undone.')) {
            this.foundItems = {};
            this.saveFoundItems();
            this.updateFoundCount();
        }
    }
    
    getDamageTypeString(type) {
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