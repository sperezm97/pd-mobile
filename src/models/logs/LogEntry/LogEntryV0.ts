import { ReadingEntry } from '../ReadingEntry';
import { TreatmentEntry } from '../TreatmentEntry';
import { FormulaKey } from '../../recipe/FormulaKey';

/**
 * Represents readingEntries and treatmentEntries for a given pool
 */
export class LogEntryV0 {
    // The id of this object
    objectId!: string;

    // The objectID of the corresponding pool
    poolId!: string;

    // The timestamp, in milliseconds
    ts!: number;

    // All the readings taken
    readingEntries!: ReadingEntry[];

    // All the treatments performed
    treatmentEntries!: TreatmentEntry[];

    // The unique id of the recipe
    recipeKey!: FormulaKey;

    // Any special thoughts the user had about this log entry.
    notes?: string;

    // For Realm purposes
    static schema = {
        name: 'LogEntry',
        primaryKey: 'objectId',
        properties: {
            objectId: 'string',
            poolId: 'string',
            readingEntries: 'ReadingEntry[]',
            treatmentEntries: 'TreatmentEntry[]',
            ts: 'int',
            recipeKey: 'string',
            notes: 'string?',
        },
    };
}
