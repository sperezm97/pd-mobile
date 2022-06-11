import { ReadingEntry } from '../ReadingEntry';
import { TreatmentEntry } from '../TreatmentEntry';

/**
 * Represents readingEntries and treatmentEntries for a given pool
 */
export class LogEntryV4 {
    // The id of this object
    objectId!: string;

    // The objectID of the corresponding pool
    poolId!: string;

    // The auto-generated client timestamp, in milliseconds
    clientTS!: number;

    // The user-editable timestamp, in milliseconds
    userTS!: number;

    // The server-assigned timestamp when this entry was saved, if any
    serverTS?: number;

    // All the readings taken
    readingEntries!: ReadingEntry[];

    // All the treatments performed
    treatmentEntries!: TreatmentEntry[];

    // The id of the formula used to guide this service
    formulaId?: string;

    // [Deprecated] the id + timestamp of the old-style formula
    legacyFormulaKey?: string;

    // The human-friendly name of the formula
    formulaName?: string;

    // Any special thoughts the user had about this log entry.
    notes?: string;

    // If this log entry was imported.
    poolDoctorId?: string;

    // For Realm purposes
    static schema = {
        name: 'LogEntry',
        primaryKey: 'objectId',
        properties: {
            objectId: 'string',
            poolId: 'string',
            readingEntries: 'ReadingEntry[]',
            treatmentEntries: 'TreatmentEntry[]',
            userTS: 'int',
            clientTS: 'int',
            serverTS: 'int?',
            formulaId: 'string?',
            legacyFormulaKey: 'string?',
            formulaName: 'string?',
            notes: 'string?',
            poolDoctorId: 'string?',
        },
    };

    static make(
        objectId: string,
        poolId: string,
        clientTS: number,
        userTS: number,
        serverTS: number | null,
        readingEntries: ReadingEntry[],
        treatmentEntries: TreatmentEntry[],
        formulaId: string,
        formulaName: string,
        notes: string | null,
        poolDoctorId: string | null,
    ): LogEntryV4 {
        let logEntry = new LogEntryV4();
        logEntry.objectId = objectId;
        logEntry.poolId = poolId;
        if (serverTS) {
            logEntry.serverTS = serverTS;
        }
        logEntry.userTS = userTS;
        logEntry.clientTS = clientTS;
        logEntry.readingEntries = readingEntries;
        logEntry.treatmentEntries = treatmentEntries;
        logEntry.formulaId = formulaId;
        logEntry.formulaName = formulaName;
        if (notes && notes.length > 0) {
            logEntry.notes = notes;
        }
        if (poolDoctorId && poolDoctorId.length > 0) {
            logEntry.poolDoctorId = poolDoctorId;
        }
        return logEntry;
    }
}
