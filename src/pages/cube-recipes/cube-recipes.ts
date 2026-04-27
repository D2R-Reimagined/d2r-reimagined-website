import { bindable, watch } from 'aurelia';

import { character_class_options } from '../../resources/constants';
import { debounce, IDebouncedFunction } from '../../utilities/debounce';
import { matchesTokenGroups, tokenizeSearch } from '../../utilities/filter-helpers';
import { IKeyedLine } from '../../utilities/i-keyed-line';
import { format, t } from '../../utilities/translation-store.js';
import { isBlankOrInvalid, syncParamsToUrl } from '../../utilities/url-sanitize';

type V2Input = {
    Name: IKeyedLine;
    Quantity?: number;
    Qualifiers?: (string | IKeyedLine)[];
    RawToken?: string;
};

type V2Output = {
    Name: IKeyedLine;
    Quantity?: number;
    Qualifiers?: (string | IKeyedLine)[];
    Lines?: IKeyedLine[];
};

type V2Recipe = {
    Index: number;
    Op?: number;
    Param?: number | string;
    Value?: number | string;
    RequiredClass?: string;
    NumInputs?: number;
    ResolvedInputsCount?: number;
    Inputs?: V2Input[];
    Outputs?: Record<string, V2Output>;
    Notes?: IKeyedLine[];
    Enabled?: boolean;
};

type OutputBlock = {
    key: string; // A, B, C ...
    title: string; // e.g., "Return Updated Item" or "1x Amulet"
    lineOne: string; // "1x Name, Qualifier1, Qualifier2" (or just title if none)
    modifiers: string[]; // qualifiers as individual entries
    properties: IKeyedLine[]; // properties as individual entries, in source order
    // Optional chance text rendered under properties for certain recipes
    chanceText?: string;
};

type DisplayRecipe = {
    // Keeping legacy field names so the existing template keeps working
    Description: string;
    // Optional selectedClass restriction/label coming from the recipe JSON
    RequiredClass?: string;
    // Joined strings for rendering (kept for backwards compatibility)
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
    const toQtyName = (qty?: number, name?: IKeyedLine) => {
        const q = typeof qty === 'number' && qty > 0 ? qty : 1;
        // Format as "1x Name" to match the requested style
        return `${q}x ${format(name) ?? ''}`.trim();
    };

    const joinQualifiers = (q?: (string | IKeyedLine)[]) => {
        const list = (q ?? []).map(item => {
            if (typeof item === 'string') return item;
            return format(item);
        }).filter(Boolean);
        // Join qualifiers with comma per requested display style
        return list.length ? list.join(', ') : '';
    };

    const shouldOmitQtyForOutput = (name?: IKeyedLine, qty?: number) => {
        // Prefer omitting quantity for textual outputs like "Return Updated Item" when qty is 1
        const n = format(name);
        if (!n) return false;
        if (qty && qty !== 1) return false;
        return n.startsWith('Return');
    };

    return (recipes || []).map((r) => {
        const mappedClass = r.RequiredClass ? `class_${r.RequiredClass.toLowerCase()}` : undefined;

        // Compute special chance text for "orb of corruption recipe" notes
        const hasOrbOfCorruptionNote = (r.Notes ?? []).some(
            (n) =>
                n.key === 'strCubeNoteOrbOfCorruption' ||
                format(n).toLowerCase().includes('orb of corruption recipe'),
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
                    chanceText = t('label_chance', [1]);
                } else if (vNum >= 53 && vNum <= 99) {
                    chanceText = t('label_chance', [6]);
                } else if (vNum >= 46 && vNum <= 52) {
                    chanceText = t('label_chance', [7]);
                } else if (vNum >= 21 && vNum <= 45) {
                    chanceText = t('label_chance', [25]);
                } else if (vNum >= 1 && vNum <= 20) {
                    chanceText = t('label_chance', [20]);
                }
            }
        }
        // Inputs (include qualifiers as modifiers)
        const inputsArr = (r.Inputs ?? []).map((inp) => {
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
                    ? `${format(out.Name) ?? ''}`.trim()
                    : toQtyName(out.Quantity, out.Name);
                const qStr = joinQualifiers(out.Qualifiers);
                const lines = out.Lines ?? [];
                const propsStrings = lines.map((l) => format(l)).filter(Boolean);

                const withQual = qStr ? `${base}, ${qStr}` : base;
                // Append properties after a comma without an extra parentheses wrapper
                const withProps = propsStrings.length
                    ? `${withQual}, ${propsStrings.join('; ')}`
                    : withQual;
                outputsArr.push(withProps);

                // Build a structured block
                outputBlocks.push({
                    key: k,
                    title: base,
                    lineOne: withQual,
                    modifiers: (out.Qualifiers ?? []).map(q => typeof q === 'string' ? q : format(q)).filter(Boolean),
                    properties: lines,
                    // Show the same chance text under each output block when applicable
                    chanceText,
                });
            }
        }
        const outputStr = outputsArr.join(' + ');

        const description = (r.Notes ?? []).map(n => format(n)).join(' | ');

        return {
            Description: description,
            RequiredClass: mappedClass,
            Input: inputStr,
            Output: outputStr,
            Inputs: inputsArr,
            Outputs: outputsArr,
            OutputBlocks: outputBlocks,
            _raw: r,
        };
    });
}

export class CubeRecipes {
    private allRecipes: DisplayRecipe[] = [];
    recipes: DisplayRecipe[] = [];

    formatGroupName(name: string) {
        return name.replace(/-/g, ' ').replace(/([a-z])([0-9])/g, '$1 $2');
    }

    @bindable search: string;

    // Filters and options
    @bindable selectedNote: string | undefined;
    @bindable selectedClass: string | undefined;

    noteOptions: Array<{ value: string | undefined; label: string }> = [];
    classOptions = character_class_options.map(opt => ({
        ...opt,
        label: t(opt.label),
    }));

    private _debouncedSearchItem!: IDebouncedFunction;

    async binding() {
        // Fetch keyed cube recipes data
        try {
            const resp = await fetch('/data/keyed/cube-recipes.json');
            const raw = (await resp.json()) as V2Recipe[];
            this.allRecipes = mapV2ToDisplay(raw);
            this.recipes = [...this.allRecipes];
        } catch (e) {
            console.error('Failed to load cube recipes:', e);
            this.allRecipes = [];
            this.recipes = [];
        }

        // Build dropdown options from the existing data set
        try {
            const noteSet = new Set<string>();
            for (const r of this.allRecipes) {
                const raw = r._raw;
                for (const n of raw?.Notes ?? []) {
                    const t = format(n).trim();
                    if (t) noteSet.add(t);
                }
            }
            const noteList = Array.from(noteSet).sort((a, b) => a.localeCompare(b));
            this.noteOptions = [
                { value: '', label: '-' },
                ...noteList.map((n) => ({ value: n, label: n })),
            ];
        } catch {
            this.noteOptions = [{ value: '', label: '-' }];
        }

        // Read query parameters from URL when the component is initialized
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        if (searchParam && !isBlankOrInvalid(searchParam))
            this.search = searchParam;

        const noteParam = urlParams.get('note');
        if (noteParam && !isBlankOrInvalid(noteParam))
            this.selectedNote = noteParam;

        const classParam = urlParams.get('selectedClass');
        if (classParam && !isBlankOrInvalid(classParam))
            this.selectedClass = classParam;
    }

    attached() {
        this._debouncedSearchItem = debounce(() => this.handleSearch(), 350);
        // Run the initial filter pass based on any URL params
        this.handleSearch();
        this.updateUrl();
    }

    @watch('search')
    handleSearchChanged() {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        }
        this.updateUrl();
    }

    @watch('selectedNote')
    handleSelectedNoteChanged() {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        } else {
            this.handleSearch();
        }
        this.updateUrl();
    }

    @watch('selectedClass')
    handleSelectedClassChanged() {
        if (this._debouncedSearchItem) {
            this._debouncedSearchItem();
        } else {
            this.handleSearch();
        }
        this.updateUrl();
    }

    // Inputs/Outputs-only flags removed as redundant; search always scans all text

    private updateUrl() {
        syncParamsToUrl({
            search: this.search,
            note: this.selectedNote,
            selectedClass: this.selectedClass,
        }, false);
    }

    handleSearch() {
        const tokens = tokenizeSearch(this.search);
        const selectedNote = (this.selectedNote || '').toLowerCase();
        const selectedClass = (this.selectedClass || '').toLowerCase();

        if (!tokens.length && !selectedNote && !selectedClass) {
            this.recipes = this.allRecipes;
            return;
        }

        const found: DisplayRecipe[] = [];
        for (const recipe of this.allRecipes) {
            // Filter by selectedClass (exact match)
            if (selectedClass) {
                const rc = (recipe.RequiredClass || '').toLowerCase();
                if (!rc.includes(selectedClass)) continue;
            }

            // Filter by note (exact match among a raw note array)
            if (selectedNote) {
                const notes = (recipe._raw?.Notes || []).map((n) =>
                    (typeof n === 'string' ? n : '').toLowerCase(),
                );
                if (!notes.includes(selectedNote)) continue;
            }

            // Text search (tokenized AND across inputs, outputs, and description)
            if (tokens.length) {
                const desc = (recipe.Description || '').toLowerCase();
                const inp = [recipe.Input || '', ...(recipe.Inputs || [])]
                    .join(' ')
                    .toLowerCase();
                const out = [recipe.Output || '', ...(recipe.Outputs || [])]
                    .join(' ')
                    .toLowerCase();
                const haystack = [inp, out, desc]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                if (!matchesTokenGroups(haystack, tokens))
                    continue;
            }

            found.push(recipe);
        }
        this.recipes = found;
    }

    // Reset filters by default (show all) and refresh URL/list
    resetFilters() {
        this.search = '';
        this.selectedNote = undefined;
        this.selectedClass = undefined;
        this.recipes = this.allRecipes;
        this.updateUrl();
    }
}
