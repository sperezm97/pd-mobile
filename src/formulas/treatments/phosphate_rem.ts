import { Treatment } from '~/formulas/models/Treatment';

export const phosphate_rem: Treatment = {
    name: 'Phosphate Remover',
    id: 'phosphate_rem',
    type: 'dryChemical',
    concentration: 100,
    function: ({ pool, deltas }) => {
        if (deltas.phosphate === undefined || deltas.phosphate >= 0) {
            return null;
        }

        // TODO: verify this
        // 1oz per 10000 gal removed 250 ppb
        // 1/2 oz per 5000 gal remove 250 ppb
        //1250 gallons reduce by 250 ppb requires .125 oz
        const multiplier = 0.000004;
        const result = Math.round(pool.gallons * deltas.phosphate * multiplier * 100.0) / 100.0;

        // Don't add more than 8 oz per 10k gallons:
        const amount = Math.min(
            Math.abs(result),
            (pool.gallons / 10000) * 8
        );
        return {
            amount,
            effects: {
                phosphate: deltas.phosphate,    // TODO: consider returning _actual_ delta here
            }
        };
    }
};
