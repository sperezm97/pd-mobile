import { createAction } from '@reduxjs/toolkit';

import { PickerState } from './PickerState';

export const updatePickerState = createAction('picker/update-state', (picker: PickerState) => ({
    payload: picker,
}));

export const clearPickerState = createAction('picker/clear');
