import { Reading } from '~/formulas/models/Reading';

export const ta: Reading = {
    name: 'Total Alkalinity',
    var: 'ta',
    defaultValue: 100,
    targetRange: {
        min: 80,
        max: 120,
    },
    decimalPlaces: 0, // TODO: can we change to -1?
    sliderRange: {
        min: 50,
        max: 150,
    },
    offsetReadingVar: null,
    type: 'number',
    units: 'ppm',
    isDefaultOn: true,
};