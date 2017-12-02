import { WallTypeValue } from '../Pool/WallType';

/**
 * Represents a target-range configuration that authors allow end-users to modify locally.
 * It is assumed that the recipe's formulas will take these settings into account.
 */
export interface TargetRange {
    /// This is the variable name that will be exposed to the treatment formulas.
    var: string;
    /// The string displayed to the end-user
    name: string;
    /// The [optional] blob of text explaining to end-users how this target range is used.
    description: string | null;
    /// The default min & max values for this target range. It's called 'default' because
    /// the user can modify these ranges at will.
    defaults: DefaultRange[];
}
/**
 * The recipe author can set different default ranges for different water types.
 * A waterType of null implies that it is the default, for all non-specified water types.
 */
export interface DefaultRange {
    /// If this matches a pool's wall-type, then this value will be the default for that pool.
    wallType: WallTypeValue | null;
    /// range min
    min: number;
    /// range max
    max: number;
}

/**
 * The shape of the objects actually passed to the CalculationService to run the recipe formulas.
 */
export interface EffectiveTargetRange {
    var: string;
    min: number;
    max: number;
}
