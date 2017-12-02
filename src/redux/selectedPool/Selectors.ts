import { Recipe } from '~/models/recipe/Recipe';
import { TargetRange } from '~/models/recipe/TargetRange';
import { AppState } from '~/redux/AppState';

import { createSelector } from '@reduxjs/toolkit';

const getSelectedPoolAndCurrentRecipe = (state: AppState, props: Recipe | null) => ({
    pool: state.selectedPool,
    recipe: props,
});

export const getCustomTargetsBySelectedPool = createSelector([getSelectedPoolAndCurrentRecipe], ({ pool, recipe }) => {
    const customTargets =
        recipe?.custom?.map((customTarget) => ({
            ...customTarget,
            defaults: customTarget.defaults.filter((cs) => cs.wallType === pool?.wallType),
        })) ?? [];

    return customTargets as TargetRange[];
});
