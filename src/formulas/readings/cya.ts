import { Reading } from '~/formulas/models/Reading';

export const cya: Reading = {
    name: 'Cyanuric Acid',
    id: 'cya',
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
    offsetReadingId: null,
    type: 'number',
    units: 'ppm',
    isDefaultOn: true,
};