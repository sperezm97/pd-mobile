/// When performing a service, we need to associate values with both readings & treatments.

import { Range } from './Range';

/// This is a tiny data type to hold those.
export interface ReadingValue {
    var: string;
    value: number;
}

export interface ReadingValues {
    [varName:string]: number;
}

// These are identical to the shape of the reading types.
export type TreatmentValue = ReadingValue;
export type TreatmentValues = ReadingValues;

/// The target ranges, in the shape needed by the treatment functions:
export interface EffectiveTargetRanges {
    [varName:string]: Range;
}

/// Just a dictionary of skipped values
/// truly, we should do away with this.
export interface SkippedReadings {
    [varName:string]: boolean;
}
