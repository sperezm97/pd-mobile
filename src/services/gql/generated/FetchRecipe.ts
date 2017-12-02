/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchRecipe
// ====================================================

export interface FetchRecipe_formulaVersion_readings {
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
}

export interface FetchRecipe_formulaVersion_treatments {
  __typename: "Treatment";
  name: string;
  var: string;
  function: string;
  type: string;
  concentration: number;
}

export interface FetchRecipe_formulaVersion_custom_defaults {
  __typename: "DefaultRange";
  wallType: string | null;
  min: number;
  max: number;
}

export interface FetchRecipe_formulaVersion_custom {
  __typename: "TargetRange";
  name: string;
  var: string;
  description: string | null;
  defaults: FetchRecipe_formulaVersion_custom_defaults[];
}

export interface FetchRecipe_formulaVersion {
  __typename: "Formula";
  id: string;
  author_id: string;
  author_username: string;
  name: string;
  description: string;
  ts: number;
  appVersion: string;
  readings: FetchRecipe_formulaVersion_readings[];
  treatments: FetchRecipe_formulaVersion_treatments[];
  custom: FetchRecipe_formulaVersion_custom[];
}

export interface FetchRecipe {
  formulaVersion: FetchRecipe_formulaVersion;
}

export interface FetchRecipeVariables {
  id: string;
  ts: number;
}
