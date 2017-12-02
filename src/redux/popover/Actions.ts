import { createAction } from '@reduxjs/toolkit';

export const updatePopoverValue = createAction('popover/update-state', (value: string) => ({
    payload: value,
}));

export const clearPopover = createAction('popover/clear');
