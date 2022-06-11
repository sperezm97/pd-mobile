import { Reading } from '~/formulas/models/Reading';

export const ch: Reading = {
    name: 'Calcium Hardness',
    var: 'ch',
    defaultValue: 300,
    targetRange: {
        min: 200,
        max: 400,
    },
    decimalPlaces: 0, // TODO: -1
    sliderRange: {
        min: 0,
        max: 600,
    },

    offsetReadingVar: null,
    type: 'number',
    units: 'ppm',
    isDefaultOn: true,
};