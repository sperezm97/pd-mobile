import { Reading } from '~/formulas/models/Reading';

export const copper: Reading = {
    name: 'Copper',
    id: 'copper',
    defaultValue: 1,
    targetRange: {
        min: 0.4,
        max: 0.7,
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