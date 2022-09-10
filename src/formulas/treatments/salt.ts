import { Treatment } from '~/formulas/models/Treatment';

export const salt: Treatment = {
    name: 'Salt',
    id: 'salt',
    type: 'dryChemical',
    concentration: 100,
    function: ({ pool, deltas, extra }) => {
        if (deltas.salt === undefined || deltas.salt <= 0) {
            return null;
        }
        // Thanks, Paul!
        const magicMultiplierDerivedFromPsoup = 0.0001333714;
        const amount = deltas.salt * pool.gallons * magicMultiplierDerivedFromPsoup;

        return {
            amount,
            effects: {
                salt: deltas.salt,
            }
        };
    }
};
