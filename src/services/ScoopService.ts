import { Treatment } from '~/formulas/models/Treatment';
import { FormulaService } from './FormulaService';


export class ScoopService {
    static getAllTreatments = async (): Promise<Treatment[]> => {
        const formulas = FormulaService.getAllFormulas();
        let treatments: Treatment[] = [];
        formulas.forEach((formula) => {
            formula.treatments.forEach((t) => {
                // The "var" property must be unique... we might eventually need to define a formal tie-breaker
                if (!treatments.find((existingTreatment) => existingTreatment.var === t.var)) {
                    treatments.push(t);
                }
            });
        });
        return treatments;
    };
}
