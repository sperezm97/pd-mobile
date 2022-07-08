import { Treatment } from '~/formulas/models/Treatment';

export const swg_up: Treatment = {
    name: 'Increase Salt Generator',
    id: 'swg_up',
    type: 'task',
    function: ({ pool, deltas }) => {
        if (deltas.fc === undefined || deltas.fc <= 0) {
            return null;
        }
        return {
            amount: 1,
            effects: {}     // Technically, there will be an effect on FC, but not immediate enough for balancing needs.
        };
    }
};
