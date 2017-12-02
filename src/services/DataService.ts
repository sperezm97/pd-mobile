import { LogEntry } from '~/models/logs/LogEntry';
import { Pool } from '~/models/Pool';
import { Database } from '~/repository/Database';

import { ConversionUtil } from './ConversionsUtil';
import { Util } from './Util';

export namespace DataService {
    /// Returns the base64 encoded file data.
    /// Really, this should stream to a file & not happen on the main thread.
    /// But, Android file-sharing is tedious, and idk if multi-threading in RN or js even works.
    export const generateCsvFileForAllPools = (): string => {
        let dataString = 'pool_dash,export\n';

        dataString += Database.loadPools()
            .map((pool) => generateCSVEntriesForPool(pool))
            .join('\n**************\n');

        return dataString;
    };

    /// Returns the base64 encoded file data
    export const generateCsvFileForPool = (pool: Pool): string => {
        let dataString = 'pool_dash,export\n';

        dataString += generateCSVEntriesForPool(pool);

        return dataString;
    };

    const generateCSVEntriesForPool = (pool: Pool): string => {
        let result = `\npool,\
            ${pool.name},\
            ${pool.gallons},\
            us gallons,\
            ${ConversionUtil.usGallonsToLiters(pool.gallons)},\
            liters,\
            ${ConversionUtil.usGallonsToImpGallon(pool.gallons)},\
            imperial gallons,\
            ${pool.waterType},\
            ${pool.wallType},\
            ${pool.recipeKey ?? ''},\
            ${pool.objectId}`;
        const logs = Database.loadLogEntriesForPool(pool.objectId, null, true);
        logs.forEach((entry) => {
            result += `${getRowsForEntry(entry)}\n`;
        });
        return result;
    };

    const getRowsForEntry = (logEntry: LogEntry): string => {
        let result = `\nlog_entry,\
            ${new Date(logEntry.userTS).toISOString()},\
            ${logEntry.notes ?? '---'},\
            ${logEntry.recipeKey},\
            ${logEntry.objectId}`;
        logEntry.readingEntries.forEach((re) => {
            result += `\nreading,\
                ${re.readingName},\
                ${re.var},\
                ${re.value},\
                ${re.units ?? ''}`;
        });
        logEntry.treatmentEntries.forEach((te) => {
            result += `\ntreatment,\
                ${Util.getDisplayNameForTreatment({ name: te.treatmentName, concentration: te.concentration })},\
                ${te.var},\
                ${te.displayAmount},\
                ${te.displayUnits ?? ''},\
                ${te.ounces},\
                ounces`;
        });
        return result;
    };
}
