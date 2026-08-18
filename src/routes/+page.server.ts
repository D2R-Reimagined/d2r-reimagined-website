import uniques from '../../static/data/keyed/uniques.json';
import sets from '../../static/data/keyed/sets.json';
import runewords from '../../static/data/keyed/runewords.json';
import cubeRecipes from '../../static/data/keyed/cube-recipes.json';

export function load() {
  return {
    counts: {
      uniques: uniques.length,
      sets: sets.length,
      runewords: runewords.length,
      recipes: cubeRecipes.length
    }
  };
}
