import { Pool } from '../pool/Pool';
import { EffectiveTargetRanges, ReadingValues, SkippedReadings, TreatmentValues } from './Values';

export type TreatmentFunction = (
    p: Pool,
    r: ReadingValues,
    t: TreatmentValues,
    c: EffectiveTargetRanges,
    s: SkippedReadings
) => number | null;
