import { Treatment } from '~/formulas/models/Treatment';


export const na_clo: Treatment = {
    name: 'Sodium Hypochlorite',
    id: 'na_clo',
    type: 'dryChemical',
    concentration: 12,      // TODO: this should really be from (0,1] instead of x100
    function: ({ pool, deltas }) => {
        if (deltas.fc === undefined || deltas.fc <= 0) {
            return null;
        }

        const sodiumHypo12Multiplier = .00088;

        // We account for the pool's volume, the desired change, and the chemical's... potency?
        const amount = pool.gallons * deltas.fc * sodiumHypo12Multiplier;
        return {
            amount,
            effects: {
                fc: deltas.fc
            }
        };
    }
};
