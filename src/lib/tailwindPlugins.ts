import plugin from 'tailwindcss/plugin';

/** Adds a `hover-active` variant to TailwindCSS, to execute a style change when either :hover or :active are true - this aims to get rid of duplicated code targetting mobile devices. */
export const tailwindHoverActive = plugin(({ addVariant, matchVariant }) => {
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

// TODO add explicit plugin option to include default presets I guess
// TODO other popular Google fonts: Montserrat, Open Sans, Poppins, Lato, Raleway, Oswald, Source Sans Pro, Playfair Display, Pathway Gothic One

type TextCropFontPreset = { topCrop: number; bottomCrop: number; cropFontSize: number; cropLineHeight: number };
type TextCropOptions = Record<string, TextCropFontPreset>;

// http://text-crop.eightshapes.com and https://github.com/DirectedEdges/text-crop --> Used values from tailwind's text-5xl here
const textCropOptionPresets: TextCropOptions = {
    roboto: {
        topCrop: 7,
        bottomCrop: 7,
        cropFontSize: 48,
        cropLineHeight: 1,
    },
};

export const tailwindTextCrop = plugin.withOptions((textCropOptions: TextCropOptions) => ({ matchComponents, theme }) => {
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
