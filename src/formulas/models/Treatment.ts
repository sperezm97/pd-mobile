import { TreatmentFunction } from './misc/TreatmentFunction';

/**
 * Represents an action that can be taken during performance of a formula, and includes
 * a function that accepts the formula readings (and some pool info) as parameters and returns whether the action
 * needs to be taken (and if so, how much).
 */
export interface Treatment {
    // The treatment's user-visible name (ex: "Shock")
    name: string;

    // The treatment's variable name, for use in subsequent treatment functions in the same recipe
    // TODO: rename this to "id" or something
    var: string;

    // The javascript function that determines how much (if any) of the treatment is necessary
    function: TreatmentFunction;

    // The % active ingredient of the chemical product recommended (0,100]
    concentration?: number;

    // If this is a task, dry chem, wet chem, or other...
    type: TreatmentType;
}

export type TreatmentType = 'dryChemical' | 'liquidChemical' | 'task' | 'calculation';
