import { TreatmentEntry } from '~/models/logs/TreatmentEntry';

import { createReducer } from '@reduxjs/toolkit';

export const outputsReducer = createReducer([] as TreatmentEntry[], (builder) => {
    builder.addDefaultCase((state) => state);
});
