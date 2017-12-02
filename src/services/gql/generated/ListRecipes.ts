/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListRecipes
// ====================================================

export interface ListRecipes_listRecipes {
  __typename: "FormulaMeta";
  id: string;
  name: string;
  desc: string;
  ts: number;
  appVersion: string;
}

export interface ListRecipes {
  listRecipes: ListRecipes_listRecipes[];
}
