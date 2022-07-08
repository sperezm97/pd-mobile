import { EffectiveTargetRanges, EffectValues, ReadingValues } from './Values';

export type ReadingsAndDelta = {
    readings: ReadingValues;
    deltas: EffectValues;
    targets: EffectiveTargetRanges;
};

/// This is a pure function on the custom targets for a formula.
/// It accepts the readings & current desired effects, and returns new desired effects.
export type GetUpdatedReadingsAndDeltas = (input: ReadingsAndDelta) => ReadingsAndDelta;
