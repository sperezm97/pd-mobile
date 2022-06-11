import { Reading } from '~/formulas/models/Reading';

export const temp_f: Reading = {
    name: 'Temperature',
    var: 'temp_f',
    defaultValue: 80,
    targetRange: {
        min: 74,
        max: 86,
    },
    decimalPlaces: 0,
    sliderRange: {
        min: 50,
        max: 120,
    },
    offsetReadingVar: null,
    type: 'number',
    units: 'f',
    isDefaultOn: false,
};
