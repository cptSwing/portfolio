import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';
import showTailwindCSSBreakpoint from 'astro-show-tailwindcss-breakpoint';
import purgecss from 'astro-purgecss';
import { loadEnv } from 'vite';
import process from 'node:process';

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), 'ASTRO');

export default defineConfig({
    site: 'https://www.jbrandenburg.de',
    output: 'static',
    build: { format: 'preserve', inlineStylesheets: 'never' },
    integrations: [
        preact(),
        showTailwindCSSBreakpoint(),
        purgecss({
            extractors: [
                // Necessary for tailwind to not delete my custom classes (w-[200px] for instance)
                {
                    extractor: (content) => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
                    extensions: ['astro', 'html', 'tsx'],
                },
            ],
        }),
    ],
    vite: {
        plugins: [tailwindcss()],
    },
    devToolbar: { enabled: true },
    prefetch: {
        prefetchAll: true,
        defaultStrategy: 'hover',
    },
    fonts: [
        {
            provider: fontProviders.google(),
            name: 'Roboto',
            weights: [200, '400', 'bold'],
            styles: ['normal', 'italic', 'oblique'],
            display: 'swap',
            cssVariable: '--font-roboto',
            fallbacks: ['sans-serif'],
        },
    ],
    image: {
        domains: ['astro.build', env.ASTRO_GRAPHQL_ENDPOINT],
        remotePatterns: [{ protocol: 'http' }],
    },
});
