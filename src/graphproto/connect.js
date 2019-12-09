import ApolloClient, {gql}  from 'apollo-boost';
import assert from 'assert'

export default async (config,libs,emit) => {
  assert(config.uri,'requires graphql query url')

  const apollo = new ApolloClient({
    uri: config.uri,
    queryDeduplication:false,
  });

  return {
    apollo,
    gql
  }

}
