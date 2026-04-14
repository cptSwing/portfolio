import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';

export default defineConfig({
    site: 'https://www.jbrandenburg.de',
    output: 'static',
    build: { format: 'preserve' },
    integrations: [preact()],
    vite: { plugins: [tailwindcss()] },
    devToolbar: { enabled: false },
    prefetch: {
        prefetchAll: true,
        defaultStrategy: 'tap',
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
});
