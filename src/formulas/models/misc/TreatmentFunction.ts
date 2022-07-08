import { Pool } from '../pool/Pool';
import { EffectiveTargetRanges, EffectValues, ReadingValues } from './Values';


export interface TreatmentFunctionRequest {
    pool: Pool,
    deltas: EffectValues,
    // The extra fields should be unnecessary for balancing, but might help for some tasks
    extra: {
        readings: ReadingValues,   // includes derived reading values
        targets: EffectiveTargetRanges,
    }
}

export interface TreatmentFunctionResult {
    amount: number;
    effects: EffectValues;
}

export type TreatmentFunction = (req: TreatmentFunctionRequest) => TreatmentFunctionResult | null;
