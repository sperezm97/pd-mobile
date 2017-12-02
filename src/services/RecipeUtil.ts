import compareVersions from 'compare-versions';
import { Recipe } from '~/models/recipe/Recipe';
import { FormulaKey } from '~/models/recipe/FormulaKey';
import { FormulaMeta } from '~/models/recipe/FormulaMeta';

export class RS {
    static toMeta = (recipe: Recipe): FormulaMeta => {
        return {
            id: recipe.id,
            name: recipe.name,
            desc: recipe.description,
            ts: recipe.ts,
            appVersion: recipe.appVersion,
            isOfficial: recipe.isOfficial,
        };
    };

    static getKey = (recipeOrMeta: { id: string; ts: number }): FormulaKey => {
        return `${recipeOrMeta.id}|${recipeOrMeta.ts}`;
    };

    static reverseKey = (key: FormulaKey): { id: string; ts: number } => {
        const parts = key.split('|');
        return {
            id: parts[0],
            ts: parseFloat(parts[1]),
        };
    };

    static isOfficial = (meta: {isOfficial: boolean, id: string}): boolean => {
        // Hack to get this property right for old recipes that were saved before we ever pulled down this information.
        return meta.isOfficial || meta.id === 'vast_argument_756';
    }

    static needUpdateToUseRecipe = (recipeOrMeta: { appVersion: string }, appVersion: string): boolean => {
        return compareVersions.compare(recipeOrMeta.appVersion, appVersion, '>');
    };
}
