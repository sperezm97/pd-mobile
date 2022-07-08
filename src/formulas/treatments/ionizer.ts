import { Treatment } from '~/formulas/models/Treatment';

export const ionizer: Treatment = {
    name: 'Increase the Ionizer',
    id: 'ionizer',
    type: 'task',
    function: ({ deltas }) => {
        if (deltas.copper === undefined || deltas.copper <= 0) {
            return null;
        }

        return {
            amount: 1,
            effects: {
                // TODO: reconsider this for tasks?
                copper: deltas.copper,
            },
        };
    }
};
