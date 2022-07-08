import { Treatment } from '~/formulas/models/Treatment';

export const oxidizer: Treatment = {
    name: 'Increase the Oxidizer',
    id: 'oxidizer',
    type: 'task',
    function: ({ deltas }) => {
        if (deltas.disox === undefined || deltas.disox <= 0) {
            return null;
        }

        return {
            amount: 1,
            effects: {
                disox: deltas.disox,
            },
        };
    }
};
