import { bindable } from 'aurelia';

import json from '../item-jsons/uniques.json';

export class Uniques {
    uniques = json;
    @bindable search: string;
    class: string;

    classes = ['Amazon', 'Assassin', 'Barbarian', 'Druid', 'Necromancer', 'Paladin', 'Sorceress']

    searchChanged() {
        if (!this.search) {
            this.uniques = json;
            return;
        }
        this.updateList();
    }

    classChanged(e) {
        this.class = e?.detail?.value;
        this.uniques = json;
        this.updateList();
    }

    updateList() {
        if (!this.search && !this.class) {
            return;
        }

        const foundUniques = [];

        uniqueLoop:
        for (const unique of json) {
            if (unique.Name.toLowerCase().includes(this.search?.toLowerCase())) {
                foundUniques.push(unique);
                continue;
            }
            for (const property of unique.Properties) {
                if (property?.PropertyString?.toLowerCase()?.includes(this.class?.toLowerCase())) {
                    foundUniques.push(unique);
                    continue uniqueLoop;
                } else if (property.PropertyString?.toLowerCase().includes(this.search?.toLowerCase())) {
                    foundUniques.push(unique);
                    continue uniqueLoop;
                }
            }
        }
        this.uniques = foundUniques;
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
