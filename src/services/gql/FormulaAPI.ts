import gql from 'graphql-tag';
import { Formula } from '~/models/recipe/Recipe';
import { FormulaKey } from '~/models/recipe/FormulaKey';
import { ApolloClient, NormalizedCacheObject, QueryResult, useQuery } from '@apollo/client';

import { RS } from '../RecipeUtil';
import { FetchLatestFormulaMeta, FetchLatestFormulaMetaVariables } from './generated/FetchLatestFormulaMeta';
import { FetchFormula, FetchFormulaVariables } from './generated/FetchFormula';
import { ListFormulas } from './generated/ListFormulas';
import { FormulaTransformer } from './FormulaTransformer';
import { FormulaMeta } from '~/models/recipe/FormulaMeta';

export class FormulaAPI {
    static useFormulaList = (): QueryResult<ListFormulas> => {
        const query = gql`
            query ListFormulas {
                listFormulas {
                    id
                    name
                    desc
                    ts
                    appVersion
                    isOfficial
                }
            }
        `;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useQuery<ListFormulas>(query);
    };

    static fetchFormula = async (key: FormulaKey, client: ApolloClient<NormalizedCacheObject>): Promise<Formula> => {
        const query = gql`
            query FetchFormula($id: String!, $ts: Float!) {
                formulaVersion(id: $id, ts: $ts) {
                    id
                    author_id
                    author_username
                    name
                    description
                    ts
                    appVersion
                    isOfficial
                    readings {
                        name
                        var
                        sliderMin
                        sliderMax
                        idealMin
                        idealMax
                        type
                        decimalPlaces
                        units
                        defaultValue
                        isDefaultOn
                        offsetReadingVar
                    }
                    treatments {
                        name
                        var
                        function
                        type
                        concentration
                    }
                    custom {
                        name
                        var
                        description
                        defaults {
                            wallType
                            min
                            max
                        }
                    }
                }
            }
        `;
        const variables = RS.reverseKey(key);
        console.log('Variable: ', JSON.stringify(variables));
        const result = await client.query<FetchFormula, FetchFormulaVariables>({
            query,
            variables,
        });
        if (result.data) {
            return FormulaTransformer.fromAPI(result.data.formulaVersion);
        }
        return Promise.reject('');
    };

    /// Runs a cheap query to fetch _some_ of the metadata of the most recent version for a particular formula (see the Omit fields)
    static fetchLatestMetaForFormula = async (
        key: FormulaKey,
        client: ApolloClient<NormalizedCacheObject>,
    ): Promise<Omit<FormulaMeta, 'desc' | 'name'>> => {
        const query = gql`
            query FetchLatestFormulaMeta($id: String!) {
                latestPublishedMeta(id: $id) {
                    ts
                    appVersion
                    id
                    isOfficial
                }
            }
        `;
        const variables = {
            id: RS.reverseKey(key).id,
        };
        const result = await client.query<FetchLatestFormulaMeta, FetchLatestFormulaMetaVariables>({
            query,
            variables,
        });
        if (!result.data) {
            return Promise.reject('Formula meta not found on server');
        }

        return result.data.latestPublishedMeta;
    };

    static fetchLatestFormulaQuery = gql`
        query LatestFormula($id: String!) {
            latestFormula(id: $id) {
                id
                author_id
                author_username
                name
                description
                ts
                appVersion
                isOfficial
                readings {
                    name
                    var
                    sliderMin
                    sliderMax
                    idealMin
                    idealMax
                    type
                    decimalPlaces
                    units
                    defaultValue
                    isDefaultOn
                    offsetReadingVar
                }
                treatments {
                    name
                    var
                    function
                    type
                    concentration
                }
                custom {
                    name
                    var
                    description
                    defaults {
                        wallType
                        min
                        max
                    }
                }
            }
        }
    `;
}
