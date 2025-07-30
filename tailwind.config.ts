import tailwindBreakpointsInspector from 'tailwindcss-breakpoints-inspector';
import tailwindScrollbar from 'tailwind-scrollbar';
import { tailwindClipInset, tailwindMaskEdges } from 'tailwind-css-plugins/meta';
import { tailwindHoverActive } from './src/lib/tailwindPlugins';

const tailWindTheme = {
    future: {
        hoverOnlyWhenSupported: true,
    },
    content: ['./index.html', './src/**/*.{js,ts,tsx}'],
    theme: {
        extend: {
            aspectRatio: {
                'hex-flat': '1 / 0.866',
            },
            spacing: {
                84: '21rem',
                88: '22rem',
                92: '23rem',
                96: '24rem',
                100: '25rem',
                104: '26rem',
                108: '27rem',
                112: '28rem',
                116: '29rem',
                120: '30rem',
                124: '31rem',
                128: '32rem',
                132: '33rem',
                136: '34rem',
                140: '35rem',
                144: '36rem',
                148: '37rem',
                152: '38rem',
                156: '39rem',
                160: '40rem',
                164: '41rem',
                168: '42rem',
            },
            fontFamily: {
                'lato': ['Lato', 'sans-serif'], // small lettering
                'fjalla-one': ['Fjalla One', 'sans-serif'], // headlines etc
                'merriweather': ['Merriweather', 'serif'], // post text
            },
            fontSize: {
                '2xs': ['0.666rem', { lineHeight: '0.875rem' }],
                '3xs': ['0.55rem', { lineHeight: '0.7rem' }],
            },
            dropShadow: {
                'omni-md': ['0 0 4px rgb(0 0 0 / 0.1)', '0 0 3px rgb(0 0 0 / 0.2)'],
                'omni-lg': ['0 0 6px rgb(0 0 0 / 0.2)', '0 0 4px rgb(0 0 0 / 0.4)', '0 0 1px black'],
            },
            boxShadow: {
                'inner-sm-border': 'inset 0 0 1.5rem 1.5rem var(--tw-shadow-color)',
                'inner-sm': 'inset 0 0 2rem 0.5rem var(--tw-shadow-color)',
                'inner-md': 'inset 0 0 4rem 1rem var(--tw-shadow-color)',
            },
            willChange: {
                filter: 'filter',
            },
            colors: {
                theme: {
                    'primary': 'rgb(var(--theme-primary))',
                    'primary-lighter': 'rgb(var(--theme-primary-lighter))',
                    'primary-darker': 'rgb(var(--theme-primary-darker))',
                    'secondary': 'rgb(var(--theme-secondary))',
                    'secondary-lighter': 'rgb(var(--theme-secondary-lighter))',
                    'secondary-darker': 'rgb(var(--theme-secondary-darker))',
                    'accent': 'rgb(var(--theme-accent))',
                    'text': 'rgb(var(--theme-text))',
                    'text-background': 'rgb(var(--theme-text-background))',
                    'root-background': 'rgb(var(--theme-root-background))',
                },
            },
        },
    },
    plugins: [tailwindScrollbar, tailwindBreakpointsInspector, tailwindClipInset, tailwindMaskEdges, tailwindHoverActive],
};

export default tailWindTheme;
