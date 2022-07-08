import { Treatment } from '~/formulas/models/Treatment';

export const cal_chlor: Treatment = {
    name: 'Calcium Chloride',
    id: 'cal_chlor',
    type: 'dryChemical',
    concentration: 100,
    function: ({ pool, deltas }) => {
        if (deltas.ch === undefined || deltas.ch <= 0) {
            return null;
        }
        const multiplier = .000144;

        const amount = pool.gallons * deltas.ch * multiplier;
        return {
            amount,
            effects: {
                ch: deltas.ch
            }
        };
    }
};
