import { bindable, watch } from 'aurelia';
import { isBlankOrInvalid } from '../../utilities/url-sanitize';
import { debounce, DebouncedFunction } from '../../utilities/debounce';
import { prependTypeResetOption } from '../../utilities/filter-helpers';

import runewordsJson from '../item-jsons/runewords.json';
import setsJson from '../item-jsons/sets.json';
import uniquesJson from '../item-jsons/uniques.json';
import type { ISetData, ISetItem } from '../sets/set-types';
import {
    type_filtering_options,
    buildOptionsForPresentTypes,
    resolveBaseTypeName,
    getChainForTypeName,
    FilterOption
} from '../../resources/constants/item-type-filters';

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
}

interface IUniqueItem {
    Name: string;
    Class?: string;
    Rarity?: string;
    RequiredLevel?: number;
    Equipment: IEquipment;
    Properties?: IProperty[];
}

export class Grail {
    // Data sources
    uniques: IUniqueItem[] = uniquesJson as IUniqueItem[];
    filteredUniques: IUniqueItem[] = [];

    allSetItems: ISetItem[] = [];
    filteredSetItems: ISetItem[] = [];

    runewords: any[] = runewordsJson as any[];
    filteredRunewords: any[] = [];

    classes = [
        { value: '' as any, label: '-' },
        { value: 'Amazon', label: 'Amazon' },
        { value: 'Assassin', label: 'Assassin' },
        { value: 'Barbarian', label: 'Barbarian' },
        { value: 'Druid', label: 'Druid' },
        { value: 'Necromancer', label: 'Necromancer' },
        { value: 'Paladin', label: 'Paladin' },
        { value: 'Sorceress', label: 'Sorceress' }
    ];

    equipmentNames: ISelectOption[] = [{ id: '', name: '-' }];

    // Category handling
    categories = [
        { value: 'uniques', label: 'Uniques' },
        { value: 'sets', label: 'Sets' },
        { value: 'runewords', label: 'Runewords' }
    ];
    @bindable selectedCategory: 'uniques' | 'sets' | 'runewords' = 'uniques';


    @bindable search: string;
    @bindable selectedClass: string;
    // Centralized type filter (UI binds to the base token; internal uses array of base+parents)
    @bindable selectedTypeBase: string | undefined;
    @bindable selectedType: string[];
    @bindable selectedEquipmentName: string;
    // When true, hide items where Vanilla === 'Y'
    @bindable hideVanilla: boolean = false;

    // Centralized options list (rebuilt per category based on data present)
    types: ReadonlyArray<FilterOption> = type_filtering_options.slice();
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
    setItemFoundCount: number = 0;      // number of found set ITEMS
    setItemTotalCount: number = 0;      // total set ITEMS
    setItemsDisplayedCount: number = 0; // displayed set ITEMS under current filters
    
    // Debouncers to keep UI interactions (like checkbox clicks) snappy
    private _debouncedSaveFound!: DebouncedFunction;
    private _debouncedApplyFilters!: DebouncedFunction;
    
    binding(): void {
        // Flatten sets to item list for filtering
        try {
            const sets = setsJson as ISetData[];
            this.allSetItems = [];
            for (const s of sets) {
                for (const it of (s.SetItems || [])) {
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

        // Initialize internal selectedType array from selectedTypeBase and available options
        if (this.selectedTypeBase) {
            const opt = this.types.find(o => o.value && o.value[0] === this.selectedTypeBase);
            this.selectedType = opt?.value ?? [this.selectedTypeBase];
        } else {
            this.selectedType = undefined as any;
        }

        // Prebuild Equipment options if a type was restored (non-runewords)
        this.equipmentNames = [{ id: '', name: '-' }];
        if (this.selectedType && this.selectedType.length > 0 && this.selectedCategory !== 'runewords') {
            try {
                const set = new Set<string>();
                if (this.selectedCategory === 'uniques') {
                    const selectedBases = new Set<string>(this.selectedType);
                    for (const u of this.uniques) {
                        const base = getChainForTypeName((u as any)?.Type ?? '')[0] || ((u as any)?.Type ?? '');
                        if (selectedBases.has(base) && u?.Equipment?.Name) set.add(u.Equipment.Name);
                    }
                } else if (this.selectedCategory === 'sets') {
                    const selectedBases = new Set<string>(this.selectedType);
                    for (const it of this.allSetItems) {
                        const base = getChainForTypeName((it as any)?.Type ?? '')[0] || ((it as any)?.Type ?? '');
                        if (selectedBases.has(base) && it?.Equipment?.Name) set.add(it.Equipment.Name);
                    }
                }
                for (const name of set) this.equipmentNames.push({ id: name, name });
            } catch {
                // ignore errors, keep default "All Equipment"
            }
        }

        // Cache total set items
        this.setItemTotalCount = this.allSetItems.length;

        // Prepare debounced actions to avoid long click handlers
        this._debouncedSaveFound = debounce(() => this.saveFoundItems(), 200);
        // Debounced filter application (updates list + URL together)
        this._debouncedApplyFilters = debounce(() => {
            this.updateList();
            this.updateUrl();
        }, 300);

        // Initial filter + counters
        this.updateList();
    }

    // Reflect current state back into the URL
    attached(): void {
        // Push clean state into URL on first load (no external hydration)
        this.updateUrl();
    }

    // When navigating away, clear Grail-related params from the URL so returning starts empty
    detached(): void {
        try {
            const url = new URL(window.location.href);
            // Only remove Grail-scoped parameters; do not touch global filters used by other pages
            url.searchParams.delete('g-category');
            url.searchParams.delete('g-class');
            url.searchParams.delete('g-type');
            url.searchParams.delete('g-equipment');
            url.searchParams.delete('g-search');
            url.searchParams.delete('g-hideFound');
            url.searchParams.delete('g-hideVanilla');
            window.history.pushState({}, '', url.toString());
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
                this.selectedCategory = cat as any;
            }

            // Class
            const cls = urlParams.get('g-class');
            if (cls && !isBlankOrInvalid(cls)) this.selectedClass = cls;

            // Type (serialized as base token only)
            const t = urlParams.get('g-type');
            if (t && !isBlankOrInvalid(t)) {
                this.selectedTypeBase = t;
            } else {
                this.selectedTypeBase = undefined as any;
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
        try {
            const url = new URL(window.location.href);

            // Always persist selected category (Grail-scoped)
            url.searchParams.set('g-category', this.selectedCategory);

            // Class (Grail-scoped)
            if (this.selectedClass && this.selectedClass.trim() !== '' && !isBlankOrInvalid(this.selectedClass)) {
                url.searchParams.set('g-class', this.selectedClass);
            } else {
                url.searchParams.delete('g-class');
            }

            // Type (Grail-scoped, serialize base only)
            if (this.selectedTypeBase && !isBlankOrInvalid(this.selectedTypeBase)) {
                url.searchParams.set('g-type', this.selectedTypeBase);
            } else {
                url.searchParams.delete('g-type');
            }

            // Equipment (Grail-scoped)
            if (this.selectedEquipmentName && this.selectedEquipmentName.trim() !== '' && !isBlankOrInvalid(this.selectedEquipmentName)) {
                url.searchParams.set('g-equipment', this.selectedEquipmentName);
            } else {
                url.searchParams.delete('g-equipment');
            }

            // Search (Grail-scoped)
            if (this.search && this.search.trim() !== '' && !isBlankOrInvalid(this.search)) {
                url.searchParams.set('g-search', this.search);
            } else {
                url.searchParams.delete('g-search');
            }

            // Hide Found (Grail-scoped; only include when true to keep URL tidy)
            if (this.showFoundItems) {
                url.searchParams.set('g-hideFound', 'true');
            } else {
                url.searchParams.delete('g-hideFound');
            }

            // Hide Vanilla (Grail-scoped)
            if (this.hideVanilla) {
                url.searchParams.set('g-hideVanilla', 'true');
            } else {
                url.searchParams.delete('g-hideVanilla');
            }

            window.history.pushState({}, '', url.toString());
        } catch {
            // ignore URL update issues
        }
    }

    private rebuildTypeOptions(): void {
        const present = new Set<string>();
        try {
            if (this.selectedCategory === 'uniques') {
                for (const u of (uniquesJson as any[])) {
                    const base = resolveBaseTypeName(u?.Type ?? '');
                    if (base) present.add(base);
                }
            } else if (this.selectedCategory === 'sets') {
                for (const s of (setsJson as any[])) {
                    for (const it of (s?.SetItems || [])) {
                        const base = resolveBaseTypeName(it?.Type ?? '');
                        if (base) present.add(base);
                    }
                }
            } else if (this.selectedCategory === 'runewords') {
                for (const rw of (runewordsJson as any[])) {
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
        // For grail: de-duplicate by base so 'Helm' vs 'Any Helm' doesn't appear twice in a base-serialized URL model
        this.types = buildOptionsForPresentTypes(
            type_filtering_options,
            present,
            { dedupeByBase: true, preferLabelStartsWith: 'Any ' }
        );
        // Prepend reset option so users can clear selection with '-'
        this.types = prependTypeResetOption(this.types);
    }
    
    selectedCategoryChanged(): void {
        // Reset filters on category change
        this.selectedClass = undefined;
        this.selectedType = undefined as any;
        this.selectedEquipmentName = '';
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
        this.selectedEquipmentName = '';
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
                    const base = getChainForTypeName((u as any)?.Type ?? '')[0] || ((u as any)?.Type ?? '');
                    if (selectedBases.has(base) && u?.Equipment?.Name) set.add(u.Equipment.Name);
                }
            } else if (this.selectedCategory === 'sets') {
                for (const it of this.allSetItems) {
                    const base = getChainForTypeName((it as any)?.Type ?? '')[0] || ((it as any)?.Type ?? '');
                    if (selectedBases.has(base) && it?.Equipment?.Name) set.add(it.Equipment.Name);
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
            const opt = this.types.find(o => o.value && o.value[0] === this.selectedTypeBase);
            this.selectedType = opt?.value ?? [this.selectedTypeBase];
        } else {
            this.selectedType = undefined as any;
            this.selectedEquipmentName = '';
        }
        // Rebuild equipment names for Uniques/Sets when a type is selected
        this.equipmentNames = [{ id: '', name: 'All Equipment' }];
        if (this.selectedType && this.selectedType.length > 0 && this.selectedCategory !== 'runewords') {
            try {
                const set = new Set<string>();
                if (this.selectedCategory === 'uniques') {
                    const selectedBases = new Set<string>(this.selectedType);
                    for (const u of this.uniques) {
                        const base = getChainForTypeName((u as any)?.Type ?? '')[0] || ((u as any)?.Type ?? '');
                        if (selectedBases.has(base) && u?.Equipment?.Name) set.add(u.Equipment.Name);
                    }
                } else if (this.selectedCategory === 'sets') {
                    const selectedBases = new Set<string>(this.selectedType);
                    for (const it of this.allSetItems) {
                        const base = getChainForTypeName((it as any)?.Type ?? '')[0] || ((it as any)?.Type ?? '');
                        if (selectedBases.has(base) && it?.Equipment?.Name) set.add(it.Equipment.Name);
                    }
                }
                for (const name of set) this.equipmentNames.push({ id: name, name });
            } catch { /* ignore */ }
        }
        if (this._debouncedApplyFilters) this._debouncedApplyFilters();
    }

    selectedEquipmentNameChanged(): void {
        if (this._debouncedApplyFilters) this._debouncedApplyFilters();
    }

    // Reset only the filter controls (not found-state or progress)
    resetFilters(): void {
        this.search = '' as any;
        this.selectedClass = '' as any;
        // Clear type and dependent equipment
        this.selectedTypeBase = '' as any;
        this.selectedType = undefined as any;
        this.selectedEquipmentName = '';
        this.equipmentNames = [{ id: '', name: 'All Equipment' }];
        // Visibility toggles
        this.showFoundItems = false;
        this.hideVanilla = false;

        // Rebuild options list for current category and refresh
        this.rebuildTypeOptions();
        this.updateList();
        this.updateTotalCount();
        this.updateUrl();
    }

    updateList() {
        // Filter per category
        const searchRaw = (this.search || '').trim().toLowerCase();
        const searchTokens = searchRaw.length ? searchRaw.split(/\s+/) : [];
        const selectedTypeSet = (this.selectedType && this.selectedType.length > 0)
            ? new Set<string>(this.selectedType)
            : null;

        if (this.selectedCategory === 'uniques') {
            const result = (uniquesJson as any[]).filter((unique: any) => {
                const okClass = !this.selectedClass || String(unique?.Equipment?.RequiredClass || '').toLowerCase().includes(String(this.selectedClass).toLowerCase());
                const okType = !selectedTypeSet || selectedTypeSet.has(getChainForTypeName(unique?.Type ?? '')[0] || (unique?.Type ?? ''));
                const okEquip = !this.selectedEquipmentName || String(unique?.Equipment?.Name || '') === this.selectedEquipmentName;
                const okVanilla = !this.hideVanilla || String(unique?.Vanilla || '').toUpperCase() !== 'Y';
                const okSearch = !searchTokens.length || ((): boolean => {
                    const hay = [
                        String(unique?.Name || ''),
                        ...(Array.isArray(unique?.Properties) ? unique.Properties.map((p: any) => String(p?.PropertyString || '')) : []),
                        String(unique?.Equipment?.Name || ''),
                    ]
                        .filter(Boolean)
                        .join(' ')
                        .toLowerCase();
                    return searchTokens.every(t => hay.includes(t));
                })();
                const notGrabber = !String(unique?.Name || '').toLowerCase().includes('grabber');
                const key = this.getUniqueKey(unique);
                const okFound = !this.showFoundItems || !this.foundUniques[key];
                return okClass && okType && okEquip && okVanilla && okSearch && notGrabber && okFound;
            }) as IUniqueItem[];
            this.filteredUniques = result;
            this.displayedCount = this.filteredUniques.length;
        } else if (this.selectedCategory === 'sets') {
            const result = (this.allSetItems as any[]).filter((item: any) => {
                const okClass = !this.selectedClass || String(item?.Equipment?.RequiredClass || '').toLowerCase().includes(String(this.selectedClass).toLowerCase());
                const okType = !selectedTypeSet || selectedTypeSet.has(getChainForTypeName(item?.Type ?? '')[0] || (item?.Type ?? ''));
                const okEquip = !this.selectedEquipmentName || String(item?.Equipment?.Name || '') === this.selectedEquipmentName;
                const okVanilla = !this.hideVanilla || String(item?.Vanilla || '').toUpperCase() !== 'Y';
                const okSearch = !searchTokens.length || ((): boolean => {
                    const hay = [
                        String(item?.Name || ''),
                        ...(Array.isArray(item?.Properties) ? item.Properties.map((p: any) => String(p?.PropertyString || '')) : []),
                        ...(Array.isArray(item?.SetPropertiesString) ? item.SetPropertiesString.map((s: any) => String(s || '')) : []),
                        String(item?.Equipment?.Name || ''),
                    ]
                        .filter(Boolean)
                        .join(' ')
                        .toLowerCase();
                    return searchTokens.every(t => hay.includes(t));
                })();
                const key = this.getSetItemKey(item);
                const okFound = !this.showFoundItems || !this.foundSets[key];
                return okClass && okType && okEquip && okVanilla && okSearch && okFound;
            }) as ISetItem[];
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
            let list = this.runewords as any[];

            // Type filtering modeled after Runewords page
            if (this.selectedType?.length > 0) {
                const selectedBase = resolveBaseTypeName(this.selectedType[0] ?? '');
                if (selectedBase) {
                    const selectedChain = getChainForTypeName(selectedBase);
                    const selectedChainSet = new Set<string>(selectedChain);

                    let hasDescendantInData = false;
                    if (!this.exclusiveType) {
                        try {
                            outer: for (const rw of this.runewords as any[]) {
                                const types = Array.isArray(rw?.Types) ? rw.Types : [];
                                for (let i = 0; i < types.length; i++) {
                                    const raw = types[i]?.Name != null ? String(types[i].Name) : '';
                                    const chain = getChainForTypeName(raw);
                                    if (!chain || chain.length === 0) continue;
                                    const base = chain[0];
                                    if (base !== selectedBase && chain.indexOf(selectedBase) !== -1) {
                                        hasDescendantInData = true;
                                        break outer;
                                    }
                                }
                            }
                        } catch {
                            hasDescendantInData = false;
                        }
                    }

                    list = list.filter((rw) => {
                        const types = Array.isArray(rw.Types) ? rw.Types : [];
                        for (let i = 0; i < types.length; i++) {
                            const raw = types[i]?.Name != null ? String(types[i].Name) : '';
                            const chain = getChainForTypeName(raw);
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

            const result = list.filter((rw: any) => {
                const okVanilla = !this.hideVanilla || String(rw?.Vanilla || '').toUpperCase() !== 'Y';
                const okSearch = !searchTokens.length || ((): boolean => {
                    const hay = [
                        String(rw?.Name || ''),
                        ...(Array.isArray(rw?.Properties) ? rw.Properties.map((p: any) => String(p?.PropertyString || '')) : []),
                        ...(Array.isArray(rw?.Types) ? rw.Types.map((t: any) => String(t?.Name || '')) : []),
                    ]
                        .filter(Boolean)
                        .join(' ')
                        .toLowerCase();
                    return searchTokens.every(t => hay.includes(t));
                })();
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
    
    loadFoundItems(): void {
        // Migrate legacy uniques storage if present
        const legacy = localStorage.getItem('d2r-grail-items');
        const u = localStorage.getItem('d2r-grail-uniques');
        if (legacy && !u) {
            try { localStorage.setItem('d2r-grail-uniques', legacy); } catch {}
            try { localStorage.removeItem('d2r-grail-items'); } catch {}
        }

        const savedU = localStorage.getItem('d2r-grail-uniques');
        const savedS = localStorage.getItem('d2r-grail-sets');
        const savedR = localStorage.getItem('d2r-grail-runewords');
        if (savedU) this.foundUniques = JSON.parse(savedU) as Record<string, boolean>;
        if (savedS) this.foundSets = JSON.parse(savedS) as Record<string, boolean>;
        if (savedR) this.foundRunewords = JSON.parse(savedR) as Record<string, boolean>;
    }
    
    saveFoundItems(): void {
        try { localStorage.setItem('d2r-grail-uniques', JSON.stringify(this.foundUniques)); } catch {}
        try { localStorage.setItem('d2r-grail-sets', JSON.stringify(this.foundSets)); } catch {}
        try { localStorage.setItem('d2r-grail-runewords', JSON.stringify(this.foundRunewords)); } catch {}
    }
    
    updateFoundStatus(_itemKey: string): void {
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
            this.foundCount = Object.values(this.foundRunewords).filter(Boolean).length;
        } else {
            this.foundCount = 0;
        }
    }

    updateTotalCount(): void {
        if (this.selectedCategory === 'uniques') {
            this.totalCount = (uniquesJson as any[]).length;
        } else if (this.selectedCategory === 'sets') {
            // Total unique sets available
            try {
                this.totalCount = (setsJson as ISetData[]).length;
            } catch {
                this.totalCount = 0;
            }
        } else if (this.selectedCategory === 'runewords') {
            this.totalCount = (this.runewords as any[]).length;
        } else {
            this.totalCount = 0;
        }
    }
    
    resetGrail(): void {
        if (confirm('Are you sure you want to reset your Grail progress for this category? This cannot be undone.')) {
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
    
    getDamageTypeString(type: number): string {
        switch (type) {
            case 0:
                return 'Damage:';
            case 1:
                return 'One-Hand Damage:';
            case 2:
                return 'Two-Hand Damage:';
            case 3:
                return 'Throw Damage:';
            default:
                return 'Damage:';
        }
    }

    // Helpers for keys and equipment name list
    private getUniqueKey(u: any): string { return String(u?.Name || ''); }
    private getSetItemKey(it: any): string { return `${String(it?.Set || '')}::${String(it?.Name || '')}`; }
    private getRunewordKey(rw: any): string { return String(rw?.Name || ''); }

    // Count fully completed sets based on found set items
    private computeCompletedSetsCount(): number {
        try {
            let completed = 0;
            for (const set of (setsJson as ISetData[])) {
                const items = Array.isArray(set?.SetItems) ? set.SetItems : [];
                if (items.length === 0) continue; // ignore malformed sets
                let allFound = true;
                for (const it of items) {
                    const key = this.getSetItemKey(it);
                    if (!this.foundSets[key]) { allFound = false; break; }
                }
                if (allFound) completed++;
            }
            return completed;
        } catch {
            return 0;
        }
    }

    // Maintain original item-based counters for Sets header first line
    private updateSetCounters(): void {
        try {
            this.setItemTotalCount = this.allSetItems.length;
        } catch {
            this.setItemTotalCount = 0;
        }
        try {
            this.setItemFoundCount = Object.values(this.foundSets).filter(Boolean).length;
        } catch {
            this.setItemFoundCount = 0;
        }
        // setItemsDisplayedCount is updated inside updateList() for sets; keep value otherwise
        if (this.selectedCategory !== 'sets') {
            // When not on sets, keep displayed items count unchanged or zero it
            // so template doesn't show stale values if ever referenced
            // (it is only used when selectedCategory === 'sets').
            this.setItemsDisplayedCount = this.setItemsDisplayedCount;
        }
    }

    private getUniqueEquipmentNames(): ISelectOption[] {
        const set = new Set<string>();
        if (this.selectedCategory === 'uniques') {
            for (const u of this.uniques) {
                if ((!this.selectedType || (u as any).Type === this.selectedType) && u?.Equipment?.Name) {
                    set.add(u.Equipment.Name);
                }
            }
        } else if (this.selectedCategory === 'sets') {
            for (const it of this.allSetItems) {
                if ((!this.selectedType || (it as any).Type === this.selectedType) && it?.Equipment?.Name) {
                    set.add(it.Equipment.Name);
                }
            }
        }
        const result: ISelectOption[] = [{ id: '', name: 'All Equipment' }];
        for (const name of Array.from(set).sort()) {
            result.push({ id: name, name });
        }
        return result;
    }
}