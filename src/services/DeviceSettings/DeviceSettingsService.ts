import {
    DeviceSettings, RawDeviceSettings,
} from '~/models/DeviceSettings';

import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_SETTINGS_KEY = 'pd_device_settings_0';

export class DeviceSettingsService {
    static getDefaultSettings = (): DeviceSettings => {
        return {
            units: 'us',
            night_mode: 'system',
            treatments: {
                concentrations: {},
                units: {},
            },
            scoops: [],
        };
    };

    static getSettings = async (): Promise<DeviceSettings> => {
        const asString = await AsyncStorage.getItem(DEVICE_SETTINGS_KEY);
        if (!asString) {
            return DeviceSettingsService.getDefaultSettings();
        }
        const rs = JSON.parse(asString) as RawDeviceSettings;

        // fill it in (if necessary)
        const ds = DeviceSettingsService.rawDeviceSettingsToDeviceSettings(rs);

        return ds;
    };

    static saveSettings = async (settings: DeviceSettings): Promise<void> => {
        const asString = JSON.stringify(settings);
        await AsyncStorage.setItem(DEVICE_SETTINGS_KEY, asString);
    };

    private static rawDeviceSettingsToDeviceSettings = (raw: RawDeviceSettings): DeviceSettings => {
        // Just... be careful here.

        return {
            ...raw,
            scoops: raw.scoops || [],
            treatments: {
                concentrations: raw.treatments.concentrations,
                units: raw.treatments.units || {},
            },
        };
    };
}
