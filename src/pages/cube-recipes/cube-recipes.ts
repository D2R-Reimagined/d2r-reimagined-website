import { bindable, watch } from 'aurelia';

import json from '../item-jsons/cube_recipes.json';

import './cube-recipes.scss';
import { debounce, DebouncedFunction } from '../../utilities/debounce';

export class CubeRecipes {
    recipes = [...json];
    @bindable search: string;

    private _debouncedSearchItem!: DebouncedFunction;

    attached() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this._debouncedSearchItem = debounce(this.handleSearch.bind(this), 350);
    }

    @watch('search')
    handleSearchChanged() {
        this._debouncedSearchItem();
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
