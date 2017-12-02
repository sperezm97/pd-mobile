import { createReducer } from '@reduxjs/toolkit';

import { clearPopover, updatePopoverValue } from './Actions';

const initialState: null | string = null;

export const popoverReducer = createReducer<null | string>(initialState, (builder) => {
    builder
        .addCase(updatePopoverValue, (state, action) => {
            state = action.payload;
            return state;
        })
        .addCase(clearPopover, (state) => {
            state = null;
            return state;
        });
});
