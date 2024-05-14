import { bindable } from 'aurelia';

import json from '../item-jsons/sets.json';

export class Sets {
    sets = json;
    @bindable search;
    class;

    classes = ['Amazon', 'Assassin', 'Barbarian', 'Druid', 'Necromancer', 'Paladin', 'Sorceress']

    searchChanged() {
        if (!this.search) {
            this.sets = json;
            return;
        }
        this.updateList();
    }

    classChanged(e) {
        this.class = e?.detail?.value;
        this.sets = json;
        this.updateList();
    }

    updateList() {
        if (!this.search && !this.class) {
            return;
        }
        try {
            const foundSets = [];
            loop1:
            for (const set of json) {
                set.AllProperties = [...set?.FullProperties, ...set?.PartialProperties]

                if (this.search && set.Name?.toLowerCase().includes(this.search?.toLowerCase())) {
                    foundSets.push(set);
                    continue;
                }

                for (const property of set?.AllProperties) {
                    if (this.class) {
                        if (property?.PropertyString?.toLowerCase()?.includes(this.class?.toLowerCase())) {
                            foundSets.push(set);
                            continue loop1;
                        }
                    } else {
                        if (property?.PropertyString?.toLowerCase()?.includes(this.search?.toLowerCase())) {
                            foundSets.push(set);
                            continue loop1;
                        }
                    }
                }

                for (const setItem of set?.SetItems) {
                    for (const property of setItem?.Properties) {
                        if (this.class) {
                            if (property?.PropertyString?.toLowerCase()?.includes(this.class?.toLowerCase())) {
                                foundSets.push(set);
                                continue loop1;
                            }
                        } else {
                            if (property?.PropertyString?.toLowerCase()?.includes(this.search?.toLowerCase())) {
                                foundSets.push(set);
                                continue loop1;
                            }
                        }
                    }
                }
            }
            this.sets = foundSets;
        } catch(e) {
            console.log(e);
        }
    }

    getDamageTypeString(type) {
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