import { Treatment } from '~/formulas/models/Treatment';

export const bromine: Treatment = {
    name: 'Bromine',
    id: 'bromine',
    type: 'dryChemical',
    concentration: 100,
    function: ({ pool, deltas }) => {
        if (deltas.bro === undefined || deltas.bro <= 0) {
            return null;
        }

        // This number is the one that PoolDoctor used, but I don't remember where it came from.
        // It's the approximate ounces of <chemical>
        // required to adjust the measurement by 1ppm in a 1 gallon pool.
        // The stronger a chemical is, the lower this number will be.
        const bromineMultiplier = .0001;

        // We account for the pool's volume, the desired change, and the chemical's... potency?
        const amount = pool.gallons * deltas.bro * bromineMultiplier;
        return {
            amount,
            effects: {
                bro: deltas.bro,
            },
        };
    }
};
