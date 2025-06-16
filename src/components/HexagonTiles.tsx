import { CSSProperties, FC } from 'react';

const hexHeight = 0.866;
const hexHalfHeight = hexHeight / 2;

const HexagonTiles: FC<{ extraClassNames?: string }> = ({ extraClassNames }) => {
    const hexColumns = 5;
    const hexPaddingFactor = 1.5;
    const hexWithPadding = hexColumns * hexPaddingFactor - hexPaddingFactor / 3;
    const strokeWidth = 0.05;

    return (
        <svg
            className={
                '[--hex-left-translate-x:0] [--hex-right-translate-x:0] has-[.center:hover]:![--hex-center-scale:1.05] has-[.left:hover]:[--hex-left-translate-x:-2%] has-[.right:hover]:[--hex-right-translate-x:2%] hover:[--hex-left-translate-x:-1%] hover:[--hex-right-translate-x:1%] [&_.center]:has-[.center:hover]:!origin-[50%_50%] ' +
                extraClassNames
            }
            viewBox={`0 0 ${hexWithPadding} ${hexWithPadding * hexHeight}`}
            style={
                {
                    '--hex-center-scale': 1 - strokeWidth,
                } as CSSProperties
            }
        >
            <defs>
                <polygon
                    id='flat-top-hex'
                    points='
                                0,0.433
                                0.25,0
                                0.75,0
                                1,0.433
                                0.75,0.866
                                0.25,0.866
                            '
                />

                <polygon
                    id='flat-top-hex-half'
                    points='
                                0,0.433
                                1,0.433
                                0.75,0.866
                                0.25,0.866
                            '
                />
            </defs>
            {/* 0 */}
            <use
                href='#flat-top-hex'
                className='-z-10 translate-x-[--hex-left-translate-x] fill-black/10 transition-[transform,fill] hover:fill-black/20'
                {...getOffsetsAndScale(1, 0, strokeWidth)}
            />
            <use
                href='#flat-top-hex-half'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(1, 0, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='-z-10 translate-x-[--hex-right-translate-x] fill-black/10 transition-[transform,fill] hover:fill-black/20'
                {...getOffsetsAndScale(2, 0, strokeWidth)}
            />
            <use
                href='#flat-top-hex-half'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(2, 0, strokeWidth)}
            />

            {/* 1 */}
            <use
                href='#flat-top-hex'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(1, 1, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(2, 1, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(3, 1, strokeWidth)}
            />

            {/* 2 */}
            <use
                href='#flat-top-hex'
                className='-z-10 translate-x-[--hex-left-translate-x] fill-black/10 transition-[transform,fill] hover:fill-black/20'
                {...getOffsetsAndScale(0, 2, strokeWidth)}
            />
            <use
                href='#flat-top-hex-half'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(0, 2, strokeWidth, { '--tw-rotate': '-60deg' } as CSSProperties)}
            />
            <use
                href='#flat-top-hex'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(1, 2, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(2, 2, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='-z-10 translate-x-[--hex-right-translate-x] fill-black/10 transition-[transform,fill] hover:fill-black/20'
                {...getOffsetsAndScale(3, 2, strokeWidth)}
            />
            <use
                href='#flat-top-hex-half'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(3, 2, strokeWidth, { '--tw-rotate': '60deg' } as CSSProperties)}
            />

            {/* 3 */}
            <use
                href='#flat-top-hex'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(1, 3, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(2, 3, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(3, 3, strokeWidth)}
            />

            {/* 4 */}
            <use
                href='#flat-top-hex'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(0, 4, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(1, 4, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(2, 4, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(3, 4, strokeWidth)}
            />

            {/* 5 */}
            <use
                href='#flat-top-hex'
                className='-z-10 translate-x-[--hex-left-translate-x] fill-black/10 transition-[transform,fill] hover:fill-black/20'
                {...getOffsetsAndScale(0, 5, strokeWidth)}
            />
            <use
                href='#flat-top-hex-half'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(0, 5, strokeWidth, { '--tw-rotate': '-60deg' } as CSSProperties)}
            />
            <use
                href='#flat-top-hex'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(1, 5, strokeWidth)}
            />

            <use
                href='#flat-top-hex'
                className='peer/code center pointer-events-auto z-0 translate-x-0 !scale-[--hex-center-scale] fill-white/50 transition-[transform,fill] hover-active:z-10 hover-active:!origin-[10%_30%] hover-active:!scale-125 hover-active:fill-white'
                {...getOffsetsAndScale(2, 5, strokeWidth)}
            />
            <text
                className='pointer-events-none translate-x-0 select-none fill-red-500 text-center text-[3%] peer-hover-active/code:!scale-110'
                {...getOffsetsAndScale(2, 5, strokeWidth)}
                x='3'
                y='38%'
                textLength='1'
                lengthAdjust='spacingAndGlyphs'
            >
                Code
            </text>

            <use
                href='#flat-top-hex'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(3, 5, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='-z-10 translate-x-[--hex-right-translate-x] fill-black/10 transition-[transform,fill] hover:fill-black/20'
                {...getOffsetsAndScale(4, 5, strokeWidth)}
            />
            <use
                href='#flat-top-hex-half'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(4, 5, strokeWidth, { '--tw-rotate': '60deg' } as CSSProperties)}
            />

            {/* 6 */}
            <use
                href='#flat-top-hex'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(0, 6, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='center pointer-events-auto z-0 !scale-[--hex-center-scale] fill-white/50 transition-[transform,fill] hover-active:z-10 hover-active:fill-white'
                {...getOffsetsAndScale(1, 6, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='center pointer-events-auto z-0 !scale-[--hex-center-scale] fill-white/50 transition-[transform,fill] hover-active:z-10 hover-active:fill-white'
                {...getOffsetsAndScale(2, 6, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(3, 6, strokeWidth)}
            />

            {/* 7 , Middle */}
            <use
                href='#flat-top-hex'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(0, 7, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(1, 7, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='peer/3d center pointer-events-auto z-0 translate-x-0 !scale-[--hex-center-scale] fill-white/50 transition-[transform,fill] hover-active:z-10 hover-active:!scale-125 hover-active:fill-white'
                {...getOffsetsAndScale(2, 7, strokeWidth)}
            />
            <text
                className='pointer-events-none translate-x-0 select-none fill-red-500 text-center text-[3%] peer-hover-active/3d:!scale-110'
                {...getOffsetsAndScale(2, 5, strokeWidth)}
                x='3'
                y='54%'
                textLength='1'
                lengthAdjust='spacingAndGlyphs'
            >
                3D
            </text>

            <use
                href='#flat-top-hex'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(3, 7, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(4, 7, strokeWidth)}
            />

            {/* 8 */}
            <use
                href='#flat-top-hex'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(0, 8, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='center pointer-events-auto z-0 translate-x-0 !scale-[--hex-center-scale] fill-white/50 transition-[transform,fill] hover-active:z-10 hover-active:fill-white'
                {...getOffsetsAndScale(1, 8, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='center pointer-events-auto z-0 translate-x-0 !scale-[--hex-center-scale] fill-white/50 transition-[transform,fill] hover-active:z-10 hover-active:fill-white'
                {...getOffsetsAndScale(2, 8, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(3, 8, strokeWidth)}
            />

            {/* 9 */}
            <use
                href='#flat-top-hex'
                className='-z-10 translate-x-[--hex-left-translate-x] fill-black/10 transition-[transform,fill] hover:fill-black/20'
                {...getOffsetsAndScale(0, 9, strokeWidth)}
            />
            <use
                href='#flat-top-hex-half'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(0, 9, strokeWidth, { '--tw-rotate': '-120deg' } as CSSProperties)}
            />
            <use
                href='#flat-top-hex'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(1, 9, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='peer/log center pointer-events-auto z-0 translate-x-0 !scale-[--hex-center-scale] fill-white/50 transition-[transform,fill] hover-active:z-10 hover-active:!scale-125 hover-active:fill-white'
                {...getOffsetsAndScale(2, 9, strokeWidth)}
            />
            <text
                className='pointer-events-none translate-x-0 select-none fill-red-500 text-center text-[3%] peer-hover-active/log:!scale-125'
                {...getOffsetsAndScale(2, 5, strokeWidth)}
                x='3'
                y='68%'
                textLength='1'
                lengthAdjust='spacingAndGlyphs'
            >
                Log
            </text>

            <use
                href='#flat-top-hex'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(3, 9, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='-z-10 translate-x-[--hex-right-translate-x] fill-black/10 transition-[transform,fill] hover:fill-black/20'
                {...getOffsetsAndScale(4, 9, strokeWidth)}
            />
            <use
                href='#flat-top-hex-half'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(4, 9, strokeWidth, { '--tw-rotate': '120deg' } as CSSProperties)}
            />

            {/* 10 */}
            <use
                href='#flat-top-hex'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(0, 10, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(1, 10, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(2, 10, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(3, 10, strokeWidth)}
            />

            {/* 11 */}
            <use
                href='#flat-top-hex'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(1, 11, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(2, 11, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(3, 11, strokeWidth)}
            />

            {/* 12 */}
            <use
                href='#flat-top-hex'
                className='-z-10 translate-x-[--hex-left-translate-x] fill-black/10 transition-[transform,fill] hover:fill-black/20'
                {...getOffsetsAndScale(0, 12, strokeWidth)}
            />
            <use
                href='#flat-top-hex-half'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(0, 12, strokeWidth, { '--tw-rotate': '-120deg' } as CSSProperties)}
            />
            <use
                href='#flat-top-hex'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(1, 12, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(2, 12, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='-z-10 translate-x-[--hex-right-translate-x] fill-black/10 transition-[transform,fill] hover:fill-black/20'
                {...getOffsetsAndScale(3, 12, strokeWidth)}
            />
            <use
                href='#flat-top-hex-half'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(3, 12, strokeWidth, { '--tw-rotate': '120deg' } as CSSProperties)}
            />

            {/* 13 */}
            <use
                href='#flat-top-hex'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(1, 13, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(2, 13, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(3, 13, strokeWidth)}
            />

            {/* 14 */}
            <use
                href='#flat-top-hex'
                className='-z-10 translate-x-[--hex-left-translate-x] fill-black/10 transition-[transform,fill] hover:fill-black/20'
                {...getOffsetsAndScale(1, 14, strokeWidth)}
            />
            <use
                href='#flat-top-hex-half'
                className='left pointer-events-auto z-0 translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary'
                {...getOffsetsAndScale(1, 14, strokeWidth, { '--tw-rotate': '180deg' } as CSSProperties)}
            />
            <use
                href='#flat-top-hex'
                className='-z-10 translate-x-[--hex-right-translate-x] fill-black/10 transition-[transform,fill] hover:fill-black/20'
                {...getOffsetsAndScale(2, 14, strokeWidth)}
            />
            <use
                href='#flat-top-hex-half'
                className='right pointer-events-auto z-0 translate-x-[--hex-right-translate-x] fill-theme-primary-darker/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary-darker'
                {...getOffsetsAndScale(2, 14, strokeWidth, { '--tw-rotate': '180deg' } as CSSProperties)}
            />
        </svg>
    );
};

export default HexagonTiles;

const getOffsetsAndScale = (column: number, row: number, strokeWidth: number, extraStyles: CSSProperties = {}) => {
    const xOffset = row % 2 === 0 ? 0.75 : 0;
    const xValue = 1.5 * column + xOffset;

    const yOffset = hexHalfHeight;
    const yValue = (row - 1) * yOffset;

    return {
        x: xValue,
        y: yValue,
        style: {
            'transformOrigin': `${((xValue + 0.5) / 7) * 100}% ${((yValue + 0.433) / 6.062) * 100}%`,
            '--tw-scale-x': `${1 - strokeWidth}`,
            '--tw-scale-y': `${1 - strokeWidth}`,
            ...extraStyles,
        },
    };
};
