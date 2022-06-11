import { createAction } from '@reduxjs/toolkit';
import { FormulaID } from '~/formulas/models/FormulaID';

export const updateSelectedFormula = createAction('formula/update', (id: FormulaID | null) => {
    return { payload: id };
});
