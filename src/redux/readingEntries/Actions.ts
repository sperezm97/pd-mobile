import { createAction } from '@reduxjs/toolkit';
import { Reading } from '~/formulas/models/Reading';

export const recordInput = createAction('readings/input', (reading: Reading, value: number) => ({
    payload: {
        reading,
        value,
    },
}));

export const clearReadings = createAction('readings/clear');
