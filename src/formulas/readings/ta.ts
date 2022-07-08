import { Reading } from '~/formulas/models/Reading';

export const ta: Reading = {
    name: 'Total Alkalinity',
    id: 'ta',
    defaultValue: 100,
    targetRange: {
        min: 80,
        max: 120,
    },
    decimalPlaces: 0, // TODO: can we change to -1?
    sliderRange: {
        min: 50,
        max: 150,
    },
    offsetReadingId: null,
    type: 'number',
    units: 'ppm',
    isDefaultOn: true,
};