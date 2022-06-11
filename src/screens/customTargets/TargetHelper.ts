import { Formula } from '~/formulas/models/Formula';
import { EffectiveTargetRange, TargetRange } from '~/formulas/models/TargetRange';
import { TargetRangeOverride } from '~/models/Pool/TargetRangeOverride';
import { WallTypeValue } from '~/models/Pool/WallType';
import { Util } from '~/services/Util';

export interface MinMax {
    min: number;
    max: number;
}

export namespace TargetsHelper {
    export const resolveRangesForPool = (
        formula: Formula,
        poolWallType: WallTypeValue,
        localOverridesForPool: TargetRangeOverride[],
    ): EffectiveTargetRange[] => {

        // TODO: merge more effeciently.
        const readingTargets: EffectiveTargetRange[] = formula.readings.map(r => ({
            var: r.var,
            range: r.targetRange,
        }));

        const formulaTargets = formula.targets.map((tr) => {
            const localOverride = Util.firstOrNull(
                localOverridesForPool.filter((local) => local.var === tr.var)
            );
            return {
                range:{ ...resolveMinMax(tr, poolWallType, localOverride, formula) },
                var: tr.var,
            };
        });

        const result: EffectiveTargetRange[] = Util.deepCopy(readingTargets);
        formulaTargets.forEach(ft => {
            const existingIndex = result.findIndex(rtr => rtr.var === ft.var);
            if (existingIndex >= 0) {
                result[existingIndex] = ft;
            } else {
                result.push(ft);
            }
        });

        return result;
    };

    // TODO: clean up params.
    export const resolveMinMax = (
        targetRange: TargetRange,
        poolWallType: WallTypeValue,
        locallySavedOverride: TargetRangeOverride | null,
        formula: Formula,
    ): MinMax => {
        /// If there's a local override saved, always use that:
        if (locallySavedOverride) {
            return {
                min: locallySavedOverride.min,
                max: locallySavedOverride.max,
            };
        }

        /// Second, try to find a default on the formula for this pool's wall-type
        const formulaDefaultRangeForWallType = Util.firstOrNull(
            targetRange.defaults.filter((d) => d.wallType === poolWallType),
        );
        if (formulaDefaultRangeForWallType) {
            return {
                min: formulaDefaultRangeForWallType.range.min,
                max: formulaDefaultRangeForWallType.range.max,
            };
        }

        /// Next, try to find a default on the formula with a null wall-type
        const formulaDefaultRange = Util.firstOrNull(targetRange.defaults.filter((d) => d.wallType === null));
        if (formulaDefaultRange) {
            return {
                min: formulaDefaultRange.range.min,
                max: formulaDefaultRange.range.max,
            };
        }

        /// Lastly, see if the reading has one:
        const readingTargets: EffectiveTargetRange[] = formula.readings.map(r => ({
            var: r.var,
            range: r.targetRange,
        }));
        const readingDefaultRange = Util.firstOrNull(
            readingTargets.filter((rt => rt.var === targetRange.var))
        );
        if (readingDefaultRange) {
            return readingDefaultRange.range;
        }

        /// This is an error-condition & should never happen... default to 0?
        console.error('Error, target range has no default');
        return { min: 0, max: 0 };
    };
}
