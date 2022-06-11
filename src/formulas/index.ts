import { Formula } from './models/Formula';

import { chlorineFormula } from '~/formulas/formulas/chlorine';
import { saltFormula } from '~/formulas/formulas/salt';
import { FormulaMap } from './models/misc/FormulaMap';

/// This is a dumb list of all the formulas -- let's grow it real big!
export const allFormulas: Formula[] = [
    chlorineFormula,
    saltFormula,
];

/// This defines which formulas are compatible with which water sanitization types:
export const defaultFormulaMap: FormulaMap = {
    chlorine: 'chlorine_cal_hypo',
    salt_water: 'salt_calc_hypo',
    // TODO: fill these in:
    uv: 'chlorine_cal_hypo',
    bromine: 'chlorine_cal_hypo',
    ozone: 'chlorine_cal_hypo',
    copper: 'chlorine_cal_hypo',
};
