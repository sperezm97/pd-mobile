import { WaterTypeValue } from '~/models/Pool/WaterType';
import { Formula } from '~/formulas/models/Formula';
import { allFormulas, defaultFormulaMap } from '~/formulas';
import { FormulaID } from '~/formulas/models/FormulaID';
import { chlorineFormula } from '~/formulas/formulas/chlorine';
import { Util } from './Util';

export class FormulaService {
    private static defaultFormula = chlorineFormula;
    static defaultFormulaId = FormulaService.defaultFormula.id;

    static getFormulaIdForWaterType = (wt: WaterTypeValue): FormulaID => {
        return defaultFormulaMap[wt];
    }

    // TODO: make this more efficient after I have ~100 formulas
    static getFormulaById = (formulaID: FormulaID): Formula => {
        return Util.firstOrNull(allFormulas.filter(f => f.id === formulaID)) ?? this.defaultFormula;
    };

    static getAllFormulas = (): Formula[] => {
        return allFormulas;
    }
}
