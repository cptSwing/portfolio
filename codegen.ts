import type { CodegenConfig } from '@graphql-codegen/cli';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), 'ASTRO');

const config: CodegenConfig = {
    overwrite: true,
    schema: env.ASTRO_GRAPHQL_ENDPOINT,
    documents: ['src/**/*.{astro,graphql}', '!*.schema.graphql'],
    generates: {
        'src/api/gql/': { preset: 'client' },
    },
    config: {
        enumsAsConst: true,
        useTypeImports: true,
        pureMagicComment: true,
        printFieldsOnNewLines: true,
        extractAllFieldsToTypes: true,
    },
    importExtension: '.ts',
};

export default config;
