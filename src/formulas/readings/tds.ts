import { Reading } from '~/formulas/models/Reading';

export const tds: Reading = {
    name: 'TDS',
    var: 'tds',
    defaultValue: 324,
    targetRange: {
        min: 0,
        max: 1500,
    },
    decimalPlaces: 0,       // -2?
    sliderRange: {
        min: 0,
        max: 4000,
    },
    offsetReadingVar: null,
    type: 'number',
    units: 'ppm',
    isDefaultOn: false,
};
