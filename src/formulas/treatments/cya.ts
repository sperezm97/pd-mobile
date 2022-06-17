import { Treatment } from '~/formulas/models/Treatment';

export const cya: Treatment = {
    name: 'Cyanuric Acid',
    var: 'cya',
    type: 'dryChemical',
    concentration: 100,
    function: (p, r, t, c) => {
        if (r.cya === undefined) { return null; }
        
        if (r.cya >= c.cya.min) {
            return null;
        }
        
        const target = (c.cya.min + c.cya.max) / 2.0;
        const delta = target - r.cya;
        const multiplier = .00013;
        
        return p.gallons * delta * multiplier;
    }
};
