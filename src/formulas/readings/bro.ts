import { Reading } from '~/formulas/models/Reading';

export const bro: Reading = {
    name: 'Bromine',
    id: 'bro',
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
    offsetReadingId: null,
    type: 'number',
    units: 'ppm',
    isDefaultOn: true,
};