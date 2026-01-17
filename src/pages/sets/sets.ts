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
    getWeaponNonPhysDamValueFromProperties,
    getWeaponPhysDamValue,
    IUniqueItem,
    parseDamageProperty,
} from '../../utilities/damage-types';
import { debounce, IDebouncedFunction } from '../../utilities/debounce';
import {
    isVanillaItem,
    prependTypeResetOption,
    tokenizeSearch,
} from '../../utilities/filter-helpers';
import {
    getSortKeyFromDamageType as getSortKeyFromDamageTypeUtil,
    toggleWeaponSort,
    WeaponSortMode,
    weaponSortOptions,
} from '../../utilities/item-sorting';
import { isBlankOrInvalid, syncParamsToUrl } from '../../utilities/url-sanitize';
import json from '../item-jsons/sets.json';

import { ISetData } from './set-types';

export class Sets {
    sets: ISetData[] = json;
    @bindable search: string;
    @bindable selectedClass: string | undefined;
    // Selected type: base token (scalar)
    @bindable selectedType: string = '';
    @bindable selectedEquipmentName: string | undefined;
    // When true, exclude items where Vanilla === 'Y'
    @bindable hideVanilla: boolean = false;
    @bindable weaponSortMode: WeaponSortMode = 'none';

    private _debouncedSearchItem!: IDebouncedFunction;
    private _debouncedUpdateUrl!: IDebouncedFunction;

    equipmentNames: Array<{ value: string | undefined; label: string }> = [];

    // Centralized type options, narrowed to types present in data
    types: ReadonlyArray<IFilterOption> = type_filtering_options.slice();

    classes = character_class_options;

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

    weaponSortOptions = weaponSortOptions;

    // Build options and hydrate from URL BEFORE controls render
    binding(): void {
        const urlParams = new URLSearchParams(window.location.search);

        const searchParam = urlParams.get('search');
        if (searchParam && !isBlankOrInvalid(searchParam)) {
            this.search = searchParam;
        }

        const classParam = urlParams.get('selectedClass');
        if (classParam && !isBlankOrInvalid(classParam)) {
            this.selectedClass = classParam;
        }

        // Boolean param
        const hv = urlParams.get('hideVanilla');
        if (hv === 'true' || hv === '1') this.hideVanilla = true;

        // Collect base type names present in data and build options
        try {
            const present = new Set<string>();
            for (const set of (json as unknown as ISetData[]) || []) {
                for (const item of set?.SetItems || []) {
                    const base = resolveBaseTypeName(item?.Type ?? '');
                    if (base) present.add(base);
                }
            }
            this.types = buildOptionsForPresentTypes(type_filtering_options, present);
            // Prepend a uniform reset option so users can clear the selection with '-'
            this.types = prependTypeResetOption(this.types);
        } catch {
            // keep defaults on error
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

    attached(): void {
        this._debouncedSearchItem = debounce(() => this.updateList(), 350);
        this._debouncedUpdateUrl = debounce(() => this.updateUrl(), 150);
        // Prebuild Equipment options if type preselected
        if (this.selectedType) {
            this.equipmentNames = this.getSetEquipmentNames();
        }
        this.updateList();
        this.updateUrl();
    }

    // Types provided via shared preset (this.types)

    // Push current filters to URL
    private updateUrl() {
        syncParamsToUrl({
            search: this.search,
            selectedClass: this.selectedClass,
            type: this.selectedType,
            equipment: this.selectedEquipmentName,
            hideVanilla: this.hideVanilla,
        }, false);
    }

    @watch('search')
    handleSearchChanged(): void {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        }
        if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
    }

    @watch('selectedClass')
    @watch('hideVanilla')
    @watch('weaponSortMode')
    handleFilterChanged(): void {
        this.updateList();
        if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
    }

    @watch('selectedType')
    handleTypeChanged(): void {
        // Update equipment names when type changes and reset selection
        this.equipmentNames = this.getSetEquipmentNames();
        this.selectedEquipmentName = undefined;

        // Reset sorting mode when type changes to non-weapon type
        if (!this.isWeaponType) this.weaponSortMode = 'none';

        if (this._debouncedSearchItem) this._debouncedSearchItem();
        if (this._debouncedUpdateUrl) this._debouncedUpdateUrl();
    }

    @watch('selectedEquipmentName')
    handleEquipmentNameChanged(): void {
        if (this._debouncedSearchItem) this._debouncedSearchItem();
    }

    updateList(): void {
        try {
            const searchTokens = tokenizeSearch(this.search);
            const classText = this.selectedClass?.toLowerCase();

            // Build an allowed set from selected base + descendants + ancestors
            const allowedTypeSet: Set<string> | null = ((): Set<string> | null => {
                if (!this.selectedType) return null;
                const opt = this.types.find((o) => o.id === this.selectedType);
                return opt && opt.value ? new Set<string>(opt.value) : null;
            })();

            const matchesType = (set: ISetData) => {
                if (!allowedTypeSet) return true;
                return (set.SetItems ?? []).some((si) => {
                    const base = getChainForTypeNameReadonly(si?.Type ?? '')[0] || (si?.Type ?? '');
                    return allowedTypeSet.has(base);
                });
            };

            const matchesEquipment = (set: ISetData) => {
                if (!this.selectedEquipmentName) return true;
                return (set.SetItems ?? []).some(
                    (si) => si.Equipment?.Name === this.selectedEquipmentName,
                );
            };

            const matchesSearch = (set: ISetData) => {
                if (!searchTokens.length) return true;
                const hayParts: string[] = [];
                if (set.Name) hayParts.push(String(set.Name));
                const allProps = set.AllProperties ?? [
                    ...(set.FullProperties || []),
                    ...(set.PartialProperties || []),
                ];
                for (const p of allProps || [])
                    hayParts.push(String(p?.PropertyString || ''));
                for (const si of set.SetItems ?? []) {
                    hayParts.push(String(si?.Name || ''));
                    hayParts.push(String(si?.Equipment?.Name || ''));
                    for (const p of si?.Properties || [])
                        hayParts.push(String(p?.PropertyString || ''));
                    for (const s of si?.SetPropertiesString || [])
                        hayParts.push(String(s || ''));
                }
                const hay = hayParts.filter(Boolean).join(' ').toLowerCase();
                return searchTokens.some((group) =>
                    group.every((t) => hay.includes(t)),
                );
            };

            const matchesVanilla = (set: ISetData) => {
                return !this.hideVanilla || !isVanillaItem(set?.Vanilla);
            };

            const matchesClass = (set: ISetData) => {
                if (!classText) return true;
                const allProps = set.AllProperties ?? [
                    ...(set.FullProperties || []),
                    ...(set.PartialProperties || []),
                ];
                if (
                    allProps?.some((p) =>
                        p.PropertyString?.toLowerCase()?.includes(classText),
                    )
                )
                    return true;
                for (const si of set.SetItems ?? []) {
                    if (si.Name?.toLowerCase().includes(classText)) return true;
                    if (si.Equipment?.Name?.toLowerCase().includes(classText))
                        return true;
                    if (
                        si.Properties?.some((p) =>
                            p.PropertyString?.toLowerCase()?.includes(classText),
                        )
                    )
                        return true;
                    if (
                        si.SetPropertiesString?.some((s) =>
                            s?.toLowerCase()?.includes(classText),
                        )
                    )
                        return true;
                }
                return false;
            };

            // If no filters at all (including hideVanilla), show all
            // Important: do NOT early-return when hideVanilla is true, so the vanilla filter can take effect
            if (
                !this.search &&
                !this.selectedClass &&
                !this.selectedType &&
                !this.selectedEquipmentName &&
                !this.hideVanilla
            ) {
                this.sets = json;
                return;
            }

            this.sets = json.filter(
                (set) =>
                    matchesType(set) &&
                    matchesEquipment(set) &&
                    matchesSearch(set) &&
                    matchesClass(set) &&
                    matchesVanilla(set),
            );

            // Main sorting logic:
            if (this.isWeaponType && this.weaponSortMode !== 'none') {
                const isAsc = this.weaponSortMode.includes('ascending');
                const mode = this.weaponSortMode;
                this.sets = this.sets.slice().sort((a, b) => {
                    const getBestDam = (set: ISetData) => {
                        let maxV = 0;
                        for (const item of set.SetItems) {
                            let v = 0;
                            if (mode.includes('1h-phys')) v = getWeaponPhysDamValue(item as unknown as IUniqueItem, [3, 0]);
                            else if (mode.includes('2h-phys')) v = getWeaponPhysDamValue(item as unknown as IUniqueItem, 1);
                            else if (mode.includes('throw-phys')) v = getWeaponPhysDamValue(item as unknown as IUniqueItem, 2);
                            else if (mode.includes('non-phys')) v = getWeaponNonPhysDamValueFromProperties(item as unknown as IUniqueItem);
                            if (v > maxV) maxV = v;
                        }
                        return maxV;
                    };
                    const vA = getBestDam(a);
                    const vB = getBestDam(b);

                    if (vA === 0 && vB !== 0) return 1;
                    if (vA !== 0 && vB === 0) return -1;
                    return isAsc ? vA - vB : vB - vA;
                });
            }
        } catch (e) {
            // ignore
        }
    }

    getDamageTypeString = getDamageTypeStringUtil;
    parseDamageProperty = parseDamageProperty;

    // Partial set bonus count display by index 0-1 = 2, 2-3 = 3, 4-5 = 4, 6+ = 5
    getItemCount(indexPassed: number): number {
        if (indexPassed < 2) return 2;
        if (indexPassed < 4) return 3;
        if (indexPassed < 6) return 4;
        return 5;
    }

    // Build equipment names options for the selected type
    getSetEquipmentNames(): Array<{
        value: string | undefined;
        label: string;
    }> {
        const names = new Set<string>();
        // Allowed set from selected base + descendants + ancestors
        const allowed: Set<string> | null = ((): Set<string> | null => {
            if (!this.selectedType) return null;
            const opt = this.types.find((o) => o.id === this.selectedType);
            return opt && opt.value ? new Set<string>(opt.value) : null;
        })();
        for (const set of (json as unknown as ISetData[]) || []) {
            for (const si of set.SetItems ?? []) {
                if (allowed) {
                    const base =
                        getChainForTypeNameReadonly(si?.Type ?? '')[0] || (si?.Type ?? '');
                    if (!allowed.has(base)) continue;
                }
                const name = si.Equipment?.Name;
                if (name) names.add(name);
            }
        }
        const options: Array<{ value: string | undefined; label: string }> = [
            { value: '', label: '-' },
        ];
        Array.from(names)
            .sort()
            .forEach((n) => options.push({ value: n, label: n }));
        return options;
    }

    // Reset all filters to defaults and refresh
    resetFilters(): void {
        this.search = '';
        this.selectedClass = undefined;
        this.selectedType = '';
        this.selectedEquipmentName = undefined;
        this.hideVanilla = false;
        this.equipmentNames = [{ value: '', label: '-' }];
        this.weaponSortMode = 'none';

        this.updateList();
        this.updateUrl();
    }

    // Reset only the weapon sorting mode
    resetSort() {
        this.weaponSortMode = 'none';
    }

    toggleSort(type: string) {
        this.weaponSortMode = toggleWeaponSort(this.weaponSortMode, type);
    }

    getSortKeyFromDamageType(type: number): string | null {
        return getSortKeyFromDamageTypeUtil(type);
    }
}
