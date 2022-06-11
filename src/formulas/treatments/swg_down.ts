import { Treatment } from '~/formulas/models/Treatment';

export const swg_down: Treatment = {
    name: 'Decrease Salt Generator',
    var: 'swg_down',
    type: 'task',
    function: (p, r, t, c, s) => {
        if (s.NaCl) { return 0; }
        if (r.NaCl >= c.NaCl.max) {
            return 1;
        }
        return 0;
    }
};
