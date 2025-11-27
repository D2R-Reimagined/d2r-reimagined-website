import { bindable } from 'aurelia';
import { debounce, DebouncedFunction } from '../../utilities/debounce';

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
        { value: undefined, label: '-' },
        { value: 'Amazon', label: 'Amazon' },
        { value: 'Assassin', label: 'Assassin' },
        { value: 'Barbarian', label: 'Barbarian' },
        { value: 'Druid', label: 'Druid' },
        { value: 'Necromancer', label: 'Necromancer' },
        { value: 'Paladin', label: 'Paladin' },
        { value: 'Sorceress', label: 'Sorceress' }
    ];

    equipmentNames: ISelectOption[] = [{ id: '', name: 'All Equipment' }];

    // Category handling
    categories = [
        { value: 'uniques', label: 'Uniques' },
        { value: 'sets', label: 'Sets' },
        { value: 'runewords', label: 'Runewords' }
    ];
    @bindable selectedCategory: 'uniques' | 'sets' | 'runewords' = 'uniques';


    @bindable search: string;
    @bindable selectedClass: string;
    @bindable selectedType: string;
    @bindable selectedEquipmentName: string;

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
    private _debouncedUpdateList!: DebouncedFunction;
    
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

        // Hydrate from URL before first render
        this.readUrlStateSafely();

        // Prebuild Equipment options if a type was restored (non-runewords)
        this.equipmentNames = [{ id: '', name: 'All Equipment' }];
        if (this.selectedType && this.selectedCategory !== 'runewords') {
            try {
                const set = new Set<string>();
                if (this.selectedCategory === 'uniques') {
                    for (const u of this.uniques) {
                        if ((u as any).Type === this.selectedType && u?.Equipment?.Name) set.add(u.Equipment.Name);
                    }
                } else if (this.selectedCategory === 'sets') {
                    for (const it of this.allSetItems) {
                        if ((it as any).Type === this.selectedType && it?.Equipment?.Name) set.add(it.Equipment.Name);
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
        this._debouncedUpdateList = debounce(() => this.updateList(), 50);

        // Initial filter + counters
        this.updateList();
    }

    // Reflect current state back into the URL
    attached(): void {
        // State restored in binding(); push params on first load
        this.updateUrl();
    }

    // Defensive URL parse
    private readUrlStateSafely(): void {
        try {
            const urlParams = new URLSearchParams(window.location.search);

            // Category
            const cat = (urlParams.get('category') || '').toLowerCase();
            if (cat === 'uniques' || cat === 'sets' || cat === 'runewords') {
                this.selectedCategory = cat as any;
            }

            // Class
            const cls = urlParams.get('class');
            if (cls) this.selectedClass = cls;

            // Type (string token per data)
            const t = urlParams.get('type');
            if (t) this.selectedType = t;

            // Equipment name (exact match token)
            const eq = urlParams.get('equipment');
            if (eq) this.selectedEquipmentName = eq;

            // Search text
            const s = urlParams.get('search');
            if (s) this.search = s;

            // Hide Found: default false when param is absent
            const hf = urlParams.get('hideFound');
            this.showFoundItems = hf === 'true' || hf === '1';
        } catch {
            // ignore URL parse issues
        }
    }

    // Update browser URL with current selection and filters (no reload)
    private updateUrl(): void {
        try {
            const url = new URL(window.location.href);

            // Always persist selected category
            url.searchParams.set('category', this.selectedCategory);

            // Class
            if (this.selectedClass && this.selectedClass.trim() !== '') {
                url.searchParams.set('class', this.selectedClass);
            } else {
                url.searchParams.delete('class');
            }

            // Type
            if (this.selectedType && String(this.selectedType).trim() !== '') {
                url.searchParams.set('type', String(this.selectedType));
            } else {
                url.searchParams.delete('type');
            }

            // Equipment
            if (this.selectedEquipmentName && this.selectedEquipmentName.trim() !== '') {
                url.searchParams.set('equipment', this.selectedEquipmentName);
            } else {
                url.searchParams.delete('equipment');
            }

            // Search
            if (this.search && this.search.trim() !== '') {
                url.searchParams.set('search', this.search);
            } else {
                url.searchParams.delete('search');
            }

            // Hide Found (only include when true to keep URL tidy)
            if (this.showFoundItems) {
                url.searchParams.set('hideFound', 'true');
            } else {
                url.searchParams.delete('hideFound');
            }

            window.history.pushState({}, '', url.toString());
        } catch {
            // ignore URL update issues
        }
    }

    get types() {
        const typeSet = new Set<string>();
        if (this.selectedCategory === 'uniques') {
            (uniquesJson as any[]).forEach((u: any) => {
                if (u?.Type) typeSet.add(String(u.Type));
            });
        } else if (this.selectedCategory === 'sets') {
            (setsJson as any[]).forEach((s: any) => {
                for (const it of (s?.SetItems || [])) {
                    if (it?.Type) typeSet.add(String(it.Type));
                }
            });
        } else if (this.selectedCategory === 'runewords') {
            (runewordsJson as any[]).forEach((rw: any) => {
                for (const t of (rw?.Types || [])) {
                    if (t?.Name) typeSet.add(String(t.Name));
                }
            });
        }

        const typeOptions = [{ value: undefined, label: '-' }];
        Array.from(typeSet).sort().forEach(type => {
            typeOptions.push({ value: type, label: type });
        });
        return typeOptions;
    }
    
    selectedCategoryChanged(): void {
        // Reset filters on category change
        this.selectedClass = undefined;
        this.selectedType = undefined as any;
        this.selectedEquipmentName = '';
        this.equipmentNames = [{ id: '', name: 'All Equipment' }];
        this.updateList();
        this.updateTotalCount();
        this.updateUrl();
    }

    selectedClassChanged(): void {
        this.updateList();
        this.updateUrl();
    }
    
    selectedTypeChanged(): void {
        // Reset equipment selection
        this.selectedEquipmentName = '';
        this.equipmentNames = [{ id: '', name: 'All Equipment' }];

        if (!this.selectedType) {
            this.updateList();
            this.updateUrl();
            return;
        }

        // Extract equipment names for the selected type (not applicable to runewords)
        if (this.selectedCategory !== 'runewords') {
            const set = new Set<string>();
            if (this.selectedCategory === 'uniques') {
                for (const u of this.uniques) {
                    if ((u as any).Type === this.selectedType && u?.Equipment?.Name) set.add(u.Equipment.Name);
                }
            } else if (this.selectedCategory === 'sets') {
                for (const it of this.allSetItems) {
                    if ((it as any).Type === this.selectedType && it?.Equipment?.Name) set.add(it.Equipment.Name);
                }
            }
            for (const name of set) this.equipmentNames.push({ id: name, name });
        }

        this.updateList();
        this.updateUrl();
    }
    
    selectedEquipmentNameChanged(): void {
        this.updateList();
        this.updateUrl();
    }
    
    searchChanged(): void {
        this.updateList();
        this.updateUrl();
    }
    
    showFoundItemsChanged(): void {
        this.updateList();
        this.updateUrl();
    }

    updateList() {
        // Filter per category
        const searchText = (this.search || '').toLowerCase();

        if (this.selectedCategory === 'uniques') {
            const result = (uniquesJson as any[]).filter((unique: any) => {
                const okClass = !this.selectedClass || String(unique?.Equipment?.RequiredClass || '').toLowerCase().includes(String(this.selectedClass).toLowerCase());
                const okType = !this.selectedType || String(unique?.Type || '').toLowerCase() === String(this.selectedType).toLowerCase();
                const okEquip = !this.selectedEquipmentName || String(unique?.Equipment?.Name || '') === this.selectedEquipmentName;
                const okSearch = !searchText || (
                    String(unique?.Name || '').toLowerCase().includes(searchText) ||
                    (Array.isArray(unique?.Properties) && unique.Properties.some((p: any) => String(p?.PropertyString || '').toLowerCase().includes(searchText))) ||
                    String(unique?.Equipment?.Name || '').toLowerCase().includes(searchText)
                );
                const notGrabber = !String(unique?.Name || '').toLowerCase().includes('grabber');
                const key = this.getUniqueKey(unique);
                const okFound = !this.showFoundItems || !this.foundUniques[key];
                return okClass && okType && okEquip && okSearch && notGrabber && okFound;
            }) as IUniqueItem[];
            this.filteredUniques = result;
            this.displayedCount = this.filteredUniques.length;
        } else if (this.selectedCategory === 'sets') {
            const result = (this.allSetItems as any[]).filter((item: any) => {
                const okClass = !this.selectedClass || String(item?.Equipment?.RequiredClass || '').toLowerCase().includes(String(this.selectedClass).toLowerCase());
                const okType = !this.selectedType || String(item?.Type || '').toLowerCase() === String(this.selectedType).toLowerCase();
                const okEquip = !this.selectedEquipmentName || String(item?.Equipment?.Name || '') === this.selectedEquipmentName;
                const okSearch = !searchText || (
                    String(item?.Name || '').toLowerCase().includes(searchText) ||
                    (Array.isArray(item?.Properties) && item.Properties.some((p: any) => String(p?.PropertyString || '').toLowerCase().includes(searchText))) ||
                    (Array.isArray(item?.SetPropertiesString) && item.SetPropertiesString.some((s: any) => String(s || '').toLowerCase().includes(searchText))) ||
                    String(item?.Equipment?.Name || '').toLowerCase().includes(searchText)
                );
                const key = this.getSetItemKey(item);
                const okFound = !this.showFoundItems || !this.foundSets[key];
                return okClass && okType && okEquip && okSearch && okFound;
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
            const result = (this.runewords as any[]).filter((rw: any) => {
                const okType = !this.selectedType || (Array.isArray(rw?.Types) && rw.Types.some((t: any) => String(t?.Name || '') === this.selectedType));
                const okSearch = !searchText || (
                    String(rw?.Name || '').toLowerCase().includes(searchText) ||
                    (Array.isArray(rw?.Properties) && rw.Properties.some((p: any) => String(p?.PropertyString || '').toLowerCase().includes(searchText))) ||
                    (Array.isArray(rw?.Types) && rw.Types.some((t: any) => String(t?.Name || '').toLowerCase().includes(searchText)))
                );
                const key = this.getRunewordKey(rw);
                const okFound = !this.showFoundItems || !this.foundRunewords[key];
                return okType && okSearch && okFound;
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
        if (this._debouncedUpdateList) this._debouncedUpdateList();
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