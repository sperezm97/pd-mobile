import {
    DeviceSettings, DeviceSettingsPurchaseFields, RawDeviceSettings,
} from '~/models/DeviceSettings';

import AsyncStorage from '@react-native-community/async-storage';

import { PurchaseState } from '../subscription/IAP';

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
            sub_exp: null,
            sub_will_renew: false,
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

    /************************
     * This will "trick" your local app into thinking that the app is unlocked,
     * but won't allow you to actually test the checkout flow in dev.
     * *********************/
    // static getSettings = async (): Promise<DeviceSettings> => {
    //     console.warn('USING TEST PURCHASE OVERRIDE, REVERT BEFORE MERGING');
    //     const asString = await AsyncStorage.getItem(DEVICE_SETTINGS_KEY);
    //     if (!asString) {
    //         const ds = DeviceSettingsService.getDefaultSettings();
    //         ds.sub_exp = Date.now() + 3000000000;
    //         return ds;
    //     }
    //     const rs = JSON.parse(asString) as RawDeviceSettings;

    //     // fill it in (if necessary)
    //     const ds = DeviceSettingsService.rawDeviceSettingsToDeviceSettings(rs);

    //     ds.sub_exp = Date.now() + 3000000000;
    //     console.log('SETTINGS:');
    //     console.log(JSON.stringify(ds));
    //     return ds;
    // }

    static saveSettings = async (settings: DeviceSettings): Promise<void> => {
        const asString = JSON.stringify(settings);
        await AsyncStorage.setItem(DEVICE_SETTINGS_KEY, asString);
    };

    private static rawDeviceSettingsToDeviceSettings = (raw: RawDeviceSettings): DeviceSettings => {
        // Just... be careful here.

        let sub_will_renew = raw.sub_will_renew ?? false;
        // Special-case: User purchased app on _old_ version, and this property was not set.
        // In this case, if the expiration is in the future AND sub_will_renew has never been set,
        // give them the benefit of the doubt (we'll also refresh this via RevenueCat later).
        if ((raw.sub_will_renew === undefined) && raw.sub_exp !== null) {
            sub_will_renew = raw.sub_exp > Date.now();
        }

        return {
            ...raw,
            scoops: raw.scoops || [],
            treatments: {
                concentrations: raw.treatments.concentrations,
                units: raw.treatments.units || {},
            },
            sub_will_renew,
        };
    };

    static mapPurchaseStateToDeviceSettingsFields = (ps: PurchaseState): DeviceSettingsPurchaseFields => {
        return {
            sub_exp: ps.details?.exp?.getTime() ?? null,
            sub_will_renew: ps.details?.will_renew ?? false,
        };
    }
}
