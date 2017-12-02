/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchFormula
// ====================================================

export interface FetchFormula_formulaVersion_readings {
  __typename: "Reading";
  name: string;
  var: string;
  sliderMin: number | null;
  sliderMax: number | null;
  idealMin: number | null;
  idealMax: number | null;
  type: string;
  decimalPlaces: number | null;
  units: string | null;
  defaultValue: number;
  isDefaultOn: boolean;
  offsetReadingVar: string | null;
}

export interface FetchFormula_formulaVersion_treatments {
  __typename: "Treatment";
  name: string;
  var: string;
  function: string;
  type: string;
  concentration: number;
}

export interface FetchFormula_formulaVersion_custom_defaults {
  __typename: "DefaultRange";
  wallType: string | null;
  min: number;
  max: number;
}

export interface FetchFormula_formulaVersion_custom {
  __typename: "TargetRange";
  name: string;
  var: string;
  description: string | null;
  defaults: FetchFormula_formulaVersion_custom_defaults[];
}

export interface FetchFormula_formulaVersion {
  __typename: "Formula";
  id: string;
  author_id: string;
  author_username: string;
  name: string;
  description: string;
  ts: number;
  appVersion: string;
  isOfficial: boolean;
  readings: FetchFormula_formulaVersion_readings[];
  treatments: FetchFormula_formulaVersion_treatments[];
  custom: FetchFormula_formulaVersion_custom[];
}

export interface FetchFormula {
  formulaVersion: FetchFormula_formulaVersion;
}

export interface FetchFormulaVariables {
  id: string;
  ts: number;
}
