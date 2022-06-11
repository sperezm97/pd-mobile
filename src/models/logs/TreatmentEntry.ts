import { Treatment, TreatmentType } from '~/formulas/models/Treatment';

/**
 * Represents the amount or state of a treatment or task
 */
export class TreatmentEntry {
    // The number of ounces used (for graphing, not displaying)
    ounces!: number;

    // The actual used value (for displaying, not graphing)
    displayAmount!: string;

    // The units selected by the user
    displayUnits?: string;

    // The actual concentration used, [1,100]
    concentration?: number;

    // Variable name (defined by the recipe)
    var!: string;

    // human-friendly name of the reading
    treatmentName!: string;

    type!: TreatmentType;

    // For Realm purposes
    static schema = {
        name: 'TreatmentEntry',
        properties: {
            treatmentName: 'string',
            var: 'string',
            displayAmount: 'string',
            displayUnits: 'string',
            concentration: 'double?',
            ounces: 'double',
            type: 'string',
        },
    };

    static make(
        treatment: Treatment,
        ounces: number,
        displayAmount: string,
        displayUnits: string,
        concentration?: number,
    ): TreatmentEntry {
        let entry = new TreatmentEntry();

        entry.treatmentName = treatment.name;
        entry.var = treatment.var;
        entry.displayAmount = displayAmount;
        entry.displayUnits = displayUnits;
        entry.concentration = concentration || treatment.concentration;
        entry.ounces = ounces;
        entry.type = treatment.type;
        return entry;
    }
}
