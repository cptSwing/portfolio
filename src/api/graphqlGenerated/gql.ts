/* eslint-disable */
import * as types from './graphql.ts';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    'query GetAllPostsSlugs {\n  posts {\n    nodes {\n      slug\n    }\n  }\n}': typeof types.GetAllPostsSlugsDocument;
    'query GetAllPostsSlugsCategories {\n  posts {\n    nodes {\n      slug\n      categories {\n        nodes {\n          slug\n        }\n      }\n    }\n  }\n}': typeof types.GetAllPostsSlugsCategoriesDocument;
    'query GetAllPostsSlugsTitlesCategoriesFeaturedImages {\n  posts {\n    nodes {\n      slug\n      title\n      categories {\n        nodes {\n          slug\n        }\n      }\n      featuredImage {\n        node {\n          sourceUrl\n        }\n      }\n    }\n  }\n}': typeof types.GetAllPostsSlugsTitlesCategoriesFeaturedImagesDocument;
    'query GetAllPostsTitlesSlugs {\n  posts {\n    nodes {\n      title\n      slug\n    }\n  }\n}': typeof types.GetAllPostsTitlesSlugsDocument;
    'query GetPost($slug: ID!) {\n  post(id: $slug, idType: SLUG) {\n    title\n    slug\n    content\n  }\n}': typeof types.GetPostDocument;
};
const documents: Documents = {
    'query GetAllPostsSlugs {\n  posts {\n    nodes {\n      slug\n    }\n  }\n}': types.GetAllPostsSlugsDocument,
    'query GetAllPostsSlugsCategories {\n  posts {\n    nodes {\n      slug\n      categories {\n        nodes {\n          slug\n        }\n      }\n    }\n  }\n}':
        types.GetAllPostsSlugsCategoriesDocument,
    'query GetAllPostsSlugsTitlesCategoriesFeaturedImages {\n  posts {\n    nodes {\n      slug\n      title\n      categories {\n        nodes {\n          slug\n        }\n      }\n      featuredImage {\n        node {\n          sourceUrl\n        }\n      }\n    }\n  }\n}':
        types.GetAllPostsSlugsTitlesCategoriesFeaturedImagesDocument,
    'query GetAllPostsTitlesSlugs {\n  posts {\n    nodes {\n      title\n      slug\n    }\n  }\n}': types.GetAllPostsTitlesSlugsDocument,
    'query GetPost($slug: ID!) {\n  post(id: $slug, idType: SLUG) {\n    title\n    slug\n    content\n  }\n}': types.GetPostDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: 'query GetAllPostsSlugs {\n  posts {\n    nodes {\n      slug\n    }\n  }\n}'
): (typeof documents)['query GetAllPostsSlugs {\n  posts {\n    nodes {\n      slug\n    }\n  }\n}'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: 'query GetAllPostsSlugsCategories {\n  posts {\n    nodes {\n      slug\n      categories {\n        nodes {\n          slug\n        }\n      }\n    }\n  }\n}'
): (typeof documents)['query GetAllPostsSlugsCategories {\n  posts {\n    nodes {\n      slug\n      categories {\n        nodes {\n          slug\n        }\n      }\n    }\n  }\n}'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: 'query GetAllPostsSlugsTitlesCategoriesFeaturedImages {\n  posts {\n    nodes {\n      slug\n      title\n      categories {\n        nodes {\n          slug\n        }\n      }\n      featuredImage {\n        node {\n          sourceUrl\n        }\n      }\n    }\n  }\n}'
): (typeof documents)['query GetAllPostsSlugsTitlesCategoriesFeaturedImages {\n  posts {\n    nodes {\n      slug\n      title\n      categories {\n        nodes {\n          slug\n        }\n      }\n      featuredImage {\n        node {\n          sourceUrl\n        }\n      }\n    }\n  }\n}'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: 'query GetAllPostsTitlesSlugs {\n  posts {\n    nodes {\n      title\n      slug\n    }\n  }\n}'
): (typeof documents)['query GetAllPostsTitlesSlugs {\n  posts {\n    nodes {\n      title\n      slug\n    }\n  }\n}'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: 'query GetPost($slug: ID!) {\n  post(id: $slug, idType: SLUG) {\n    title\n    slug\n    content\n  }\n}'
): (typeof documents)['query GetPost($slug: ID!) {\n  post(id: $slug, idType: SLUG) {\n    title\n    slug\n    content\n  }\n}'];

export function graphql(source: string) {
    return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
