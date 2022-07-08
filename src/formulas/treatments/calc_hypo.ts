import { Treatment } from '~/formulas/models/Treatment';


export const calc_hypo: Treatment = {
    name: 'Calcium Hypochlorite',
    id: 'calc_hypo',
    type: 'dryChemical',
    concentration: 67,      // TODO: this should really be from (0,1] instead of x100
    function: ({ pool, deltas }) => {
        if (deltas.fc === undefined || deltas.fc <= 0) {
            return null;
        }
        
        // This number is more art than science. It's the approximate ounces of <chemical>
        // required to adjust the measurement by 1ppm in a 1 gallon pool.
        // The stronger a chemical is, the lower this number will be.
        const calcHypo67Multiplier = .000208;
        
        // We account for the pool's volume, the desired change, and the chemical's... potency?
        const amount = pool.gallons * deltas.fc * calcHypo67Multiplier;
        return {
            amount,
            effects: {
                fc: deltas.fc
            }
        };
    }
};
