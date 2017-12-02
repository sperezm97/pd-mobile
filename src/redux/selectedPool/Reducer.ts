// import { AnyAction } from 'redux';

import { IPool } from '~/models/Pool';

import { createReducer } from '@reduxjs/toolkit';

import { clearPool, selectPool, updatePool, deletePool } from './Actions';

export const selectedPoolReducer = createReducer(null as IPool | null, (builder) => {
    builder
        .addCase(selectPool, (state, action) => {
            state = action.payload;
            return state;
        })
        .addCase(clearPool, (state) => {
            state = null;
            return state;
        })
        .addCase(updatePool.fulfilled, (state, action) => {
            state = action.payload;
            return state;
        })
        .addCase(deletePool.fulfilled, (state) => {
            state = null;
            return state;
        });
});
