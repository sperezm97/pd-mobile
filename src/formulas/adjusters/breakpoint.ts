import { GetUpdatedReadingsAndDeltas } from '../models/misc/UpdatedTargets';

/// Adjusts the fc target & delta to shock levels if the total chlorine is above the max range.
export const breakpointFCAdjuster: GetUpdatedReadingsAndDeltas = ({ readings, deltas, targets }) => {
    if (readings.tc === undefined || readings.fc === undefined) {
        return { readings, deltas, targets };
    }

    const cc = readings.tc - readings.fc;
    const newReadings = {
        ...readings,
        cc,
    };
    const newTargets = {
        ...targets,
    };
    const newDeltas = {
        ...deltas,
    };

    // Adjust the fc target & delta way up
    if (cc > targets.cc.max) {
        // Shock it (within a reasonable max range)!
        const breakpointFC = Math.min(cc * 10, 20);
        newTargets.fc = {
            min: breakpointFC,
            max: breakpointFC
        };
        newDeltas.fc = breakpointFC - readings.fc;
    }

    return {
        readings: newReadings,
        deltas: newDeltas,
        targets: newTargets
    };
};