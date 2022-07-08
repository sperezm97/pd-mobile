import { TargetRange } from '../models/TargetRange';

// A target for combined chlorine, useful for formulas that don't let users take this reading directly.
export const ccTarget: TargetRange = {
    id: 'cc',
    range: {
        min: 0,
        max: .11,
    },
    name: 'Combined Chlorine',
    description: null,
};
