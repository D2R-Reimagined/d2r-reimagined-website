import { bindable, watch } from 'aurelia';

import {
    buildOptionsForPresentTypes,
    character_class_options,
    getChainForTypeNameReadonly,
    IFilterOption,
    resolveBaseTypeName,
    type_filtering_options,
} from '../../resources/constants';
import { getDamageTypeString as getDamageTypeStringUtil } from '../../utilities/damage-types';
import { debounce, IDebouncedFunction } from '../../utilities/debounce';
import {
    isVanillaItem,
    prependTypeResetOption,
    tokenizeSearch,
} from '../../utilities/filter-helpers';
import { isBlankOrInvalid, syncParamsToUrl } from '../../utilities/url-sanitize';
import json from '../item-jsons/uniques.json';

// Minimal shapes for uniques JSON used by this page. Only type what we read.
interface IUniqueProperty {
    PropertyString?: string;
}

interface IUniqueEquipment {
    Name?: string;
    RequiredClass?: string;
}

interface IUniqueItem {
    Name?: string;
    Type?: string;
    Equipment?: IUniqueEquipment;
    Properties?: IUniqueProperty[];
    Vanilla?: string | number | boolean;
}

// Types of final damage format in weapons: (1) X-Y damage; (2) (X1-X2) to (Y1-Y2) damage
// NOTE: Strictly for ease
type SimpleDamage = {
    min: number;
    max: number;
};

type RangedDamage = {
    min_min: number;
    min_max: number;
    max_min: number;
    max_max: number;
};

export class Uniques {
    uniques: IUniqueItem[] = json as unknown as IUniqueItem[];

    @bindable search: string;
    @bindable selectedClass: string | undefined;
    // When true, hide items where Vanilla === 'Y'
    @bindable hideVanilla: boolean = false;
    // Selected type value from dropdown: base token (scalar)
    @bindable selectedType: string = '';
    @bindable selectedEquipmentName: string | undefined;
    // Current possible sorting modes
    // TODO: Specific non-physical damage sorting in the future? (e.g.: fire damage)
    @bindable weaponSortMode: 'none' |
        'avg-throw-phys-ascending' |'avg-throw-phys-descending' |
        'avg-melee-phys-ascending' | 'avg-melee-phys-descending' |
        'avg-non-phys-ascending' | 'avg-non-phys-descending' |
        'something-else' = 'none';

    equipmentNames: Array<{ value: string | undefined; label: string }> = [];

    // Centralized, data-driven type options (filtered to present types)
    types: ReadonlyArray<IFilterOption> = type_filtering_options.slice();

    private _debouncedSearchItem!: IDebouncedFunction;
    private _debouncedUpdateUrl!: IDebouncedFunction;

    // Weapon type strings (used in isWeaponType)
    // NOTE: not really elegant. Is there a better way of separating between weapons and non-weapons without
    // rewritting interfaces?
    private readonly weaponTypes = new Set<string>([
        'any-weapon',
        'missile-weapon',
        'melee-weapon',
        'axe',
        'mace',
        'hammer',
        'sword',
        'knife',
        'spear',
        'polearm',
        'staff',
        'wand',
        'bow',
        'crossbow',
        'javelin',
        'throwing-knife',
        'throwing-axe',
        'amazon-javelin',
        'amazon-bow',
        'amazon-spear',
        'assassin-claw',
        'sorceress-orb'
    ]);


    classes = character_class_options;

    // Hydrate state from URL and build type options BEFORE the controls render
    binding() {
        const urlParams = new URLSearchParams(window.location.search);

        const searchParam = urlParams.get('search');
        if (searchParam && !isBlankOrInvalid(searchParam)) {
            this.search = searchParam;
        }

        const classParam = urlParams.get('selectedClass');
        if (classParam && !isBlankOrInvalid(classParam)) {
            this.selectedClass = classParam;
        }

        // Boolean param: hideVanilla=true
        const hv = urlParams.get('hideVanilla');
        if (hv === 'true' || hv === '1') this.hideVanilla = true;

        // Build data-driven options from present types in uniques data
        try {
            const present = new Set<string>();
            for (const u of (json as unknown as IUniqueItem[]) || []) {
                const base = resolveBaseTypeName(u?.Type ?? '');
                if (base) present.add(base);
            }
            this.types = buildOptionsForPresentTypes(type_filtering_options, present);
            // Prepend a uniform reset option so users can clear the selection with '-'
            this.types = prependTypeResetOption(this.types);
        } catch {
            // keep default preset on error
        }

        // Map URL 'type' (id)
        const typeParam = urlParams.get('type');
        if (typeParam && !isBlankOrInvalid(typeParam)) {
            const opt = this.types.find((o) => o.id === typeParam);
            this.selectedType = opt ? opt.id : '';
        }

        // Equipment name (exact match)
        const eqParam = urlParams.get('equipment');
        if (eqParam && !isBlankOrInvalid(eqParam)) {
            this.selectedEquipmentName = eqParam;
        }
    }

    attached() {
        this._debouncedSearchItem = debounce(() => this.updateList(), 350);
        this._debouncedUpdateUrl = debounce(() => this.updateUrl(), 150);

        // Prebuild Equipment options if type preselected
        if (this.selectedType) {
            this.equipmentNames = this.getUniqueEquipmentNames();
        }
        this.updateList();
        this.updateUrl();
    }

    // Check if selected type is a weapon type
    get isWeaponType(): boolean {
        return this.selectedType && this.weaponTypes.has(this.selectedType);
    }

    @watch('selectedClass')
    @watch('hideVanilla')
    @watch('weaponSortMode')
    handleFilterChanged() {
        this.updateList();
        if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
    }

    @watch('search')
    handleSearchChanged() {
        if (this._debouncedSearchItem) this._debouncedSearchItem();
        if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
    }

    @watch('selectedType')
    handleTypeChanged() {
        // Update equipment names when type changes
        this.equipmentNames = this.getUniqueEquipmentNames();
        // Reset selected equipment name when type changes
        this.selectedEquipmentName = undefined;

        // Reset sorting mode when type changes to non-weapon type
        if (!this.isWeaponType) this.weaponSortMode = 'none';

        if (this._debouncedSearchItem) this._debouncedSearchItem();
        if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
    }

    @watch('selectedEquipmentName')
    handleEquipmentNameChanged() {
        if (this._debouncedSearchItem) this._debouncedSearchItem();
    }

    // Helper method to update URL with current search parameters
    private updateUrl() {
        syncParamsToUrl({
            search: this.search,
            selectedClass: this.selectedClass,
            type: this.selectedType,
            hideVanilla: this.hideVanilla,
            equipment: this.selectedEquipmentName,
        }, false);
    }

    updateList() {
        const searchTokens = tokenizeSearch(this.search);
        const selectedClassLower = (this.selectedClass || '').toLowerCase();

        // Build an allowed set from the selected base + its descendants (aggregates) + ancestors
        const allowedTypeSet: Set<string> | null = ((): Set<string> | null => {
            if (!this.selectedType) return null;
            const opt = this.types.find((o) => o.id === this.selectedType);
            return opt && opt.value ? new Set<string>(opt.value) : null;
        })();

        const isMatchingClass = (unique: IUniqueItem) => {
            if (!selectedClassLower) return true;
            const req = unique?.Equipment?.RequiredClass
                ? String(unique.Equipment.RequiredClass).toLowerCase()
                : '';
            return req.includes(selectedClassLower);
        };
        const isMatchingSearch = (unique: IUniqueItem) => {
            if (!searchTokens.length) return true;
            const hay = [
                String(unique?.Name || ''),
                ...(Array.isArray(unique?.Properties)
                    ? unique.Properties.map((p) => String(p?.PropertyString || ''))
                    : []),
                String(unique?.Equipment?.Name || ''),
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return searchTokens.every((t) => hay.includes(t));
        };
        const isMatchingType = (unique: IUniqueItem) => {
            if (!allowedTypeSet) return true;
            const base =
                getChainForTypeNameReadonly(unique?.Type ?? '')[0] || (unique?.Type ?? '');
            return allowedTypeSet.has(base);
        };
        const isMatchingEquipmentName = (unique: IUniqueItem) => {
            return (
                !this.selectedEquipmentName ||
                String(unique?.Equipment?.Name || '') === this.selectedEquipmentName
            );
        };
        const isMatchingVanilla = (unique: IUniqueItem) => {
            return !this.hideVanilla || !isVanillaItem(unique?.Vanilla);
        };

        // Update the equipment names list if a type is selected
        if (
            this.selectedType &&
            (!this.equipmentNames || this.equipmentNames.length <= 1)
        ) {
            this.equipmentNames = this.getUniqueEquipmentNames();
        }

        this.uniques = (json as unknown as IUniqueItem[]).filter(
            (unique: IUniqueItem) =>
                !String(unique?.Name || '')
                    .toLowerCase()
                    .includes('grabber') &&
                isMatchingSearch(unique) &&
                isMatchingClass(unique) &&
                isMatchingType(unique) &&
                isMatchingEquipmentName(unique) &&
                isMatchingVanilla(unique),
        );

        // Main sorting logic:
        // - descending: second avg damage - first avg damage;
        // - ascending: first avg damage - second avg damage.
        if (this.isWeaponType) {
            switch(this.weaponSortMode) {
                case 'avg-melee-phys-descending': {
                    this.uniques = this.uniques.slice().sort((a,b) => 
                        this.getWeaponPhysDamValue(b, 3) - this.getWeaponPhysDamValue(a, 3)
                    );
                    break;
                }
                case 'avg-melee-phys-ascending': {
                    this.uniques = this.uniques.slice().sort((a,b) => 
                        this.getWeaponPhysDamValue(a, 3) - this.getWeaponPhysDamValue(b, 3)
                    );
                    break;
                }
                case 'avg-throw-phys-descending': {
                    this.uniques = this.uniques.slice().sort((a,b) => 
                        this.getWeaponPhysDamValue(b, 2) - this.getWeaponPhysDamValue(a, 2)
                    );
                    break;
                }
                case 'avg-throw-phys-ascending': {
                    this.uniques = this.uniques.slice().sort((a,b) => 
                        this.getWeaponPhysDamValue(a, 2) - this.getWeaponPhysDamValue(b, 2)
                    );
                    break;
                }
                case 'avg-non-phys-descending': {
                    this.uniques = this.uniques.slice().sort((a,b) => 
                        this.getWeaponNonPhysDamValueFromProperties(b) - this.getWeaponNonPhysDamValueFromProperties(a)
                    );
                    break;
                }
                case 'avg-non-phys-ascending': {
                    this.uniques = this.uniques.slice().sort((a,b) => 
                        this.getWeaponNonPhysDamValueFromProperties(a) - this.getWeaponNonPhysDamValueFromProperties(b)
                    );
                    break;
                }
                default: break;
            }
        }
    }

    getDamageTypeString = getDamageTypeStringUtil;

    getUniqueEquipmentNames() {
        // Filter uniques based on the selected base (include descendants + ancestors)
        const allowedTypeSet: Set<string> | null = ((): Set<string> | null => {
            if (!this.selectedType) return null;
            const opt = this.types.find((o) => o.id === this.selectedType);
            return opt && opt.value ? new Set<string>(opt.value) : null;
        })();
        const filteredUniques = (json as unknown as IUniqueItem[]).filter(
            (unique: IUniqueItem) => {
                if (!allowedTypeSet) return true;
                const base =
                    getChainForTypeNameReadonly(unique?.Type ?? '')[0] || (unique?.Type ?? '');
                return allowedTypeSet.has(base);
            },
        );

        // Extract unique Equipment.Name values
        const uniqueEquipmentNames = new Set<string>();
        filteredUniques.forEach((unique) => {
            if (unique.Equipment && unique.Equipment.Name) {
                uniqueEquipmentNames.add(unique.Equipment.Name);
            }
        });

        // Create options array
        const equipmentNameOptions: Array<{
            value: string | undefined;
            label: string;
        }> = [{ value: '', label: '-' }];
        Array.from(uniqueEquipmentNames)
            .sort()
            .forEach((name) => {
                equipmentNameOptions.push({ value: name, label: name });
            });

        return equipmentNameOptions;
    }

    // Reset all filters to their default values and refresh
    resetFilters() {
        this.search = '';
        this.selectedClass = undefined;
        this.hideVanilla = false;
        this.selectedType = '';
        this.selectedEquipmentName = undefined;
        this.equipmentNames = [{ value: '', label: '-' }];

        this.updateList();
        this.updateUrl();
    }

    // Handle clicking any of the non-physical damage sorting interactables:
    // - property line that is non-physical damage related;
    // - weapon-sort-bar tab buttons
    onNonPhysDamPropertyClicked() {
        if (this.weaponSortMode !== 'avg-non-phys-descending' && this.weaponSortMode !== 'avg-non-phys-ascending') {
            this.weaponSortMode = 'avg-non-phys-descending';
        } else if (this.weaponSortMode === 'avg-non-phys-descending') {
            this.weaponSortMode = 'avg-non-phys-ascending'
        } else if (this.weaponSortMode === 'avg-non-phys-ascending') {
                this.weaponSortMode = 'none'
        }
    }

    // Handle clicking any of the throw physical damage sorting interactables
    // - same as non-physical damage;
    // - final throw physical damage line
    onThrowPhysDamageClicked() {
        if (this.weaponSortMode !== 'avg-throw-phys-descending' && this.weaponSortMode !== 'avg-throw-phys-ascending') {
            this.weaponSortMode = 'avg-throw-phys-descending';
        } else if (this.weaponSortMode === 'avg-throw-phys-descending') {
            this.weaponSortMode = 'avg-throw-phys-ascending'
        } else if (this.weaponSortMode === 'avg-throw-phys-ascending') {
                this.weaponSortMode = 'none'
        }
    }

    // Handle clicking any of the melee physical damage sorting interactables
    // - same as non-physical damage;
    // - final melee physical damage line
    onMeleePhysDamageClicked() {
        if (this.weaponSortMode !== 'avg-melee-phys-descending' && this.weaponSortMode !== 'avg-melee-phys-ascending') {
            this.weaponSortMode = 'avg-melee-phys-descending';
        } else if (this.weaponSortMode === 'avg-melee-phys-descending') {
            this.weaponSortMode = 'avg-melee-phys-ascending'
        } else if (this.weaponSortMode === 'avg-melee-phys-ascending') {
                this.weaponSortMode = 'none'
        }
    }

    // Parse the damage string from a given item
    // NOTE: Matches: (1) X to Y; (2) (X1-X2) to (Y1-Y2)
    parseDamageString(damage_string: string): SimpleDamage | RangedDamage | null {
        const SIMPLE_DAMAGE_REGEX = /^\s*(\d+)\s+to\s+(\d+)\s*$/;
        const RANGED_DAMAGE_REGEX = /^\s*\((\d+)\s*-\s*(\d+)\)\s+to\s+\((\d+)\s*-\s*(\d+)\)\s*$/;

        let match = damage_string.match(SIMPLE_DAMAGE_REGEX);

        if (match) {
            return {
                min: Number(match[1]),
                max: Number(match[2])
            };
        }

        match = damage_string.match(RANGED_DAMAGE_REGEX);

        if (match) {
            return {
                min_min: Number(match[1]),
                min_max: Number(match[2]),
                max_min: Number(match[3]),
                max_max: Number(match[4]),
            };
        }

        return null;
    }

    // Parse the final physical damage lines from items
    // NOTE: dam_type: 2 = throw, 3 = melee
    getWeaponPhysDamValue(unique: any, dam_type: number): number {
        const damage_entry = unique.Equipment?.DamageTypes?.find(entry => entry.Type === dam_type);
        if (!damage_entry) return 0;
        let damage_string = damage_entry.DamageString;
        if (!damage_string) return 0;

        const parsed = this.parseDamageString(damage_string);
        if (!parsed) return 0;

        if ('min' in parsed) {
            return (parsed.min + parsed.max) / 2;
        }

        let avg_min_dam = (parsed.min_min + parsed.min_max) / 2;
        let avg_max_dam = (parsed.max_min + parsed.max_max) / 2;
        let avg_dam = (avg_min_dam + avg_max_dam) / 2;

        return avg_dam;
    }

    // Reads and parses unique item's single properties and matches possible formats.
    // NOTE: Matches: (1) Adds X-Y to <Type> Damage; (2) Adds X-Y Weapon <Type> Damage; (3) (X-Y) to Minimum <Type> Damage;
    // NOTE: Did I miss some other format? Didn't find any (X-Y) to Maximum <Type> Damage.
    parseDamageProperty(property: IUniqueProperty) : SimpleDamage | null {
        if (!property) return null;
        if (!property.PropertyString) return null;

        const ADDS_ELEMENTAL_DAMAGE_REGEX = /^Adds\s+(\d+)\s*-\s*(\d+)\s+to\s+(Cold|Fire|Lightning)\s+Damage$/i;
        const ADDS_WEAPON_ELEMENTAL_DAMAGE_REGEX = /^Adds\s+(\d+)\s*-\s*(\d+)\s+Weapon\s+(Cold|Lightning|Fire|Magic)\s+Damage$/i;
        const ADDS_MAGIC_DAMAGE_REGEX = /^Adds\s+(\d+)\s*-\s*(\d+)\s+magic\s+damage$/i;
        const ADDS_MIN_ELEMENTAL_DAMAGE_REGEX = /^\+(\d+)\s*-\s*(\d+)\s+to\s+Minimum\s+(Cold|Lightning|Fire|Poison)\s+Damage$/i;

        let match = property.PropertyString.match(ADDS_ELEMENTAL_DAMAGE_REGEX);
        if (match) {
            return {
                min: Number(match[1]),
                max: Number(match[2])
            };
        }

        match = property.PropertyString.match(ADDS_MAGIC_DAMAGE_REGEX);
        if (match) {
            return {
                min: Number(match[1]),
                max: Number(match[2])
            };
        }

        match = property.PropertyString.match(ADDS_MIN_ELEMENTAL_DAMAGE_REGEX);
        if (match) {
            return {
                min: Number(match[1]),
                max: 0
            };
        }

        match = property.PropertyString.match(ADDS_WEAPON_ELEMENTAL_DAMAGE_REGEX);
        if (match) {
            return {
                min: Number(match[1]),
                max: Number(match[2])
            };
        }

        return null;
    }

    // Reads properties, selects them in case they are a damage property and adds to the total average 
    // accordingly.
    getWeaponNonPhysDamValueFromProperties(unique: IUniqueItem): number {
        let weapon_properties = unique.Properties;
        if (!weapon_properties) return 0;
        let avg_non_phys_dam = 0;
        weapon_properties.forEach((property) => {
            let current_property_dam = this.parseDamageProperty(property);
            if (current_property_dam !== null) {
                avg_non_phys_dam += (current_property_dam.min + current_property_dam.max) / 2;
            }
        });

        return avg_non_phys_dam;
    }
}
