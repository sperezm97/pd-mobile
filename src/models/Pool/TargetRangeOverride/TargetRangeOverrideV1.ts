export class TargetRangeOverrideV1 {
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
}
