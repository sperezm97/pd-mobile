import { Treatment } from '~/formulas/models/Treatment';

export const swg_down: Treatment = {
    name: 'Decrease Salt Generator',
    var: 'swg_down',
    type: 'task',
    function: (p, r, t, c) => {
        if (r.NaCl === undefined) { return null; }

        if (r.NaCl >= c.NaCl.max) {
            return 1;
        }
        return null;
    }
};
