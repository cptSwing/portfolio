import tailwindBreakpointsInspector from 'tailwindcss-breakpoints-inspector';
import tailwindScrollbar from 'tailwind-scrollbar';
import tailwindClipInset from './src/lib/tailwindClipInset';
import tailwindMaskEdges from './src/lib/tailwindMaskEdges';

export default {
    future: {
        hoverOnlyWhenSupported: true,
    },
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
                164: '41rem',
                168: '42rem',
            },
            fontFamily: {
                'besley': ['Besley', 'ui-serif', 'serif'],
                'dm-serif': ['"DM Serif Display"', 'ui-serif', 'serif'],
                'barlow': ['"Barlow Semi Condensed"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                'protest-strike': ['"Protest Strike"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                'protest-riot': ['"Protest Riot"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                'protest-revolution': ['"Protest Revolution"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                'caveat': ['Caveat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                '2xs': '0.666rem',
                '3xs': '0.55rem',
            },
            // colors: {
            //     theme: {
            //         ...themePalette,
            //     },
            // },
            boxShadow: {
                'top-rim-lg': 'inset 0px 10px 4px -10px rgb(0 0 0 / 0.1)',
                'with-top-lg': '0px -1px 10px -1px rgb(0 0 0 / 0.1), 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                'with-top-xl': '0px -3px 14px -4px rgb(0 0 0 / 0.1), 0px 20px 25px -5px rgb(0 0 0 / 0.1), 0px 8px 10px -6px rgb(0 0 0 / 0.1)',
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
        tailwindClipInset,
        tailwindMaskEdges,
        // plugin(function ({ addVariant }) {
        //     addVariant('hover', ['@media (hover: hover) { &:hover }', '@media (hover: none) { &:active }']);
        // }),
    ],
};
