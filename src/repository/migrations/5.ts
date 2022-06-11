import { MigrationCallback } from 'realm';
import { LogEntryV2 } from '~/models/logs/LogEntry/LogEntryV2';
import { LogEntryV3 } from '~/models/logs/LogEntry/LogEntryV3';

export const migration5: MigrationCallback = (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 5) {
        const oldLogEntries = oldRealm.objects<LogEntryV2>('LogEntry');
        const newLogEntries = newRealm.objects<LogEntryV3>('LogEntry');

        // loop through all objects and set the name property in the new schema
        for (let i = 0; i < oldLogEntries.length; i++) {
            newLogEntries[i].clientTS = oldLogEntries[i].ts;
            newLogEntries[i].userTS = oldLogEntries[i].ts;
        }
    }
};
