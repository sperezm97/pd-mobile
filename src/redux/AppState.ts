import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { combineReducers } from 'redux';

import { configureStore } from '@reduxjs/toolkit';

import { deviceSettingsReducer } from './deviceSettings/Reducer';
import { hasValidSubscriptionReducer } from './hasValidSubscription/Reducer';
import { outputsReducer } from './outputs/Reducer';
import { pickerStateReducer } from './picker/Reducer';
import { popoverReducer } from './popover/Reducer';
import { readingEntriesReducer } from './readingEntries/Reducer';
import { selectedPoolReducer } from './selectedPool/Reducer';
import { selectedRecipeReducer } from './selectedRecipe/Reducer';

const reducer = combineReducers({
    readingEntries: readingEntriesReducer,
    outputs: outputsReducer,
    selectedPool: selectedPoolReducer,
    hasValidSubscription: hasValidSubscriptionReducer,
    pickerState: pickerStateReducer,
    deviceSettings: deviceSettingsReducer,
    selectedFormulaKey: selectedRecipeReducer,
    popover: popoverReducer,
});

export type AppState = ReturnType<typeof reducer>;

export const store = configureStore({
    reducer,
    devTools: __DEV__,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: true,
            serializableCheck: true,
            thunk: true,
        }),
});

/**
 * Global App Dispatch for useDispatch
 * Example: const dispatch: AppDispatch = useDispatch()
 */
export type AppDispatch = typeof store.dispatch;

// Custom hook for handle async functions.
export const useThunkDispatch = () => useDispatch<AppDispatch>();

// Custom hook for basic selectors.
export const useTypedSelector: TypedUseSelectorHook<AppState> = useSelector;

export const dispatch = store.dispatch;
