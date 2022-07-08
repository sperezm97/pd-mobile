import { Reading } from '~/formulas/models/Reading';

export const ch: Reading = {
    name: 'Calcium Hardness',
    id: 'ch',
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

    offsetReadingId: null,
    type: 'number',
    units: 'ppm',
    isDefaultOn: true,
};