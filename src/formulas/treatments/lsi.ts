import { Treatment } from '~/formulas/models/Treatment';

export const lsi: Treatment = {
    name: 'LSI',
    var: 'lsi',
    type: 'calculation',
    function: (p, r, t, c) => {
        // We need these 4 readings + temperature to calculate this:
        if ((r.ch === undefined)
        || (r.ph === undefined)
        || (r.tds === undefined)
        || (r.ta === undefined)
        || ((r.temp_f === undefined) && (r.temp_c === undefined))
        ) {
            return null;
        }

        // Get the degrees in C, no matter which reading the user actually took.
        const degrees_c = r.temp_c || (r.temp_f - 32) / 1.8;

        const aa = (Math.log10(r.tds) - 1) / 10.0;
        const bb = (-13.12 * Math.log10(degrees_c + 273)) + 34.55;
        const cc = Math.log10(r.ch) - .4;
        const dd = Math.log10(r.ta);

        return r.ph - 9.3 - aa - bb + cc + dd;
    }
};
