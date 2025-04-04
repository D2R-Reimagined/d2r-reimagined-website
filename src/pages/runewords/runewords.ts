import { bindable, watch } from 'aurelia';

import { debounce, DebouncedFunction } from '../../utilities/debounce';
import json from '../item-jsons/runewords.json';

export class Runewords {
    runewords = json;

    @bindable search: string;
    @bindable searchRunes: string;
    @bindable exclusiveType: boolean;

    private _debouncedSearchItem!: DebouncedFunction;

    filteredRunewords = [];

    // The order of the value entries matters, going from specific to generic.
    // When checking the exclusive box, only the first value element is selected.
    types: { label: string, value: string[] }[] = [
        // Parent types
        { label: '-', value: [] },
        { label: 'Any Armor', value: [ 'Armor', 'Any Armor'] },
        { label: 'Any Helm', value: [ 'Helm' ] },
        { label: 'Any Weapon', value: [ 'Weapon' ] },
        { label: 'Any Melee Weapon', value: [ 'Melee Weapon', 'Weapon' ] },
        { label: 'Any Missile Weapon', value: [ 'Missile Weapon', 'Weapon' ] },
        { label: 'Any Shield', value: ['Any Shield'] },
        // Specific weapon types
        { label: 'Axe', value: [ 'Axe', 'Melee Weapon', 'Weapon' ] },
        { label: 'Club', value: [ 'Club', 'Melee Weapon', 'Weapon'] },
        { label: 'Hammer', value: [ 'Hammer', 'Melee Weapon', 'Weapon' ] },
        { label: 'Hand to Hand', value: [ 'Hand to Hand', 'Melee Weapon', 'Weapon' ] },
        { label: 'Mace', value: [ 'Mace', 'Melee Weapon', 'Weapon' ] },
        { label: 'Orb', value: ['Orb'] },
        { label: 'Polearm', value: [ 'Polearm', 'Melee Weapon', 'Weapon' ] },
        { label: 'Scepter', value: ['Scepter', 'Melee Weapon', 'Weapon' ] },
        { label: 'Staff', value: [ 'Staff', 'Melee Weapon', 'Weapon' ] },
        { label: 'Spear', value: [ 'Spear', 'Melee Weapon', 'Weapon' ] },
        { label: 'Sword', value: [ 'Sword', 'Melee Weapon', 'Weapon' ] },
        { label: 'Wand', value: [ 'Wand', 'Melee Weapon', 'Weapon' ] },
        // Specific armor types
        { label: 'Circlet', value: [ 'Circlet', 'Helm' ] },
        // Class specific types
        { label: 'Amazon Bow', value: [ 'Amazon Bow', 'Missile Weapon', 'Weapon' ] },
        { label: 'Amazon Spear', value: [ 'Amazon Spear', 'Spear', 'Melee Weapon', 'Weapon' ] },
        { label: 'Necromancer Shield', value: [ 'Necromancer Item', 'Any Shield' ] },
        { label: 'Barbarian Item', value: [ 'Barbarian Item' ] },
        { label: 'Paladin Item', value: [ 'Paladin Item' ] },
        { label: 'Druid Item', value: [ 'Druid Item' ] },
    ]

    selectedType: string[];

    amounts = [
        { value: undefined, label: 'Any' },
        { value: 2, label: '2 Sockets' },
        { value: 3, label: '3 Sockets' },
        { value: 4, label: '4 Sockets' },
        { value: 5, label: '5 Sockets' },
        { value: 6, label: '6 Sockets' }
    ];

    selectedAmount: number;

    attached() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._debouncedSearchItem = debounce(this.updateList.bind(this), 350);
        this.updateList();
    }

    @watch('searchRunes')
    handleSearchRunesChanged() {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        }
    }

    @watch('search')
    handleSearchChanged() {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        }
    }

    @watch('selectedType')
    selectedTypeChanged() {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        }
    }

    @watch('selectedAmount')
    selectedAmountChanged() {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        }
    }

    @watch('exclusiveType')
    handleExclusiveTypeChanged() {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        }
    }

    normalizeRuneName(name: string): string {
        // Remove " Rune" suffix and trim any extra spaces
        return name.replace(/ rune$/i, '').trim().toLowerCase();
    }

    updateList() {
        let filteringRunewords = this.runewords;

        // Type filtering
        if (this.selectedType?.length > 0) {
            const selectedType = this.exclusiveType ? [this.selectedType[0]] : this.selectedType;
            filteringRunewords = filteringRunewords.filter((x) => {
                for (const type of x.Types) {
                    if (selectedType.includes(type.Index) || (type.Index === 'Merc Equip' && selectedType.includes('Helm'))) {
                        return true;
                    }
                }
                return false;
            });
        }

        // Amount filtering
        if (this.selectedAmount) {
            filteringRunewords = filteringRunewords.filter((x) => x.Runes.length === this.selectedAmount);
        }

        // Initialize found to apply both search filters together
        let found = filteringRunewords;

        // Regular search filter (by name, properties, types)
        if (this.search) {
            found = found.filter((runeword) => {
                if (runeword.Name.toLowerCase().includes(this.search.toLowerCase())) {
                    return true;
                }
                for (const property of runeword.Properties) {
                    if (property.PropertyString.toLowerCase().includes(this.search.toLowerCase())) {
                        return true;
                    }
                }
                for (const type of runeword.Types) {
                    if (type.Name.toLowerCase().includes(this.search.toLowerCase())) {
                        return true;
                    }
                }
                return false;
            });
        }

        // Rune search filter
        if (this.searchRunes) {
            const inputRuneList = this.searchRunes.split(' ')
                .map((rune) => rune.trim().toLowerCase())
                .filter((rune) => rune.length > 0);

            found = found.filter((runeword) => {
                const runewordRuneNames = runeword.Runes.map((rune) => this.normalizeRuneName(rune.Name));
                return inputRuneList.every((inputRune) =>
                    runewordRuneNames.includes(inputRune)
                );
            });
        }

        // Set the filtered runewords at the end
        this.filteredRunewords = found;
    }

    transformTypeName(name) {
        switch (name) {
            case 'Merc Equip':
                return 'Helm'
            default:
                return name;
        }
    }

    actualLevelRequirement(runeword) {
        for (const property of runeword.Properties) {
            if (property.PropertyString && property.PropertyString.includes('To Required Level')) {
                const value = property.PropertyString.substring(1, 3);
                if(!runeword.RequiredLevel) {
                    return parseInt(value.trim());
                }
                return runeword.RequiredLevel + parseInt(value.trim());
            }
        }
        return runeword.RequiredLevel
    }
}
