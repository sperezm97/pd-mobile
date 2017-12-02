import { createAction } from '@reduxjs/toolkit';

export const updateValidSubscription = createAction(
    'subscription',
    (subscription: { hasValidSubscription: boolean }) => ({
        payload: subscription,
    }),
);
