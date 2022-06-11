import { Reading } from '~/formulas/models/Reading';

export const ph: Reading = {
    name: 'pH',
    var: 'ph',
    defaultValue: 7.3,
    targetRange: {
        min: 7.2,
        max: 7.6,
    },
    decimalPlaces: 1,
    sliderRange: {
        min: 5,
        max: 9,
    },
    offsetReadingVar: null,
    type: 'number',
    units: null,
    isDefaultOn: true,
};
