import { TargetRangeOverride } from '~/models/Pool/TargetRangeOverride';
import { WallTypeValue } from '~/models/Pool/WallType';
import { Recipe } from '~/models/recipe/Recipe';
import { EffectiveTargetRange, TargetRange } from '~/models/recipe/TargetRange';
import { Util } from '~/services/Util';

export interface MinMax {
    min: number;
    max: number;
}

export namespace TargetsHelper {
    export const resolveRangesForPool = (
        recipe: Recipe,
        poolWallType: WallTypeValue,
        localOverridesForPool: TargetRangeOverride[],
    ): EffectiveTargetRange[] => {
        return recipe.custom.map((tr) => {
            const localOverride = Util.firstOrNull(localOverridesForPool.filter((local) => local.var === tr.var));
            return {
                ...resolveMinMax(tr, poolWallType, localOverride),
                var: tr.var,
            };
        });
    };

    export const resolveMinMax = (
        targetRange: TargetRange,
        poolWallType: WallTypeValue,
        locallySavedOverride: TargetRangeOverride | null,
    ): MinMax => {
        /// If there's a local override saved, always use that:
        if (locallySavedOverride) {
            return {
                min: locallySavedOverride.min,
                max: locallySavedOverride.max,
            };
        }

        /// Second, try to find a default on the recipe for this pool's wall-type
        const recipeDefaultRangeForWallType = Util.firstOrNull(
            targetRange.defaults.filter((d) => d.wallType === poolWallType),
        );
        if (recipeDefaultRangeForWallType) {
            return {
                min: recipeDefaultRangeForWallType.min,
                max: recipeDefaultRangeForWallType.max,
            };
        }

        /// Lastly, try to find a default on the recipe with a null wall-type
        const recipeDefaultRange = Util.firstOrNull(targetRange.defaults.filter((d) => d.wallType === null));
        if (recipeDefaultRange) {
            return {
                min: recipeDefaultRange.min,
                max: recipeDefaultRange.max,
            };
        }

        /// This is an error-condition & should never happen... default to 0?
        console.error('Error, target range has no default');
        return { min: 0, max: 0 };
    };
}
