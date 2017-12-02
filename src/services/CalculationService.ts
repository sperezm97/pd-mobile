import { WebViewMessageEvent } from 'react-native-webview';
import { TreatmentEntry } from '~/models/logs/TreatmentEntry';
import { ReadingValue } from '~/models/ReadingValue';
import { EffectiveTargetRange } from '~/models/recipe/TargetRange';
import { Treatment } from '~/models/recipe/Treatment';
import { TreatmentState } from '~/screens/treatments/TreatmentListHelpers';

import { Pool } from '../models/Pool';
import { Recipe } from '../models/recipe/Recipe';
import { Util } from './Util';

export interface CalculationResult {
    value: number | null;
    var: string;
}

export class CalculationService {
    /// Hermes is the thing that runs the functions, obviously.
    static getHtmlStringForLocalHermes = (
        recipe: Recipe,
        pool: Pool,
        inputs: ReadingValue[],
        targets: EffectiveTargetRange[],
    ): string => {
        const calc = `
        const calc = (event) => {
            // Load up the recipe
            const recipe = event.recipe;
            const outputs = {};
            const readings = {};
            const skipped = [];
            recipe.readings.forEach(r => {
                const entry = event.readings.find(x => x.var === r.var);
                if (entry) {
                    readings[r.var] = entry.value;
                } else {
                    readings[r.var] = r.defaultValue;
                    skipped.push(r.var);
                }
            });
            const inputsAsArgs = \`const r = {\${ recipe.readings.map(r => \`\${r.var}: \${readings[r.var]}\`).join(',') }};\`;
            const skippedAsArgs = \`const s = {\${ skipped.map(v => \`\${v}: true\`).join(',') }};\`;
            const customTargetsAsArgs = \`const c = {\${event.custom.map(c => \`\${c.var}: { min: \${c.min}, max: \${c.max}}\`).join(',')}};\`;
            const poolAsArgs = \`const p = {gallons: \${event.pool.gallons}, liters: \${event.pool.liters}, wall_type: '\${event.pool.wallType}', water_type: '\${event.pool.waterType}'};\`;
            for (let i = 0; i < recipe.treatments.length; i++) {
                const t = recipe.treatments[ i ];
                const prevTreatVals = [];
                Object.entries(outputs).forEach(([ variable, value ]) => { prevTreatVals.push(\`\${variable}:\${value}\`) });
                const previousTreatmentsAsArgs = \`const t = {\${prevTreatVals.join(',') || ''}};\`;
                const f = \`
                    \${inputsAsArgs}
                    \${poolAsArgs}
                    \${previousTreatmentsAsArgs}
                    \${customTargetsAsArgs}
                    \${skippedAsArgs}
                    \${t.function}
                \`;

                // Fire away (for each function)!
                let result = null;
                try {
                    result = new Function(f)();
                } catch (e) {
                    console.error(e);
                }
                outputs[ t.var ] = result;
            }

            const keys = Object.keys(outputs);
            const treatments = keys.map(k => ({ var: k, value: outputs[ k ] }));

            return treatments;
        };`;
        const event: RecipeRunRequest = {
            recipe,
            pool,
            readings: inputs,
            custom: targets,
        };
        const jsCall =
            calc +
            `const results = calc(${JSON.stringify(
                event,
            )});document.getElementById("hello").innerHTML = JSON.stringify(results);window.ReactNativeWebView.postMessage(JSON.stringify(results));`;

        return `<body><h1 id="hello">hello</h1><script>${jsCall}</script></body>`;
    };

    static getTreatmentEntriesFromWebviewMessage = (event: WebViewMessageEvent, formula: Recipe): TreatmentEntry[] => {
        const results = JSON.parse(event.nativeEvent.data) as CalculationResult[];
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

    static getTreatment = (variable: string, formula: Recipe): Treatment | null => {
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

interface RecipeRunRequest {
    recipe: Recipe;
    readings: RecipeReading[];
    custom: RecipeCustomTargets[];
    pool: Pool;
}

interface RecipeCustomTargets {
    var: string;
    min: number;
    max: number;
}

interface RecipeReading {
    var: string;
    value: number;
}
