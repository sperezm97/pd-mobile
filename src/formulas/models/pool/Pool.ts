import { WallTypeValue } from './WallType';
import { WaterTypeValue } from './WaterType';

/// These are just the properties of the pool needed by the treatment functions:
export interface Pool {
    // We pass both gallons & liters to the treatment functions, so formula authors can use either.
    // Generally, the user only enters 1 of these, and the other is computed.
    gallons: number;
    liters: number;
    // If I was really good, this would be called SanitizationMethod
    waterType: WaterTypeValue;
    // The wallType should be reflected in the TargetRanges, and arguably isn't useful here.
    // It could still be informative (should I use a wire or vinyl brush?), but I might remove it.
    wallType: WallTypeValue;
}
