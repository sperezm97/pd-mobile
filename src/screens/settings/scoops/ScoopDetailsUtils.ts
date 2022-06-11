import { DeviceSettings } from '~/models/DeviceSettings';
import { Treatment } from '~/formulas/models/Treatment';
import { Scoop } from '~/models/Scoop';
import { Util } from '~/services/Util';

export const getTreatmentWithVar = (treatments: Treatment[], varName: string): Treatment | null => {
    return Util.firstOrNull(
        treatments.filter((t) => t.var === varName)
    );
};

export const mapScoopDeviceSettings = (deviceSetting: DeviceSettings, scoop: Scoop, type: 'edit' | 'create') => {
    const newDeviceSetting = Util.deepCopy(deviceSetting);
    if (type === 'create') {
        newDeviceSetting.scoops.push(scoop);
    } else {
        const index = newDeviceSetting.scoops.findIndex((sc) => sc.var === scoop.var);
        if (index >= 0) {
            newDeviceSetting.scoops[index] = scoop;
        }
    }
    return newDeviceSetting;
};
