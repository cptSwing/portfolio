import { FC } from 'react';

const hexHeight = 0.866;
const hexHalfHeight = hexHeight / 2;

const HexagonMask: FC<{ classNames?: string }> = ({ classNames }) => {
    const hexColumns = 5;
    const hexPaddingFactor = 1.5;
    const hexWithPadding = hexColumns * hexPaddingFactor - hexPaddingFactor / 3;
    const strokeWidth = 0.05;

    return (
        <svg className={classNames} viewBox={`0 0 ${hexWithPadding} ${hexWithPadding * hexHeight}`}>
            <style>
                {`
                    .regular {
                        fill: white;
                        fill-opacity: 0.75;
                        transition-property: fill;
                        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                        transition-duration: 500ms;
                        cursor: pointer;
                    }

                    .regular:hover {
                        fill: rgb(30,30,30);
                    }

                    .test-secondary {
                        fill: gray;
                        fill-opacity: 0.75;
                        transition-property: fill;
                        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                        transition-duration: 500ms;
                        cursor: pointer;
                    }

                    .test-secondary:hover {
                        fill: white;
                        stroke: black;
                        stroke-width: 0;
                    }

                    .border {
                        fill: rgb(50,50,50);
                        stroke: black;
                        stroke-width: 0.02;
                    }

                    .large {
                        fill: rgb(190,190,190);
                        stroke: black;
                        stroke-width: 0.02;
                    }

                    .test-poly {
                        --test-poly-fill: white;
                    }

                    .test-poly:hover {
                        --test-poly-fill: gray;
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

                <mask id='cut-hex-mask' maskContentUnits='objectBoundingBox'>
                    {/* white bg  */}
                    {/* <rect width='100%' height='100%' fill='black' /> */}

                    {/* Tiling the hexes, each with width=1, height=0.866  */}
                    {/* X value increases by 0.75 (or 3/4ths), Y by 0.433 (or 1/2)  */}

                    {/* Row 1  */}
                    {/* <use className='border' href='#flat-top-hex-half' x='2.75' y='0' width='14.286%' height='12.372%' /> */}
                    {/* <use className='border' href='#flat-top-hex-half' x='4.25' y='0' width='14.286%' height='12.372%' /> */}

                    {/* Row 2  */}
                    {/* <use className='regular' href='#flat-top-hex' x='2' y='4.33%' width='14.286%' height='12.372%' /> */}
                    {/* <use className='regular' href='#flat-top-hex' x='35' y='4.33%' width='14.286%' height='12.372%' /> */}
                    {/* <use className='regular' href='#flat-top-hex' x='50' y='4.33%' width='14.286%' height='12.372%' /> */}

                    {/* Row 3 */}
                    {/* <use className='border' href='#flat-top-hex-half' x='1.25' y='0.866' width='14.286%' height='12.372%' transform='rotate(-60,1.25,0.866)' /> */}
                    {/* <use className='test-secondary' href='#flat-top-hex' x='2.75' y='0.866' width='14.286%' height='12.372%' /> */}
                    {/* <use className='test-secondary' href='#flat-top-hex' x='4.25' y='0.866' width='14.286%' height='12.372%' /> */}
                    {/* <use className='border' href='#flat-top-hex-half' x='5.75' y='0.866' width='14.286%' height='12.372%' transform='rotate(60,5.75,0.866)' /> */}

                    {/* Row 4  */}
                    {/* <use className='regular' href='#flat-top-hex' x='2' y='1.299' width='14.286%' height='12.372%' /> */}
                    {/* <use className='regular' href='#flat-top-hex' x='3.5' y='1.299' width='14.286%' height='12.372%' /> */}
                    {/* <use className='regular' href='#flat-top-hex' x='5' y='1.299' width='14.286%' height='12.372%' /> */}

                    {/* Row 5  */}
                    {/* <use className='test-secondary' href='#flat-top-hex' x='1.25' y='1.732' width='14.286%' height='12.372%' /> */}
                    {/* <use className='test-secondary' href='#flat-top-hex' x='2.75' y='1.732' width='14.286%' height='12.372%' /> */}
                    {/* <use className='test-secondary' href='#flat-top-hex' x='4.25' y='1.732' width='14.286%' height='12.372%' /> */}
                    {/* <use className='test-secondary' href='#flat-top-hex' x='5.75' y='1.732' width='14.286%' height='12.372%' /> */}

                    {/* Row 6  */}
                    {/* <use className='border' href='#flat-top-hex-half' x='0.5' y='2.165' width='14.286%' height='12.372%' transform='rotate(-60,0.5,2.165)' /> */}
                    {/* <use className='regular' href='#flat-top-hex' x='2' y='2.165' width='14.286%' height='12.372%' /> */}
                    {/* <use className='regular' href='#flat-top-hex' x='3.5' y='2.165' width='14.286%' height='12.372%' /> */}
                    {/* <use className='regular' href='#flat-top-hex' x='5' y='2.165' width='14.286%' height='12.372%' /> */}
                    {/* <use className='border' href='#flat-top-hex-half' x='6.5' y='2.165' width='14.286%' height='12.372%' transform='rotate(60,6.5,2.165)' /> */}

                    {/* Row 7  */}
                    {/* <use className='test-secondary' href='#flat-top-hex' x='1.25' y='2.598' width='14.286%' height='12.372%' /> */}
                    {/* <use className='test-secondary' href='#flat-top-hex' x='2.75' y='2.598' width='14.286%' height='12.372%' /> */}
                    {/* <use className='test-secondary' href='#flat-top-hex' x='4.25' y='2.598' width='14.286%' height='12.372%' /> */}
                    {/* <use className='test-secondary' href='#flat-top-hex' x='5.75' y='2.598' width='14.286%' height='12.372%' /> */}

                    {/* Row 8  */}
                    {/* <use className='regular' href='#flat-top-hex' x='0.5' y='3.031' width='14.286%' height='12.372%' /> */}
                    {/* <use className='regular' href='#flat-top-hex' x='2' y='3.031' width='14.286%' height='12.372%' /> */}
                    {/* <use className='regular' href='#flat-top-hex' x='3.5' y='3.031' width='14.286%' height='12.372%' /> */}
                    {/* <use className='regular' href='#flat-top-hex' x='5' y='3.031' width='14.286%' height='12.372%' /> */}
                    {/* <use className='regular' href='#flat-top-hex' x='6.5' y='3.031' width='14.286%' height='12.372%' /> */}

                    {/* Row 9  */}
                    {/* <use className='test-secondary' href='#flat-top-hex' x='1.25' y='3.464' width='14.286%' height='12.372%' /> */}
                    {/* <use className='test-secondary' href='#flat-top-hex' x='2.75' y='3.464' width='14.286%' height='12.372%' /> */}
                    {/* <use className='test-secondary' href='#flat-top-hex' x='4.25' y='3.464' width='14.286%' height='12.372%' /> */}
                    {/* <use className='test-secondary' href='#flat-top-hex' x='5.75' y='3.464' width='14.286%' height='12.372%' /> */}

                    {/* Row 10  */}
                    {/* <use className='border' href='#flat-top-hex-half' x='0.5' y='3.897' width='14.286%' height='12.372%' transform='rotate(-120,0.5,3.897)' /> */}
                    {/* <use className='regular' href='#flat-top-hex' x='2' y='3.897' width='14.286%' height='12.372%' /> */}
                    {/* <use className='regular' href='#flat-top-hex' x='3.5' y='3.897' width='14.286%' height='12.372%' /> */}
                    {/* <use className='regular' href='#flat-top-hex' x='5' y='3.897' width='14.286%' height='12.372%' /> */}
                    {/* <use className='border' href='#flat-top-hex-half' x='6.5' y='3.897' width='14.286%' height='12.372%' transform='rotate(120,6.5,3.897)' /> */}

                    {/* Row 11  */}
                    {/* <use className='test-secondary' href='#flat-top-hex' x='1.25' y='4.33' width='14.286%' height='12.372%' /> */}
                    {/* <use className='test-secondary' href='#flat-top-hex' x='2.75' y='4.33' width='14.286%' height='12.372%' /> */}
                    {/* <use className='test-secondary' href='#flat-top-hex' x='4.25' y='4.33' width='14.286%' height='12.372%' /> */}
                    {/* <use className='test-secondary' href='#flat-top-hex' x='5.75' y='4.33' width='14.286%' height='12.372%' /> */}

                    {/* Row 12  */}
                    {/* <use className='regular' href='#flat-top-hex' x='2' y='4.763' width='14.286%' height='12.372%' /> */}
                    {/* <use className='regular' href='#flat-top-hex' x='3.5' y='4.763' width='14.286%' height='12.372%' /> */}
                    {/* <use className='regular' href='#flat-top-hex' x='5' y='4.763' width='14.286%' height='12.372%' /> */}

                    {/* Row 13  */}
                    {/* <use className='border' href='#flat-top-hex-half' x='1.25' y='5.196' width='14.286%' height='12.372%' transform='rotate(-120,1.25,5.196)' /> */}
                    {/* <use className='test-secondary' href='#flat-top-hex' x='2.75' y='5.196' width='14.286%' height='12.372%' /> */}
                    {/* <use className='test-secondary' href='#flat-top-hex' x='4.25' y='5.196' width='14.286%' height='12.372%' /> */}
                    {/* <use className='border' href='#flat-top-hex-half' x='5.75' y='5.196' width='14.286%' height='12.372%' transform='rotate(120,5.75,5.196)' /> */}

                    {/* Row 14  */}
                    {/* <use className='regular' href='#flat-top-hex' x='2' y='5.629' width='14.286%' height='12.372%' /> */}
                    {/* <use className='regular' href='#flat-top-hex' x='3.5' y='5.629' width='14.286%' height='12.372%' /> */}
                    {/* <use className='regular' href='#flat-top-hex' x='5' y='5.629' width='14.286%' height='12.372%' /> */}

                    {/* Row 15  */}
                    {/* <use className='border' href='#flat-top-hex-half' x='2.75' y='6.062' width='14.286%' height='12.372%' transform='rotate(180,2.75,6.062)' /> */}
                    {/* <use className='border' href='#flat-top-hex-half' x='4.25' y='6.062' width='14.286%' height='12.372%' transform='rotate(180,4.25,6.062)' /> */}

                    {/* test  */}
                    <use className='regular' href='#flat-top-hex' transform='scale(0.12372)' />
                    <use className='test-secondary' href='#flat-top-hex' />
                </mask>
            </defs>

            {/* 0 */}
            <use className='regular' href='#flat-top-hex-half' transform={getTranslatedShape(1, 0, strokeWidth)} />
            <use className='regular' href='#flat-top-hex-half' transform={getTranslatedShape(2, 0, strokeWidth)} />

            {/* 1 */}
            <use className='test-secondary' href='#flat-top-hex' transform={getTranslatedShape(1, 1, strokeWidth)} />
            <use className='test-secondary' href='#flat-top-hex' transform={getTranslatedShape(2, 1, strokeWidth)} />
            <use className='test-secondary' href='#flat-top-hex' transform={getTranslatedShape(3, 1, strokeWidth)} />

            {/* 2 */}
            <use className='regular' href='#flat-top-hex-half' transform={getTranslatedShape(0, 2, strokeWidth) + ' rotate(-60,0.5,0.433)'} />
            <use className='regular' href='#flat-top-hex' transform={getTranslatedShape(1, 2, strokeWidth)} />
            <use className='regular' href='#flat-top-hex' transform={getTranslatedShape(2, 2, strokeWidth)} />
            <use className='regular' href='#flat-top-hex-half' transform={getTranslatedShape(3, 2, strokeWidth) + ' rotate(60,0.5,0.433)'} />

            {/* 3 */}
            <use className='test-secondary' href='#flat-top-hex' transform={getTranslatedShape(1, 3, strokeWidth)} />
            <use className='test-secondary' href='#flat-top-hex' transform={getTranslatedShape(2, 3, strokeWidth)} />
            <use className='test-secondary' href='#flat-top-hex' transform={getTranslatedShape(3, 3, strokeWidth)} />

            {/* 4 */}
            <use className='regular' href='#flat-top-hex' transform={getTranslatedShape(0, 4, strokeWidth)} />
            <use className='regular' href='#flat-top-hex' transform={getTranslatedShape(1, 4, strokeWidth)} />
            <use className='regular' href='#flat-top-hex' transform={getTranslatedShape(2, 4, strokeWidth)} />
            <use className='regular' href='#flat-top-hex' transform={getTranslatedShape(3, 4, strokeWidth)} />

            {/* 5 */}
            <use className='test-secondary' href='#flat-top-hex-half' transform={getTranslatedShape(0, 5, strokeWidth) + ' rotate(-60,0.5,0.433)'} />
            <use className='test-secondary' href='#flat-top-hex' transform={getTranslatedShape(1, 5, strokeWidth)} />
            <use className='test-secondary' href='#flat-top-hex' transform={getTranslatedShape(2, 5, strokeWidth)} />
            <use className='test-secondary' href='#flat-top-hex' transform={getTranslatedShape(3, 5, strokeWidth)} />
            <use className='test-secondary' href='#flat-top-hex-half' transform={getTranslatedShape(4, 5, strokeWidth) + ' rotate(60,0.5,0.433)'} />

            {/* 6 */}
            <use className='regular' href='#flat-top-hex' transform={getTranslatedShape(0, 6, strokeWidth)} />
            <use className='regular' href='#flat-top-hex' transform={getTranslatedShape(1, 6, strokeWidth)} />
            <use className='regular' href='#flat-top-hex' transform={getTranslatedShape(2, 6, strokeWidth)} />
            <use className='regular' href='#flat-top-hex' transform={getTranslatedShape(3, 6, strokeWidth)} />

            {/* 7 */}
            <use className='test-secondary' href='#flat-top-hex' transform={getTranslatedShape(0, 7, strokeWidth)} />
            <use className='test-secondary' href='#flat-top-hex' transform={getTranslatedShape(1, 7, strokeWidth)} />
            <use className='test-secondary' href='#flat-top-hex' transform={getTranslatedShape(2, 7, strokeWidth)} />
            <use className='test-secondary' href='#flat-top-hex' transform={getTranslatedShape(3, 7, strokeWidth)} />
            <use className='test-secondary' href='#flat-top-hex' transform={getTranslatedShape(4, 7, strokeWidth)} />

            {/* 8 */}
            <use className='regular' href='#flat-top-hex' transform={getTranslatedShape(0, 8, strokeWidth)} />
            <use className='regular' href='#flat-top-hex' transform={getTranslatedShape(1, 8, strokeWidth)} />
            <use className='regular' href='#flat-top-hex' transform={getTranslatedShape(2, 8, strokeWidth)} />
            <use className='regular' href='#flat-top-hex' transform={getTranslatedShape(3, 8, strokeWidth)} />

            {/* 9 */}
            <use className='test-secondary' href='#flat-top-hex-half' transform={getTranslatedShape(0, 9, strokeWidth) + ' rotate(-120,0.5,0.433)'} />
            <use className='test-secondary' href='#flat-top-hex' transform={getTranslatedShape(1, 9, strokeWidth)} />
            <use className='test-secondary' href='#flat-top-hex' transform={getTranslatedShape(2, 9, strokeWidth)} />
            <use className='test-secondary' href='#flat-top-hex' transform={getTranslatedShape(3, 9, strokeWidth)} />
            <use className='test-secondary' href='#flat-top-hex-half' transform={getTranslatedShape(4, 9, strokeWidth) + ' rotate(120,0.5,0.433)'} />

            {/* 10 */}
            <use className='regular' href='#flat-top-hex' transform={getTranslatedShape(0, 10, strokeWidth)} />
            <use className='regular' href='#flat-top-hex' transform={getTranslatedShape(1, 10, strokeWidth)} />
            <use className='regular' href='#flat-top-hex' transform={getTranslatedShape(2, 10, strokeWidth)} />
            <use className='regular' href='#flat-top-hex' transform={getTranslatedShape(3, 10, strokeWidth)} />

            {/* 11 */}
            <use className='test-secondary' href='#flat-top-hex' transform={getTranslatedShape(1, 11, strokeWidth)} />
            <use className='test-secondary' href='#flat-top-hex' transform={getTranslatedShape(2, 11, strokeWidth)} />
            <use className='test-secondary' href='#flat-top-hex' transform={getTranslatedShape(3, 11, strokeWidth)} />

            {/* 12 */}
            <use className='regular' href='#flat-top-hex-half' transform={getTranslatedShape(0, 12, strokeWidth) + ' rotate(-120,0.5,0.433)'} />
            <use className='regular' href='#flat-top-hex' transform={getTranslatedShape(1, 12, strokeWidth)} />
            <use className='regular' href='#flat-top-hex' transform={getTranslatedShape(2, 12, strokeWidth)} />
            <use className='regular' href='#flat-top-hex-half' transform={getTranslatedShape(3, 12, strokeWidth) + ' rotate(120,0.5,0.433)'} />

            {/* 13 */}
            <use className='test-secondary' href='#flat-top-hex' transform={getTranslatedShape(1, 13, strokeWidth)} />
            <use className='test-secondary' href='#flat-top-hex' transform={getTranslatedShape(2, 13, strokeWidth)} />
            <use className='test-secondary' href='#flat-top-hex' transform={getTranslatedShape(3, 13, strokeWidth)} />

            {/* 14 */}
            <use className='regular' href='#flat-top-hex' transform={getTranslatedShape(1, 14, strokeWidth)} />
            <use className='regular' href='#flat-top-hex' transform={getTranslatedShape(2, 14, strokeWidth)} />

            {/* <use className='stroked' href='#flat-top-hex' transform={`scale(${hexWithPadding})`} fillOpacity={0} stroke='black' strokeWidth='0.02' /> */}
        </svg>
    );
};

export default HexagonMask;

const getTranslatedShape = (column: number, row: number, stroke: number) => {
    const xOffset = row % 2 === 0 ? 0.75 : 0;
    const yOffset = hexHalfHeight;
    let strokeOffset = 0;

    if (typeof stroke === 'number') {
        strokeOffset = stroke / 2;
    }

    return `translate(${1.5 * column + xOffset + strokeOffset}, ${(row - 1) * yOffset + strokeOffset}) ${typeof stroke === 'number' ? `scale(${1 - stroke})` : ''}`;
};
