import {gql}  from 'apollo-boost';
import ApolloClient from "apollo-client";
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import assert from 'assert'

export default async (config,libs,emit) => {
  assert(config.uri,'requires graphql query url')
  assert(config.ws,'requires graphql ws url')

  console.log({config})
  const wsLink = new WebSocketLink({
    uri: config.ws,
    options: {
      reconnect: true
    }
  });

  const httpLink = new HttpLink({
    uri: config.uri,
  });

  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink,
  )
  const apollo = new ApolloClient({
    link,
    cache: new InMemoryCache()
  });


  return {
    apollo,
    gql
  }

}
