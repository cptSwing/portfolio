import { CSSProperties, FC } from 'react';
import { Link } from 'react-router-dom';
import { getNumberedArrayOfLength } from '../lib/getNumberedArrayOfLength';
import classNames from '../lib/classNames';

const hexHeightAspectRatio = 0.866;
const hexHalfHeight = hexHeightAspectRatio / 2;
const hexPaddingFactor = 1.5;
const hexColumns = 3;
const totalWidthAtCenter = hexColumns * hexPaddingFactor - 0.5;
const totalHeight = totalWidthAtCenter * hexHeightAspectRatio;
const strokeWidth = 0.025;

const rowsData: Record<3 | 5 | 7, RowData> = {
    3: {
        cells: [
            { count: 1, leftIndices: [1], borderRotationDeg: 0, xOffset: 1 },
            { count: 2, leftIndices: [1], xOffset: 1 },
            { count: 3, leftIndices: [0], borderRotationDeg: 60 },
            { count: 2, leftIndices: [1], xOffset: 1 },

            { count: 3, leftIndices: [0], centerIndices: [1] },

            { count: 2, leftIndices: [1], xOffset: 1 },
            { count: 3, leftIndices: [0], borderRotationDeg: 120 },
            { count: 2, leftIndices: [1], xOffset: 1 },
            { count: 1, leftIndices: [1], borderRotationDeg: 180, xOffset: 1 },
        ],
        links: [
            { name: 'code', url: '/0', rowCol: [3, 1] },
            { name: '3d', url: '/1', rowCol: [3, 2] },
            { name: 'log', url: '/3', rowCol: [6, 1] },
        ],
    },

    5: {
        cells: [
            { count: 2, leftIndices: [1, 2], borderRotationDeg: 0, xOffset: 1 },
            { count: 3, leftIndices: [1, 2, 3], xOffset: 1 },
            { count: 4, leftIndices: [0, 1, 2], borderRotationDeg: 60 },
            { count: 3, leftIndices: [1, 2], xOffset: 1 },
            { count: 4, leftIndices: [0, 1, 2] },
            { count: 5, leftIndices: [0, 1], borderRotationDeg: 60, centerIndices: [2] },
            { count: 4, leftIndices: [0], centerIndices: [1, 2] },

            { count: 5, leftIndices: [0, 1], centerIndices: [2] },

            { count: 4, leftIndices: [0], centerIndices: [1, 2] },
            { count: 5, leftIndices: [0, 1], borderRotationDeg: 120, centerIndices: [2] },
            { count: 4, leftIndices: [0, 1] },
            { count: 3, leftIndices: [1], xOffset: 1 },
            { count: 4, leftIndices: [0], borderRotationDeg: 120 },
            { count: 3, leftIndices: [1], xOffset: 1 },
            { count: 2, leftIndices: [], borderRotationDeg: 180, xOffset: 1 },
        ],
        links: [
            { name: 'code', url: '/0', rowCol: [6, 1] },
            { name: '3d', url: '/1', rowCol: [6, 2] },
            { name: 'log', url: '/3', rowCol: [9, 2] },
        ],
    },

    7: {
        cells: [
            { count: 3, leftIndices: [2], borderRotationDeg: 0, xOffset: 2 },
            { count: 4, leftIndices: [2, 3], xOffset: 2 },
            { count: 5, leftIndices: [1, 2], borderRotationDeg: 60, xOffset: 1 },
            { count: 4, leftIndices: [2, 3], xOffset: 2 },
            { count: 5, leftIndices: [1, 2], xOffset: 1 },
            { count: 6, leftIndices: [1, 2, 3], borderRotationDeg: 60, xOffset: 1 },
            { count: 5, leftIndices: [1, 2], xOffset: 1, centerIndices: [3] },
            { count: 6, leftIndices: [1, 2], xOffset: 1, centerIndices: [3, 4] },
            { count: 7, leftIndices: [0, 1], borderRotationDeg: 60, centerIndices: [2, 3, 4] },
            { count: 6, leftIndices: [1, 2], xOffset: 1, centerIndices: [3, 4] },

            { count: 7, leftIndices: [0, 1], centerIndices: [2, 3, 4] },

            { count: 6, leftIndices: [1, 2], xOffset: 1, centerIndices: [3, 4] },
            { count: 7, leftIndices: [0, 1], borderRotationDeg: 120, centerIndices: [2, 3, 4] },
            { count: 6, leftIndices: [1, 2], xOffset: 1, centerIndices: [3, 4] },
            { count: 5, leftIndices: [1, 2], xOffset: 1, centerIndices: [3] },
            { count: 6, leftIndices: [1, 2, 3], borderRotationDeg: 120, xOffset: 1 },
            { count: 5, leftIndices: [1, 2], xOffset: 1 },
            { count: 4, leftIndices: [2, 3], xOffset: 2 },
            { count: 5, leftIndices: [1, 2], borderRotationDeg: 120, xOffset: 1 },
            { count: 4, leftIndices: [2, 3], xOffset: 2 },
            { count: 3, leftIndices: [2], borderRotationDeg: 180, xOffset: 2 },
        ],
        links: [
            { name: 'code', url: '/0', rowCol: [9, 3] },
            { name: '3d', url: '/1', rowCol: [9, 4] },
            { name: 'log', url: '/3', rowCol: [12, 3] },
        ],
    },
};

const HexagonTiles: FC<{ extraClassNames?: string }> = ({ extraClassNames }) => {
    return (
        <svg
            className={classNames(
                '[--hex-gradient-color-1:theme(colors.theme.primary)] [--hex-gradient-color-2:theme(colors.theme.secondary)] [--hex-left-translate-x:0] [--hex-right-translate-x:0]',
                'has-[.right:hover]:[--hex-left-translate-x:-1%] has-[.center:hover]:[--hex-left-translate-x:-2%] has-[.left:hover]:[--hex-left-translate-x:-2%] has-[.left:hover]:[--hex-right-translate-x:1%] has-[.center:hover]:[--hex-right-translate-x:2%] has-[.right:hover]:[--hex-right-translate-x:2%]' /* [&_.center]:has-[.center:hover]:!origin-[50%_50%] */,
                extraClassNames,
            )}
            viewBox={`0 0 ${totalWidthAtCenter} ${totalHeight}`}
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

                <linearGradient id='myGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
                    <stop offset='0%' stopColor='var(--hex-gradient-color-1)' />
                    <stop offset='100%' stopColor='var(--hex-gradient-color-2)' />
                </linearGradient>
            </defs>

            {Object.values(rowsData[hexColumns].cells).map((cellData, rowIndex) => getHexagonsPerRow(rowIndex, cellData))}
            {Object.values(rowsData[hexColumns].links).map((linkData) => drawHexagonLinks(linkData))}
        </svg>
    );
};

export default HexagonTiles;

const leftClasses =
    /* tw */ 'left pointer-events-auto translate-x-[--hex-left-translate-x] fill-theme-primary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-primary';
const rightClasses =
    /* tw */ 'right pointer-events-auto translate-x-[--hex-right-translate-x] fill-theme-secondary/75 transition-[transform,fill] hover-active:z-10 hover-active:fill-theme-secondary';
const centerClasses = /* tw */ 'center pointer-events-auto translate-x-0 fill-white/50 transition-[transform,fill] hover-active:fill-white';

const getHexagonsPerRow = (row: number, cellData: CellData) => {
    const { count, leftIndices, borderRotationDeg, centerIndices, xOffset } = cellData;

    return getNumberedArrayOfLength(count, xOffset).map((colCount, idx, arr) => {
        const column = colCount - 1; // getNumberedArrayOfLength() returns numbers starting at 1, so for correct offsets etc we subtract 1 again
        const isFirst = idx === 0;
        const isLast = idx === arr.length - 1;
        const isHalfPolygon = typeof borderRotationDeg === 'number' && (isFirst || isLast);
        const idKey = `hex-row-${row}-column-${column}`;

        return rowsData[hexColumns].links.findIndex(({ rowCol: [linkRow, linkCol] }) => row === linkRow && column === linkCol) >= 0 ? null : (
            <use
                id={idKey}
                key={idKey}
                className={classNames('', leftIndices?.includes(column) ? leftClasses : centerIndices?.includes(column) ? centerClasses : rightClasses)}
                href={isHalfPolygon ? '#flat-top-hex-half' : '#flat-top-hex'}
                {...getOffsetsAndScale(
                    column,
                    row,
                    strokeWidth,
                    isHalfPolygon ? ({ '--tw-rotate': `${isLast ? borderRotationDeg : -borderRotationDeg}deg` } as CSSProperties) : undefined,
                )}
            />
        );
    });
};

const drawHexagonLinks = (linkData: LinkData) => {
    const {
        name,
        url,
        rowCol: [linkRow, linkColumn],
    } = linkData;

    const offsetsAndScale = getOffsetsAndScale(linkColumn, linkRow, strokeWidth);

    return (
        <Link key={`hex-row-${linkRow}-column-${linkColumn}`} to={url} className='group no-underline [--hex-link-scale:1] hover-active:[--hex-link-scale:1.25]'>
            <use
                id={`hex-row-${linkRow}-column-${linkColumn}`}
                href='#flat-top-hex'
                className={centerClasses + ' !fill-[url(#myGradient)] group-hover-active:!scale-[--hex-link-scale]'}
                {...offsetsAndScale}
            />
            <text
                className='pointer-events-none rotate-[-60deg] select-none fill-red-500 text-[2.5%] font-bold tracking-tight group-hover-active:!scale-[--hex-link-scale]'
                x={offsetsAndScale.x + 0.5}
                y={offsetsAndScale.y + hexHalfHeight}
                style={{ transformOrigin: `${offsetsAndScale.x + 0.5}px ${offsetsAndScale.y + hexHalfHeight}px` }}
                textAnchor='middle'
                alignmentBaseline='central'
            >
                {name}
            </text>
        </Link>
    );
};

const getOffsetsAndScale = (column: number, row: number, strokeWidth: number, extraStyles: CSSProperties = {}) => {
    const globalXOffsetAdjust = ((hexColumns * 3 - 1) / 2) % 2 == 0;
    const xOffsetPerRow = row % 2 === 0 ? (globalXOffsetAdjust ? 0 : 0.75) : globalXOffsetAdjust ? -0.75 : 0;
    const xValue = 1.5 * column + xOffsetPerRow;

    const yOffsetPerRow = hexHalfHeight;
    const yValue = (row - 1) * yOffsetPerRow;

    return {
        x: xValue,
        y: yValue,
        style: {
            'transformOrigin': `${((xValue + 0.5) / totalWidthAtCenter) * 100}% ${((yValue + hexHalfHeight) / totalHeight) * 100}%`,
            '--tw-scale-x': `${1 - strokeWidth}`,
            '--tw-scale-y': `${1 - strokeWidth}`,
            ...extraStyles,
        },
    };
};

type CellData = { count: number; leftIndices: number[]; borderRotationDeg?: number; centerIndices?: number[]; xOffset?: number };
type LinkData = { name: 'code' | '3d' | 'log'; url: string; rowCol: [number, number] };
type RowData = { cells: CellData[]; links: [LinkData, LinkData, LinkData] };
