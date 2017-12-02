import { DeviceSettings } from '~/models/DeviceSettings';
import { PoolUnit } from '~/models/Pool/PoolUnit';

import { ConversionUtil } from './ConversionsUtil';
import { Util } from './Util';

export class VolumeUnitsUtil {
    static getNextUnitValue = (inputUnit: PoolUnit): PoolUnit => {
        const units: PoolUnit[] = ['us', 'metric', 'imperial'];
        const inputIndex = units.indexOf(inputUnit);
        // if the last item, return the first item
        const nextUnit = (inputIndex + 1) % units.length;
        const nextValue = units[nextUnit];
        return nextValue;
    };

    static getPrevUnitValue = (inputUnit: PoolUnit): PoolUnit => {
        const units: PoolUnit[] = ['us', 'metric', 'imperial'];
        const inputIndex = units.indexOf(inputUnit);
        // if the first item, return the last item
        const prevUnit = inputIndex === 0 ? 2 : inputIndex - 1;
        const nextValue = units[prevUnit];
        return nextValue;
    };

    static getDisplayVolume = (gallons: number, settings: DeviceSettings): string => {
        switch (settings.units) {
            case 'us':
                return `${gallons.toLocaleString(undefined, { maximumFractionDigits: 0 })} US Gallons`;
            case 'metric':
                return `${ConversionUtil.usGallonsToLiters(gallons).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                })} Liters`;
            case 'imperial':
                return `${ConversionUtil.usGallonsToImpGallon(gallons).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                })} Imp Gallons`;
        }
    };

    static getAbbreviatedDisplayVolume = (gallons: number, settings: DeviceSettings): string => {
        switch (settings.units) {
            case 'us':
                return `${Util.abbreviate(gallons)} Gallons`;
            case 'metric':
                return `${Util.abbreviate(ConversionUtil.usGallonsToLiters(gallons))} Liters`;
            case 'imperial':
                return `${Util.abbreviate(ConversionUtil.usGallonsToImpGallon(gallons))} Gallons (Imperial)`;
        }
    };

    static getValueVolumeByUnit = (gallons: number, fromUnit: PoolUnit): number => {
        switch (fromUnit) {
            case 'metric':
                return ConversionUtil.usGallonsToLiters(gallons);
            case 'imperial':
                return ConversionUtil.usGallonsToImpGallon(gallons);
            default:
                return gallons;
        }
    };

    static getUsGallonsByUnit = (gallons: number, fromUnit: PoolUnit): number => {
        switch (fromUnit) {
            case 'metric':
                return ConversionUtil.litersToUsGallons(gallons);
            case 'imperial':
                return ConversionUtil.impGallonsToUsGallon(gallons);
            default:
                return gallons;
        }
    };

    static getLitersByUnit = (gallons: number, fromUnit: PoolUnit): number => {
        switch (fromUnit) {
            case 'us':
                return ConversionUtil.usGallonsToLiters(gallons);
            case 'imperial':
                return ConversionUtil.impGallonsToLiters(gallons);
            default:
                return gallons;
        }
    };

    static getImpGallonByUnit = (gallons: number, fromUnit: PoolUnit): number => {
        switch (fromUnit) {
            case 'us':
                return ConversionUtil.usGallonsToImpGallon(gallons);
            case 'metric':
                return ConversionUtil.litersToImpGallons(gallons);
            default:
                return gallons;
        }
    };

    static getVolumeByUnit = (gallons: number, prevUnit: PoolUnit, nextUnit: PoolUnit): number => {
        switch (nextUnit) {
            case 'us':
                return VolumeUnitsUtil.getUsGallonsByUnit(gallons, prevUnit);
            case 'metric':
                return VolumeUnitsUtil.getLitersByUnit(gallons, prevUnit);
            case 'imperial':
                return VolumeUnitsUtil.getImpGallonByUnit(gallons, prevUnit);
        }
    };
}
