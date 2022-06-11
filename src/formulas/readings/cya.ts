import { Reading } from '~/formulas/models/Reading';

export const cya: Reading = {
    name: 'Cyanuric Acid',
    var: 'cya',
    defaultValue: 40,
    targetRange: {
        min: 30,
        max: 50,
    },
    decimalPlaces: 0,
    sliderRange: {
        min: 0,
        max: 80,
    },
    offsetReadingVar: null,
    type: 'number',
    units: 'ppm',
    isDefaultOn: true,
};