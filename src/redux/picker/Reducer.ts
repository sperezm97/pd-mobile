import { createReducer } from '@reduxjs/toolkit';

import { clearPickerState, updatePickerState } from './Actions';
import { PickerState } from './PickerState';

export const pickerStateReducer = createReducer(null as PickerState | null, (builder) => {
    builder
        .addCase(updatePickerState, (state, action) => {
            state = action.payload;
            return state;
        })
        .addCase(clearPickerState, (state) => {
            state = null;
            return state;
        });
});
