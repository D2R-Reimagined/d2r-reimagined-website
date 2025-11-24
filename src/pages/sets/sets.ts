import { bindable, watch } from 'aurelia';

import { debounce, DebouncedFunction } from '../../utilities/debounce';
import json from '../item-jsons/sets.json';

import { ISetData } from './set-types';

export class Sets {
    sets: ISetData[] = json;
    @bindable search: string;
    @bindable selectedType: string;
    @bindable selectedEquipmentName: string;

    private _debouncedSearchItem!: DebouncedFunction;

    equipmentNames: Array<{ value: string | undefined; label: string } > = [];

    attached(): void {
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

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._debouncedSearchItem = debounce(this.updateList.bind(this), 350);
        // Initialize equipment names if type is preselected
        if (this.selectedType) {
            this.equipmentNames = this.getSetEquipmentNames();
        }
        this.updateList();
    }

    // Types list derived from set items
    get types(): Array<{ value: string | undefined; label: string }> {
        const typeSet = new Set<string>();
        for (const set of json) {
            for (const item of set.SetItems ?? []) {
                if (item.Type) typeSet.add(item.Type);
            }
        }
        const typeOptions: Array<{ value: string | undefined; label: string }> = [{ value: undefined, label: '-' }];
        Array.from(typeSet).sort().forEach(t => typeOptions.push({ value: t, label: t }));
        return typeOptions;
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

    @watch('search')
    handleSearchChanged(): void {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        }
        this.updateUrl();
    }

    @bindable class: string;

    classes: Array<{ value: string | null; label: string }> = [
        { value: null, label: '-' },
        { value: 'Amazon', label: 'Amazon' },
        { value: 'Assassin', label: 'Assassin' },
        { value: 'Barbarian', label: 'Barbarian' },
        { value: 'Druid', label: 'Druid' },
        { value: 'Necromancer', label: 'Necromancer' },
        { value: 'Paladin', label: 'Paladin' },
        { value: 'Sorceress', label: 'Sorceress' }
    ];

    classChanged(): void {
        this.sets = json;
        this.updateList();
        this.updateUrl();
    }

    selectedTypeChanged(): void {
        // Update equipment names when type changes and reset selection
        this.equipmentNames = this.getSetEquipmentNames();
        this.selectedEquipmentName = undefined;
        if (this._debouncedSearchItem) this._debouncedSearchItem();
        this.updateUrl();
    }

    selectedEquipmentNameChanged(): void {
        if (this._debouncedSearchItem) this._debouncedSearchItem();
    }

    updateList(): void {
        try {
            const searchText = this.search?.toLowerCase();
            const classText = this.class?.toLowerCase();

            const matchesType = (set: ISetData) => {
                if (!this.selectedType) return true;
                return (set.SetItems ?? []).some(si => si.Type === this.selectedType);
            };

            const matchesEquipment = (set: ISetData) => {
                if (!this.selectedEquipmentName) return true;
                return (set.SetItems ?? []).some(si => si.Equipment?.Name === this.selectedEquipmentName);
            };

            const matchesSearch = (set: ISetData) => {
                if (!searchText) return true;
                if (set.Name?.toLowerCase().includes(searchText)) return true;

                const allProps = set.AllProperties ?? [...(set.FullProperties || []), ...(set.PartialProperties || [])];
                // Match set-level properties (partial/full bonuses)
                if (allProps?.some(p => p.PropertyString?.toLowerCase()?.includes(searchText))) return true;

                for (const si of set.SetItems ?? []) {
                    if (si.Name?.toLowerCase().includes(searchText)) return true;
                    if (si.Equipment?.Name?.toLowerCase().includes(searchText)) return true;
                    // Match base item properties
                    if (si.Properties?.some(p => p.PropertyString?.toLowerCase()?.includes(searchText))) return true;
                    // Match item-level set properties shown in UI (SetPropertiesString)
                    if (si.SetPropertiesString?.some(s => s?.toLowerCase()?.includes(searchText))) return true;
                }
                return false;
            };

            const matchesClass = (set: ISetData) => {
                if (!classText) return true;
                const allProps = set.AllProperties ?? [...(set.FullProperties || []), ...(set.PartialProperties || [])];
                if (allProps?.some(p => p.PropertyString?.toLowerCase()?.includes(classText))) return true;
                for (const si of set.SetItems ?? []) {
                    if (si.Name?.toLowerCase().includes(classText)) return true;
                    if (si.Equipment?.Name?.toLowerCase().includes(classText)) return true;
                    if (si.Properties?.some(p => p.PropertyString?.toLowerCase()?.includes(classText))) return true;
                    if (si.SetPropertiesString?.some(s => s?.toLowerCase()?.includes(classText))) return true;
                }
                return false;
            };

            // If no filters at all, show all
            if (!this.search && !this.class && !this.selectedType && !this.selectedEquipmentName) {
                this.sets = json;
                return;
            }

            this.sets = json.filter(set =>
                matchesType(set) &&
                matchesEquipment(set) &&
                matchesSearch(set) &&
                matchesClass(set)
            );
        } catch (e) {
            console.error(e);
        }
    }

    getDamageTypeString(type: number): string {
        switch (type) {
            case 3:
                return 'Damage: ';
            case 2:
                return 'Throw Damage: ';
            case 1:
                return 'Two-Handed Damage: ';
            default:
                return 'Damage: ';
        }
    }

    // Partial set bonus count display by index 0-1 = 2, 2-3 = 3, 4-5 = 4, 6+ = 5
    getItemCount(indexPassed: number): number {
        if (indexPassed < 2) return 2;
        if (indexPassed < 4) return 3;
        if (indexPassed < 6) return 4;
        return 5;
    }

    // Build equipment names options for the selected type
    getSetEquipmentNames(): Array<{ value: string | undefined; label: string }> {
        const names = new Set<string>();
        for (const set of json) {
            for (const si of set.SetItems ?? []) {
                if (this.selectedType && si.Type !== this.selectedType) continue;
                const name = si.Equipment?.Name;
                if (name) names.add(name);
            }
        }
        const options: Array<{ value: string | undefined; label: string }> = [{ value: undefined, label: '-' }];
        Array.from(names).sort().forEach(n => options.push({ value: n, label: n }));
        return options;
    }
}
