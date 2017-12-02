/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchLatestFormulaMeta
// ====================================================

export interface FetchLatestFormulaMeta_latestPublishedMeta {
  __typename: "FormulaMeta";
  ts: number;
  appVersion: string;
  id: string;
  isOfficial: boolean;
}

export interface FetchLatestFormulaMeta {
  latestPublishedMeta: FetchLatestFormulaMeta_latestPublishedMeta;
}

export interface FetchLatestFormulaMetaVariables {
  id: string;
}
