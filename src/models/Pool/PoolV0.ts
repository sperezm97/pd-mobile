import { FormulaKey } from '../recipe/FormulaKey';
import { WallTypeValue } from './WallType';
import { WaterTypeValue } from './WaterType';

/**
 * Represents a swimming pool (duh).
 */
export class PoolV0 {
    // The pool's volume, in gallons.
    gallons!: number;

    // The pool's user-visible name
    name!: string;

    // An ID that uniquely identifies this pool
    objectId!: string;

    // The recipe id + the ts it was last updated
    recipeKey?: FormulaKey;

    // The pool water type
    waterType!: WaterTypeValue;

    // The pool wall type
    wallType!: WallTypeValue;

    // For Realm purposes
    static schema = {
        name: 'Pool',
        primaryKey: 'objectId',
        properties: {
            gallons: 'double',
            name: 'string',
            objectId: 'string',
            recipeKey: 'string?',
            waterType: 'string',
            wallType: 'string',
        },
    };

    static make(newPool: PoolV0): PoolV0 {
        const pool = new PoolV0();
        pool.name = newPool.name;
        pool.gallons = newPool.gallons;
        pool.waterType = newPool.waterType;
        pool.recipeKey = newPool.recipeKey;
        pool.wallType = newPool.wallType;

        // what the heck is this??? is the edit logic busted?
        if (newPool.objectId) {
            pool.objectId = newPool.objectId;
        }
        return pool;
    }
}
