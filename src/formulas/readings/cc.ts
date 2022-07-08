import { Reading } from '~/formulas/models/Reading';

// We should never include this directly in a formula, but we need to list it here so we can display it
// if it's inferred.
export const cc: Reading = {
    name: 'Combined Chlorine',
    id: 'cc',
    defaultValue: 0,
    targetRange: {
        min: 0,
        max: 0.1
    },
    decimalPlaces: 1,
    sliderRange: {
        min: 0,
        max: 7,
    },
    offsetReadingId: null,
    type: 'number',
    units: 'ppm',
    isDefaultOn: false,
};