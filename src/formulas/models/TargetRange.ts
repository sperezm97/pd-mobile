import { WallTypeValue } from '~/formulas/models/pool/WallType';
import { Range } from './misc/Range';

/// TODO: clean this up. It adds a lot of complexity for a tiny amount of functionality.
/// - get rid of wallType options?
/// - rename things
/// - change how they're passed into the formulas


/**
 * Represents a target-range configuration that authors allow end-users to modify locally.
 * It is assumed that the formula's treatment functions will take these settings into account.
 */
export interface TargetRange {
    /// This is the variable name that will be exposed to the treatment functions.
    var: string;
    /// The string displayed to the end-user
    name: string;
    /// The [optional] blob of text explaining to end-users how this target range is used.
    description: string | null;
    /// The target ranges that this formula overrides.
    defaults: DefaultRange[];
}
/**
 * The formula author can set different default ranges for different water types.
 * A waterType of null implies that it is the default, for all non-specified water types.
 */
export interface DefaultRange {
    /// If this matches a pool's wall-type, then this value will be the default for that pool.
    wallType: WallTypeValue | null;
    /// Min & max for this wall-type
    range: Range;
}

/**
 * The shape of the objects actually passed to the CalculationService to run the treatment functions.
 */
export interface EffectiveTargetRange {
    var: string;
    // min & max for this treatment
    range: Range;
}
