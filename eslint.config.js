import jsEslint from '@eslint/js';
import globals from 'globals';
import reactEslint from 'eslint-plugin-react';
import reactHooksEslint from 'eslint-plugin-react-hooks';
import reactRefreshEslint from 'eslint-plugin-react-refresh';
import tsEslint from 'typescript-eslint';
import prettierEslint from 'eslint-plugin-prettier';

export default tsEslint.config(
    { ignores: ['dist'] },
    {
        extends: [jsEslint.configs.recommended, ...tsEslint.configs.recommended],
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: globals.browser,
        },
        plugins: {
            'react': reactEslint,
            'react-hooks': reactHooksEslint,
            'react-refresh': reactRefreshEslint,
            'prettier': prettierEslint,
        },
        rules: {
            ...reactHooksEslint.configs.recommended.rules,
            'react-hooks/rules-of-hooks': 'warn',
            'react-hooks/exhaustive-deps': 'warn',

            'object-shorthand': 'warn',
            'no-console': 'warn',
            'no-unused-vars': 'off',
            'no-unused-expressions': 'off',

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
        },
    },
);

// module.exports = {
//     root: true,
//     env: { browser: true, es2020: true },
//     parser: '@typescript-eslint/parser',
//     parserOptions: {
//         project: ['./tsconfig.app.json'],
//         ecmaFeatures: {
//             jsx: true,
//         },
//     },
//     plugins: ['prettier', '@typescript-eslint', 'react', 'react-hooks', 'react-refresh'],
//     ignorePatterns: ['dist', '.eslintrc.cjs'],
//     extends: [
//         'eslint:recommended',
//         'plugin:@typescript-eslint/recommended-requiring-type-checking',
//         'plugin:react/recommended',
//         'plugin:react-hooks/recommended',
//         'plugin:react/jsx-runtime',
//         'plugin:prettier/recommended',
//     ],
//     rules: {
//         'object-shorthand': 'warn',
//         'no-console': 'warn',
//         'prettier/prettier': 'error',
//         '@typescript-eslint/no-unused-vars': [
//             'warn',
//             {
//                 argsIgnorePattern: '^_',
//                 varsIgnorePattern: '^_ignored',
//             },
//         ],
//         'react-hooks/rules-of-hooks': 'warn',
//         'react-hooks/exhaustive-deps': 'warn',
//         'react-refresh/only-export-components': ['warn', { allowConstantExport: false }],
//     },
// };
