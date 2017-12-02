/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: LatestFormula
// ====================================================

export interface LatestFormula_latestFormula_readings {
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

export interface LatestFormula_latestFormula_treatments {
  __typename: "Treatment";
  name: string;
  var: string;
  function: string;
  type: string;
  concentration: number;
}

export interface LatestFormula_latestFormula_custom_defaults {
  __typename: "DefaultRange";
  wallType: string | null;
  min: number;
  max: number;
}

export interface LatestFormula_latestFormula_custom {
  __typename: "TargetRange";
  name: string;
  var: string;
  description: string | null;
  defaults: LatestFormula_latestFormula_custom_defaults[];
}

export interface LatestFormula_latestFormula {
  __typename: "Formula";
  id: string;
  author_id: string;
  author_username: string;
  name: string;
  description: string;
  ts: number;
  appVersion: string;
  isOfficial: boolean;
  readings: LatestFormula_latestFormula_readings[];
  treatments: LatestFormula_latestFormula_treatments[];
  custom: LatestFormula_latestFormula_custom[];
}

export interface LatestFormula {
  latestFormula: LatestFormula_latestFormula;
}

export interface LatestFormulaVariables {
  id: string;
}
