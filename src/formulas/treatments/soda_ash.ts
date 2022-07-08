import { Treatment } from '~/formulas/models/Treatment';

export const soda_ash: Treatment = {
    name: 'Sodium Carbonate',
    id: 'soda_ash',
    type: 'dryChemical',
    concentration: 100,
    function: ({ pool, deltas, extra }) => {
        if (deltas.ph === undefined || deltas.ph <= 0) {
            return null;
        }
        const r = extra.readings;

        // This is lazy & unscientific... we just set a cap,
        // because we don't want to use too much of this stuff.
        const maxAmount = pool.gallons * .0048;

        // This is interesting -- the effect of adding a chemical to increase
        // the pH isn't "linear", but instead the measure will asymptotically approach
        // some pH, depending on what chemical you add.

        // In other words, the multiplier actually changes based on the pH measure.
        // This is just a rough approximation grabbed out of thin air -- if anyone
        // wants to "remix" this recipe with a better one, please do! We can use
        // sophisticated operators like Math.log(), I just don't do it yet...
        const sodaAshMultiplierPH = Math.max(
            0.000805,
            0.00035 * (r.ph + 1)
        );
        const sodaAshMultiplierForTA = .00014;      // TODO: verify this guess

        const calculatedAmount = pool.gallons * deltas.ph * sodaAshMultiplierPH;

        // Return the lower of the 2 numbers:
        const amount = Math.min(calculatedAmount, maxAmount);

        const pHEffect = amount / (pool.gallons * sodaAshMultiplierPH);
        const taEffect = amount / (pool.gallons * sodaAshMultiplierForTA);

        return {
            amount,
            effects: {
                ph: pHEffect,
                ta: taEffect,
            }
        };
    }
};
