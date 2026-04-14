import { expect, test } from 'vitest';
import { ESLint } from 'eslint';

test('@eslint/js (js/recommended) correctly flags "no-console" as "warn"', async () => {
    // js/recommended sets this to 'off'
    const messages = await lint('console.log("hiii");\n', 'file.js');
    expect(messages?.some((msg) => msg.ruleId === 'no-console' && msg.severity === 1)).toBe(true);
});

test('@typescript-eslint (@typescript-eslint/recommended) -> correctly flags "@typescript-eslint/no-unused-vars" as "warn"', async () => {
    // @typescript-eslint/recommended sets this to 'error'
    const messages = await lint('const fooBar = 123;\n', 'file.ts');
    expect(messages?.some((msg) => msg.ruleId === '@typescript-eslint/no-unused-vars' && msg.severity === 1)).toBe(true);
});

test('eslint-config-preact -> correctly does not flag "react/jsx-no-bind" (with ignoreRefs == true)', async () => {
    const messages = await lint('<Foo ref={() => console.log("Hello!")} />;\n', 'file.tsx');
    expect(messages?.some((msg) => msg.ruleId === 'react/jsx-no-bind')).toBe(false);
});

// Tools:

const eslint = new ESLint({
    overrideConfigFile: 'eslint.config.mjs',
});

async function lint(code: string, filePath: string) {
    const results = await eslint.lintText(code, { filePath });
    console.log(`[eslint.test] -> ${cleanControlCharacters(code)}`, results[0]);
    return results[0].messages.length ? results[0].messages : null;
}

function cleanControlCharacters(str: string) {
    return str.replace(/[\r\n\t]/g, ' ');
}
