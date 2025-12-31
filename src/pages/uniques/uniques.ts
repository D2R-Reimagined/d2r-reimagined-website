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

export class Uniques {
    uniques: IUniqueItem[] = json as unknown as IUniqueItem[];

    @bindable search: string;
    @bindable selectedClass: string | undefined;
    // When true, hide items where Vanilla === 'Y'
    @bindable hideVanilla: boolean = false;
    // Selected type value from dropdown: base token (scalar)
    @bindable selectedType: string = '';
    @bindable selectedEquipmentName: string | undefined;

    equipmentNames: Array<{ value: string | undefined; label: string }> = [];

    // Centralized, data-driven type options (filtered to present types)
    types: ReadonlyArray<IFilterOption> = type_filtering_options.slice();

    private _debouncedSearchItem!: IDebouncedFunction;
    private _debouncedUpdateUrl!: IDebouncedFunction;

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

    @watch('selectedClass')
    @watch('hideVanilla')
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
            return searchTokens.some((group) =>
                group.every((t) => hay.includes(t)),
            );
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
}
