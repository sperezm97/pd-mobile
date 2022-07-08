/**
 * Represents the value of a reading or observation
 */
export class ReadingEntryV1 {
    // The value of the input
    value!: number;

    // Variable name (defined by the formula)
    var!: string;

    // human-friendly name of the reading
    readingName!: string;

    // for convenience, store the reading units here as well
    units?: string;

    idealMin?: number;
    idealMax?: number;

    // For Realm purposes
    static schema = {
        name: 'ReadingEntry',
        properties: {
            readingName: 'string',
            var: 'string',
            value: 'double',
            units: 'string?',
            idealMin: 'double?',
            idealMax: 'double?',
        },
    };
}
