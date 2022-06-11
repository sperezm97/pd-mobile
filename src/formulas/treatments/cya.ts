import { Treatment } from '~/formulas/models/Treatment';

export const cya: Treatment = {
    name: 'Cyanuric Acid',
    var: 'cya',
    type: 'dryChemical',
    concentration: 100,
    function: (p, r, t, c, s) => {
        if (s.cya) {
            return 0;
        }
        
        if (r.cya >= c.cya.min) {
            return 0;
        }
        
        const target = (c.cya.min + c.cya.max) / 2.0;
        const delta = target - r.cya;
        const multiplier = .00013;
        
        return p.gallons * delta * multiplier;
    }
};
