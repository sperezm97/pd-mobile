import { Util } from '~/services/Util';

type TargetRangeOverrideMakeParams = {
    min: number;
    max: number;
    poolId: string;
    var: string;
    objectId: string | null;
};

export class TargetRangeOverride {
    // The id of this object
    objectId!: string;

    // Pool relates to custom target
    poolId!: string;

    // Variable to identify the custom target selected
    var!: string;

    // Min's value for the custom target
    min!: number;

    // Max's value for the custom target
    max!: number;

    // For Realm purposes
    static schema = {
        name: 'TargetRangeOverride',
        primaryKey: 'objectId',
        properties: {
            objectId: 'string',
            poolId: 'string',
            var: 'string',
            min: 'double',
            max: 'double',
        },
    };

    static make(input: TargetRangeOverrideMakeParams): TargetRangeOverride {
        let result = new TargetRangeOverride();

        result.objectId = input.objectId ?? Util.generateUUID();
        result.poolId = input.poolId;
        result.var = input.var;
        result.min = input.min;
        result.max = input.max;

        return result;
    }
}
