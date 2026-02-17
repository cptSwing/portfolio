export default {
    plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    printWidth: 160,
    tabWidth: 4,
    jsxSingleQuote: false,

    overrides: [
        {
            files: '*.astro',
            options: {
                parser: 'astro',
            },
        },
    ],
};
