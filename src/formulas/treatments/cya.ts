import { Treatment } from '~/formulas/models/Treatment';

export const cya: Treatment = {
    name: 'Cyanuric Acid',
    id: 'cya',
    type: 'dryChemical',
    concentration: 100,
    function: ({ pool, deltas }) => {
        if (deltas.cya === undefined || deltas.cya <= 0) {
            return null;
        }
        const multiplier = .00013;
        
        const amount = pool.gallons * deltas.cya * multiplier;
        return {
            amount,
            effects: {
                cya: deltas.cya
            }
        };
    }
};
