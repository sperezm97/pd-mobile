import { Pool } from '../pool/Pool';
import { EffectiveTargetRanges, ReadingValues, TreatmentValues } from './Values';

export type TreatmentFunction = (
    p: Pool,
    r: ReadingValues,
    t: TreatmentValues,
    c: EffectiveTargetRanges,
) => number | null;
