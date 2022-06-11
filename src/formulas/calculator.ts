/// This runs a formula and returns some results!

import { Formula } from './models/Formula';
import { Range } from './models/misc/Range';
import { Pool } from './models/pool/Pool';


export interface FormulaRunRequest {
    formula: Formula;
    readings: ReadingEntry[];
    targetLevels: FormulaCustomTargets[];   // TODO: reconsider this!
    pool: Pool;
}

interface FormulaCustomTargets {
    var: string;
    range: Range;
}

interface ReadingEntry {
    var: string;
    value: number;
}

interface CalculationResult {
    value: number | null;
    var: string;
}

export const calculate = (req: FormulaRunRequest): CalculationResult[] => {
    const formula = req.formula;
    const outputs: Record<string, number> = {};
    const readings: Record<string, number> = {};
    const skipped: Record<string, boolean> = {};
    formula.readings.forEach(r => {
        const entry = req.readings.find(x => x.var === r.var);
        if (entry) {
            readings[r.var] = entry.value;
        } else {
            readings[r.var] = r.defaultValue;
            skipped[r.var] = true;
        }
    });
    const targets = req.targetLevels.reduce((res, t) => {
        res[t.var] = { ...t.range };
        return res;
    }, {});
    formula.treatments.forEach(t => {
        const result = t.function(
            req.pool,
            readings,
            outputs,
            targets,
            skipped,
        );
        outputs[ t.var ] = result ?? 0;     // TODO: better nullability
    });
    
    return Object.keys(outputs).map(k => ({
        var: k, value: outputs[k]
    }));
};
