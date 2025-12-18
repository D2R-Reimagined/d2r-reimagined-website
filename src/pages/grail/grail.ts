import { bindable, watch } from 'aurelia';

import {
    buildOptionsForPresentTypes,
    character_class_options,
    getChainForTypeNameReadonly,
    IFilterOption,
    resolveBaseTypeName,
    type_filtering_options,
} from '../../resources/constants';
import { debounce, IDebouncedFunction } from '../../utilities/debounce';
import {
    getDamageTypeString as getDamageTypeStringUtil,
    isVanillaItem,
    prependTypeResetOption,
    tokenizeSearch,
} from '../../utilities/filter-helpers';
import { isBlankOrInvalid, syncParamsToUrl } from '../../utilities/url-sanitize';
import runewordsJson from '../item-jsons/runewords.json';
import setsJson from '../item-jsons/sets.json';
import uniquesJson from '../item-jsons/uniques.json';
import type { ISetData, ISetItem } from '../sets/set-types';

interface ISelectOption {
    id: string;
    name: string;
}

interface IDamageType {
    Type: number;
    DamageString: string;
}

interface IProperty {
    PropertyString: string;
}

interface IEquipment {
    Name?: string;
    Type?: string;
    ArmorString?: string;
    DamageTypes?: IDamageType[];
    RequiredStrength?: number;
    RequiredDexterity?: number;
    Durability?: number;
    RequiredClass?: string;
}

interface IUniqueItem {
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

    // Precomputed token maps for fast, cross-field search
    private _uniqueTokens = new Map<string, Set<string>>();
    private _setItemTokens = new Map<string, Set<string>>();
    private _runewordTokens = new Map<string, Set<string>>();

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
        this.buildAllTokens();

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

        // Rebuild options list for the current category and refresh
        this.rebuildTypeOptions();
        this.updateList();
        this.updateTotalCount();
        this.updateUrl();
    }

    updateList() {
        // Filter per category
        const searchTokens = tokenizeSearch(this.search);

        const selectedTypeSet =
            this.selectedType && this.selectedType.length > 0
                ? new Set<string>(this.selectedType)
                : null;

        if (this.selectedCategory === 'uniques') {
            const result = this.uniques.filter((unique) => {
                const okClass =
                    !this.selectedClass ||
                    String(unique?.Equipment?.RequiredClass || '')
                        .toLowerCase()
                        .includes(String(this.selectedClass).toLowerCase());
                const okType =
                    !selectedTypeSet ||
                    selectedTypeSet.has(
                        getChainForTypeNameReadonly(unique?.Type ?? '')[0] || (unique?.Type ?? ''),
                    );
                const okEquip =
                    !this.selectedEquipmentName ||
                    String(unique?.Equipment?.Name || '') === this.selectedEquipmentName;
                const okVanilla = !this.hideVanilla || !isVanillaItem(unique?.Vanilla);
                const okSearch = this.tokensPartiallyMatch(
                    this._uniqueTokens.get(this.getUniqueKey(unique)),
                    searchTokens,
                );
                const notGrabber = !String(unique?.Name || '')
                    .toLowerCase()
                    .includes('grabber');
                const key = this.getUniqueKey(unique);
                const okFound = !this.showFoundItems || !this.foundUniques[key];
                return (
                    okClass &&
                    okType &&
                    okEquip &&
                    okVanilla &&
                    okSearch &&
                    notGrabber &&
                    okFound
                );
            });
            this.filteredUniques = result;
            this.displayedCount = this.filteredUniques.length;
        } else if (this.selectedCategory === 'sets') {
            const result = this.allSetItems.filter((item) => {
                const okClass =
                    !this.selectedClass ||
                    String(item?.Equipment?.RequiredClass || '')
                        .toLowerCase()
                        .includes(String(this.selectedClass).toLowerCase());
                const okType =
                    !selectedTypeSet ||
                    selectedTypeSet.has(
                        getChainForTypeNameReadonly(item?.Type ?? '')[0] || (item?.Type ?? ''),
                    );
                const okEquip =
                    !this.selectedEquipmentName ||
                    String(item?.Equipment?.Name || '') === this.selectedEquipmentName;
                const okVanilla = !this.hideVanilla || !isVanillaItem(item?.Vanilla);
                const okSearch = this.tokensPartiallyMatch(
                    this._setItemTokens.get(this.getSetItemKey(item)),
                    searchTokens,
                );
                const key = this.getSetItemKey(item);
                const okFound = !this.showFoundItems || !this.foundSets[key];
                return okClass && okType && okEquip && okVanilla && okSearch && okFound;
            });
            this.filteredSetItems = result;
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

                    let hasDescendantInData = false;
                    if (!this.exclusiveType) {
                        try {
                            outer: for (const rw of this.runewords) {
                                const types = Array.isArray(rw?.Types) ? rw.Types : [];
                                for (let i = 0; i < types.length; i++) {
                                    const raw =
                                        types[i]?.Name != null ? String(types[i].Name) : '';
                                    const chain = getChainForTypeNameReadonly(raw);
                                    if (!chain || chain.length === 0) continue;
                                    const base = chain[0];
                                    if (
                                        base !== selectedBase &&
                                        chain.indexOf(selectedBase) !== -1
                                    ) {
                                        hasDescendantInData = true;
                                        break outer;
                                    }
                                }
                            }
                        } catch {
                            hasDescendantInData = false;
                        }
                    }

                    list = list.filter((rw: IRunewordData) => {
                        const types = Array.isArray(rw.Types) ? rw.Types : [];
                        for (let i = 0; i < types.length; i++) {
                            const raw = types[i]?.Name != null ? String(types[i].Name) : '';
                            const chain = getChainForTypeNameReadonly(raw);
                            if (!chain || chain.length === 0) continue;
                            const itemBase = chain[0];
                            if (this.exclusiveType) {
                                if (itemBase === selectedBase) return true;
                            } else if (hasDescendantInData) {
                                if (chain.indexOf(selectedBase) !== -1) return true;
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
                    this._runewordTokens.get(this.getRunewordKey(rw)),
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

    //Tokenization helpers
    private tokenizeStrings(
        values: readonly (string | undefined | null)[],
    ): Set<string> {
        const out = new Set<string>();
        for (const v of values) {
            const toks = tokenizeSearch(v);
            for (const tok of toks) out.add(tok);
        }
        return out;
    }

    private tokensFromTypeChain(
        typeName: string | undefined | null,
    ): Set<string> {
        const chain = getChainForTypeNameReadonly(typeName ? String(typeName) : '');
        return this.tokenizeStrings(chain);
    }

    private buildTokensForUnique(u: IUniqueItem): Set<string> {
        const baseVals: Array<string | undefined | null> = [
            u?.Name,
            u?.Equipment?.Name,
            u?.Equipment?.RequiredClass,
        ];
        const tokens = this.tokenizeStrings(baseVals);
        // Properties
        if (Array.isArray(u?.Properties)) {
            for (const p of u.Properties) {
                const s = p?.PropertyString != null ? String(p.PropertyString) : '';
                if (s) {
                    for (const t of this.tokenizeStrings([s])) tokens.add(t);
                }
            }
        }
        // Type chain
        for (const t of this.tokensFromTypeChain(u?.Type)) tokens.add(t);
        return tokens;
    }

    private buildTokensForSetItem(it: ISetItem): Set<string> {
        const baseVals: Array<string | undefined | null> = [
            it?.Name,
            it?.Set,
            it?.Equipment?.Name,
        ];
        const tokens = this.tokenizeStrings(baseVals);
        if (Array.isArray(it?.Properties)) {
            for (const p of it.Properties) {
                const s = p?.PropertyString != null ? String(p.PropertyString) : '';
                if (s) for (const t of this.tokenizeStrings([s])) tokens.add(t);
            }
        }
        if (Array.isArray(it?.SetPropertiesString)) {
            for (const s of it.SetPropertiesString) {
                if (s) for (const t of this.tokenizeStrings([String(s)])) tokens.add(t);
            }
        }
        for (const t of this.tokensFromTypeChain(it?.Type)) tokens.add(t);
        return tokens;
    }

    private buildTokensForRuneword(rw: IRunewordData): Set<string> {
        const tokens = this.tokenizeStrings([rw?.Name]);
        if (Array.isArray(rw?.Properties)) {
            for (const p of rw.Properties) {
                const s = p?.PropertyString != null ? String(p.PropertyString) : '';
                if (s) for (const t of this.tokenizeStrings([s])) tokens.add(t);
            }
        }
        if (Array.isArray(rw?.Types)) {
            for (const t of rw.Types) {
                const name = t?.Name != null ? String(t.Name) : '';
                // include raw type name tokens and its chain
                for (const tok of this.tokenizeStrings([name])) tokens.add(tok);
                for (const tok of this.tokensFromTypeChain(name)) tokens.add(tok);
            }
        }
        if (Array.isArray(rw?.Runes)) {
            for (const r of rw.Runes) {
                const name = r?.Name != null ? String(r.Name) : '';
                for (const tok of this.tokenizeStrings([name])) tokens.add(tok);
            }
        }
        return tokens;
    }

    private buildAllTokens(): void {
        this._uniqueTokens.clear();
        this._setItemTokens.clear();
        this._runewordTokens.clear();

        try {
            for (const u of this.uniques) {
                const key = this.getUniqueKey(u);
                this._uniqueTokens.set(key, this.buildTokensForUnique(u));
            }
        } catch {
            /* ignore */
        }

        try {
            for (const it of this.allSetItems) {
                const key = this.getSetItemKey(it);
                this._setItemTokens.set(key, this.buildTokensForSetItem(it));
            }
        } catch {
            /* ignore */
        }

        try {
            for (const rw of this.runewords) {
                const key = this.getRunewordKey(rw);
                this._runewordTokens.set(key, this.buildTokensForRuneword(rw));
            }
        } catch {
            /* ignore */
        }
    }

    // Checks that every query token is present as a substring of at least one item token
    // Enables partial (prefix/infix) matching instead of exact whole-word matching
    private tokensPartiallyMatch(
        allTokens: Set<string> | undefined,
        queryTokens: string[],
    ): boolean {
        if (!queryTokens.length) return true;
        if (!allTokens || allTokens.size === 0) return false;
        for (let i = 0; i < queryTokens.length; i++) {
            const q = queryTokens[i];
            let hit = false;
            for (const tok of allTokens) {
                if (tok.includes(q)) {
                    hit = true;
                    break;
                }
            }
            if (!hit) return false;
        }
        return true;
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

    // Helpers for keys and equipment name list
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
}
