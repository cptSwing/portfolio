/** @type {import('tailwindcss').Config} */

import colors from 'tailwindcss/colors';
import tailwindBreakpointsInspector from 'tailwindcss-breakpoints-inspector';
import tailwindScrollbar from 'tailwind-scrollbar';

export default {
    content: ['./index.html', './src/**/*.{js,ts,tsx}'],
    theme: {
        extend: {
            // animation: {
            //     'from-out-to-x-0': '500ms linear 0s 1 normal both running frLe',
            //     'to-out-from-x-0': '500ms linear 0s 1 normal both running toLe',
            // },
            // keyframes: {
            //     frLe: {
            //         '0%': {
            //             transform: 'translateZ(-8rem)',
            //         },
            //         '20%': {
            //             transform: 'translateZ(-8rem)',
            //         },
            //         '100%': {
            //             transform: 'translateZ(4rem)',
            //         },
            //     },
            //     toLe: {
            //         '0%': {
            //             transform: 'translateX(0)',
            //         },
            //         '66.666%': {},
            //     },
            // },
            spacing: {
                100: '25rem',
                104: '26rem',
                108: '27rem',
                112: '28rem',
                116: '29rem',
                120: '30rem',
            },
            fontSize: {
                '2xs': '0.666rem',
                '3xs': '0.55rem',
            },
            colors: {
                palette: {
                    primary: colors.gray[700],
                    secondary: colors.gray[400],
                    test: colors.red[500],
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
