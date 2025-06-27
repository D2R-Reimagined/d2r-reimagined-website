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

    binding() {
        // Read search query parameters from URL when component is initialized
        const urlParams = new URLSearchParams(window.location.search);

        const searchParam = urlParams.get('search');
        if (searchParam) {
            this.search = searchParam;
        }

        const classParam = urlParams.get('class');
        if (classParam) {
            this.class = classParam;
        }

        const typeParam = urlParams.get('type');
        if (typeParam) {
            this.selectedType = typeParam;
        }
    }

    attached() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._debouncedSearchItem = debounce(this.updateList.bind(this), 350);
        this.updateList();
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
        if (this.class) {
            url.searchParams.set('class', this.class);
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
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        }
        this.updateUrl();
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
