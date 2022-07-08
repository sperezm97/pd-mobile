import { Range } from './misc/Range';

/**
 * Represents a target-range configuration that authors allow end-users to modify locally.
 * It is assumed that the formula's treatment functions will take these settings into account.
 */
export interface TargetRange {
    /// This is the variable name that will be exposed to the treatment functions.
    id: string;
    /// The string displayed to the end-user
    name: string;
    /// The [optional] blob of text explaining to end-users how this target range is used.
    description: string | null;
    /// The target ranges that this formula adds or overrides.
    range: Range;
}


/**
 * The shape of the objects actually passed to the CalculationService to run the treatment functions.
 */
export interface EffectiveTargetRange {
    id: string;
    // min & max for this treatment
    range: Range;
}
