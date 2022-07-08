import { Pool } from './models/pool/Pool';
import { WallTypeValue } from './models/pool/WallType';
import { WaterTypeValue } from './models/pool/WaterType';

export namespace Util {
    export const makePool = (gallons: number, waterType: WaterTypeValue,
        wallType: WallTypeValue): Pool => {
        return {
            gallons,
            liters: gallons * 3.78541,
            waterType,
            wallType
        };
    };
}
