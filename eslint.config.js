import jsEslint from '@eslint/js';
import globals from 'globals';
import reactEslint from 'eslint-plugin-react';
import reactHooksEslint from 'eslint-plugin-react-hooks';
import reactRefreshEslint from 'eslint-plugin-react-refresh';
import tsEslint from 'typescript-eslint';
import prettierEslintRecommended from 'eslint-plugin-prettier/recommended';
import jsxA11yEslint from 'eslint-plugin-jsx-a11y';

export default tsEslint.config(
    { ignores: ['dist'] },
    {
        extends: [
            jsEslint.configs.recommended,
            reactEslint.configs.flat.recommended,
            reactEslint.configs.flat['jsx-runtime'],
            reactRefreshEslint.configs.recommended,
            reactHooksEslint.configs['recommended-latest'],
            jsxA11yEslint.flatConfigs.recommended,
            ...tsEslint.configs.recommended,
            prettierEslintRecommended,
        ],
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2021,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: globals.browser,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            'react-hooks/rules-of-hooks': 'warn',
            'react-hooks/exhaustive-deps': 'warn',

            'object-shorthand': 'warn',
            'no-console': 'warn',
            'no-unused-vars': 'off',
            'no-unused-expressions': 'off',
            'no-unreachable': 'warn',

            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true, allowShortCircuit: true }],

            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

            'react/prop-types': 'off', // currently bugs out when using React.FC, see https://github.com/jsx-eslint/eslint-plugin-react/issues/3873
            'react/display-name': ['off'], // In most cases you don't need to set the displayName as it's inferred from the function/class name.
        },
    },
);
