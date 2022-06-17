import { Treatment } from '~/formulas/models/Treatment';

export const m_acid: Treatment = {
    name: 'Muriatic Acid',
    var: 'm_acid',
    type: 'liquidChemical',
    concentration: 31,
    function: (p, r, t, c) => {
        if (r.ph === undefined) { return null; }
        // Muriatic Acid helps to lower the pH. I personally don't like
        // how the acid makes the water slimy & unswimmable for a few hours...
        // but meh.
        
        // If the pH isn't too high... then don't worry about it!
        if (r.ph < c.ph.max) {
            return null;
        }
        
        const targetPh = (c.ph.min + c.ph.max) / 2.0;
        const phDelta = targetPh - r.ph;    // This will be a negative number.
        
        // This is not very precise, feel free to remix. It's another non-linear effect,
        // where the multiplier is different depending on the measure.
        let multiplier = 0;
        
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
        
        // Cap the total amount of acid, just in-case someone enters a pH of 100 somehow:
        const maxAmount = .0032 * p.gallons;
        const calculatedAmount = p.gallons * phDelta * multiplier;
        
        return Math.min(maxAmount, calculatedAmount);
    }
};