import { DeviceSettingsPurchaseFields } from '~/models/DeviceSettings';

export namespace DS {
    export const isSubscriptionValid = (ds: DeviceSettingsPurchaseFields, now: number): boolean => {
        if (ds.sub_exp === null) {
            return false;
        }
        // This is the rare case where the subscription renews during the app session but
        // we haven't detected it yet. Just assume it works.
        if (ds.sub_will_renew) {
            return true;
        }
        return ds.sub_exp > now;
    };
}
