module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['./tsconfig.app.json'],
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: ['prettier', '@typescript-eslint', 'react', 'react-hooks', 'react-refresh'],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/jsx-runtime',
        'plugin:prettier/recommended',
    ],
    rules: {
        'object-shorthand': 'warn',
        'no-console': 'warn',
        'prettier/prettier': 'error',
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_ignored',
            },
        ],
        'react-hooks/rules-of-hooks': 'warn',
        'react-hooks/exhaustive-deps': 'warn',
        'react-refresh/only-export-components': ['warn', { allowConstantExport: false }],
    },
};
