import { MigrationCallback } from 'realm';

import { ReadingEntryV1 } from '~/models/logs/ReadingEntry/ReadingEntryV1';
import { ReadingEntryV2 } from '~/models/logs/ReadingEntry/ReadingEntryV2';
import { TreatmentEntryV1 } from '~/models/logs/TreatmentEntry/TreatmentEntryV1';
import { TreatmentEntryV2 } from '~/models/logs/TreatmentEntry/TreatmentEntryV2';
import { TargetRangeOverrideV1 } from '~/models/Pool/TargetRangeOverride/TargetRangeOverrideV1';
import { TargetRangeOverrideV2 } from '~/models/Pool/TargetRangeOverride/TargetRangeOverrideV2';

export const migration7: MigrationCallback = (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 7) {
        const oldReadingEntries = oldRealm.objects<ReadingEntryV1>('ReadingEntry');
        const newReadingEntries = newRealm.objects<ReadingEntryV2>('ReadingEntry');

        for (let i = 0; i < oldReadingEntries.length; i++) {
            newReadingEntries[i].id = oldReadingEntries[i].var;
        }

        const oldTreatmentEntries = oldRealm.objects<TreatmentEntryV1>('TreatmentEntry');
        const newTreatmentEntries = newRealm.objects<TreatmentEntryV2>('TreatmentEntry');

        for (let i = 0; i < oldTreatmentEntries.length; i++) {
            newTreatmentEntries[i].id = oldTreatmentEntries[i].var;
        }

        const oldTargetOverrides = oldRealm.objects<TargetRangeOverrideV1>('TargetRangeOverride');
        const newTargetOverrides = newRealm.objects<TargetRangeOverrideV2>('TargetRangeOverride');

        for (let i = 0; i < oldTargetOverrides.length; i++) {
            newTargetOverrides[i].id = oldTargetOverrides[i].var;
        }
    }
};
