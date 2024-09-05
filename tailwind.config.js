/** @type {import('tailwindcss').Config} */

import colors from 'tailwindcss/colors';
import plugin from 'tailwindcss/plugin';
import tailwindBreakpointsInspector from 'tailwindcss-breakpoints-inspector';
import tailwindScrollbar from 'tailwind-scrollbar';

/* https://www.palettte.app/ */
const customPalettes = {
    bloodOrange: {
        primary: {
            DEFAULT: '#CC3723',
            950: '#3A0801', // dark text, for example
            900: '#661004',
            800: '#8A1707',
            700: '#A6200D',
            600: '#BA2A17',
            500: '#CC3723', // base
            400: '#DA4834',
            300: '#E65E4B',
            200: '#EF7767',
            100: '#F49B8F',
            50: '#F8C1B9', // message background, for example
        },
        utility: {
            bg: colors.gray[50],
            text: colors.gray[950],
        },
        accent: {
            DEFAULT: '#2AA6B6',
            950: '#012B31',
            900: '#034851',
            800: '#08626E',
            700: '#0F7A88',
            600: '#1B91A1',
            500: '#2AA6B6',
            400: '#3DBACA',
            300: '#56CBDB',
            200: '#71DAE8',
            100: '#92E8F4',
            50: '#B7F2FA',
        },
        critical: { ...colors.orange },
        attention: {
            DEFAULT: '#F8C72D',
            50: '#FEF6DF',
            100: '#FDF1CB',
            200: '#FCE7A3',
            300: '#FBDC7C',
            400: '#F9D254',
            500: '#F8C72D',
            600: '#E5B008',
            700: '#AF8606',
            800: '#795D04',
            900: '#423302',
            950: '#271E01',
        },
        success: { ...colors.emerald },
        neutral: { ...colors.zinc },
    },

    _undefined: {
        primary: {},
        utility: {
            bg: colors.gray[50],
            text: colors.gray[950],
        },
        accent: {},
        critical: {},
        attention: {},
        success: {},
        neutral: { ...colors.slate },
    },
};

export default {
    content: ['./index.html', './src/**/*.{js,ts,tsx}'],
    theme: {
        maskEdges: {
            DEFAULT: '20 20 1',
            0: '20 20 0',
            10: '20 20 0.1',
            20: '20 20 0.2',
            25: '20 20 0.25',
            30: '20 20 0.3',
            40: '20 20 0.4',
            50: '20 20 0.5',
            60: '20 20 0.6',
            70: '20 20 0.7',
            75: '20 20 0.75',
            80: '20 20 0.8',
            90: '20 20 0.9',
            100: '20 20 1',
        },
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
            fontFamily: {
                'barlow': ['"Barlow Semi Condensed"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                'dm-serif': ['"DM Serif Display"', 'ui-serif', 'serif'],
                'protest-riot': ['"Protest Riot"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
    plugins: [
        tailwindScrollbar,
        tailwindBreakpointsInspector,
        plugin(({ matchUtilities, theme }) => {
            matchUtilities(
                {
                    'mask-edges': (rangeX_rangeY_opacity) => {
                        const [rangeX, rangeY, opacity] = rangeX_rangeY_opacity.split(' ', 3);
                        const rangeXCapped = Math.max(0, Math.min(50, parseInt(rangeX)));
                        const rangeYCapped = Math.max(0, Math.min(50, parseInt(rangeY)));
                        const opacityCapped = Math.max(0, Math.min(1, parseFloat(opacity)));

                        return {
                            'mask-composite': 'intersect',
                            'mask-image': `linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, ${opacityCapped}) ${rangeXCapped}% ${100 - rangeXCapped}%, rgba(0, 0, 0, 0) 100%), linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, ${opacityCapped}) ${rangeYCapped}% ${100 - rangeYCapped}%, rgba(0, 0, 0, 0) 100%)`,
                        };
                    },
                },
                { values: theme('maskEdges') },
            );
        }),
    ],
};
