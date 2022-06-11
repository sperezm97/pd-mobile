import { Treatment } from '~/formulas/models/Treatment';

export const phosphate_rem: Treatment = {
    name: 'Phosphate Remover',
    var: 'phosphate_rem',
    type: 'dryChemical',
    concentration: 100,
    function: (p, r, t, c, s) => {
        if (s.phosp) { return 0; }
        if (r.phosp < c.phosp.max) {
            return 0;
        }

        // TODO: verify this
        // 1oz per 10000 gal removed 250 ppb
        // 1/2 oz per 5000 gal remove 250 ppb
        //1250 gallons reduce by 250 ppb requires .125 oz

        const galMultiplier = p.gallons / 1250;
        const doseage = .125;
        const reduction = r.phosp / 250;

        return Math.round(galMultiplier * reduction * doseage * 100.0) / 100.0;
    }
};
