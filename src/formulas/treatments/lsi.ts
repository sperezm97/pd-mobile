import { Treatment } from '~/formulas/models/Treatment';

export const lsi: Treatment = {
    name: 'LSI',
    var: 'lsi',
    type: 'calculation',
    function: (p, r, t, c, s) => {
        // We need these 4 readings + temperature to calculate this:
        if (s.ch || s.ph || s.tds || s.ta || (s.temp_f && s.temp_c)) {
            return null;
        }

        // Prefer the temp_f reading (if the user took both for some reason). But, either works:
        const degrees_c = (s.temp_f) ? r.temp_c : ((r.temp_f - 32) / 1.8);

        const aa = (Math.log10(r.tds) - 1) / 10.0;
        const bb = (-13.12 * Math.log10(degrees_c + 273)) + 34.55;
        const cc = Math.log10(r.ch) - .4;
        const dd = Math.log10(r.ta);

        return r.ph - 9.3 - aa - bb + cc + dd;
    }
};
