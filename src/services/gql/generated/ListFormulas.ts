/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListFormulas
// ====================================================

export interface ListFormulas_listFormulas {
  __typename: "FormulaMeta";
  id: string;
  name: string;
  desc: string;
  ts: number;
  appVersion: string;
  isOfficial: boolean;
}

export interface ListFormulas {
  listFormulas: ListFormulas_listFormulas[];
}
