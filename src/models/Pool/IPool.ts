import { FormulaID } from '~/formulas/models/FormulaID';
import { WallTypeValue } from './WallType';
import { WaterTypeValue } from './WaterType';


export interface IPool {
    // Even before being saved, the objectId must be resolved.
    objectId: string;

    gallons: number;
    name: string;
    formulaId?: FormulaID;
    recipeKey?: string;         // todo: remove me
    waterType: WaterTypeValue;
    wallType: WallTypeValue;
    email?: string;

    // If it was imported from pool doctor, this will be set:
    poolDoctorId?: string;
}
