import * as RNFS from 'react-native-fs';
import { Formula, Recipe } from '~/models/recipe/Recipe';
import { FormulaKey, getFormulaKey } from '~/models/recipe/FormulaKey';
import { Util } from '~/services/Util';
import { RS } from '~/services/RecipeUtil';
import { Config } from '~/services/Config/AppConfig';

const recipeFolderName = 'recipes';
const defaultFormulas: Formula[] = Config.preloadedFormulas.formulas;

export namespace RecipeRepo {
    /// Attempts to load the recipes from the Recipe folder
    export const loadLocalRecipeWithKey = async (recipeKey: FormulaKey): Promise<Recipe> => {
        const filePath = getFilepathForFormulaKey(recipeKey);

        const fileExists = await RNFS.exists(filePath);
        if (!fileExists) {
            return Promise.reject('File does not exist!');
        }

        const fileData = await RNFS.readFile(filePath, 'utf8');
        const recipe: Recipe = JSON.parse(fileData);

        /// some old recipes might not have the "custom" property, so we default it
        /// to an empty array:
        recipe.custom = recipe.custom || [];

        /// some old recipes might have treatment.formula instead of treatment.function,
        /// so we map it here:
        recipe.treatments.forEach(t => {
            t.function = t.function ?? t.formula;
        });

        /// some old formulas might not have a value for reading.isDefaultOn, so we
        /// default it to true here:
        recipe.readings.forEach(r => {
            r.isDefaultOn = (r.isDefaultOn === undefined) || r.isDefaultOn;
        });

        return recipe;
    };

    /// Saves all the pre-packaged recipes to the file-system:
    export const savePreloadedRecipes = async (): Promise<void> => {
        try {
            await ensureRecipeDirectoryExists();
        } catch (e) {
            return Promise.reject(e);
        }
        const latestLocalFormulaMetas = (await loadLatestLocalFormulaKeys()).map((rk) => RS.reverseKey(rk));

        const promises = defaultFormulas.map((r) => {
            return new Promise<void>(async (resolve) => {
                /// If we've already saved the same (or later) local recipe, skip it.
                const existingNewerFormulaMeta = latestLocalFormulaMetas.filter(
                    (meta) => meta.id === r.id && meta.ts >= r.ts,
                );
                if (existingNewerFormulaMeta.length === 0) {
                    await RecipeRepo.saveRecipe(r);
                }
                resolve();
            });
        });
        await Promise.all(promises);
    };

    /// Saves recipe, will overwrite existing file if it already exists.
    export const saveRecipe = async (recipe: Recipe): Promise<Boolean> => {
        const key = getFormulaKey(recipe);
        const filePath = getFilepathForFormulaKey(key);
        const fileData = JSON.stringify(recipe);

        const fileExists = await RNFS.exists(filePath);
        if (fileExists) {
            // TODO: reconsider returning false here when the recipe already exists
            return false;
        }

        try {
            await RNFS.writeFile(filePath, fileData, 'utf8');
            return true;
        } catch (e) {
            console.warn(JSON.stringify(e));
            return false;
        }
    };

    /// Loads the latest version of each recipe from the filesystem
    export const loadLatestLocalRecipes = async (): Promise<Recipe[]> => {
        const latestFormulaKeys = await RecipeRepo.loadLatestLocalFormulaKeys();
        const loadLatest = latestFormulaKeys.map((key) => RecipeRepo.loadLocalRecipeWithKey(key));
        return await Promise.all(loadLatest);
    };

    export const loadLatestLocalFormulaKeys = async (): Promise<FormulaKey[]> => {
        const folderPath = `${RNFS.DocumentDirectoryPath}/${recipeFolderName}/`;
        const allRecipeFiles = await RNFS.readDir(folderPath);
        const latestRecipeInfos: { id: string; ts: number }[] = [];

        allRecipeFiles.forEach((file) => {
            const key = getFormulaKeyFromFileName(file.name);
            if (!key) {
                return; /* continue to next */
            }

            const meta = RS.reverseKey(key);

            // We received error reports from some clients that apparently have recipes without a timestamp saved... whoops?
            if (!meta.ts) {
                meta.ts = 0;    // Just default to 0... this isn't _great_, but if the id is valid, maybe it'll return a later version.
            }
            const existingIndex = latestRecipeInfos.findIndex((r) => r.id === meta.id);
            if (existingIndex >= 0) {
                // If we already have a recipe w/ this id, keep the newer one
                if (latestRecipeInfos[existingIndex].ts < meta.ts) {
                    latestRecipeInfos[existingIndex] = meta;
                }
            } else {
                // If this is the first recipe w/ this id, keep it
                latestRecipeInfos.push(meta);
            }
        });

        return latestRecipeInfos.map((info) => RS.getKey(info));
    };

    const ensureRecipeDirectoryExists = async (): Promise<void> => {
        const dirPath = `${RNFS.DocumentDirectoryPath}/${recipeFolderName}`;
        const fileExists = await RNFS.exists(dirPath);
        if (!fileExists) {
            try {
                await RNFS.mkdir(dirPath);
            } catch (e) {
                console.warn(e);
                return Promise.reject(e);
            }
        }
    };

    const getFilepathForFormulaKey = (recipeKey: FormulaKey): string => {
        const fileName = recipeKey + '.json';
        const filePath = `${RNFS.DocumentDirectoryPath}/${recipeFolderName}/${fileName}`;
        // console.warn(filePath);
        return filePath;
    };

    const getFormulaKeyFromFileName = (name: string): FormulaKey | null => {
        if (!name.endsWith('.json')) {
            return null;
        }
        return Util.removeSuffixIfPresent('.json', name);
    };

    export const deleteRecipeWithId = async (recipeKey: FormulaKey): Promise<boolean> => {
        const filePath = getFilepathForFormulaKey(recipeKey);
        const fileExists = await RNFS.exists(filePath);
        if (!fileExists) {
            return false;
        }

        try {
            await RNFS.unlink(filePath);
            return true;
        } catch (e) {
            return Promise.reject(e);
        }
    };
}
