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

export const tailwindConvertToMatrixTransform = plugin(({ addUtilities, matchUtilities, theme }) => {
    const defaults = {
        matrixA: 1,
        matrixB: 0,
        matrixC: 0,
        matrixD: 1,
        matrixE: 0,
        matrixF: 0,
        matrixRotateCos: 1,
        matrixRotateSin: 0,
        matrixScale: 1,
    };

    const defaultMatrixTransform = `matrix(var(--tw-matrix-a, ${defaults.matrixA}), var(--tw-matrix-b, ${defaults.matrixB}), var(--tw-matrix-c, ${defaults.matrixC}), var(--tw-matrix-d, ${defaults.matrixD}), var(--tw-matrix-e, ${defaults.matrixE}), var(--tw-matrix-f, ${defaults.matrixF}))`;

    addUtilities({
        '.matrix-transform': {
            '--tw-matrix-a': `calc(var(--tw-matrix-scale-x, ${defaults.matrixScale}) * var(--tw-matrix-rotate-cos, ${defaults.matrixRotateCos}))`,
            '--tw-matrix-b': `calc(var(--tw-matrix-scale-x, ${defaults.matrixScale}) * var(--tw-matrix-rotate-sin, ${defaults.matrixRotateSin}))`,
            '--tw-matrix-c': `calc(-1 * var(--tw-matrix-scale-y, ${defaults.matrixScale}) * var(--tw-matrix-rotate-sin, ${defaults.matrixRotateSin}))`,
            '--tw-matrix-d': `calc(var(--tw-matrix-scale-y, ${defaults.matrixScale}) * var(--tw-matrix-rotate-cos, ${defaults.matrixRotateCos}))`,
            'transform': defaultMatrixTransform,
        },
    });

    matchUtilities(
        {
            'matrix-translate-x': (value: string) => ({
                '--tw-matrix-e': value,
                'transform': defaultMatrixTransform,
            }),
            'matrix-translate-y': (value: string) => ({
                '--tw-matrix-f': value,
                'transform': defaultMatrixTransform,
            }),
        },
        { values: theme('number'), supportsNegativeValues: true },
    );

    matchUtilities(
        {
            'matrix-rotate': (value: string) => {
                const rotateCos = cos(value.split('deg')[0]!, 5);
                const rotateSin = sin(value.split('deg')[0]!, 5);

                return {
                    '--tw-matrix-rotate-cos': rotateCos,
                    '--tw-matrix-rotate-sin': rotateSin,
                    '--tw-matrix-a': `calc(var(--tw-matrix-scale-x, ${defaults.matrixScale}) * var(--tw-matrix-rotate-cos))`,
                    '--tw-matrix-b': `calc(var(--tw-matrix-scale-x, ${defaults.matrixScale}) * var(--tw-matrix-rotate-sin))`,
                    '--tw-matrix-c': `calc(-1 * var(--tw-matrix-scale-y, ${defaults.matrixScale}) * var(--tw-matrix-rotate-sin))`,
                    '--tw-matrix-d': `calc(var(--tw-matrix-scale-y, ${defaults.matrixScale}) * var(--tw-matrix-rotate-cos))`,
                    'transform': defaultMatrixTransform,
                };
            },
        },
        { values: theme('rotate'), supportsNegativeValues: true },
    );

    matchUtilities(
        {
            'matrix-scale-x': (value: string) => ({
                '--tw-matrix-scale-x': value,
                '--tw-matrix-a': `calc(var(--tw-matrix-scale-x) * var(--tw-matrix-rotate-cos, ${defaults.matrixRotateCos}))`,
                '--tw-matrix-b': `calc(var(--tw-matrix-scale-x) * var(--tw-matrix-rotate-sin, ${defaults.matrixRotateSin}))`,
                'transform': defaultMatrixTransform,
            }),
            'matrix-scale-y': (value: string) => ({
                '--tw-matrix-scale-y': value,
                '--tw-matrix-c': `calc(-1 * var(--tw-matrix-scale-y) * var(--tw-matrix-rotate-sin, ${defaults.matrixRotateSin}))`,
                '--tw-matrix-d': `calc(var(--tw-matrix-scale-y) * var(--tw-matrix-rotate-cos, ${defaults.matrixRotateCos}))`,
                'transform': defaultMatrixTransform,
            }),
            'matrix-scale': (value: string) => ({
                '--tw-matrix-scale-x': value,
                '--tw-matrix-scale-y': value,
                '--tw-matrix-a': `calc(var(--tw-matrix-scale-x) * var(--tw-matrix-rotate-cos, ${defaults.matrixRotateCos}))`,
                '--tw-matrix-b': `calc(var(--tw-matrix-scale-x) * var(--tw-matrix-rotate-sin, ${defaults.matrixRotateSin}))`,
                '--tw-matrix-c': `calc(-1 * var(--tw-matrix-scale-y) * var(--tw-matrix-rotate-sin, ${defaults.matrixRotateSin}))`,
                '--tw-matrix-d': `calc(var(--tw-matrix-scale-y) * var(--tw-matrix-rotate-cos, ${defaults.matrixRotateCos}))`,
                'transform': defaultMatrixTransform,
            }),
        },
        { values: theme('scale'), supportsNegativeValues: true },
    );

    function cos(angle_DEG: string, clampTo?: number) {
        const parsedAngle = angle_DEG.split('deg')[0];
        if (parsedAngle) {
            const angle_RAD = parseFloat(parsedAngle) * (Math.PI / 180);
            return clampTo ? Math.cos(angle_RAD).toFixed(clampTo).toString() : Math.cos(angle_RAD).toString();
        } else return '1';
    }

    function sin(angle_DEG: string, clampTo?: number) {
        const parsedAngle = angle_DEG.split('deg')[0];
        if (parsedAngle) {
            const angle_RAD = parseFloat(parsedAngle) * (Math.PI / 180);
            return clampTo ? Math.sin(angle_RAD).toFixed(clampTo).toString() : Math.sin(angle_RAD).toString();
        } else return '0';
    }
});

// export const tailwindConvertToMatrixTransform = plugin(({ addUtilities }) => {
//     addUtilities({
//         '.matrix-transform': {
//             '--tw-translate-x': '0px',
//             '--tw-translate-y': '0px',
//             '--tw-rotate': '0deg',
//             '--tw-scale-x': '1',
//             '--tw-scale-y': '1',

//             '--tw-rotate-cos': 'cos(var(--tw-rotate))',
//             '--tw-rotate-sin': 'sin(var(--tw-rotate))',

//             'transform': `matrix(
//                 calc(var(--tw-rotate-cos) * var(--tw-scale-x)),
//                 calc(var(--tw-rotate-sin) * var(--tw-scale-x)),
//                 calc(var(--tw-rotate-sin) * (var(--tw-scale-y) * -1)),
//                 calc(var(--tw-rotate-cos) * var(--tw-scale-y)),
//                 var(--tw-translate-x),
//                 var(--tw-translate-y)
//             )`,
//         },
//     });
// });

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
