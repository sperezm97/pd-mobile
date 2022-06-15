import { Treatment } from '~/formulas/models/Treatment';

export const cal_chlor: Treatment = {
    name: 'Calcium Chloride',
    var: 'cal_chlor',
    type: 'dryChemical',
    concentration: 100,
    function: (p, r, t, c) => {
        // If the user didn't take a CH reading, don't try to balance this chem:
        if (r.ch === undefined) { return 0; }

        // If the calcium hardness is above 200, we don't need to add any calcium chloride.
        if (r.ch >= c.ch.min) {
            return 0;
        }

        const target = (c.ch.min + c.ch.max) / 2.0;
        const delta = target - r.ch;
        const multiplier = .000144;

        return p.gallons * delta * multiplier;
    }
};
