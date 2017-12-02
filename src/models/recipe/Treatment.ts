/**
 * Represents an action that can be taken during performance of a recipe, and includes
 * a formula that accepts the recipe inputs as parameters and returns whether the action
 * needs to be taken.
 */
export interface Treatment {
    // The treatment's user-visible name
    name: string;

    // The treatment's variable name, for use in subsequent treatment formulas in the same recipe
    var: string;

    // The javascript formula that determines how much (if any) of the treatment is necessary
    formula?: string;

    // The javascript function that determines how much (if any) of the treatment is necessary
    function: string;

    // The % active ingredient of the chemical product recommended [1,100]
    concentration?: number;

    // If this is a task, dry chem, wet chem, or other...
    type: TreatmentType;
}

// export type TreatmentType = 'dryChemical' | 'liquidChemical' | 'task' | 'calculation';
export type TreatmentType = string;
