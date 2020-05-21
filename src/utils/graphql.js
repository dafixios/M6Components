const fBase = window.Drupal.settings.m6_platform.f_base.functions.api_url

import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const graphqlCache = new InMemoryCache()

export { graphqlCache }

export default new ApolloClient({
  // Provide the URL to the API server.
  link: new HttpLink({ uri: `${fBase}/graphql` }),
  // Using a cache for blazingly
  // fast subsequent queries.
  cache: graphqlCache,

  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore'
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all'
    }
  }
})
