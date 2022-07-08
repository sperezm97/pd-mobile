import { Reading } from '~/formulas/models/Reading';

export const temp_c: Reading = {
    name: 'Temperature',
    id: 'temp_c',
    defaultValue: 27,
    targetRange: {
        min: 24,
        max: 30,
    },
    decimalPlaces: 0,
    sliderRange: {
        min: 0,
        max: 60,
    },
    offsetReadingId: null,
    type: 'number',
    units: 'c',
    isDefaultOn: false,
};