import { Formula } from './models/Formula';

import { chlorineFormula } from '~/formulas/formulas/chlorine';
import { saltFormula } from '~/formulas/formulas/salt';
import { FormulaMap } from './models/misc/FormulaMap';
import { uvFormula } from './formulas/uv';
import { bromineFormula } from './formulas/bromine';
import { ecoSmarteFormula } from './formulas/ecosmarte';

/// This is a dumb list of all the formulas -- let's grow it real big!
export const allFormulas: Formula[] = [
    chlorineFormula,
    saltFormula,
    uvFormula,
    bromineFormula,
    ecoSmarteFormula,
];

/// This defines which formulas are compatible with which water sanitization types:
export const defaultFormulaMap: FormulaMap = {
    chlorine: 'chlorine_cal_hypo',
    salt_water: 'salt_calc_hypo',
    uv: 'chlorine_uv',
    bromine: 'bromine',
    ozone: 'chlorine_cal_hypo',
    copper: 'ecosmarte',
};
