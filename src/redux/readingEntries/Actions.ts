import { Reading } from 'models/recipe/Reading';

import { createAction } from '@reduxjs/toolkit';

export const recordInput = createAction('readings/input', (reading: Reading, value: number) => ({
    payload: {
        reading,
        value,
    },
}));

export const clearReadings = createAction('readings/clear');
