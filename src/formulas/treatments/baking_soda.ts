import { Treatment } from '~/formulas/models/Treatment';

export const baking_soda: Treatment = {
    name: 'Sodium Bicarbonate',
    var: 'baking_soda',
    type: 'dryChemical',
    concentration: 100,
    function: (p, r, t, c, s) => {
        if (s.ta) {
            return 0;
        }
        
        // If the TA is already in good range, don't add any baking soda
        if (r.ta >= c.ta.min) {
            return 0;
        }
        
        // Otherwise, shoot for the middle of the ideal range:
        const target = (c.ta.min + c.ta.max) / 2.0;
        let taDelta = target - r.ta;
        
        // Remember, soda ash (from the previous step) also affects the TA,
        // so we should calculate how much (if any) the soda ash has
        // already moved the TA & offset our new delta accordingly:
        const sodaAshMultiplierForTA = .00014;
        const taIncreaseFromSodaAsh = t.soda_ash / (sodaAshMultiplierForTA * p.gallons);
        
        if (taIncreaseFromSodaAsh >= taDelta) {
            return 0;
        }
        taDelta = taDelta - taIncreaseFromSodaAsh;
        
        // Now, calculate the amount of baking soda necessary to close the remaining gap.
        const bakingSodaTAMultiplier = .000224;
        return p.gallons * taDelta * bakingSodaTAMultiplier;
        
        // NOTE: this ignores some complications. For instance, this new dose of
        // baking soda will also raise the pH, and could knock it above the ideal range.
        // If anyone wants to remix this recipe to account for this, you would be a hero.
    }
};
