import { bindable, watch } from 'aurelia';

import { debounce, DebouncedFunction } from '../../utilities/debounce';
import json from '../item-jsons/sets.json';

import { ISetData } from './set-types';

export class Sets {
    sets: ISetData[] = json;
    @bindable search: string;

    private _debouncedSearchItem!: DebouncedFunction;

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

        // Update the URL without reloading the page
        window.history.pushState({}, '', url.toString());
    }

    @watch('search')
    handleSearchChanged(): void {
        if (!this.search) {
            this.sets = json;
            this.updateUrl();
            return;
        }
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

    updateList(): void {
        if (!this.search && !this.class) {
            return;
        }
        try {
            const foundSets: ISetData[] = [];
            loop1:
            for (const set of json) {
                set.AllProperties = [...(set.FullProperties || []), ...(set.PartialProperties || [])]

                if (this.search && set.Name?.toLowerCase().includes(this.search.toLowerCase())) {
                    foundSets.push(set);
                    continue;
                }

                if (set.AllProperties) {
                    for (const property of set.AllProperties) {
                        if (this.class) {
                            if (property.PropertyString?.toLowerCase()?.includes(this.class.toLowerCase())) {
                                foundSets.push(set);
                                continue loop1;
                            }
                        } else if (this.search) {
                            if (property.PropertyString?.toLowerCase()?.includes(this.search.toLowerCase())) {
                                foundSets.push(set);
                                continue loop1;
                            }
                        }
                    }
                }

                if (set.SetItems) {
                    for (const setItem of set.SetItems) {
                        if (this.class) {
                            if (setItem.Name.toLowerCase().includes(this.class.toLowerCase())) {
                                foundSets.push(set);
                                continue loop1;
                            }
                        } else if (this.search) {
                            if (setItem.Name.toLowerCase().includes(this.search.toLowerCase())) {
                                foundSets.push(set);
                                continue loop1;
                            }
                        }

                        if (setItem.Properties) {
                            for (const property of setItem.Properties) {
                                if (this.class) {
                                    if (property.PropertyString?.toLowerCase()?.includes(this.class.toLowerCase())) {
                                        foundSets.push(set);
                                        continue loop1;
                                    }
                                } else if (this.search) {
                                    if (property.PropertyString?.toLowerCase()?.includes(this.search.toLowerCase())) {
                                        foundSets.push(set);
                                        continue loop1;
                                    }
                                }
                            }
                        }

                        if (this.class) {
                            if (setItem.Equipment.Name.toLowerCase().includes(this.class.toLowerCase())) {
                                foundSets.push(set);
                                continue loop1;
                            }
                        } else if (this.search) {
                            if (setItem.Equipment.Name.toLowerCase().includes(this.search.toLowerCase())) {
                                foundSets.push(set);
                                continue loop1;
                            }
                        }
                    }
                }
            }
            this.sets = foundSets;
        } catch(e) {
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
}
