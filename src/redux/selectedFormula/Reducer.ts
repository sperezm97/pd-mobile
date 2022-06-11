import { createReducer } from '@reduxjs/toolkit';
import { FormulaID } from '~/formulas/models/FormulaID';
import { updateSelectedFormula } from './Actions';

export const selectedFormulaReducer = createReducer(null as FormulaID | null, (builder) => {
    builder
        .addCase(updateSelectedFormula, (state, action) => {
            state = action.payload;
            return state;
        });
});
