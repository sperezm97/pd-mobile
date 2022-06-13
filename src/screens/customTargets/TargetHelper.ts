import { Formula } from '~/formulas/models/Formula';
import { EffectiveTargetRange, TargetRange } from '~/formulas/models/TargetRange';
import { TargetRangeOverride } from '~/models/Pool/TargetRangeOverride';
import { Util } from '~/services/Util';

export interface MinMax {
    min: number;
    max: number;
}

export namespace TargetsHelper {

    export const listTargetsForFormula = (
        formula: Formula
    ): TargetRange[] => {
        const readingTargets: TargetRange[] = formula.readings.map(r => ({
            var: r.var,
            range: r.targetRange,
            description: null,
            name: r.name,
        }));

        formula.targets.forEach(ft => {
            const existingIndex = readingTargets.findIndex(rt => rt.var === ft.var);
            if (existingIndex >= 0) {
                readingTargets[existingIndex] = ft;
            } else {
                readingTargets.unshift(ft);
            }
        });

        return readingTargets;
    };

    export const resolveRangesForPool = (
        formula: Formula,
        localOverridesForPool: TargetRangeOverride[],
    ): EffectiveTargetRange[] => {

        // Get targets from readings:
        const targets: TargetRange[] = formula.readings.map(r => ({
            var: r.var,
            range: r.targetRange,
            name: r.name,
            description: null,
        }));

        formula.targets.forEach(ft => {
            if (targets.findIndex(t => t.var === ft.var) < 0) {
                targets.push(ft);
            }
        });

        return targets.map((tr) => {
            const localOverride = Util.firstOrNull(
                localOverridesForPool.filter((local) => local.var === tr.var)
            );
            return {
                range: { ...resolveMinMax(tr, localOverride) },
                var: tr.var,
            };
        });
    };

    export const resolveMinMax = (
        targetRange: TargetRange,       // What is this? The local override?
        locallySavedOverride: TargetRangeOverride | null,
    ): MinMax => {
        return locallySavedOverride ?? targetRange.range;
    };
}
