import { DeviceSettings } from '~/models/DeviceSettings';

import { createAction } from '@reduxjs/toolkit';

import { Scoop } from '../../models/Scoop';

export const updateDeviceSettings = createAction<DeviceSettings>('device/update-settings');

export const loadDeviceSettings = createAction<DeviceSettings>('device/load-settings');

// Scoop Actions
export const addScoop = createAction<Scoop>('scoop/add');
export const editScoop = createAction<Scoop>('scoop/edit');
