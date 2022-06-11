import { Reading } from '~/formulas/models/Reading';

export const fc: Reading = {
    name: 'Free Chlorine',
    var: 'fc',
    defaultValue: 3,
    targetRange: {
        min: 3,
        max: 5,
    },
    decimalPlaces: 1,
    sliderRange: {
        min: 0,
        max: 7,
    },
    offsetReadingVar: null,
    type: 'number',
    units: 'ppm',
    isDefaultOn: true,
};