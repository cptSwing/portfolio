import { defineConfig } from 'eslint/config';
import globals from 'globals';
import eslintPluginTypescript from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginJs from '@eslint/js';
import eslintConfigPreact from 'eslint-config-preact';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginCss from '@eslint/css';
import { tailwind4 } from 'tailwind-csstree';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @typedef {import("@eslint/config-helpers").ConfigWithExtends} eslintConfigPreactTyped */
const eslintConfigPreactTyped = eslintConfigPreact;

// WARN eslint-config-preact contains @eslint/js (as well as eslint-plugin-react-hooks), so to prevent overwriting, these rules need to be applied in both entries

/** @type {import("eslint").Linter.RulesRecord} jsRules */
const jsRules = {
    'no-empty': 'off',
    'object-shorthand': 'warn',
    'no-console': 'warn',
    'no-unused-vars': 'off',
    'no-unused-expressions': 'off',
    'no-unreachable': 'warn',
};

/** @type {import("@eslint/config-helpers").ConfigWithExtends[]} config */
const config = defineConfig([
    {
        name: 'languageOptions',
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
    },

    {
        name: 'ignores',
        ignores: ['dist', 'node_modules', '.astro', '.vscode'],
    },

    {
        name: '@eslint/js',
        files: ['**/*.{js,mjs,cjs,ts,tsx}'],
        plugins: {
            js: eslintPluginJs,
        },
        extends: ['js/recommended'],
        rules: jsRules,
    },

    {
        name: 'all typescript / preact + typescript files',
        files: ['**/*.{ts,tsx}'],
        plugins: {
            '@typescript-eslint': eslintPluginTypescript.plugin,
        },
        extends: [eslintConfigPreactTyped, '@typescript-eslint/recommended', eslintPluginJsxA11y.flatConfigs.recommended],
        rules: {
            ...jsRules,
            'react/jsx-no-bind': ['warn', { ignoreRefs: true }],

            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true, allowShortCircuit: true }],
        },
    },

    {
        name: 'eslint-plugin-astro',
        files: ['**/*.astro'],
        plugins: {
            astro: eslintPluginAstro,
        },
        extends: ['astro/jsx-a11y-recommended'],
    },

    {
        name: '@eslint/css',
        files: ['**/*.css'],
        language: 'css/css',
        languageOptions: {
            tolerant: true,
            customSyntax: tailwind4,
        },
        plugins: { css: eslintPluginCss },
        extends: ['css/recommended'],
    },

    // Prettier last to disable conflicts
    eslintConfigPrettier,
]);

export default config;
