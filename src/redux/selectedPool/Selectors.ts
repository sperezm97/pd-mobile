
import { AppState } from '~/redux/AppState';

import { createSelector } from '@reduxjs/toolkit';
import { Formula } from '~/formulas/models/Formula';
import { TargetRange } from '~/formulas/models/TargetRange';

const getSelectedPoolAndCurrentRecipe = (state: AppState, props: Formula | null) => ({
    pool: state.selectedPool,
    formula: props,
});

export const getCustomTargetsBySelectedPool = createSelector([getSelectedPoolAndCurrentRecipe], ({ pool, formula }) => {
    // TODO: Get these targets correctly
    console.warn('Fix the target ranges reducer!!');
    const customTargets =
        formula?.targets?.map((customTarget) => ({
            ...customTarget,
            defaults: customTarget.defaults.filter((cs) => cs.wallType === pool?.wallType),
        })) ?? [];

    return customTargets as TargetRange[];
});
