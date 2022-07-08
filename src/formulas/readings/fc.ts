import { Reading } from '~/formulas/models/Reading';

export const fc: Reading = {
    name: 'Free Chlorine',
    id: 'fc',
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