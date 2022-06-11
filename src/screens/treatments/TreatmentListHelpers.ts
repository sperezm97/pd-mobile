import { Formula } from '~/formulas/models/Formula';
import { Treatment } from '~/formulas/models/Treatment';
import { DeviceSettings } from '~/models/DeviceSettings';
import { Util } from '~/services/Util';
import { Units } from '~/models/TreatmentUnits';
import { Scoop } from '~/models/Scoop';

export interface TreatmentState {
    treatment: Treatment;
    value?: string;
    ounces: number;
    isOn: boolean;
    units: Units;
    decimalPlaces: number;
    concentration: number;
}

export class TreatmentListHelpers {
    static getTreatmentFromFormula= (treatmentVarName: string, formula: Formula): Treatment | null => {
        for (let i = 0; i < formula.treatments.length; i++) {
            const t = formula.treatments[i];
            if (t.var === treatmentVarName) {
                return t;
            }
        }
        return null;
    };

    static getConcentrationForTreatment = (varName: string, ds: DeviceSettings | null): number | null => {
        return ds?.treatments.concentrations[varName] || null;
    };

    static getScoopForTreatment = (varName: string, scoops: Scoop[]): Scoop | null => {
        for (let i = 0; i < scoops.length; i++) {
            if (scoops[i].var === varName) {
                return scoops[i];
            }
        }
        return null;
    };

    // Returns true if an update occured, false otherwise
    static updateTreatmentState = (
        varName: string,
        modification: (ts: TreatmentState) => boolean,
        treatmentStates: TreatmentState[],
        setTreatmentState: React.Dispatch<React.SetStateAction<TreatmentState[]>>,
    ): boolean => {
        const tss = Util.deepCopy(treatmentStates);
        let didChange = false;
        tss.forEach((ts) => {
            if (ts.treatment.var === varName) {
                didChange = modification(ts);
            }
        });
        if (didChange) {
            setTreatmentState(tss);
        }
        return didChange;
    };

    static getUpdatedLastUsedUnits = (
        unitsMap: { [varName: string]: string },
        treatmentStates: TreatmentState[],
    ): { [varName: string]: string } => {
        const newUnits = Util.deepCopy(unitsMap);
        treatmentStates
            .filter((ts) => ts.isOn)
            .forEach((ts) => {
                newUnits[ts.treatment.var] = ts.units;
            });
        return newUnits;
    };
}
