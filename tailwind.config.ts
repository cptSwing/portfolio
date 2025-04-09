import tailwindBreakpointsInspector from 'tailwindcss-breakpoints-inspector';
import tailwindScrollbar from 'tailwind-scrollbar';
import plugin from 'tailwindcss/plugin';
import { tailwindClipInset, tailwindMaskEdges } from 'tailwind-css-plugins/meta';

export default {
    future: {
        hoverOnlyWhenSupported: true,
    },
    content: ['./index.html', './src/**/*.{js,ts,tsx}'],
    theme: {
        extend: {
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
                'mariam-libre': ['Miriam Libre Variable', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                '2xs': '0.666rem',
                '3xs': '0.55rem',
            },
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
        plugin(({ addVariant }) => {
            addVariant('hover-focus', ['&:hover', '&:focus']);
            addVariant('hover-active', ['&:hover', '&:active']);
            addVariant('hover-focus-active', ['&:hover', '&:focus', '&:active']);
        }),
        plugin(({ matchComponents }) => {
            matchComponents({
                'text-crop': (argString) => {
                    const [cropTop, cropBottom, cropFontSize] = argString.split(' ').map((pxValue) => pxValue.replace(/[^0-9]/g, ''));

                    return {
                        '&:before,&:after': {
                            content: '""',
                            display: 'block',
                            height: '0',
                            width: '0',
                        },
                        '&:before': { marginBottom: `calc(-1 * (max(${cropTop}em, 0em) / ${cropFontSize})) /* Crop Top */` },
                        '&:after': { marginTop: `calc(-1 * (max(${cropBottom}em, 0em) / ${cropFontSize})) /* Crop Bottom */` },
                    };
                },
            });
        }),
    ],
};
