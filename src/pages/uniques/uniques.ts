import { bindable, watch } from 'aurelia';

import { debounce, DebouncedFunction } from '../../utilities/debounce';
import json from '../item-jsons/uniques.json';

export class Uniques {
    uniques = json;
    private types = [
        // The first element allows resetting the filter
        { label: '-', value: undefined },
        // Now follows a unique list of all possible types
        ...[ ...new Set<string>(json.map(unique => unique.Type)).values() ]
            // which is sorted alphabetically
            .sort((a, b) => a.localeCompare(b))
            // and converted into a selection list
            .map(type => { return { label: type, value: type } })
    ];

    @bindable search: string;
    @bindable class: string;
    @bindable selectedType: string;

    private _debouncedSearchItem!: DebouncedFunction;

    attached() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._debouncedSearchItem = debounce(this.updateList.bind(this), 350);
        this.updateList();
    }
    @watch('class')
    handleClassChanged() {
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



    updateList() {
        const isMatchingClass = (unique) => {
            return !this.class || unique.Equipment.RequiredClass?.toLowerCase().includes(this.class?.toLowerCase());
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
        this.uniques = json.filter(unique =>
            !unique.Name.toLowerCase().includes('grabber') && 
            !unique.Name.toLowerCase().includes('pliers') && 
            !unique.Name.toLowerCase().includes('gem bag') &&
            !unique.Name.toLowerCase().includes('storage for keys') &&
            !unique.Name.toLowerCase().includes('rainbow facet') &&
            !unique.Name.toLowerCase().includes('amulet of the viper') &&
            !unique.Name.toLowerCase().includes('staff of kings') &&
            !unique.Name.toLowerCase().includes('horadric staff') &&
            !unique.Name.toLowerCase().includes('khalim\'s ') &&
            !unique.Name.toLowerCase().includes('hell forge hammer') &&
            isMatchingSearch(unique) &&
            isMatchingClass(unique) &&
            isMatchingType(unique));
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
