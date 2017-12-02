import { createReducer } from '@reduxjs/toolkit';

import { addScoop, editScoop, loadDeviceSettings, updateDeviceSettings } from './Actions';
import { DeviceSettingsService } from '~/services/DeviceSettings/DeviceSettingsService';

// TODO: @sebas, use either this initial state, or the one passed in AppState.tsx
export const deviceSettingsReducer = createReducer(DeviceSettingsService.getDefaultSettings(), (builder) => {
    builder
        .addCase(updateDeviceSettings, (state, action) => {
            state = action.payload;
            return state;
        })
        .addCase(loadDeviceSettings, (state, action) => {
            state = action.payload;
            return state;
        })
        .addCase(editScoop, (state, action) => {
            state?.scoops.forEach((sc, i) => {
                if (sc.var === action.payload.var) {
                    state.scoops[i] = action.payload;
                }
            });
        })
        .addCase(addScoop, (state, action) => {
            state?.scoops.push(action.payload);
            return state;
        });
});
