/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    printWidth: 160,
    tabWidth: 4,
    jsxSingleQuote: false,
    plugins: ['prettier-plugin-tailwindcss'],
    tailwindStylesheet: './src/styles/global.css',
    tailwindFunctions: ['classNames'],
};
