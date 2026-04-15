import { expect, test } from 'vitest';
import { ESLint } from 'eslint';

// js/recommended sets this to 'off and this is customised in config
test('@eslint/js (js/recommended) correctly flags "no-console" as "warn"', async () => {
    const messages = await lintText('console.log("hiii");', 'js');
    expect(messages?.some((msg) => msg.ruleId === 'no-console' && msg.severity === 1)).toBe(true);
});

// @typescript-eslint/recommended sets this to 'error' and this is customised in eslint config
test('@typescript-eslint (@typescript-eslint/recommended) -> correctly flags "@typescript-eslint/no-unused-vars" as "warn"', async () => {
    const messages = await lintText('const fooBar = 123;', 'ts');
    expect(messages?.some((msg) => msg.ruleId === '@typescript-eslint/no-unused-vars' && msg.severity === 1)).toBe(true);
});

// see config
test('eslint-config-preact -> correctly does NOT flag "react/jsx-no-bind" (with ignoreRefs == true) as "warn"', async () => {
    const messages = await lintText('<Foo ref={() => console.log("Hello!")} />;', 'tsx');
    expect(messages?.some((msg) => msg.ruleId === 'react/jsx-no-bind')).toBe(false);
});

// set active in recommended ruleset
test('eslint-plugin-jsx-a11y (recommended) -> correctly flags missing "alt" attribute ("jsx-a11y/alt-text")', async () => {
    const messages = await lintText('<img src="icon.png" />', 'tsx');
    expect(messages?.some((msg) => msg.ruleId === 'jsx-a11y/alt-text')).toBe(true);
});

// defaults to "error" in recommended ruleset
test('eslint-plugin-astro (recommended) -> correctly flags deprecated Astro.canonicalURL ("astro/no-deprecated-astro-canonicalurl")', async () => {
    const messages = await lintText('---\nconst canonicalURL = Astro.canonicalURL;\n---', 'astro');
    expect(messages?.some((msg) => msg.ruleId === 'astro/no-deprecated-astro-canonicalurl')).toBe(true);
});

// defaults to "error" in recommended ruleset
test('astro/jsx-a11y-recommended -> correctly flags headings with no content ("astro/jsx-a11y/heading-has-content")', async () => {
    const messages = await lintText('<h1 />', 'astro');
    expect(messages?.some((msg) => msg.ruleId === 'astro/jsx-a11y/heading-has-content')).toBe(true);
});

// defaults to "error" in recommended ruleset
test('@eslint/css (recommended) -> correctly flags duplicate imports ("css/no-duplicate-imports")', async () => {
    const messages = await lintText('@import url(a.css);\n@import "a.css";', 'css');
    expect(messages?.some((msg) => msg.ruleId === 'css/no-duplicate-imports')).toBe(true);
});

// Helper functions:

const eslint = new ESLint({
    overrideConfigFile: 'eslint.config.ts',
});

async function lintText(code: string, fileExtension: string) {
    const results = await eslint.lintText(code, { filePath: `dummy.${fileExtension}` });
    return results[0].messages.length ? results[0].messages : null;
}
