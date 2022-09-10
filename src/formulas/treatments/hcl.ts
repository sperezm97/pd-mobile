import { Treatment } from '~/formulas/models/Treatment';

export const hcl: Treatment = {
    name: 'Hydrochloric Acid',
    id: 'hcl',
    type: 'dryChemical',
    concentration: 33,
    function: ({ pool, deltas, extra }) => {
        if (deltas.ph === undefined || deltas.ph >= 0) {
            return null;
        }

        let multiplier = 0;
        const r = extra.readings;

        if (r.ph > 8.2) {
            multiplier = -.0031;
        }
        else if (r.ph > 8.0) {
            multiplier = -.0032;
        }
        else if (r.ph > 7.8) {
            multiplier = -.0034;
        }
        else if (r.ph > 7.6) {
            multiplier = -.0035;
        }

        const maxAmount = 0.0075 * pool.gallons;
        const calculatedAmount = pool.gallons * deltas.ph * multiplier;
        // Cap the total amount of acid, just in-case someone enters a pH of 100 somehow:
        const amount = Math.min(maxAmount, calculatedAmount);

        const effectOnPH = amount / (pool.gallons * multiplier);

        return {
            amount,
            effects: {
                ph: effectOnPH,
            }
        };
    }
};
