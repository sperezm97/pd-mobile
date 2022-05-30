import { DeviceSettings } from '~/models/DeviceSettings';
import { Scoop } from '~/models/Scoop';
import { useThunkDispatch, useTypedSelector } from '~/redux/AppState';
import { updateDeviceSettings } from '~/redux/deviceSettings/Actions';

import { DeviceSettingsService } from './DeviceSettingsService';

interface HookResult {
    ds: DeviceSettings;
    updateDS: (newSettings: Partial<DeviceSettings>) => Promise<void>;
    updateDSForScoops: (scoop: Scoop, type: 'create' | 'edit') => Promise<void>
}

/// This hook exposes a simple way to update device settings persistently
export const useDeviceSettings = (): HookResult => {
    const dispatch = useThunkDispatch();
    const ds = useTypedSelector((state) => state.deviceSettings);

    const updateDS = async (delta: Partial<DeviceSettings>) => {
        const updatedSettings = {
            ...ds,
            ...delta,
        };
        dispatch(updateDeviceSettings(updatedSettings));
        await DeviceSettingsService.saveSettings(updatedSettings);
    };

    const updateDSForScoops = async ( scoop: Scoop, type: 'edit' | 'create') => {
        const newDeviceSetting = { ...ds };
        if (type === 'create') {
            newDeviceSetting.scoops.push(scoop);
        } else {
            const index = newDeviceSetting.scoops.findIndex((sc) => sc.var === scoop.var);
            if (index >= 0) {
                newDeviceSetting.scoops[index] = scoop;
            }
        }
        await updateDS(newDeviceSetting);

    };

    return {
        ds,
        updateDS,
        updateDSForScoops,
    };
};
