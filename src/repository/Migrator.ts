import Realm from 'realm';
import { LogEntryV0 } from '~/models/logs/LogEntry/LogEntryV0';
import { LogEntryV1 } from '~/models/logs/LogEntry/LogEntryV1';
import { LogEntryV2 } from '~/models/logs/LogEntry/LogEntryV2';
import { LogEntryV3 } from '~/models/logs/LogEntry/LogEntryV3';
import { LogEntryV4 } from '~/models/logs/LogEntry/LogEntryV4';
import { ReadingEntryV1 } from '~/models/logs/ReadingEntry/ReadingEntryV1';
import { ReadingEntryV2 } from '~/models/logs/ReadingEntry/ReadingEntryV2';
import { TreatmentEntryV1 } from '~/models/logs/TreatmentEntry/TreatmentEntryV1';
import { TreatmentEntryV2 } from '~/models/logs/TreatmentEntry/TreatmentEntryV2';
import { PoolV0 } from '~/models/Pool/PoolV0';
import { PoolV1 } from '~/models/Pool/PoolV1';
import { PoolV2 } from '~/models/Pool/PoolV2';
import { PoolV3 } from '~/models/Pool/PoolV3';
import { TargetRangeOverrideV1 } from '~/models/Pool/TargetRangeOverride/TargetRangeOverrideV1';
import { TargetRangeOverrideV2 } from '~/models/Pool/TargetRangeOverride/TargetRangeOverrideV2';
import { migration5 } from './migrations/5';
import { migration6 } from './migrations/6';
import { migration7 } from './migrations/7';

/**
 * List of schemas for the Realm database. This array should be updated every
 * time there is a change to the data model.
 */
const schemas: Realm.Configuration[] = [
    {
        schema: [PoolV0.schema, LogEntryV0.schema, ReadingEntryV1.schema, TreatmentEntryV1.schema, TargetRangeOverrideV1.schema],
        schemaVersion: 0,
    },
    {
        schema: [PoolV1.schema, LogEntryV0.schema, ReadingEntryV1.schema, TreatmentEntryV1.schema, TargetRangeOverrideV1.schema],
        schemaVersion: 1,
    },
    {
        schema: [PoolV1.schema, LogEntryV1.schema, ReadingEntryV1.schema, TreatmentEntryV1.schema, TargetRangeOverrideV1.schema],
        schemaVersion: 2,
    },
    {
        schema: [PoolV2.schema, LogEntryV1.schema, ReadingEntryV1.schema, TreatmentEntryV1.schema, TargetRangeOverrideV1.schema],
        schemaVersion: 3,
    },
    {
        schema: [PoolV2.schema, LogEntryV2.schema, ReadingEntryV1.schema, TreatmentEntryV1.schema, TargetRangeOverrideV1.schema],
        schemaVersion: 4,
    },
    {
        schema: [PoolV2.schema, LogEntryV3.schema, ReadingEntryV1.schema, TreatmentEntryV1.schema, TargetRangeOverrideV1.schema],
        schemaVersion: 5,
        migration: (oldRealm, newRealm) => {
            migration5(oldRealm, newRealm);
        },
    },
    {
        schema: [PoolV3.schema, LogEntryV4.schema, ReadingEntryV1.schema, TreatmentEntryV1.schema, TargetRangeOverrideV1.schema],
        schemaVersion: 6,
        migration: (oldRealm, newRealm) => {
            migration5(oldRealm, newRealm);
            migration6(oldRealm, newRealm);
        },
    },
    {
        schema: [PoolV3.schema, LogEntryV4.schema, ReadingEntryV2.schema, TreatmentEntryV2.schema, TargetRangeOverrideV2.schema],
        schemaVersion: 7,
        migration: (oldRealm, newRealm) => {
            migration5(oldRealm, newRealm);
            migration6(oldRealm, newRealm);
            migration7(oldRealm, newRealm);
        },
    },
];

/**
 * Class that handles Realm migrations when Realm is loaded on app start.
 */
export class Migrator {
    /** Run each migration sequentially. */
    public static runMigrations() {
        let nextSchemaIndex = Realm.schemaVersion(Realm.defaultPath);
        while (nextSchemaIndex < schemas.length) {
            const migratedRealm = new Realm(schemas[nextSchemaIndex++]);
            migratedRealm.close();
        }
    }

    /** Get the latest schema from the schema list */
    public static getCurrentSchemaVersion(): Realm.Configuration {
        return schemas[schemas.length - 1];
    }
}
