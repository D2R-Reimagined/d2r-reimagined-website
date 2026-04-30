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
} from '../../utilities/damage-types';
import { debounce, IDebouncedFunction } from '../../utilities/debounce';
import {
    isVanillaItem,
    matchesTokenGroups,
    prependTypeResetOption,
    tokenizeSearch,
} from '../../utilities/filter-helpers';
import { IKeyedLine } from '../../utilities/i-keyed-line';
import {
    getSortKeyFromDamageType as getSortKeyFromDamageTypeUtil,
    HandFilterMode,
    handFilterOptions,
    passesHandFilter,
    sortItemsByWeaponDamage,
    toggleWeaponSort,
    WeaponSortMode,
    weaponSortOptions,
} from '../../utilities/item-sorting';
import { format, t } from '../../utilities/translation-store.js';
import { isBlankOrInvalid, syncParamsToUrl } from '../../utilities/url-sanitize';

// Shapes for the new keyed uniques.json
interface IUniqueEquipment {
    EquipmentType: number;
    NameKey: string;
    RequiredClass: string;
    DamageTypes?: {
        Type: number;
        AverageDamage: number;
        Lines: IKeyedLine[];
    }[];
    Lines: IKeyedLine[];
}

interface IUniqueItem {
    Type: string;
    Vanilla: string;
    Index: string;
    Enabled: boolean;
    Rarity: number;
    ItemLevel: number;
    RequiredLevel: number;
    Code: string;
    DamageArmorEnhanced: boolean;
    Lines: IKeyedLine[];
    Equipment: IUniqueEquipment;
}

export class Uniques {
    allUniques: IUniqueItem[] = [];
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
    @bindable handFilterMode: HandFilterMode = '';

    equipmentNames: Array<{ value: string | undefined; label: string }> = [];

    // Centralized, data-driven type options (filtered to present types)
    types: ReadonlyArray<IFilterOption> = type_filtering_options.slice();

    private _debouncedSearchItem!: IDebouncedFunction;
    private _debouncedUpdateUrl!: IDebouncedFunction;

    classes = character_class_options.map(opt => ({
        ...opt,
        label: t(opt.label),
    }));

    // Build options and hydrate from URL BEFORE controls render
    async binding() {
        // Fetch keyed uniques data
        try {
            const resp = await fetch('/data/keyed/uniques.json');
            this.allUniques = (await resp.json()) as IUniqueItem[];
        } catch (e) {
            console.error('Failed to load uniques:', e);
            this.allUniques = [];
        }

        // Pre-calculate searchable strings
        this.allUniques.forEach(u => {
            this._searchStrings.set(u, this.buildSearchableStringForUnique(u));
        });

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
            for (const u of this.allUniques || []) {
                const base = resolveBaseTypeName(u?.Type ?? '');
                if (base) present.add(base);
            }
            this.types = buildOptionsForPresentTypes(type_filtering_options, present).map(opt => ({
                ...opt,
                label: t(opt.label),
            }));
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
        // Equipment (exact)
        const eqParam = urlParams.get('equipment');
        if (eqParam && !isBlankOrInvalid(eqParam))
            this.selectedEquipmentName = eqParam;
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

        // Check if the weapon root code is in the values (works for aggregates and non-exact types)
        if (opt.value.includes('weapitype')) return true;

        // For exact types, we need to check their ancestors in the type graph
        return opt.value.some(typeName => {
            const chain = getTypeChain(typeName);
            return chain.includes('weapitype');
        });
    }

    @watch('selectedClass')
    @watch('hideVanilla')
    @watch('weaponSortMode')
    @watch('handFilterMode')
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
    handFilterOptions = handFilterOptions;

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
            const name = unique?.Index || '';
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
                String(unique?.Equipment?.NameKey || '') !== this.selectedEquipmentName
            ) {
                return false;
            }

            // 5. Search filter
            if (searchTokens.length > 0) {
                const hay = this._searchStrings.get(unique) || '';
                if (!matchesTokenGroups(hay, searchTokens)) {
                    return false;
                }
            }

            return true;
        });

        // Hand filter (1H / 2H):
        if (this.handFilterMode) {
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
            t(unique?.Index),
            t(unique?.Equipment?.NameKey),
        ];

        const typeIndex = unique?.Type;
        if (typeIndex) {
            parts.push(typeIndex);
            parts.push(t(typeIndex));
            const chain = getChainForTypeNameReadonly(typeIndex);
            if (chain) {
                parts.push(...chain);
                parts.push(...chain.map(c => t(c)));
            }
        }

        if (Array.isArray(unique?.Lines)) {
            unique.Lines.forEach((l) => {
                parts.push(format(l));
            });
        }

        if (Array.isArray(unique?.Equipment?.Lines)) {
            unique.Equipment.Lines.forEach((l) => {
                parts.push(format(l));
            });
        }

        if (Array.isArray(unique?.Equipment?.DamageTypes)) {
            for (const d of unique.Equipment.DamageTypes) {
                parts.push(getDamageTypeStringUtil(d.Type));
                if (Array.isArray(d.Lines)) {
                    d.Lines.forEach((l) => {
                        parts.push(format(l));
                    });
                }
            }
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
            if (unique.Equipment && unique.Equipment.NameKey) {
                uniqueEquipmentNames.add(unique.Equipment.NameKey);
            }
        });

        // Create options array
        const equipmentNameOptions: Array<{
            value: string | undefined;
            label: string;
        }> = [{ value: '', label: '-' }];
        Array.from(uniqueEquipmentNames)
            .sort((a, b) => t(a).localeCompare(t(b)))
            .forEach((key) => {
                equipmentNameOptions.push({ value: key, label: t(key) });
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
        this.handFilterMode = '';

        this.updateList();
        this.updateUrl();
    }

    // Reset only the weapon sorting mode
    resetSort() {
        this.weaponSortMode = 'none';
        this.handFilterMode = '';
    }

    toggleSort(type: string) {
        this.weaponSortMode = toggleWeaponSort(this.weaponSortMode, type);
    }

    getSortKeyFromDamageType(type: number): string | null {
        return getSortKeyFromDamageTypeUtil(type);
    }
}
