import { WaterTypeValue } from '~/models/Pool/WaterType';
import { FormulaKey } from '~/models/recipe/FormulaKey';
import { Formula } from '~/models/recipe/Recipe';

export interface PreloadedFormulas {
    defaultFormulaKeys: Record<WaterTypeValue, FormulaKey[]>;
    formulas: Formula[];
}
