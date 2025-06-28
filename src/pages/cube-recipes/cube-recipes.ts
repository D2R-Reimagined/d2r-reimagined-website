import { bindable, watch } from 'aurelia';

import { debounce, DebouncedFunction } from '../../utilities/debounce';
import json from '../item-jsons/cube_recipes.json';

import './cube-recipes.scss';

export class CubeRecipes {
    recipes = [...json];
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
            this.recipes = json;
            return;
        }
        const found = [];
        for (const recipe of json) {
            if (!recipe.CubeRecipeDescription) {
                recipe.CubeRecipeDescription = '';
            }
            if (!recipe.Output) {
                recipe.Output = '';
            }
            if (!recipe.Description) {
                recipe.Description = '';
            }
            if (
                recipe.CubeRecipeDescription.toLowerCase().includes(this.search.toLowerCase())
                ||
                recipe.Output.toLowerCase().includes(this.search.toLowerCase())
                ||
                recipe.Description.toLowerCase().includes(this.search.toLowerCase())
            ) {
                found.push(recipe);
            }
        }
        this.recipes = found;

    }
}
