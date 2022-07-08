import { Reading } from '~/formulas/models/Reading';

export const phosphate: Reading = {
    name: 'Phosphate',
    id: 'phosphate',
    defaultValue: 100,
    targetRange: {
        min: 0,
        max: 100,
    },
    decimalPlaces: 0,   // -1?
    sliderRange: {
        min: 0,
        max: 1000,
    },
    offsetReadingId: null,
    type: 'number',
    units: 'ppm',
    isDefaultOn: false,
};
