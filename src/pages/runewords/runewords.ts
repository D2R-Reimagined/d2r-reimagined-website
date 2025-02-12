import { bindable, watch } from 'aurelia';

import { debounce, DebouncedFunction } from '../../utilities/debounce';
import json from '../item-jsons/runewords.json';

export class Runewords {
    runewords = json;

    @bindable search: string;
    @bindable searchRunes: string;

    private _debouncedSearchItem!: DebouncedFunction;

    filteredRunewords = [];

    types = [
        { value: undefined, label: 'Any' },
        { value: 'Armor', label: 'Armor' },
        { value: 'Helm', label: 'Helm' },
        { value: 'Polearm', label: 'Polearm' },
        { value: 'Any Shield', label: 'Any Shield' },
        { value: 'Barbarian Item', label: 'Barbarian Item' },
        { value: 'Circlet', label: 'Circlet' },
        { value: 'Missile Weapon', label: 'Missile Weapon' },
        { value: 'Melee Weapon', label: 'Melee Weapon' },
        { value: 'Weapon', label: 'Weapon' },
        { value: 'Wand', label: 'Wand' },
        { value: 'Orb', label: 'Orb' },
        { value: 'Sword', label: 'Sword' },
        { value: 'Axe', label: 'Axe' },
        { value: 'Amazon Bow', label: 'Amazon Bow' },
        { value: 'Amazon Spear', label: 'Amazon Spear' },
        { value: 'Spear', label: 'Spear' },
        { value: 'Staff', label: 'Staff' },
        { value: 'Mace', label: 'Mace' },
        { value: 'Hammer', label: 'Hammer' },
        { value: 'Paladin Item', label: 'Paladin Item' },
        { value: 'Hand to Hand', label: 'Hand to Hand' },
        { value: 'Club', label: 'Club' },
        { value: 'Any Armor', label: 'Any Armor' },
        { value: 'Scepter', label: 'Scepter' },
        { value: 'Druid Item', label: 'Druid Item' },
        { value: 'Necromancer Item', label: 'Necro Shield' },
    ];

    amounts = [
        { value: undefined, label: 'Any' },
        { value: 2, label: '2 Sockets' },
        { value: 3, label: '3 Sockets' },
        { value: 4, label: '4 Sockets' },
        { value: 5, label: '5 Sockets' },
        { value: 6, label: '6 Sockets' }
    ];

    selectedType: string;
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

    normalizeRuneName(name: string): string {
        // Remove " Rune" suffix and trim any extra spaces
        return name.replace(/ rune$/i, '').trim().toLowerCase();
    }

    updateList() {
        let filteringRunewords = this.runewords;

        // Type filtering
        if (this.selectedType) {
            filteringRunewords = filteringRunewords.filter((x) => {
                for (const type of x.Types) {
                    if (type.Index === this.selectedType || (type.Index === 'Merc Equip' && this.selectedType === 'Helm')) {
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
                .map((rune) => rune.trim())
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

    removeRuneFromName(runeName) {
        return runeName.replace(' Rune', '');
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
            if (property.PropertyString && property.PropertyString.includes("To Required Level")) {
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
