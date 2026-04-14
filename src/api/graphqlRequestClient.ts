import { GraphQLClient } from 'graphql-request';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

const graphqlClient = new GraphQLClient(import.meta.env.ASTRO_GRAPHQL_ENDPOINT);

export function clientRequest<TData, TVariables>(documentNode: TypedDocumentNode<TData, TVariables>, variables?: object) {
    return graphqlClient.request<TData>(documentNode, variables);
}
