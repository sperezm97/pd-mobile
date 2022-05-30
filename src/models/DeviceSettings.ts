// This is the way that we can reference the DeviceSettings after they've been processed through the DSService.

import { PoolUnit } from './Pool/PoolUnit';
import { Scoop } from './Scoop';

// Undefined keys are replaced with default values.
export interface DeviceSettings {
    units: PoolUnit;
    night_mode: 'dark' | 'light' | 'system';
    treatments: {
        concentrations: { [varName: string]: number };
        // The last units selected for a particular treatment
        units: { [varName: string]: string };
    };
    // Custom scoops, keyed to output vars
    scoops: Scoop[];
}

// This is the way we must handle the DeviceSettings when loading them from persistent storage.
// Depending on the app version used to save them, some keys might be undefined.
export interface RawDeviceSettings {
    units: PoolUnit;
    night_mode: 'dark' | 'light' | 'system';
    treatments: {
        concentrations: { [varName: string]: number };
        // The last units selected for a particular treatment
        units?: { [varName: string]: string };
    };
    // Custom scoops, keyed to output vars
    scoops?: Scoop[];

    // All the info about a user's subscription:
    sub_exp?: number | null;
    sub_will_renew?: boolean;
}
