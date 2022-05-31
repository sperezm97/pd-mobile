import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

import { Config } from '../Config/AppConfig';

export const getApolloClient = () => {
    const apolloClient = new ApolloClient({
        cache: new InMemoryCache(),
        link: createHttpLink({
            uri: Config.gql_url,
            credentials: 'include',
        }),
        defaultOptions: { query: { fetchPolicy: 'no-cache' } },
    });
    return apolloClient;
};
