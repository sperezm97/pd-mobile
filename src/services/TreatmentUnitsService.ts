import { Scoop } from '~/models/Scoop';
import { DryChemicalUnits, WetChemicalUnits } from '~/models/TreatmentUnits';

import { Util } from './Util';

/// Honestly, the way I handle scoops here is kinda stupid. Oh well, here's how it works:
/// If there is a scoop for the var we're interested in, we pass it in to each function-call, and
/// then we append it to the list of valid chemicals & do the conversions from ounces if
/// necessary. Awesome. So, just _always_ pass scoops here & that's all she wrote.

export class Converter {
    // Helper function for cycling through all dry chemical options
    static nextDry = (prevUnits: DryChemicalUnits, scoop: Scoop | null): DryChemicalUnits => {
        const allDryUnits = Util.deepCopy(Converter.allDryUnits);
        if (scoop) {
            allDryUnits.unshift('scoops');
        }
        let index = allDryUnits.indexOf(prevUnits);
        index = (index + 1) % allDryUnits.length;
        return allDryUnits[index];
    };

    // Helper function for cycling through all wet chemical options
    static nextWet = (prevUnits: WetChemicalUnits, scoop: Scoop | null): WetChemicalUnits => {
        const allWetUnits = Util.deepCopy(Converter.allWetUnits);
        if (scoop) {
            allWetUnits.unshift('scoops');
        }
        let index = allWetUnits.indexOf(prevUnits);
        index = (index + 1) % allWetUnits.length;
        return allWetUnits[index];
    };

    static dry = (
        prevValue: number,
        fromUnits: DryChemicalUnits,
        toUnits: DryChemicalUnits,
        scoop: Scoop | null,
    ): number => {
        let prevToOunces = 1;
        switch (fromUnits) {
            case 'ounces':
                prevToOunces = 1;
                break;
            case 'pounds':
                prevToOunces = 16;
                break;
            case 'grams':
                prevToOunces = 0.03527396195;
                break;
            case 'kilograms':
                prevToOunces = 35.27396195;
                break;
            case 'scoops':
                prevToOunces = scoop?.ounces ?? 1;
                break;
        }
        const valueInOunces = prevValue * prevToOunces;
        return Converter.dryOunces(valueInOunces, toUnits, scoop);
    };

    static wet = (
        prevValue: number,
        fromUnits: WetChemicalUnits,
        toUnits: WetChemicalUnits,
        scoop: Scoop | null,
    ): number => {
        let prevToOunces = 1;
        switch (fromUnits) {
            case 'ounces':
                prevToOunces = 1;
                break;
            case 'gallons':
                prevToOunces = 128;
                break;
            case 'milliliters':
                prevToOunces = 0.03381402;
                break;
            case 'liters':
                prevToOunces = 33.81402;
                break;
            case 'scoops':
                prevToOunces = scoop?.ounces ?? 1;
        }
        const valueInOunces = prevValue * prevToOunces;
        return Converter.wetOunces(valueInOunces, toUnits, scoop);
    };

    static dryOunces = (ounces: number, toUnits: DryChemicalUnits, scoop: Scoop | null): number => {
        let multiplier = 1;
        switch (toUnits) {
            case 'ounces':
                multiplier = 1;
                break;
            case 'pounds':
                multiplier = 0.0625;
                break;
            case 'grams':
                multiplier = 28.3495;
                break;
            case 'kilograms':
                multiplier = 0.0283495;
                break;
            case 'scoops':
                multiplier = 1 / (scoop?.ounces ?? 1);
                break;
            default:
                multiplier = 1;
                break;
        }
        return ounces * multiplier;
    };

    static wetOunces = (ounces: number, toUnits: WetChemicalUnits, scoop: Scoop | null): number => {
        let multiplier = 1;
        switch (toUnits) {
            case 'ounces':
                multiplier = 1;
                break;
            case 'gallons':
                multiplier = 0.0078125;
                break;
            case 'milliliters':
                multiplier = 29.5735;
                break;
            case 'liters':
                multiplier = 0.0295735;
                break;
            case 'scoops':
                multiplier = 1 / (scoop?.ounces ?? 1);
                break;
            default:
                multiplier = 1;
                break;
        }
        return ounces * multiplier;
    };

    // Just type-wrangling. Defaults to ounces if input is invalid
    static wetFromString = (s?: string): WetChemicalUnits => {
        if (!s) {
            return 'ounces';
        }
        if (Converter.allWetUnits.some((x) => `${x}` === s)) {
            return s as WetChemicalUnits;
        } else {
            return 'ounces';
        }
    };

    // Just type-wrangling. Defaults to ounces if input is invalid
    static dryFromString = (s?: string): DryChemicalUnits => {
        if (!s) {
            return 'ounces';
        }
        if (Converter.allDryUnits.some((x) => `${x}` === s)) {
            return s as DryChemicalUnits;
        } else {
            return 'ounces';
        }
    };

    private static allDryUnits: DryChemicalUnits[] = ['ounces', 'pounds', 'grams', 'kilograms'];

    private static allWetUnits: WetChemicalUnits[] = ['ounces', 'gallons', 'milliliters', 'liters'];
}
