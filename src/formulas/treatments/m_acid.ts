import { Treatment } from '~/formulas/models/Treatment';

export const m_acid: Treatment = {
    name: 'Muriatic Acid',
    id: 'm_acid',
    type: 'liquidChemical',
    concentration: 31,
    function: ({ pool, deltas, extra }) => {
        if (deltas.ph === undefined || deltas.ph >= 0) {
            return null;
        }
        // Muriatic Acid helps to lower the pH. I personally don't like
        // how the acid makes the water slimy & unswimmable for a few hours...
        // but meh.
        
        // This is not very precise, feel free to remix. It's another non-linear effect,
        // where the multiplier is different depending on the measure.
        let multiplier = 0;
        const r = extra.readings;
        
        if (r.ph > 8.2) {
            multiplier = -.0027;
        }
        else if (r.ph > 8.0) {
            multiplier = -.0028;
        }
        else if (r.ph > 7.8) {
            multiplier = -.0029;
        }
        else if (r.ph > 7.6) {
            multiplier = -.0030;
        }
        
        
        const maxAmount = .0032 * pool.gallons;
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
