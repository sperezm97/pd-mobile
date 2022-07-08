import { Treatment } from '~/formulas/models/Treatment';

export const baking_soda: Treatment = {
    name: 'Sodium Bicarbonate',
    id: 'baking_soda',
    type: 'dryChemical',
    concentration: 100,
    function: ({ pool, deltas }) => {
        if (deltas.ta === undefined || deltas.ta <= 0) {
            return null;
        }
        
        // Now, calculate the amount of baking soda necessary to close the remaining gap.
        const bakingSodaTAMultiplier = .000224;
        const amount = pool.gallons * deltas.ta * bakingSodaTAMultiplier;
        
        // NOTE: this ignores some complications. For instance, this new dose of
        // baking soda will also raise the pH, and could knock it above the ideal range.
        // If anyone wants to remix this recipe to account for this, you would be a hero.

        return {
            amount,
            effects: {
                ta: deltas.ta
                // TODO: return pH effect here as well.
            }
        };
    }
};
