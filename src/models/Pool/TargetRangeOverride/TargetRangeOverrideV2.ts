import { Util } from '~/services/Util';

type TargetRangeOverrideMakeParams = {
    min: number;
    max: number;
    poolId: string;
    id: string;
    objectId: string | null;
};

export class TargetRangeOverrideV2 {
    // The id of this object
    objectId!: string;

    // Pool relates to custom target
    poolId!: string;

    // ID of the custom target selected
    id!: string;

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
            id: 'string',
            min: 'double',
            max: 'double',
        },
    };

    static make(input: TargetRangeOverrideMakeParams): TargetRangeOverrideV2 {
        let result = new TargetRangeOverrideV2();

        result.objectId = input.objectId ?? Util.generateUUID();
        result.poolId = input.poolId;
        result.id = input.id;
        result.min = input.min;
        result.max = input.max;

        return result;
    }
}
