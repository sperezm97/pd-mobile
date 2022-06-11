import { Reading } from '~/formulas/models/Reading';

/// I *almost* called this 'nacl', but 'salt' is just so easy.
export const salt: Reading = {
    name: 'Salt Level',
    var: 'salt',
    defaultValue: 3200,
    targetRange: {
        min: 3200,
        max: 3200,
    },
    decimalPlaces: 0,
    sliderRange: {
        min: 0,
        max: 5000,
    },
    offsetReadingVar: null,
    type: 'number',
    units: 'ppm',
    isDefaultOn: false,
};
