import { bindable, watch } from 'aurelia';

import {
    buildOptionsForPresentTypes,
    character_class_options,
    getChainForTypeNameReadonly,
    getTypeChain,
    IFilterOption,
    resolveBaseTypeName,
    type_filtering_options,
} from '../../resources/constants';
import {
    getDamageTypeString as getDamageTypeStringUtil,
    IDamageType,
} from '../../utilities/damage-types';
import { debounce, IDebouncedFunction } from '../../utilities/debounce';
import {
    isVanillaItem,
    prependTypeResetOption,
    tokenizeSearch,
} from '../../utilities/filter-helpers';
import {
    getHandFilterLabel,
    getSortKeyFromDamageType as getSortKeyFromDamageTypeUtil,
    HandFilterMode,
    passesHandFilter,
    sortItemsByWeaponDamage,
    toggleHandFilter,
    toggleWeaponSort,
    WeaponSortMode,
    weaponSortOptions,
} from '../../utilities/item-sorting';
import { isBlankOrInvalid, syncParamsToUrl } from '../../utilities/url-sanitize';
import json from '../item-jsons/uniques.json';

// Minimal shapes for uniques JSON used by this page. Only type what we read.
interface IUniqueProperty {
    PropertyString?: string;
    'group-properties'?: Record<string, IUniqueProperty[]>;
    pickmode?: number;
    Index?: number;
    Chance?: number;
}

interface IUniqueEquipment {
    Name?: string;
    RequiredClass?: string;
    RequiredStrength?: string;
    RequiredDexterity?: string;
    DamageTypes?: IDamageType[];
    ArmorString?: string;
    Block?: number;
    Durability?: number;
}

interface IUniqueItem {
    Index?: string;
    Name?: string;
    Type?: string;
    Equipment?: IUniqueEquipment;
    Properties?: IUniqueProperty[];
    Vanilla?: string | number | boolean;
    Rarity?: string;
    RequiredLevel?: number;
}

export class Uniques {
    allUniques: IUniqueItem[] = json as unknown as IUniqueItem[];
    uniques: IUniqueItem[] = [];
    private _searchStrings = new Map<IUniqueItem, string>();

    @bindable search: string;
    @bindable selectedClass: string | undefined;
    // When true, hide items where Vanilla === 'Y'
    @bindable hideVanilla: boolean = false;
    // Selected type value from dropdown: base token (scalar)
    @bindable selectedType: string = '';
    @bindable selectedEquipmentName: string | undefined;
    // Current possible sorting modes
    // TODO: Specific non-physical damage sorting in the future? (e.g.: fire damage)
    @bindable weaponSortMode: WeaponSortMode = 'none';
    @bindable handFilterMode: HandFilterMode = 'all';

    equipmentNames: Array<{ value: string | undefined; label: string }> = [];

    // Centralized, data-driven type options (filtered to present types)
    types: ReadonlyArray<IFilterOption> = type_filtering_options.slice();

    private _debouncedSearchItem!: IDebouncedFunction;
    private _debouncedUpdateUrl!: IDebouncedFunction;



    classes = character_class_options;

    // Hydrate state from URL and build type options BEFORE the controls render
    binding() {
        const urlParams = new URLSearchParams(window.location.search);

        // Pre-calculate searchable strings
        this.allUniques.forEach(u => {
            this._searchStrings.set(u, this.buildSearchableStringForUnique(u));
        });

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

    detached() {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem.cancel();
        }
        if (this._debouncedUpdateUrl) {
            this._debouncedUpdateUrl.cancel();
        }
    }

    // Check if selected type is a weapon type
    get isWeaponType(): boolean {
        if (!this.selectedType) return false;
        const opt = this.types.find((o) => o.id === this.selectedType);
        if (!opt || !opt.value) return false;

        // Check if 'Weapon' is in the values (works for aggregates and non-exact types)
        if (opt.value.includes('Weapon')) return true;

        // For exact types, we need to check their ancestors in the type graph
        return opt.value.some(typeName => {
            const chain = getTypeChain(typeName);
            return chain.includes('Weapon');
        });
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

    weaponSortOptions = weaponSortOptions;

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
        let allowedTypeSet: Set<string> | undefined;
        if (this.selectedType) {
            const opt = this.types.find((o) => o.id === this.selectedType);
            if (opt && opt.value) allowedTypeSet = new Set<string>(opt.value);
        }

        // Update the equipment names list if a type is selected and it was empty or just the placeholder
        if (
            this.selectedType &&
            (!this.equipmentNames || this.equipmentNames.length <= 1)
        ) {
            this.equipmentNames = this.getUniqueEquipmentNames();
        }

        this.uniques = this.allUniques.filter((unique: IUniqueItem) => {
            const name = unique?.Name || '';
            if (name.toLowerCase().includes('grabber')) return false;

            // 1. Vanilla filter
            if (this.hideVanilla && isVanillaItem(unique?.Vanilla)) return false;

            // 2. Class filter
            if (selectedClassLower) {
                const req = unique?.Equipment?.RequiredClass
                    ? String(unique.Equipment.RequiredClass).toLowerCase()
                    : '';
                if (!req.includes(selectedClassLower)) return false;
            }

            // 3. Type filter
            if (allowedTypeSet) {
                const base =
          getChainForTypeNameReadonly(unique?.Type ?? '')[0] || (unique?.Type ?? '');
                if (!allowedTypeSet.has(base)) return false;
            }

            // 4. Equipment Name filter
            if (
                this.selectedEquipmentName &&
        String(unique?.Equipment?.Name || '') !== this.selectedEquipmentName
            ) {
                return false;
            }

            // 5. Search filter
            if (searchTokens.length > 0) {
                const hay = this._searchStrings.get(unique) || '';
                if (!searchTokens.some((group) => group.every((t) => hay.includes(t)))) {
                    return false;
                }
            }

            return true;
        });

        // Hand filter (1H / 2H):
        if (this.handFilterMode !== 'all') {
            this.uniques = this.uniques.filter((u) =>
                passesHandFilter(u?.Equipment?.DamageTypes, this.handFilterMode),
            );
        }

        // Main sorting logic:
        if (this.isWeaponType && this.weaponSortMode !== 'none') {
            this.uniques = sortItemsByWeaponDamage(this.uniques, this.weaponSortMode);
        }
    }

    private buildSearchableStringForUnique(unique: IUniqueItem): string {
        const parts: string[] = [
            String(unique?.Name || ''),
            String(unique?.Equipment?.Name || ''),
        ];

        if (Array.isArray(unique?.Properties)) {
            unique.Properties.forEach((p) => {
                if (p.PropertyString) parts.push(p.PropertyString);
                if (p['group-properties']) {
                    Object.values(p['group-properties']).forEach((pool) => {
                        pool.forEach((affix) => {
                            if (affix.PropertyString) parts.push(affix.PropertyString);
                        });
                    });
                }
            });
        }

        return parts.filter(Boolean).join(' ').toLowerCase();
    }

    getDamageTypeString = getDamageTypeStringUtil;

    getUniqueEquipmentNames() {
        // Filter uniques based on the selected base (include descendants + ancestors)
        let allowedTypeSet: Set<string> | undefined;
        if (this.selectedType) {
            const opt = this.types.find((o) => o.id === this.selectedType);
            if (opt && opt.value) allowedTypeSet = new Set<string>(opt.value);
        }

        const filteredUniques = this.allUniques.filter(
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

    formatGroupName(name: string) {
        return name.replace(/-/g, ' ').replace(/([a-z])([0-9])/g, '$1 $2');
    }

    // Reset all filters to their default values and refresh
    resetFilters() {
        this.search = '';
        this.selectedClass = undefined;
        this.hideVanilla = false;
        this.selectedType = '';
        this.selectedEquipmentName = undefined;
        this.equipmentNames = [{ value: '', label: '-' }];
        this.weaponSortMode = 'none';

        this.updateList();
        this.updateUrl();
    }

    // Reset only the weapon sorting mode
    resetSort() {
        this.weaponSortMode = 'none';
        this.handFilterMode = 'all';
    }

    toggleSort(type: string) {
        this.weaponSortMode = toggleWeaponSort(this.weaponSortMode, type);
    }

    getSortKeyFromDamageType(type: number): string | null {
        return getSortKeyFromDamageTypeUtil(type);
    }

    toggleHandFilter() {
        this.handFilterMode = toggleHandFilter(this.handFilterMode);
        this.updateList();
    }

    getHandFilterLabel = getHandFilterLabel;
}
