import { calculate, FormulaRunRequest } from '~/formulas/calculator';
import { Formula } from '~/formulas/models/Formula';
import { ReadingValues } from '~/formulas/models/misc/Values';
import { EffectiveTargetRange } from '~/formulas/models/TargetRange';
import { Treatment } from '~/formulas/models/Treatment';
import { TreatmentEntry } from '~/models/logs/TreatmentEntry';

import { TreatmentState } from '~/screens/treatments/TreatmentListHelpers';

import { Pool } from '../models/Pool';
import { ConversionUtil } from './ConversionsUtil';
import { Util } from './Util';

export interface CalculationResult {
    value: number | null;
    var: string;
}

export class CalculationService {

    static run = (req: FormulaRunRequest): CalculationResult[] => {
        const res = calculate(req);
        return Object.keys(res).map(k => ({
            var: k,
            value: res[k],
        }));
    }

    static getFormulaRunRequest = (
        formula: Formula,
        pool: Pool,
        inputs: ReadingValues,
        targets: EffectiveTargetRange[],
    ): FormulaRunRequest => {
        return {
            formula,
            readings: inputs,
            targetLevels: targets,
            pool: {
                ...pool,
                liters: ConversionUtil.usGallonsToLiters(pool.gallons),
            },
        };
    };

    static getTreatmentEntriesFromCalculationResult = (results: CalculationResult[], formula: Formula): TreatmentEntry[] => {
        const tes: TreatmentEntry[] = [];
        results
            // filter all null treatments
            .filter(tv => (tv.value !== null) && (tv.value !== undefined))
            // filter 0-value treatments for all non-calculations (for instance, we want to show LSI = 0, but not "add 0 ounces of x")
            .filter(tv => (tv.value !== 0) || (CalculationService.getTreatment(tv.var, formula)?.type === 'calculation'))
            .forEach((tv) => {
                const correspondingTreatment = CalculationService.getTreatment(tv.var, formula);
                if (correspondingTreatment) {
                    if (tv.value) {
                        tes.push({
                            var: tv.var,
                            displayAmount: tv.value.toFixed(1),
                            treatmentName: correspondingTreatment.name,
                            ounces: tv.value,
                            displayUnits: 'ounces',
                            concentration: correspondingTreatment.concentration,
                            type: correspondingTreatment.type,
                        });
                    }
                }
            });
        return tes;
    };

    static getTreatment = (variable: string, formula: Formula): Treatment | null => {
        return Util.firstOrNull(formula.treatments.filter(t => t.var === variable)) ?? null;
    }

    static mapTreatmentStatesToTreatmentEntries = (tss: TreatmentState[]): TreatmentEntry[] => {
        return tss
            .filter((ts) => ts.isOn)
            .map((ts) => {
                let displayUnits: string = ts.units;
                if (['calculation', 'task'].some((x) => ts.treatment.type === x)) {
                    displayUnits = '';
                }
                return TreatmentEntry.make(ts.treatment, ts.ounces, ts.value || '0', displayUnits, ts.concentration);
            });
    };
}
