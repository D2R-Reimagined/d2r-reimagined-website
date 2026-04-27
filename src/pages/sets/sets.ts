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
    getWeaponNonPhysDamValue,
    getWeaponPhysDamValue,
    IUniqueItem,
} from '../../utilities/damage-types';
import { debounce, IDebouncedFunction } from '../../utilities/debounce';
import {
    isVanillaItem,
    matchesTokenGroups,
    prependTypeResetOption,
    tokenizeSearch,
} from '../../utilities/filter-helpers';
import {
    getSortKeyFromDamageType as getSortKeyFromDamageTypeUtil,
    HandFilterMode,
    handFilterOptions,
    passesHandFilter,
    toggleWeaponSort,
    WeaponSortMode,
    weaponSortOptions,
} from '../../utilities/item-sorting';
import { format, t } from '../../utilities/translation-store.js';
import { isBlankOrInvalid, syncParamsToUrl } from '../../utilities/url-sanitize';

import { ISetData } from './set-types.js';

export class Sets {
    allSets: ISetData[] = [];
    sets: ISetData[] = [];
    private _searchStrings = new Map<ISetData, string>();
    @bindable search: string;
    @bindable selectedClass: string | undefined;
    // Selected type: base token (scalar)
    @bindable selectedType: string = '';
    @bindable selectedEquipmentName: string | undefined;
    // When true, exclude items where Vanilla === 'Y'
    @bindable hideVanilla: boolean = false;
    @bindable weaponSortMode: WeaponSortMode = 'none';
    @bindable handFilterMode: HandFilterMode = '';

    private _debouncedSearchItem!: IDebouncedFunction;
    private _debouncedUpdateUrl!: IDebouncedFunction;

    equipmentNames: Array<{ value: string | undefined; label: string }> = [];

    // Centralized type options, narrowed to types present in data
    types: ReadonlyArray<IFilterOption> = type_filtering_options.slice();

    classes = character_class_options.map(opt => ({
        ...opt,
        label: t(opt.label),
    }));

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

    weaponSortOptions = weaponSortOptions;
    handFilterOptions = handFilterOptions;

    // Build options and hydrate from URL BEFORE controls render
    async binding() {
        // Fetch keyed sets data
        try {
            const resp = await fetch('/data/keyed/sets.json');
            this.allSets = (await resp.json()) as ISetData[];
        } catch (e) {
            console.error('Failed to load sets:', e);
            this.allSets = [];
        }

        const urlParams = new URLSearchParams(window.location.search);

        // Pre-calculate searchable strings
        this.allSets.forEach(s => {
            this._searchStrings.set(s, this.buildSearchableStringForSet(s));
        });

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
            for (const set of this.allSets) {
                for (const item of set?.SetItems || []) {
                    const base = resolveBaseTypeName(item?.Type ?? '');
                    if (base) present.add(base);
                }
            }
            this.types = buildOptionsForPresentTypes(type_filtering_options, present).map(opt => ({
                ...opt,
                label: t(opt.label),
            }));
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

    detached() {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem.cancel();
        }
        if (this._debouncedUpdateUrl) {
            this._debouncedUpdateUrl.cancel();
        }
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
    @watch('handFilterMode')
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
            let allowedTypeSet: Set<string> | undefined;
            if (this.selectedType) {
                const opt = this.types.find((o) => o.id === this.selectedType);
                if (opt && opt.value) allowedTypeSet = new Set<string>(opt.value);
            }

            // Update equipment names if needed
            if (
                this.selectedType &&
        (!this.equipmentNames || this.equipmentNames.length <= 1)
            ) {
                this.equipmentNames = this.getSetEquipmentNames();
            }

            this.sets = this.allSets.filter((set: ISetData) => {
                // 1. Vanilla filter
                if (this.hideVanilla && isVanillaItem(set?.Vanilla)) return false;

                // 2. Type filter
                if (allowedTypeSet) {
                    const hasMatch = (set.SetItems ?? []).some((si) => {
                        const base = getChainForTypeNameReadonly(si?.Type ?? '')[0] || (si?.Type ?? '');
                        return allowedTypeSet.has(base);
                    });
                    if (!hasMatch) return false;
                }

                // 3. Equipment name filter
                if (this.selectedEquipmentName) {
                    const hasMatch = (set.SetItems ?? []).some(
                        (si) => si.Equipment?.NameKey === this.selectedEquipmentName,
                    );
                    if (!hasMatch) return false;
                }

                const hay = this._searchStrings.get(set) || '';

                // 4. Class filter (Check if the class name appears in any property or item name)
                if (classText && !hay.includes(classText)) return false;

                // 5. Search filter
                if (searchTokens.length > 0) {
                    if (!matchesTokenGroups(hay, searchTokens)) {
                        return false;
                    }
                }

                return true;
            });

            // Hand filter (1H / 2H):
            if (this.handFilterMode) {
                this.sets = this.sets.filter((set: ISetData) =>
                    (set.SetItems ?? []).some((si) =>
                        passesHandFilter(si?.Equipment?.DamageTypes, this.handFilterMode),
                    ),
                );
            }

            // Main sorting logic — precompute sort keys to avoid per-comparison work:
            if (this.isWeaponType && this.weaponSortMode !== 'none') {
                const isAsc = this.weaponSortMode.includes('ascending');
                const mode = this.weaponSortMode;
                const getBestDam = (set: ISetData): number => {
                    let maxV = 0;
                    for (const item of set.SetItems || []) {
                        let v = 0;
                        if (mode.includes('1h-phys'))
                            v = getWeaponPhysDamValue(item as unknown as IUniqueItem, [3, 0]);
                        else if (mode.includes('2h-phys'))
                            v = getWeaponPhysDamValue(item as unknown as IUniqueItem, 1);
                        else if (mode.includes('throw-phys'))
                            v = getWeaponPhysDamValue(item as unknown as IUniqueItem, 2);
                        else if (mode.includes('non-phys'))
                            v = getWeaponNonPhysDamValue(item as unknown as IUniqueItem);
                        if (v > maxV) maxV = v;
                    }
                    return maxV;
                };
                const decorated = this.sets.map((set) => ({ set, val: getBestDam(set) }));
                decorated.sort((a, b) => {
                    if (a.val === 0 && b.val !== 0) return 1;
                    if (a.val !== 0 && b.val === 0) return -1;
                    return isAsc ? a.val - b.val : b.val - a.val;
                });
                this.sets = decorated.map((d) => d.set);
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            this.sets = this.allSets;
        }
    }

    private buildSearchableStringForSet(set: ISetData): string {
        const parts: string[] = [];
        if (set.Index) parts.push(t(set.Index));
        
        if (Array.isArray(set.PartialBonuses)) {
            for (const l of set.PartialBonuses) {
                parts.push(format(l));
            }
        }
        if (Array.isArray(set.FullBonuses)) {
            for (const l of set.FullBonuses) {
                parts.push(format(l));
            }
        }

        for (const si of set.SetItems ?? []) {
            parts.push(t(si?.Index));
            parts.push(t(si?.Equipment?.NameKey));

            const typeIndex = si?.Type;
            if (typeIndex) {
                parts.push(typeIndex);
                parts.push(t(typeIndex));
                const chain = getChainForTypeNameReadonly(typeIndex);
                if (chain) {
                    parts.push(...chain);
                    parts.push(...chain.map(c => t(c)));
                }
            }

            if (Array.isArray(si?.Lines)) {
                for (const l of si.Lines) {
                    parts.push(format(l));
                }
            }
            if (Array.isArray(si?.SetBonuses)) {
                for (const group of si.SetBonuses) {
                    for (const l of group) {
                        parts.push(format(l));
                    }
                }
            }
            if (Array.isArray(si?.Equipment?.Lines)) {
                for (const l of si.Equipment.Lines) {
                    parts.push(format(l));
                }
            }

            if (Array.isArray(si?.Equipment?.DamageTypes)) {
                for (const d of si.Equipment.DamageTypes) {
                    parts.push(getDamageTypeStringUtil(d.Type));
                    if (Array.isArray(d.Lines)) {
                        for (const l of d.Lines) {
                            parts.push(format(l));
                        }
                    }
                }
            }
        }
        return parts.filter(Boolean).join(' ').toLowerCase();
    }

    getDamageTypeString = getDamageTypeStringUtil;

    formatGroupName(name: string) {
        return name.replace(/-/g, ' ').replace(/([a-z])([0-9])/g, '$1 $2');
    }

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
        for (const set of this.allSets) {
            for (const si of set.SetItems ?? []) {
                if (allowed) {
                    const base =
                        getChainForTypeNameReadonly(si?.Type ?? '')[0] || (si?.Type ?? '');
                    if (!allowed.has(base)) continue;
                }
                const key = si.Equipment?.NameKey;
                if (key) names.add(key);
            }
        }
        const options: Array<{ value: string | undefined; label: string }> = [
            { value: '', label: '-' },
        ];
        Array.from(names)
            .sort((a, b) => t(a).localeCompare(t(b)))
            .forEach((key) => options.push({ value: key, label: t(key) }));
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
