import { bindable, watch } from 'aurelia';

import { debounce, DebouncedFunction } from '../../utilities/debounce';
import v2json from '../item-jsons/cube_recipes_v2.json';

type V2Input = {
    Name: string;
    Quantity?: number;
    Qualifiers?: string[];
    RawToken?: string;
};

type V2Property = {
    PropertyString: string;
    ModChance?: number;
    Index?: number;
};

type V2Output = {
    Name: string;
    Quantity?: number;
    Qualifiers?: string[];
    Properties?: V2Property[];
};

type V2Recipe = {
    Index: number;
    Op?: number;
    Param?: number | string;
    Value?: number | string;
    Class?: string;
    NumInputs?: number;
    ResolvedInputsCount?: number;
    Inputs?: V2Input[];
    Outputs?: Record<string, V2Output>;
    Notes?: string[];
};

type OutputBlock = {
    key: string; // A, B, C ...
    title: string; // e.g., "Return Updated Item" or "1x Amulet"
    lineOne: string; // "1x Name, Qualifier1, Qualifier2" (or just title if none)
    modifiers: string[]; // qualifiers as individual entries
    properties: string[]; // properties as individual entries, in source order
    // Optional chance text rendered under properties for certain recipes
    chanceText?: string;
};

type DisplayRecipe = {
    // Keeping legacy field names so the existing template keeps working
    Description: string;
    // Optional class restriction/label coming from the recipe JSON
    Class?: string;
    // Joined strings for rendering/searching (kept for backwards compatibility)
    Input: string; // e.g. "1 x Amulet, Corrupted + 1 x Orb of Corruption"
    Output: string; // e.g. "Return Updated Item (Ethereal (Cannot be Repaired)) + 1 x Amulet, Corrupted"
    // Also expose split arrays for potential future UI use
    Inputs?: string[];
    Outputs?: string[];
    // Structured outputs for block rendering
    OutputBlocks?: OutputBlock[];
    // Optionally expose raw for future use
    _raw?: V2Recipe;
};

function mapV2ToDisplay(recipes: V2Recipe[]): DisplayRecipe[] {
    const toQtyName = (qty?: number, name?: string) => {
        const q = typeof qty === 'number' && qty > 0 ? qty : 1;
        // Format as "1x Name" to match requested style
        return `${q}x ${name ?? ''}`.trim();
    };

    const joinQualifiers = (q?: string[]) => {
        const list = (q ?? []).filter(Boolean);
        // Join qualifiers with comma per requested display style
        return list.length ? list.join(', ') : '';
    };

    const shouldOmitQtyForOutput = (name?: string, qty?: number) => {
        // Prefer omitting quantity for textual outputs like "Return Updated Item" when qty is 1
        if (!name) return false;
        if (qty && qty !== 1) return false;
        return name.startsWith('Return');
    };

    return (recipes || []).map(r => {
        // Compute special chance text for "orb of corruption recipe" notes
        const hasOrbOfCorruptionNote = (r.Notes ?? []).some(n =>
            typeof n === 'string' && n.toLowerCase().includes('orb of corruption recipe')
        );

        let chanceText: string | undefined;
        if (hasOrbOfCorruptionNote) {
            // Value can be number or string; parse robustly
            const raw = r.Value as unknown;
            let vNum: number | undefined;
            if (typeof raw === 'number') {
                vNum = raw;
            } else if (typeof raw === 'string') {
                const parsed = parseFloat(raw);
                if (!Number.isNaN(parsed)) vNum = parsed;
            }

            if (typeof vNum === 'number') {
                // Map ranges to chance per specification
                if (vNum === 100) {
                    chanceText = '1% chance';
                } else if (vNum >= 53 && vNum <= 99) {
                    chanceText = '6% chance';
                } else if (vNum >= 46 && vNum <= 52) {
                    chanceText = '7% chance';
                } else if (vNum >= 21 && vNum <= 45) {
                    chanceText = '25% chance';
                } else if (vNum >= 1 && vNum <= 20) {
                    chanceText = '20% chance';
                }
            }
        }
        // Inputs (include qualifiers as modifiers)
        const inputsArr = (r.Inputs ?? []).map(inp => {
            const base = toQtyName(inp.Quantity, inp.Name);
            const qStr = joinQualifiers(inp.Qualifiers);
            return qStr ? `${base}, ${qStr}` : base;
        });
        const inputStr = inputsArr.join(' + ');

        // Outputs: include ALL outputs (A, B, C, ...) and render qualifiers and properties
        const outputsArr: string[] = [];
        const outputBlocks: OutputBlock[] = [];
        if (r.Outputs) {
            const keys = Object.keys(r.Outputs).sort();
            for (const k of keys) {
                const out = r.Outputs[k];
                const base = shouldOmitQtyForOutput(out.Name, out.Quantity)
                    ? `${out.Name ?? ''}`.trim()
                    : toQtyName(out.Quantity, out.Name);
                const qStr = joinQualifiers(out.Qualifiers);
                const props = (out.Properties ?? []).map(p => p.PropertyString).filter(Boolean);
                const withQual = qStr ? `${base}, ${qStr}` : base;
                // Append properties after a comma without extra parentheses wrapper
                const withProps = props.length ? `${withQual}, ${props.join('; ')}` : withQual;
                outputsArr.push(withProps);

                // Build structured block
                outputBlocks.push({
                    key: k,
                    title: base,
                    lineOne: withQual,
                    modifiers: (out.Qualifiers ?? []).filter(Boolean),
                    properties: props,
                    // Show the same chance text under each output block when applicable
                    chanceText,
                });
            }
        }
        const outputStr = outputsArr.join(' + ');

        const description = (r.Notes ?? []).join(' | ');

        return {
            Description: description,
            Class: r.Class,
            Input: inputStr,
            Output: outputStr,
            Inputs: inputsArr,
            Outputs: outputsArr,
            OutputBlocks: outputBlocks,
            _raw: r,
        } as DisplayRecipe;
    });
}

export class CubeRecipes {
    private allRecipes: DisplayRecipe[] = mapV2ToDisplay(v2json as V2Recipe[]);
    recipes: DisplayRecipe[] = [...this.allRecipes];
    @bindable search: string;

    // Filters and options
    @bindable selectedNote: string | undefined;
    @bindable selectedClass: string | undefined;

    noteOptions: Array<{ value: string | undefined; label: string }> = [];
    classOptions: Array<{ value: string | undefined; label: string }> = [];

    private _debouncedSearchItem!: DebouncedFunction;

    binding() {
        // Build dropdown options from the existing data set
        try {
            const noteSet = new Set<string>();
            const classSet = new Set<string>();
            for (const r of this.allRecipes) {
                const raw = r._raw as V2Recipe | undefined;
                for (const n of (raw?.Notes ?? [])) {
                    const t = String(n || '').trim();
                    if (t) noteSet.add(t);
                }
                const cls = String(raw?.Class || '').trim();
                if (cls) classSet.add(cls);
            }
            const noteList = Array.from(noteSet).sort((a, b) => a.localeCompare(b));
            const classList = Array.from(classSet).sort((a, b) => a.localeCompare(b));
            this.noteOptions = [{ value: undefined, label: '-' }, ...noteList.map(n => ({ value: n, label: n }))];
            this.classOptions = [{ value: undefined, label: '-' }, ...classList.map(c => ({ value: c, label: c }))];
        } catch {
            this.noteOptions = [{ value: undefined, label: '-' }];
            this.classOptions = [{ value: undefined, label: '-' }];
        }

        // Read query parameters from URL when component is initialized
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        if (searchParam) this.search = searchParam;

        const noteParam = urlParams.get('note');
        if (noteParam) this.selectedNote = noteParam;

        const classParam = urlParams.get('class');
        if (classParam) this.selectedClass = classParam;
    }

    attached() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._debouncedSearchItem = debounce(this.handleSearch.bind(this), 350);
        // Run initial filter pass based on any URL params
        this.handleSearch();
    }

    @watch('search')
    handleSearchChanged() {
        this._debouncedSearchItem();
        this.updateUrl();
    }

    @watch('selectedNote')
    handleSelectedNoteChanged() {
        this.handleSearch();
        this.updateUrl();
    }

    @watch('selectedClass')
    handleSelectedClassChanged() {
        this.handleSearch();
        this.updateUrl();
    }

    // Inputs/Outputs-only flags removed as redundant; search always scans all text

    private updateUrl() {
        // Update URL with current filters without page reload
        const url = new URL(window.location.href);
        if (this.search && this.search.trim() !== '') url.searchParams.set('search', this.search);
        else url.searchParams.delete('search');

        if (this.selectedNote && String(this.selectedNote).trim() !== '') url.searchParams.set('note', String(this.selectedNote));
        else url.searchParams.delete('note');

        if (this.selectedClass && String(this.selectedClass).trim() !== '') url.searchParams.set('class', String(this.selectedClass));
        else url.searchParams.delete('class');

        window.history.pushState({}, '', url.toString());
    }

    handleSearch() {
        const term = (this.search || '').trim().toLowerCase();
        const selectedNote = (this.selectedNote || '').toLowerCase();
        const selectedClass = (this.selectedClass || '').toLowerCase();

        if (!term && !selectedNote && !selectedClass) {
            this.recipes = this.allRecipes;
            return;
        }

        const found: DisplayRecipe[] = [];
        for (const recipe of this.allRecipes) {
            // Filter by class (exact match)
            if (selectedClass) {
                const rc = (recipe.Class || '').toLowerCase();
                if (rc !== selectedClass) continue;
            }

            // Filter by note (exact match among raw note array)
            if (selectedNote) {
                const notes = (recipe._raw?.Notes || []).map(n => String(n || '').toLowerCase());
                if (!notes.includes(selectedNote)) continue;
            }

            // Text search (always searches across inputs, outputs, and description)
            if (term) {
                const desc = (recipe.Description || '').toLowerCase();
                const inp = [recipe.Input || '', ...(recipe.Inputs || [])].join(' | ').toLowerCase();
                const out = [recipe.Output || '', ...(recipe.Outputs || [])].join(' | ').toLowerCase();
                const haystack = [inp, out, desc].join(' | ');
                if (!haystack.includes(term)) continue;
            }

            found.push(recipe);
        }
        this.recipes = found;
    }
}
