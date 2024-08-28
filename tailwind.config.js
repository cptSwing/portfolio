/** @type {import('tailwindcss').Config} */

import colors from 'tailwindcss/colors';
import tailwindBreakpointsInspector from 'tailwindcss-breakpoints-inspector';
import tailwindScrollbar from 'tailwind-scrollbar';

/* https://www.palettte.app/ */
const customPalettes = {
    bloodOrange: {
        primary: {
            900: '#6B1104', // text, for example
            700: '#A6210E',
            500: '#C73723', // base
            300: '#E05744',
            100: '#EF8A7C', // message background, for example
        },
        utility: {
            bg: colors.gray[50],
            text: colors.gray[950],
        },
        accent: {
            900: '#037382',
            700: '#0B9AAD',
            500: '#23B3C7',
            300: '#46D5E8',
            100: '#8AEEFB',
        },
        critical: {},
        attention: {},
        success: {},
        neutral: {
            900: colors.slate[900],
            800: colors.slate[800],
            700: colors.slate[700],
            600: colors.slate[600],
            500: colors.slate[500],
            400: colors.slate[400],
            300: colors.slate[300],
            200: colors.slate[200],
            100: colors.slate[100],
        },
    },
};

export default {
    content: ['./index.html', './src/**/*.{js,ts,tsx}'],
    theme: {
        extend: {
            spacing: {
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
            },
            fontSize: {
                '2xs': '0.666rem',
                '3xs': '0.55rem',
            },
            colors: {
                palette: {
                    ...customPalettes.bloodOrange,
                },
            },
            boxShadow: {
                'inner-sm-border': 'inset 0 0 1.5rem 1.5rem var(--tw-shadow-color)',
                'inner-sm': 'inset 0 0 2rem 0.5rem var(--tw-shadow-color)',
                'inner-md': 'inset 0 0 4rem 1rem var(--tw-shadow-color)',
            },
            willChange: {
                filter: 'filter',
            },
        },
    },
    plugins: [tailwindScrollbar, tailwindBreakpointsInspector],
};
