import { MigrationCallback } from 'realm';

import { LogEntryV3 } from '~/models/logs/LogEntry/LogEntryV3';
import { LogEntryV4 } from '~/models/logs/LogEntry/LogEntryV4';

import { PoolV2 } from '~/models/Pool/PoolV2';
import { PoolV3 } from '~/models/Pool/PoolV3';

export const migration6: MigrationCallback = (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 6) {
        const oldLogEntries = oldRealm.objects<LogEntryV3>('LogEntry');
        const newLogEntries = newRealm.objects<LogEntryV4>('LogEntry');

        for (let i = 0; i < oldLogEntries.length; i++) {
            newLogEntries[i].legacyFormulaKey = oldLogEntries[i].recipeKey;
        }

        const oldPools = oldRealm.objects<PoolV2>('Pool');
        const newPools = newRealm.objects<PoolV3>('Pool');

        for (let i = 0; i < oldPools.length; i++) {
            newPools[i].legacyFormulaKey = oldPools[i].recipeKey;
            // TODO: infer new formulaId based on old recipeKey.
        }
    }
};
