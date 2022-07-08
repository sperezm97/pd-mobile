import { Reading } from '~/formulas/models/Reading';

/**
 * Represents the value of a reading or observation
 */
export class ReadingEntryV2 {
    // The value of the input
    value!: number;

    // Variable name (defined by the formula)
    id!: string;

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
            id: 'string',
            value: 'double',
            units: 'string?',
            idealMin: 'double?',
            idealMax: 'double?',
        },
    };

    static make(reading: Reading, value: number): ReadingEntryV2 {
        let readingEntry = new ReadingEntryV2();
        readingEntry.id = reading.id;
        readingEntry.readingName = reading.name;
        readingEntry.value = value;
        readingEntry.units = reading.units || undefined;
        readingEntry.idealMin = reading.targetRange?.min || undefined;
        readingEntry.idealMax = reading.targetRange?.max || undefined;
        return readingEntry;
    }
}
