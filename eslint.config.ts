import { defineConfig } from 'eslint/config';
import globals from 'globals';
import eslintPluginTypescript from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginJs from '@eslint/js';
import eslintConfigPreact from 'eslint-config-preact';
import eslintPluginCss from '@eslint/css';
import { tailwind4 } from 'tailwind-csstree';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

const config = defineConfig([
    {
        // Acts as global ignore if no other keys (except for 'name')
        name: 'ignores',
        ignores: ['dist/', 'node_modules/', '.astro/', '.vscode/'],
    },

    {
        // extracted from the below config in order to not have it flag jsx-similar code in .astro files
        name: 'preact',
        files: ['**/*.tsx'],
        extends: [...eslintConfigPreact],
        rules: {
            'react/jsx-no-bind': [
                'warn',
                {
                    ignoreRefs: true,
                },
            ],
        },
    },

    {
        name: 'js/ts/astro',
        files: ['**/*.{js,mjs,cjs,ts,tsx,astro}'],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        plugins: {
            js: eslintPluginJs,
            '@typescript-eslint': eslintPluginTypescript.plugin,
            astro: eslintPluginAstro,
        },
        extends: ['js/recommended', '@typescript-eslint/recommended', ...eslintPluginAstro.configs.recommended, 'astro/jsx-a11y-recommended'],
        rules: {
            'no-empty': 'off',
            'object-shorthand': 'warn',
            'no-console': 'warn',
            'no-unused-vars': 'off',
            'no-unused-expressions': 'off',
            'no-unreachable': 'warn',

            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-unused-expressions': [
                'error',
                {
                    allowTernary: true,
                    allowShortCircuit: true,
                },
            ],
        },
    },

    {
        name: '@eslint/css',
        files: ['**/*.css'],
        language: 'css/css',
        languageOptions: {
            tolerant: true,
            customSyntax: tailwind4,
        },
        plugins: {
            css: eslintPluginCss,
        },
        extends: ['css/recommended'],
        rules: {
            'css/no-important': 'warn',
        },
    },

    // Prettier last to disable conflicts
    eslintConfigPrettier,
]);

export default config;
