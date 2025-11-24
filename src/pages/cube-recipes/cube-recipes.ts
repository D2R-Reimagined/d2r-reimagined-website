import { bindable, watch } from 'aurelia';

import { debounce, DebouncedFunction } from '../../utilities/debounce';
import v2json from '../item-jsons/cuberecipesv2.json';

import './cube-recipes.scss';

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

    private _debouncedSearchItem!: DebouncedFunction;

    binding() {
        // Read search query parameter from URL when component is initialized
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        if (searchParam) {
            this.search = searchParam;
        }
    }

    attached() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._debouncedSearchItem = debounce(this.handleSearch.bind(this), 350);
    }

    @watch('search')
    handleSearchChanged() {
        this._debouncedSearchItem();

        // Update URL with search query parameter
        const url = new URL(window.location.href);
        if (this.search && this.search.trim() !== '') {
            url.searchParams.set('search', this.search);
        } else {
            url.searchParams.delete('search');
        }

        // Update the URL without reloading the page
        window.history.pushState({}, '', url.toString());
    }

    handleSearch() {
        if (!this.search) {
            this.recipes = this.allRecipes;
            return;
        }
        const found = [];
        for (const recipe of this.allRecipes) {
            // Normalize empty fields
            const desc = recipe.Description ?? '';
            const out = recipe.Output ?? '';
            const inp = recipe.Input ?? '';
            if (
                inp.toLowerCase().includes(this.search.toLowerCase())
                || out.toLowerCase().includes(this.search.toLowerCase())
                || desc.toLowerCase().includes(this.search.toLowerCase())
            ) {
                found.push(recipe);
            }
        }
        this.recipes = found;

    }
}
