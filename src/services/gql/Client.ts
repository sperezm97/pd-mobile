import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
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
