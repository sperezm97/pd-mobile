import { Range } from './misc/Range';

/**
 * Represents a reading or observation to be taken during performance of a formula
 */
export interface Reading {
    // This reading's user-visible name
    name: string;

    // This reading's variable name for use in the treatment functions
    id: string;

    // Most of these will be ReadingType.number
    type: ReadingType;

    // The units (usually 'ppm' or null).
    units: string | null;

    // The default value:
    defaultValue: number;

    // To enable the slider:
    sliderRange: Range;
    decimalPlaces: number; // Negative values are OK

    // The default target values, if neither the formula nor the end-user override them.
    targetRange: Range;

    // Whether the slider is enabled the first time the user sees this reading
    // TODO: refactor this, it's awkward here now that readings are shared across formulas
    isDefaultOn: boolean;

    // If there is another reading that affects the possible range of this reading:
    offsetReadingId: string | null; // This really only affects the total-chlorine vs free-chlorine.
}

// Eventually, this will be 'number'
export type ReadingType = 'number'; // 'number' | 'text' | 'photo' etc...
