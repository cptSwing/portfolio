import tailwindBreakpointsInspector from 'tailwindcss-breakpoints-inspector';
import tailwindScrollbar from 'tailwind-scrollbar';
import plugin from 'tailwindcss/plugin';
import { tailwindClipInset, tailwindMaskEdges } from 'tailwind-css-plugins/meta';

const tailwindHoverActive = plugin(({ addVariant, matchVariant }) => {
    addVariant('hover-active', ['&:hover', '&:active']);

    /* https://github.com/tailwindlabs/tailwindcss/discussions/9713#discussioncomment-4040990 */
    matchVariant(
        'group',
        (_, { modifier }) =>
            modifier
                ? [`:merge(.group\\/${modifier}):hover &`, `:merge(.group\\/${modifier}):active &`]
                : [`:merge(.group):hover &`, `:merge(.group):active &`],
        {
            values: { 'hover-active': 'hover-active' },
        },
    );
    matchVariant(
        'peer',
        (_, { modifier }) =>
            modifier
                ? [`:merge(.peer\\/${modifier}):hover ~ &`, `:merge(.peer\\/${modifier}):active ~ &`]
                : [`:merge(.peer):hover ~ &`, `:merge(.peer):active ~ &`],
        {
            values: { 'hover-active': 'hover-active' },
        },
    );
});

type TextCropFontPreset = { topCrop: number; bottomCrop: number; cropFontSize: number; cropLineHeight: number };
type TextCropOptions = Record<string, TextCropFontPreset>;

// http://text-crop.eightshapes.com and https://github.com/DirectedEdges/text-crop --> Used values from tailwind's text-5xl here
// TODO add explicit plugin option to include default presets I guess
// TODO other popular Google fonts: Montserrat, Open Sans, Poppins, Lato, Raleway, Oswald, Source Sans Pro, Playfair Display, Pathway Gothic One
const textCropOptionPresets: TextCropOptions = {
    roboto: {
        topCrop: 7,
        bottomCrop: 7,
        cropFontSize: 48,
        cropLineHeight: 1,
    },
};

const tailwindTextCrop = plugin.withOptions((textCropOptions: TextCropOptions) => ({ matchComponents, theme }) => {
    const componentRootName = 'text-crop';
    const textCropComponents: Parameters<typeof matchComponents<string>>[0] = {};
    const totalTextCropOptions = { ...textCropOptionPresets, ...textCropOptions };

    for (const fontName in totalTextCropOptions) {
        const { topCrop, bottomCrop, cropFontSize, cropLineHeight } = totalTextCropOptions[fontName];
        const componentName = `${componentRootName}-${fontName}`;

        textCropComponents[componentName] = (arg: [string, { lineHeight: string }] | string) => {
            let fontSizeRem = '1rem';
            let lineHeightRemOrUnitless = '1.5rem';

            let topAdjustment_Px = '0px';
            let bottomAdjustment_Px = '0px';

            if (Array.isArray(arg)) {
                // We can assume 'rem' as unit for fontSize, 'rem' or unitless (starting at '5xl' fontsize) as unit for lineHeight
                [fontSizeRem, { lineHeight: lineHeightRemOrUnitless }] = arg;
            } else if (typeof arg === 'string') {
                // TODO here we should assume anything from user input, 'rem' | 'px' | 'em' | percent(?). fontsize and lineheight could either be at least assumed to be same value, or we need to convert to and fro
                [fontSizeRem, lineHeightRemOrUnitless, topAdjustment_Px, bottomAdjustment_Px] = arg.split(' ');
            }

            const fontSizeRemToFloat = parseFloat(fontSizeRem.replace('rem', ''));

            let lineHeightRemToFloat: number;
            if (lineHeightRemOrUnitless.includes('rem')) {
                lineHeightRemToFloat = parseFloat(lineHeightRemOrUnitless.replace('rem', ''));
            } else {
                lineHeightRemToFloat = parseFloat(lineHeightRemOrUnitless) * fontSizeRemToFloat;
            }
            const lineHeightRatio = lineHeightRemToFloat / fontSizeRemToFloat;

            const dynamicTopCrop = Math.max(topCrop + (lineHeightRatio - cropLineHeight) * (cropFontSize / 2), 0) / cropFontSize;
            const dynamicBottomCrop = Math.max(bottomCrop + (lineHeightRatio - cropLineHeight) * (cropFontSize / 2), 0) / cropFontSize;

            return {
                '&:before,&:after': {
                    content: '""',
                    display: 'block',
                    height: '0',
                    width: '0',
                },
                '&:before': { marginBottom: `calc(-${dynamicTopCrop}em + ${topAdjustment_Px}) /* lineHeight: ${lineHeightRatio} */` },
                '&:after': { marginTop: `calc(-${dynamicBottomCrop}em + ${bottomAdjustment_Px}) /* lineHeight: ${lineHeightRatio} */` },
            };
        };
    }

    matchComponents(textCropComponents, {
        values: {
            ...theme('fontSize'),
            DEFAULT: theme('fontSize')!['base'],
        },
    });
});

const tailWindTheme = {
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
                'miriam-libre': ['Miriam Libre Variable', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                '2xs': ['0.666rem', { lineHeight: '0.875rem' }],
                '3xs': ['0.55rem', { lineHeight: '0.7rem' }],
            },
            dropShadow: {
                'omni-md': ['0 0 4px rgb(0 0 0 / 0.1)', '0 0 3px rgb(0 0 0 / 0.2)'],
                'omni-lg': ['0 0 6px rgb(0 0 0 / 0.2)', '0 0 4px rgb(0 0 0 / 0.4)'],
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
        tailwindHoverActive,
        tailwindTextCrop({
            'miriam-libre': {
                topCrop: 5,
                bottomCrop: 8,
                cropFontSize: 48,
                cropLineHeight: 1,
            },
            // weight 700 in the text-crop app
            'miriam-libre-bold': {
                topCrop: 4,
                bottomCrop: 8,
                cropFontSize: 48,
                cropLineHeight: 1,
            },
        }),
    ],
};

export default tailWindTheme;
