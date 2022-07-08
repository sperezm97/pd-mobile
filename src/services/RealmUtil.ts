import { Formula } from '~/formulas/models/Formula';
import { LogEntry } from '~/models/logs/LogEntry';
import { ReadingEntry } from '~/models/logs/ReadingEntry';
import { IPool, Pool } from '~/models/Pool';
import { TargetRangeOverride } from '~/models/Pool/TargetRangeOverride';
import { ReadingValue } from '~/models/ReadingValue';

import { Util } from './Util';

// Every time we add a property to these classes, we have to mirror them here (yuck).
const PoolProps = ['name', 'gallons', 'waterType', 'wallType', 'objectId', 'formulaId', 'email', 'poolDoctorId'];
const LogEntryProps = ['objectId', 'poolId', 'userTS', 'clientTS', 'serverTS', 'readingEntries', 'treatmentEntries', 'formulaId', 'formulaName', 'notes', 'poolDoctorId'];
const TargetRangeProps = ['objectId', 'poolId', 'id', 'min', 'max'];

/**
 * if you need to parser, cast or convert any data form realm, you should use in this util class.
 */
export class RealmUtil {
    /**
     *  Parser Pool RealmObject to POJO
     * @param rawPools RealmCollection<Pool>
     * @returns array plain pool
     */
    static poolsToPojo = (rawPools: Realm.Collection<Pool>): IPool[] => {
        return Util.toArrayPojo<IPool>(PoolProps, rawPools);
    };

    /**
     *  Parser LogEntry RealmObject to POJO
     * @param rawLogEntry RealmCollection<LogEntry>
     * @returns array plain LogEntry
     */
    static logEntriesToPojo = (realmLogEntries: Realm.Collection<LogEntry>) => {
        return Util.toArrayPojo<LogEntry>(LogEntryProps, realmLogEntries);
    };

    /**
     *  Parser Custom Target RealmObject to POJO
     * @param rawCustomTargers RealmCollection<TargetRangeOverride>
     * @returns array plain custom target
     */
    static customTargetToPojo = (rawCustomTargers: Realm.Collection<TargetRangeOverride>) => {
        const parserData = Util.toArrayPojo<TargetRangeOverride>(TargetRangeProps, rawCustomTargers);
        return parserData;
    };

    static createReadingEntriesFromReadingValues = (values: ReadingValue[], formula: Formula): ReadingEntry[] => {
        const entries: ReadingEntry[] = [];
        values.forEach(v => {
            const reading = Util.firstOrNull(formula.readings.filter(r => r.id === v.id));
            if (reading) {
                const e = ReadingEntry.make(reading, v.value);
                entries.push(e);
            }
        });
        return entries;
    }
}
