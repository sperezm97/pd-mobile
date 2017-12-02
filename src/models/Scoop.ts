import { TreatmentType } from './recipe/Treatment';
import { Units } from '~/models/TreatmentUnits';

/// Represents a custom volumetric unit defined by a user.
export interface Scoop {
    guid: string;
    var: string;
    chemName: string;
    displayValue: string;
    displayUnits: Units;
    ounces: number;
    type: TreatmentType; // This is a subset of string
}
