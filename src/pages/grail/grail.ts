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
    type SearchToken,
    tokenizeSearch,
} from '../../utilities/filter-helpers';
import {
    handFilterOptions,
    getSortKeyFromDamageType as getSortKeyFromDamageTypeUtil,
    HandFilterMode,
    passesHandFilter,
    sortItemsByWeaponDamage,
    toggleWeaponSort,
    WeaponSortMode,
    weaponSortOptions,
} from '../../utilities/item-sorting';
import { isBlankOrInvalid, syncParamsToUrl } from '../../utilities/url-sanitize';
import runewordsJson from '../item-jsons/runewords.json';
import setsJson from '../item-jsons/sets.json';
import uniquesJson from '../item-jsons/uniques.json';
import type { ISetData, ISetItem } from '../sets/set-types';

interface ISelectOption {
    id: string;
    name: string;
}

interface IProperty {
    PropertyString?: string;
    'group-properties'?: Record<string, IProperty[]>;
    pickmode?: number;
    Index?: number;
    Chance?: number;
    ModChance?: number;
}

interface IEquipment {
    Name?: string;
    Type?: string;
    ArmorString?: string;
    DamageTypes?: IDamageType[];
    RequiredStrength?: string;
    RequiredDexterity?: string;
    Durability?: number;
    RequiredClass?: string;
}

interface IUniqueItem {
    Index?: string;
    Name: string;
    Class?: string;
    Rarity?: string;
    RequiredLevel?: number;
    Type?: string;
    Vanilla?: string | number | boolean;
    Equipment: IEquipment;
    Properties?: IProperty[];
}

// Minimal runeword types (only fields used on the page)
interface IRunewordProperty {
    PropertyString?: string;
    'group-properties'?: Record<string, IRunewordProperty[]>;
    pickmode?: number;
    Index?: number;
    Chance?: number;
    ModChance?: number;
}

interface IRunewordType {
    Name: string;
}

interface IRunewordRune {
    Name: string;
}

interface IRunewordData {
    Name: string;
    Types?: IRunewordType[];
    Runes?: IRunewordRune[];
    Properties?: IRunewordProperty[];
    Vanilla?: string | number | boolean;
}

export class Grail {
    // Data sources
    uniques: IUniqueItem[] = uniquesJson as unknown as IUniqueItem[];
    filteredUniques: IUniqueItem[] = [];

    allSetItems: ISetItem[] = [];
    filteredSetItems: ISetItem[] = [];

    runewords: IRunewordData[] = runewordsJson as unknown as IRunewordData[];
    filteredRunewords: IRunewordData[] = [];

    classes = character_class_options;

    equipmentNames: ISelectOption[] = [{ id: '', name: '-' }];

    // Category handling
    categories = [
        { value: 'uniques', label: 'Uniques' },
        { value: 'sets', label: 'Sets' },
        { value: 'runewords', label: 'Runewords' },
    ];
    @bindable selectedCategory: 'uniques' | 'sets' | 'runewords' = 'uniques';

    @bindable search: string;
    @bindable selectedClass: string | undefined;
    // Centralized type filter (UI binds to the base token; internal uses array of base+parents)
    @bindable selectedTypeBase: string = '';
    @bindable selectedType: string[] | undefined;
    @bindable selectedEquipmentName: string | undefined;
    // When true, hide items where Vanilla === 'Y'
    @bindable hideVanilla: boolean = false;
    @bindable weaponSortMode: WeaponSortMode = 'none';
    @bindable handFilterMode: HandFilterMode = '';

    // Helper to check if current type is weapon
    get isWeaponType(): boolean {
        if (!this.selectedTypeBase) return false;
        const opt = this.types.find((o) => o.id === this.selectedTypeBase);
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
    handFilterOptions = handFilterOptions;

    // Centralized options list (rebuilt per category based on data present)
    types: ReadonlyArray<IFilterOption> = type_filtering_options.slice();
    // Runewords uses parent/child inclusion rules; leave off explicit toggle for Grail (defaults to false)
    @bindable exclusiveType: boolean = false;

    // Hide Found: unchecked by default; persisted as ?hideFound=true only when checked.
    @bindable showFoundItems: boolean = false;

    // Found maps per category
    @bindable foundUniques: Record<string, boolean> = {};
    @bindable foundSets: Record<string, boolean> = {};
    @bindable foundRunewords: Record<string, boolean> = {};
    foundCount: number = 0;
    totalCount: number = 0;
    displayedCount: number = 0;
    // For Sets category: keep original item-based display alongside set-completion line
    setItemFoundCount: number = 0; // number of found set ITEMS
    setItemTotalCount: number = 0; // total set ITEMS
    setItemsDisplayedCount: number = 0; // displayed set ITEMS under current filters

    // Debouncers to keep UI interactions (like checkbox clicks) snappy
    private _debouncedSaveFound!: IDebouncedFunction;
    private _debouncedApplyFilters!: IDebouncedFunction;

    // Precomputed searchable strings for fast, cross-field search
    private _uniqueSearchString = new Map<string, string>();
    private _setItemSearchString = new Map<string, string>();
    private _runewordSearchString = new Map<string, string>();

    // Cache to avoid repeated chain lookups for runewords
    private _runewordTypeBases = new Map<IRunewordData, string[]>();
    // Cache for which base types have descendants in the dataset
    private _baseHasDescendantsInRunewords = new Set<string>();

    binding(): void {
        // Flatten sets to item list for filtering
        try {
            const sets = setsJson;
            this.allSetItems = [];
            for (const s of sets) {
                for (const it of s.SetItems || []) {
                    this.allSetItems.push(it);
                }
            }
        } catch {
            this.allSetItems = [];
        }

        // Load found-state from localStorage
        this.loadFoundItems();

        // Hydrate grail-scoped URL state if present
        this.readUrlStateSafely();

        // Build type options based on selected category and data present
        this.rebuildTypeOptions();

        // Initialize an internal selectedType array from selectedTypeBase and available options
        if (this.selectedTypeBase) {
            const opt = this.types.find((o) => o.id === this.selectedTypeBase);
            this.selectedType = opt?.value ?? [this.selectedTypeBase];
        } else {
            this.selectedType = undefined;
        }

        // Prebuild Equipment options if a type was restored (non-runewords)
        this.equipmentNames = [{ id: '', name: '-' }];
        if (
            this.selectedType &&
            this.selectedType.length > 0 &&
            this.selectedCategory !== 'runewords'
        ) {
            try {
                const set = new Set<string>();
                if (this.selectedCategory === 'uniques') {
                    const selectedBases = new Set<string>(this.selectedType);
                    for (const u of this.uniques) {
                        const base =
                            getChainForTypeNameReadonly(u?.Type ?? '')[0] || (u?.Type ?? '');
                        if (selectedBases.has(base) && u?.Equipment?.Name)
                            set.add(u.Equipment.Name);
                    }
                } else if (this.selectedCategory === 'sets') {
                    const selectedBases = new Set<string>(this.selectedType);
                    for (const it of this.allSetItems) {
                        const base =
                            getChainForTypeNameReadonly(it?.Type ?? '')[0] || (it?.Type ?? '');
                        if (selectedBases.has(base) && it?.Equipment?.Name)
                            set.add(it.Equipment.Name);
                    }
                }
                for (const name of set) this.equipmentNames.push({ id: name, name });
            } catch {
                // ignore errors, keep default "All Equipment"
            }
        }

        // Precompute search tokens for all categories (once per load)
        this.buildAllSearchableStrings();

        // Cache total set items
        this.setItemTotalCount = this.allSetItems.length;

        // Prepare debounced actions to avoid long click handlers
        this._debouncedSaveFound = debounce(() => this.saveFoundItems(), 200);
        // Debounced filter application (updates list + URL together)
        this._debouncedApplyFilters = debounce(() => {
            this.updateList();
            this.updateUrl();
        }, 350);

        // Initial filter + counters
        this.updateList();
    }

    // Reflect the current state back into the URL
    attached(): void {
        // Push clean state into URL on the first load (no external hydration)
        this.updateUrl();
    }

    // When navigating away, clear Grail-related params from the URL so returning starts empty
    detached(): void {
        if (this._debouncedApplyFilters) this._debouncedApplyFilters.cancel();
        if (this._debouncedSaveFound) this._debouncedSaveFound.cancel();
        try {
            const url = new URL(window.location.href);
            // Only remove Grail-scoped parameters; do not touch global filters used by other pages
            url.searchParams.delete('g-category');
            url.searchParams.delete('g-selectedClass');
            url.searchParams.delete('g-type');
            url.searchParams.delete('g-equipment');
            url.searchParams.delete('g-search');
            url.searchParams.delete('g-hideFound');
            url.searchParams.delete('g-hideVanilla');
            window.history.replaceState({}, '', url.toString());
        } catch {
            // ignore
        }
    }

    // Defensive URL parse (Grail-scoped params only)
    private readUrlStateSafely(): void {
        try {
            const urlParams = new URLSearchParams(window.location.search);

            // Category (grail-scoped)
            const cat = (urlParams.get('g-category') || '').toLowerCase();
            if (cat === 'uniques' || cat === 'sets' || cat === 'runewords') {
                this.selectedCategory = cat;
            }

            // Class
            const cls = urlParams.get('g-selectedClass');
            if (cls && !isBlankOrInvalid(cls)) this.selectedClass = cls;

            // Type (serialized as base token only)
            const t = urlParams.get('g-type');
            if (t && !isBlankOrInvalid(t)) {
                this.selectedTypeBase = t;
            } else {
                this.selectedTypeBase = '';
            }

            // Equipment name (exact match token)
            const eq = urlParams.get('g-equipment');
            if (eq && !isBlankOrInvalid(eq)) this.selectedEquipmentName = eq;

            // Search text
            const s = urlParams.get('g-search');
            if (s && !isBlankOrInvalid(s)) this.search = s;

            // Hide Found: default false when param is absent
            const hf = urlParams.get('g-hideFound');
            this.showFoundItems = hf === 'true' || hf === '1';

            // Boolean: g-hideVanilla=true
            const hv = urlParams.get('g-hideVanilla');
            if (hv === 'true' || hv === '1') this.hideVanilla = true;
        } catch {
            // ignore URL parse issues
        }
    }

    // Update browser URL with current selection and filters (no reload)
    private updateUrl(): void {
        syncParamsToUrl({
            'g-category': this.selectedCategory,
            'g-selectedClass': this.selectedClass,
            'g-type': this.selectedTypeBase,
            'g-equipment': this.selectedEquipmentName,
            'g-search': this.search,
            'g-hideFound': this.showFoundItems,
            'g-hideVanilla': this.hideVanilla,
        }, false);
    }

    private rebuildTypeOptions(): void {
        const present = new Set<string>();
        try {
            if (this.selectedCategory === 'uniques') {
                for (const u of this.uniques) {
                    const base = resolveBaseTypeName(u?.Type ?? '');
                    if (base) present.add(base);
                }
            } else if (this.selectedCategory === 'sets') {
                for (const s of setsJson as unknown as ISetData[]) {
                    for (const it of s?.SetItems ?? []) {
                        const base = resolveBaseTypeName(it?.Type ?? '');
                        if (base) present.add(base);
                    }
                }
            } else if (this.selectedCategory === 'runewords') {
                for (const rw of this.runewords) {
                    const types = Array.isArray(rw?.Types) ? rw.Types : [];
                    for (const t of types) {
                        const base = resolveBaseTypeName(t?.Name ?? '');
                        if (base) present.add(base);
                    }
                }
            }
        } catch {
            // keep default preset on error
        }
        this.types = buildOptionsForPresentTypes(type_filtering_options, present);
        // Prepend a reset option so users can clear the selection with '-'
        this.types = prependTypeResetOption(this.types);
    }

    selectedCategoryChanged(): void {
        // Reset filters on category change
        this.selectedClass = undefined;
        this.selectedTypeBase = '';
        this.selectedType = undefined;
        this.selectedEquipmentName = undefined;
        this.equipmentNames = [{ id: '', name: '-' }];
        // Rebuild options per category and clear type selection
        this.rebuildTypeOptions();
        this.updateList();
        this.updateTotalCount();
        this.updateUrl();
    }

    selectedClassChanged(): void {
        if (this._debouncedApplyFilters) this._debouncedApplyFilters();
    }

    @watch('selectedType')
    @watch('weaponSortMode')
    @watch('handFilterMode')
    selectedTypeChanged(): void {
        // Reset equipment selection
        this.selectedEquipmentName = undefined;
        this.equipmentNames = [{ id: '', name: '-' }];

        if (!this.selectedType || this.selectedType.length === 0) {
            this.updateList();
            this.updateUrl();
            return;
        }

        // Extract equipment names for the selected type (not applicable to runewords)
        if (this.selectedCategory !== 'runewords') {
            const set = new Set<string>();
            const selectedBases = new Set<string>(this.selectedType);
            if (this.selectedCategory === 'uniques') {
                for (const u of this.uniques) {
                    const base = getChainForTypeNameReadonly(u?.Type ?? '')[0] || (u?.Type ?? '');
                    if (selectedBases.has(base) && u?.Equipment?.Name)
                        set.add(u.Equipment.Name);
                }
            } else if (this.selectedCategory === 'sets') {
                for (const it of this.allSetItems) {
                    const base =
                        getChainForTypeNameReadonly(it?.Type ?? '')[0] || (it?.Type ?? '');
                    if (selectedBases.has(base) && it?.Equipment?.Name)
                        set.add(it.Equipment.Name);
                }
            }
            for (const name of set) this.equipmentNames.push({ id: name, name });
        }

        this.updateList();
        this.updateUrl();
    }

    searchChanged(): void {
        if (this._debouncedApplyFilters) this._debouncedApplyFilters();
    }

    showFoundItemsChanged(): void {
        if (this._debouncedApplyFilters) this._debouncedApplyFilters();
    }

    hideVanillaChanged(): void {
        if (this._debouncedApplyFilters) this._debouncedApplyFilters();
    }

    selectedTypeBaseChanged(): void {
        // Sync internal array model and dependent equipment options
        if (this.selectedTypeBase && this.selectedTypeBase !== '') {
            const opt = this.types.find((o) => o.id === this.selectedTypeBase);
            this.selectedType = opt?.value ?? [this.selectedTypeBase];
        } else {
            this.selectedType = undefined;
            this.selectedEquipmentName = undefined;
        }
        // Rebuild equipment names for Uniques/Sets when a type is selected
        this.equipmentNames = [{ id: '', name: '-' }];
        if (
            this.selectedType &&
            this.selectedType.length > 0 &&
            this.selectedCategory !== 'runewords'
        ) {
            try {
                const set = new Set<string>();
                if (this.selectedCategory === 'uniques') {
                    const selectedBases = new Set<string>(this.selectedType);
                    for (const u of this.uniques) {
                        const base =
                            getChainForTypeNameReadonly(u?.Type ?? '')[0] || (u?.Type ?? '');
                        if (selectedBases.has(base) && u?.Equipment?.Name)
                            set.add(u.Equipment.Name);
                    }
                } else if (this.selectedCategory === 'sets') {
                    const selectedBases = new Set<string>(this.selectedType);
                    for (const it of this.allSetItems) {
                        const base =
                            getChainForTypeNameReadonly(it?.Type ?? '')[0] || (it?.Type ?? '');
                        if (selectedBases.has(base) && it?.Equipment?.Name)
                            set.add(it.Equipment.Name);
                    }
                }
                for (const name of set) this.equipmentNames.push({ id: name, name });
            } catch {
                /* ignore */
            }
        }

        // Reset sorting mode when type changes to non-weapon type
        if (!this.isWeaponType) this.weaponSortMode = 'none';

        if (this._debouncedApplyFilters) this._debouncedApplyFilters();
    }

    selectedEquipmentNameChanged(): void {
        if (this._debouncedApplyFilters) this._debouncedApplyFilters();
    }

    // Reset only the filter controls (not found-state or progress)
    resetFilters(): void {
        this.search = '';
        this.selectedClass = undefined;
        // Clear type and dependent equipment
        this.selectedTypeBase = '';
        this.selectedType = undefined;
        this.selectedEquipmentName = undefined;
        this.equipmentNames = [{ id: '', name: '-' }];
        // Visibility toggles
        this.showFoundItems = false;
        this.hideVanilla = false;
        this.weaponSortMode = 'none';
        this.handFilterMode = '';

        // Rebuild options list for the current category and refresh
        this.rebuildTypeOptions();
        this.updateList();
        this.updateTotalCount();
        this.updateUrl();
    }

    // Reset only the weapon sorting mode
    resetSort() {
        this.weaponSortMode = 'none';
        this.handFilterMode = '';
        if (this._debouncedApplyFilters) this._debouncedApplyFilters();
    }

    toggleSort(type: string) {
        this.weaponSortMode = toggleWeaponSort(this.weaponSortMode, type);
        if (this._debouncedApplyFilters) this._debouncedApplyFilters();
    }

    getSortKeyFromDamageType(type: number): string | null {
        return getSortKeyFromDamageTypeUtil(type);
    }

    updateList() {
        // Filter per category
        const searchTokens = tokenizeSearch(this.search);

        const selectedTypeSet =
            this.selectedType && this.selectedType.length > 0
                ? new Set<string>(this.selectedType)
                : null;

        if (this.selectedCategory === 'uniques') {
            const selectedClassLower = this.selectedClass ? String(this.selectedClass).toLowerCase() : '';
            const hasSearch = searchTokens.length > 0;
            const checkFound = this.showFoundItems;
            const checkVanilla = this.hideVanilla;

            const result = this.uniques.filter((unique) => {
                // Cheap checks first
                if (String(unique?.Name || '').toLowerCase().includes('grabber')) return false;
                if (checkVanilla && isVanillaItem(unique?.Vanilla)) return false;

                if (selectedClassLower) {
                    const req = String(unique?.Equipment?.RequiredClass || '').toLowerCase();
                    if (!req.includes(selectedClassLower)) return false;
                }
                if (selectedTypeSet) {
                    const base = getChainForTypeNameReadonly(unique?.Type ?? '')[0] || (unique?.Type ?? '');
                    if (!selectedTypeSet.has(base)) return false;
                }
                if (this.selectedEquipmentName &&
                    String(unique?.Equipment?.Name || '') !== this.selectedEquipmentName) return false;

                const key = this.getUniqueKey(unique);
                if (checkFound && this.foundUniques[key]) return false;

                // Expensive search check last
                if (hasSearch && !this.tokensPartiallyMatch(this._uniqueSearchString.get(key), searchTokens)) return false;

                return true;
            });
            this.filteredUniques = result;
            // Hand filter (1H / 2H):
            if (this.handFilterMode) {
                this.filteredUniques = this.filteredUniques.filter((u) =>
                    passesHandFilter(u?.Equipment?.DamageTypes, this.handFilterMode),
                );
            }
            if (this.isWeaponType && this.weaponSortMode !== 'none') {
                this.filteredUniques = sortItemsByWeaponDamage(this.filteredUniques, this.weaponSortMode);
            }
            this.displayedCount = this.filteredUniques.length;
        } else if (this.selectedCategory === 'sets') {
            const selectedClassLower = this.selectedClass ? String(this.selectedClass).toLowerCase() : '';
            const hasSearch = searchTokens.length > 0;
            const checkFound = this.showFoundItems;
            const checkVanilla = this.hideVanilla;

            const result = this.allSetItems.filter((item) => {
                if (checkVanilla && isVanillaItem(item?.Vanilla)) return false;

                if (selectedClassLower) {
                    const req = String(item?.Equipment?.RequiredClass || '').toLowerCase();
                    if (!req.includes(selectedClassLower)) return false;
                }
                if (selectedTypeSet) {
                    const base = getChainForTypeNameReadonly(item?.Type ?? '')[0] || (item?.Type ?? '');
                    if (!selectedTypeSet.has(base)) return false;
                }
                if (this.selectedEquipmentName &&
                    String(item?.Equipment?.Name || '') !== this.selectedEquipmentName) return false;

                const key = this.getSetItemKey(item);
                if (checkFound && this.foundSets[key]) return false;

                if (hasSearch && !this.tokensPartiallyMatch(this._setItemSearchString.get(key), searchTokens)) return false;

                return true;
            });
            this.filteredSetItems = result;
            // Hand filter (1H / 2H):
            if (this.handFilterMode) {
                this.filteredSetItems = this.filteredSetItems.filter((si) =>
                    passesHandFilter(si?.Equipment?.DamageTypes, this.handFilterMode),
                );
            }
            if (this.isWeaponType && this.weaponSortMode !== 'none') {
                this.filteredSetItems = sortItemsByWeaponDamage(this.filteredSetItems, this.weaponSortMode);
            }
            // Items displayed (original display)
            this.setItemsDisplayedCount = this.filteredSetItems.length;
            // Count unique sets among displayed items
            const displayedSets = new Set<string>();
            for (const it of this.filteredSetItems) {
                if (it?.Set) displayedSets.add(String(it.Set));
            }
            this.displayedCount = displayedSets.size;
        } else if (this.selectedCategory === 'runewords') {
            let list: IRunewordData[] = this.runewords;

            // Type filtering modeled after the Runewords page
            if (Array.isArray(this.selectedType) && this.selectedType.length > 0) {
                const selectedBase = resolveBaseTypeName(this.selectedType[0] ?? '');
                if (selectedBase) {
                    const selectedChain = getChainForTypeNameReadonly(selectedBase);
                    const selectedChainSet = new Set<string>(selectedChain);
                    const hasDescendantInDataset = this._baseHasDescendantsInRunewords.has(selectedBase);

                    list = list.filter((rw: IRunewordData) => {
                        const bases = this._runewordTypeBases.get(rw) || [];
                        for (const itemBase of bases) {
                            if (this.exclusiveType) {
                                if (itemBase === selectedBase) return true;
                            } else if (hasDescendantInDataset) {
                                // Full semantics with descendant matching: 
                                // if we have descendants, we check the item type's full chain.
                                // We can use the original logic for this case as it's less frequent
                                const types = rw.Types || [];
                                for (const t of types) {
                                    const chain = getChainForTypeNameReadonly(t?.Name ?? '');
                                    if (chain.includes(selectedBase)) return true;
                                }
                            } else {
                                if (selectedChainSet.has(itemBase)) return true;
                            }
                        }
                        return false;
                    });
                }
            }

            const result = list.filter((rw: IRunewordData) => {
                const okVanilla = !this.hideVanilla || !isVanillaItem(rw?.Vanilla);
                const okSearch = this.tokensPartiallyMatch(
                    this._runewordSearchString.get(this.getRunewordKey(rw)),
                    searchTokens,
                );
                const key = this.getRunewordKey(rw);
                const okFound = !this.showFoundItems || !this.foundRunewords[key];
                return okVanilla && okSearch && okFound;
            });
            this.filteredRunewords = result;
            this.displayedCount = this.filteredRunewords.length;
        }

        // Refresh counters
        this.updateFoundCount();
        this.updateTotalCount();
        this.updateSetCounters();
    }

    //Searchable string helpers
    private buildSearchableString(
        values: readonly (string | undefined | null)[],
    ): string {
        return values
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
    }

    private searchStringFromTypeChain(
        typeName: string | undefined | null,
    ): string {
        const chain = getChainForTypeNameReadonly(typeName ? String(typeName) : '');
        return this.buildSearchableString(chain);
    }

    private buildSearchableStringForUnique(u: IUniqueItem): string {
        const parts: Array<string | undefined | null> = [
            u?.Name,
            u?.Equipment?.Name,
            u?.Equipment?.RequiredClass,
        ];
        // Properties
        if (Array.isArray(u?.Properties)) {
            for (const p of u.Properties) {
                if (p?.PropertyString) parts.push(String(p.PropertyString));
                if (p['group-properties']) {
                    Object.values(p['group-properties']).forEach((pool) => {
                        pool.forEach((affix) => {
                            if (affix.PropertyString) parts.push(String(affix.PropertyString));
                        });
                    });
                }
            }
        }
        // Damage lines
        if (Array.isArray(u?.Equipment?.DamageTypes)) {
            for (const d of u.Equipment.DamageTypes) {
                parts.push(getDamageTypeStringUtil(d.Type));
                if (d.DamageString) parts.push(d.DamageString);
            }
        }
        // Type chain
        parts.push(this.searchStringFromTypeChain(u?.Type));
        return this.buildSearchableString(parts);
    }

    private buildSearchableStringForSetItem(it: ISetItem): string {
        const parts: Array<string | undefined | null> = [
            it?.Name,
            it?.Set,
            it?.Equipment?.Name,
        ];
        if (Array.isArray(it?.Properties)) {
            for (const p of it.Properties) {
                if (p?.PropertyString) parts.push(String(p.PropertyString));
                if (p['group-properties']) {
                    Object.values(p['group-properties']).forEach((pool) => {
                        pool.forEach((affix) => {
                            if (affix.PropertyString) parts.push(String(affix.PropertyString));
                        });
                    });
                }
            }
        }
        if (Array.isArray(it?.SetPropertiesString)) {
            for (const s of it.SetPropertiesString) {
                if (s) parts.push(String(s));
            }
        }
        // Damage lines
        if (Array.isArray(it?.Equipment?.DamageTypes)) {
            for (const d of it.Equipment.DamageTypes) {
                parts.push(getDamageTypeStringUtil(d.Type));
                if (d.DamageString) parts.push(d.DamageString);
            }
        }
        parts.push(this.searchStringFromTypeChain(it?.Type));
        return this.buildSearchableString(parts);
    }

    private buildSearchableStringForRuneword(rw: IRunewordData): string {
        const parts: Array<string | undefined | null> = [rw?.Name];
        if (Array.isArray(rw?.Properties)) {
            for (const p of rw.Properties) {
                if (p?.PropertyString) parts.push(String(p.PropertyString));
                if (p['group-properties']) {
                    Object.values(p['group-properties']).forEach((pool) => {
                        pool.forEach((affix) => {
                            if (affix.PropertyString) parts.push(String(affix.PropertyString));
                        });
                    });
                }
            }
        }
        if (Array.isArray(rw?.Types)) {
            for (const t of rw.Types) {
                const name = t?.Name != null ? String(t.Name) : '';
                parts.push(name);
                parts.push(this.searchStringFromTypeChain(name));
            }
        }
        if (Array.isArray(rw?.Runes)) {
            for (const r of rw.Runes) {
                if (r?.Name) parts.push(String(r.Name));
            }
        }
        return this.buildSearchableString(parts);
    }

    private buildAllSearchableStrings(): void {
        this._uniqueSearchString.clear();
        this._setItemSearchString.clear();
        this._runewordSearchString.clear();
        this._runewordTypeBases.clear();
        this._baseHasDescendantsInRunewords.clear();

        // Pass 1: Uniques
        try {
            for (const u of this.uniques) {
                const key = this.getUniqueKey(u);
                this._uniqueSearchString.set(key, this.buildSearchableStringForUnique(u));
            }
        } catch { /* ignore */ }

        // Pass 2: Set items
        try {
            for (const it of this.allSetItems) {
                const key = this.getSetItemKey(it);
                this._setItemSearchString.set(key, this.buildSearchableStringForSetItem(it));
            }
        } catch { /* ignore */ }

        // Pass 3: Runewords (and collect type info)
        try {
            for (const rw of this.runewords) {
                const key = this.getRunewordKey(rw);
                this._runewordSearchString.set(key, this.buildSearchableStringForRuneword(rw));

                const bases: string[] = [];
                const types = Array.isArray(rw.Types) ? rw.Types : [];
                for (const t of types) {
                    const raw = t?.Name != null ? String(t.Name) : '';
                    const chain = getChainForTypeNameReadonly(raw);
                    if (chain && chain.length) {
                        const base = chain[0];
                        bases.push(base);
                        // If chain has more than 1 element, it means it's a descendant of those parents
                        for (let i = 1; i < chain.length; i++) {
                            this._baseHasDescendantsInRunewords.add(chain[i]);
                        }
                    }
                }
                this._runewordTypeBases.set(rw, bases);
            }
        } catch { /* ignore */ }
    }

    // Checks that the search query matches the item's searchable string.
    // queryGroups is an OR-list of AND-groups (SearchToken[][]).
    // An item matches if at least one OR-group matches.
    // An OR-group matches if all its non-negated terms are present and all negated terms are absent.
    private tokensPartiallyMatch(
        searchString: string | undefined,
        queryGroups: SearchToken[][],
    ): boolean {
        if (!queryGroups.length) return true;
        if (!searchString) return false;

        return queryGroups.some((group) => {
            return group.every((t) => (t.negated ? !searchString.includes(t.term) : searchString.includes(t.term)));
        });
    }

    private parseFoundMap(raw: string | null): Record<string, boolean> {
        if (!raw) return {};
        try {
            const obj = JSON.parse(raw) as unknown;
            if (obj && typeof obj === 'object') {
                const result: Record<string, boolean> = {};
                for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
                    // Coerce to boolean; any truthy value means found
                    result[k] = Boolean(v);
                }
                return result;
            }
        } catch {
            /* ignore */
        }
        return {};
    }

    loadFoundItems(): void {
        // Migrate legacy uniques storage if present
        const legacy = localStorage.getItem('d2r-grail-items');
        const u = localStorage.getItem('d2r-grail-uniques');
        if (legacy && !u) {
            try {
                localStorage.setItem('d2r-grail-uniques', legacy);
            } catch {
                /* ignore */
            }
            try {
                localStorage.removeItem('d2r-grail-items');
            } catch {
                /* ignore */
            }
        }

        const savedU = localStorage.getItem('d2r-grail-uniques');
        const savedS = localStorage.getItem('d2r-grail-sets');
        const savedR = localStorage.getItem('d2r-grail-runewords');
        this.foundUniques = this.parseFoundMap(savedU);
        this.foundSets = this.parseFoundMap(savedS);
        this.foundRunewords = this.parseFoundMap(savedR);
    }

    saveFoundItems(): void {
        try {
            localStorage.setItem(
                'd2r-grail-uniques',
                JSON.stringify(this.foundUniques),
            );
        } catch {
            /* ignore */
        }
        try {
            localStorage.setItem('d2r-grail-sets', JSON.stringify(this.foundSets));
        } catch {
            /* ignore */
        }
        try {
            localStorage.setItem(
                'd2r-grail-runewords',
                JSON.stringify(this.foundRunewords),
            );
        } catch {
            /* ignore */
        }
    }

    updateFoundStatus(_itemKey: string): void {
        void _itemKey; // mark as used to satisfy lint rule
        // checked.bind already flipped state; just persist and refresh.
        // Do both actions via debouncers so the actual click handler returns quickly
        // (prevents "[Violation] 'click' handler took ...ms").
        if (this._debouncedSaveFound) this._debouncedSaveFound();
        if (this._debouncedApplyFilters) this._debouncedApplyFilters();
    }

    updateFoundCount(): void {
        if (this.selectedCategory === 'uniques') {
            this.foundCount = Object.values(this.foundUniques).filter(Boolean).length;
        } else if (this.selectedCategory === 'sets') {
            // Count how many unique sets are fully completed
            this.foundCount = this.computeCompletedSetsCount();
        } else if (this.selectedCategory === 'runewords') {
            this.foundCount = Object.values(this.foundRunewords).filter(
                Boolean,
            ).length;
        } else {
            this.foundCount = 0;
        }
    }

    updateTotalCount(): void {
        if (this.selectedCategory === 'uniques') {
            this.totalCount = this.uniques.length;
        } else if (this.selectedCategory === 'sets') {
            // Total unique sets available
            try {
                this.totalCount = (setsJson as unknown as ISetData[]).length;
            } catch {
                this.totalCount = 0;
            }
        } else if (this.selectedCategory === 'runewords') {
            this.totalCount = this.runewords.length;
        } else {
            this.totalCount = 0;
        }
    }

    resetGrail(): void {
        if (
            confirm(
                'Are you sure you want to reset your Grail progress for this category? This cannot be undone.',
            )
        ) {
            if (this.selectedCategory === 'uniques') {
                this.foundUniques = {};
            } else if (this.selectedCategory === 'sets') {
                this.foundSets = {};
            } else if (this.selectedCategory === 'runewords') {
                this.foundRunewords = {};
            }
            this.saveFoundItems();
            this.updateFoundCount();
            this.updateList();
        }
    }

    getDamageTypeString = getDamageTypeStringUtil;

    private getUniqueKey(u: IUniqueItem): string {
        return String(u?.Name || '');
    }

    private getSetItemKey(it: ISetItem): string {
        return `${String(it?.Set || '')}::${String(it?.Name || '')}`;
    }

    private getRunewordKey(rw: IRunewordData): string {
        return String(rw?.Name || '');
    }

    // Count fully completed sets based on found set items
    private computeCompletedSetsCount(): number {
        try {
            let completed = 0;
            for (const set of setsJson) {
                const items = Array.isArray(set?.SetItems) ? set.SetItems : [];
                if (items.length === 0) continue; // ignore malformed sets
                let allFound = true;
                for (const it of items) {
                    const key = this.getSetItemKey(it);
                    if (!this.foundSets[key]) {
                        allFound = false;
                        break;
                    }
                }
                if (allFound) completed++;
            }
            return completed;
        } catch {
            return 0;
        }
    }

    // Maintain original item-based counters for Sets header-first line
    private updateSetCounters(): void {
        try {
            this.setItemTotalCount = this.allSetItems.length;
        } catch {
            this.setItemTotalCount = 0;
        }
        try {
            this.setItemFoundCount = Object.values(this.foundSets).filter(
                Boolean,
            ).length;
        } catch {
            this.setItemFoundCount = 0;
        }
        // setItemsDisplayedCount is updated inside updateList() for sets; when not on sets, leave as-is
    }

    formatGroupName(name: string) {
        return name.replace(/-/g, ' ').replace(/([a-z])([0-9])/g, '$1 $2');
    }
}
