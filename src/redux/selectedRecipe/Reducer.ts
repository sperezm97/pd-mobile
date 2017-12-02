import { createReducer } from '@reduxjs/toolkit';

import { updateSelectedRecipe } from './Actions';
import { FormulaKey } from '~/models/recipe/FormulaKey';

export const selectedRecipeReducer = createReducer(null as FormulaKey | null, (builder) => {
    builder
        .addCase(updateSelectedRecipe, (state, action) => {
            state = action.payload;
            return state;
        });
});
