import { WallTypeValue } from '~/models/Pool/WallType';
import { Reading, ReadingType } from '~/models/recipe/Reading';
import { Recipe } from '~/models/recipe/Recipe';
import { Treatment, TreatmentType } from '~/models/recipe/Treatment';

import {
    FetchFormula_formulaVersion,
    FetchFormula_formulaVersion_readings,
    FetchFormula_formulaVersion_treatments,
} from './generated/FetchFormula';

export class FormulaTransformer {
    static fromAPI = (apiFormula: FetchFormula_formulaVersion): Recipe => {
        return {
            ...apiFormula,
            readings: apiFormula.readings.map((ar) => FormulaTransformer.readingFromAPI(ar)),
            treatments: apiFormula.treatments.map((at) => FormulaTransformer.treatmentFromAPI(at)),

            // This is gross: all this to typecast the waterType from "string | null" -> "waterType | null"
            custom: apiFormula.custom.map((c) => ({
                ...c,
                defaults: c.defaults.map((d) => ({
                    ...d,
                    wallType: d.wallType as WallTypeValue,
                })),
            })),
            isOfficial: apiFormula.isOfficial,
        };
    };

    static readingFromAPI = (apiReading: FetchFormula_formulaVersion_readings): Reading => {
        return {
            ...apiReading,
            type: apiReading.type as ReadingType,
            idealMax: apiReading.idealMax,
            idealMin: apiReading.idealMin,
            sliderMax: apiReading.sliderMax || 0,
            sliderMin: apiReading.sliderMin || 0,
            decimalPlaces: apiReading.decimalPlaces || 0,
            offsetReadingVar: apiReading.offsetReadingVar,
        };
    };

    static treatmentFromAPI = (apiTreatment: FetchFormula_formulaVersion_treatments): Treatment => {
        return {
            ...apiTreatment,
            type: apiTreatment.type as TreatmentType,
        };
    };
}
