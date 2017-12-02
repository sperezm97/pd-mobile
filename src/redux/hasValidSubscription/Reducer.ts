import { createReducer } from '@reduxjs/toolkit';

import { updateValidSubscription } from './Actions';

export const hasValidSubscriptionReducer = createReducer(false, (builder) => {
    builder.addCase(updateValidSubscription, (_, action) => {
        return action.payload.hasValidSubscription;
    });
});
