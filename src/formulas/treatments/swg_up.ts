import { Treatment } from '~/formulas/models/Treatment';

export const swg_up: Treatment = {
    name: 'Increase Salt Generator',
    var: 'swg_up',
    type: 'task',
    function: (p, r, t, c, s) => {
        if (s.NaCl) { return 0; }
        if ( r.NaCl < c.NaCl.min) {
            return 1;
        }
        return 0;
    }
};
