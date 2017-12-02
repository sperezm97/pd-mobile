// subtract in
//  https://opentextbc.ca/basickitchenandfoodservicemanagement/chapter/imperial-and-u-s-systems-of-measurement/
export class ConversionUtil {
    // Us Gallons to Metric Liters
    static usGallonsToLiters = (gallons: number): number => {
        return gallons * 3.78541;
    };

    // US gallons to Imperial Gallons
    static usGallonsToImpGallon = (usGallon: number): number => {
        return usGallon * 0.832674;
    };

    // Metric Liters To Use Gallons
    static litersToUsGallons = (liters: number): number => {
        return liters / 3.78541;
    };

    // Metric Liters to Imperial Gallons
    static litersToImpGallons = (liters: number): number => {
        return liters / 4.54609;
    };

    // Imperial Gallon to US gallons
    static impGallonsToUsGallon = (impGallon: number): number => {
        return impGallon * 1.20095;
    };

    // Imperial Gallons to Metric Liter
    static impGallonsToLiters = (impGallon: number): number => {
        return impGallon * 4.54609;
    };
}
