import { Treatment } from '~/formulas/models/Treatment';

export const soda_ash: Treatment = {
    name: 'Sodium Carbonate',
    var: 'soda_ash',
    type: 'dryChemical',
    concentration: 100,
    function: (p, r, t, c) => {
        if (r.ph === undefined) { return 0; }
        
        // If the ph is already high enough, we don't need any soda ash.
        if (r.ph >= c.ph.min) {
            return 0;
        }
        
        // The target is the average of the min & max (which can be configured by users)
        const target = (c.ph.min + c.ph.max) / 2.0;
        const pHDelta = target - r.ph;
        
        // This is lazy & unscientific... we just set a cap,
        // because we don't want to use too much of this stuff.
        const maxAmount = p.gallons * .0048;
        
        // This is interesting -- the effect of adding a chemical to increase
        // the pH isn't "linear", but instead the measure will asymptotically approach
        // some pH, depending on what chemical you add.
        
        // In other words, the multiplier actually changes based on the pH measure.
        // This is just a rough approximation grabbed out of thin air -- if anyone
        // wants to "remix" this recipe with a better one, please do! We can use
        // sophisticated operators like Math.log(), I just don't do it yet...
        const sodaAshMultiplier = .00035 * (r.ph + 1);
        
        const calculatedAmount = p.gallons * pHDelta * sodaAshMultiplier;
        
        // Return the lower of the 2 numbers:
        return Math.min(calculatedAmount, maxAmount);
    }
};
