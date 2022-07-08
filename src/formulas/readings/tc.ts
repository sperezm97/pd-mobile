import { Reading } from '~/formulas/models/Reading';

export const tc: Reading = {
    name: 'Total Chlorine',
    id: 'tc',
    defaultValue: 3,
    targetRange: {
        min: 0,     // plus the offset of fc, right?
        max: 0.1
    },
    decimalPlaces: 1,
    sliderRange: {
        min: 0,
        max: 7,
    },
    offsetReadingId: 'fc',
    type: 'number',
    units: 'ppm',
    isDefaultOn: true,
};