import { WallTypeValue } from './WallType';
import { WaterTypeValue } from './WaterType';

/**
 * Represents a swimming pool (duh).
 */
export class PoolV1 {
    // The pool's volume, in gallons.
    gallons!: number;

    // The pool's user-visible name
    name!: string;

    // An ID that uniquely identifies this pool
    objectId!: string;

    // The recipe id + the ts it was last updated
    recipeKey?: string;

    // The pool water type
    waterType!: WaterTypeValue;

    // The pool wall type
    wallType!: WallTypeValue;

    // The pool email
    email?: string

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
            email: 'string?',
        },
    };
}
