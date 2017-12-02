import { createAction } from '@reduxjs/toolkit';
import { FormulaKey } from '~/models/recipe/FormulaKey';

export const updateSelectedRecipe = createAction('recipe/update', (key: FormulaKey | null) => {
    return { payload: key };
});
