import { Treatment } from '../models/Treatment';

export const dichlor: Treatment = {
    name: 'Dichlor Shock',
    id: 'dichlor',
    type: 'dryChemical',
    concentration: 99,
    function: ({ pool, deltas }) => {
        if (deltas.fc === undefined || deltas.fc <= 0) {
            return null;
        }

        // This number is more art than science. It's the approximate ounces of <chemical>
        // required to adjust the measurement by 1ppm in a 1 gallon pool.
        // The stronger a chemical is, the lower this number will be.
        const dichlorMultiplier = .000126;

        // We account for the pool's volume, the desired change, and the chemical's... potency?
        const amount = pool.gallons * deltas.fc * dichlorMultiplier;
        return {
            amount,
            effects: {
                fc: deltas.fc,
                // TODO: add effect for CYA
            }
        };
    },
};
