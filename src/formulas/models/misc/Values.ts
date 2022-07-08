/// When performing a service, we need to associate values with both readings & treatments.

import { Range } from './Range';

/// This is a tiny data type to hold those.
export interface ReadingValue {
    id: string;
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

export type EffectValues = ReadingValues;
