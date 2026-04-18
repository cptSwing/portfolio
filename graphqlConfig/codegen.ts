import type { CodegenConfig } from '@graphql-codegen/cli';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), 'ASTRO');

const config: CodegenConfig = {
    overwrite: true,
    schema: env.ASTRO_GRAPHQL_ENDPOINT,
    documents: ['graphqlConfig/*.graphql', '!graphqlConfig/*.schema.graphql', 'src/**/*.{ts,tsx,astro}', `!${env.ASTRO_GRAPHQL_CODEGEN_OUTPUT_FILE}`], // Relative to yarn root
    generates: {
        [env.ASTRO_GRAPHQL_CODEGEN_OUTPUT_FILE]: {
            plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
        },
    },
    config: {
        enumsAsConst: true,
        useTypeImports: true,
        pureMagicComment: true,
        printFieldsOnNewLines: true,
        extractAllFieldsToTypes: true,
        avoidOptionals: true,
    },
    importExtension: '.ts',
};

export default config;
