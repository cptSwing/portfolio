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
                '[--hex-left-translate-x:0] [--hex-right-translate-x:0] has-[.left:hover]:[--hex-left-translate-x:-2%] has-[.right:hover]:[--hex-right-translate-x:2%] hover:[--hex-left-translate-x:-1%] hover:[--hex-right-translate-x:1%] ' +
                extraClassNames
            }
            viewBox={`0 0 ${hexWithPadding} ${hexWithPadding * hexHeight}`}
            style={{} as CSSProperties}
        >
            <style>
                {`
                    

                    .center {
                        fill: rgb(190,190,190);
                        pointer-events: auto;

                    }
                    
                    .center:hover {
                        fill: rgb(100,100,100);
                    }
                    `}
            </style>
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
                className='pointer-events-auto z-0 translate-x-0 fill-white/50 transition-[transform,fill] hover-active:z-10 hover-active:!scale-110 hover-active:fill-white'
                {...getOffsetsAndScale(2, 5, strokeWidth)}
            />
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
                className='pointer-events-auto z-0 translate-x-0 fill-white/50 transition-[transform,fill] hover-active:z-10 hover-active:!scale-110 hover-active:fill-white'
                {...getOffsetsAndScale(1, 6, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='pointer-events-auto z-0 translate-x-0 fill-white/50 transition-[transform,fill] hover-active:z-10 hover-active:!scale-110 hover-active:fill-white'
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
                className='pointer-events-auto z-0 translate-x-0 fill-white/50 transition-[transform,fill] hover-active:z-10 hover-active:!scale-110 hover-active:fill-white'
                {...getOffsetsAndScale(2, 7, strokeWidth)}
            />
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
                className='pointer-events-auto z-0 translate-x-0 fill-white/50 transition-[transform,fill] hover-active:z-10 hover-active:!scale-110 hover-active:fill-white'
                {...getOffsetsAndScale(1, 8, strokeWidth)}
            />
            <use
                href='#flat-top-hex'
                className='pointer-events-auto z-0 translate-x-0 fill-white/50 transition-[transform,fill] hover-active:z-10 hover-active:!scale-110 hover-active:fill-white'
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
                className='pointer-events-auto z-0 translate-x-0 fill-white/50 transition-[transform,fill] hover-active:z-10 hover-active:!scale-110 hover-active:fill-white'
                {...getOffsetsAndScale(2, 9, strokeWidth)}
            />
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
            ...extraStyles,
            'transformOrigin': `${((xValue + 0.5) / 7) * 100}% ${((yValue + 0.433) / 6.062) * 100}%`,
            '--tw-scale-x': `${1 - strokeWidth}`,
            '--tw-scale-y': `${1 - strokeWidth}`,
        },
    };
};
