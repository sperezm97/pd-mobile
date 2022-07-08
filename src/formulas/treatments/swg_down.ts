import { Treatment } from '~/formulas/models/Treatment';

export const swg_down: Treatment = {
    name: 'Decrease Salt Generator',
    id: 'swg_down',
    type: 'task',
    
    function: ({ pool, deltas }) => {
        if (deltas.fc === undefined || deltas.fc >= 0) {
            return null;
        }
        return {
            amount: 1,
            effects: {}     // Technically, there will be an effect on FC, but not immediate enough for balancing needs.
        };
    }
};
