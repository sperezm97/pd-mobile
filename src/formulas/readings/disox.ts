import { Reading } from '~/formulas/models/Reading';

export const disox: Reading = {
    name: 'Dissolved Oxygen',
    id: 'disox',
    defaultValue: 1,
    targetRange: {
        min: 6,
        max: 7,
    },
    decimalPlaces: 1,
    sliderRange: {
        min: 0,
        max: 15,
    },
    offsetReadingId: null,
    type: 'number',
    units: 'ppm',
    isDefaultOn: true,
};