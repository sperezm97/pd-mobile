import { DisplayValueOption } from '../Util';

export type VolumeUnits = 'gallons' | 'liters';

export const volumeUnitOptions: DisplayValueOption<VolumeUnits>[] = [
    {
        display: 'Gallons',
        value: 'gallons',
    },
    {
        display: 'Liters',
        value: 'liters',
    },
];

export const getDisplayForVolumeValue = (value: VolumeUnits): string | null => {
    for (let i = 0; i < volumeUnitOptions.length; i++) {
        if (volumeUnitOptions[i].value === value) {
            return volumeUnitOptions[i].display;
        }
    }
    return null;
};
