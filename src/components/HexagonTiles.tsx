import { CSSProperties, FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNumberedArrayOfLength } from '../lib/getNumberedArrayOfLength';
import classNames from '../lib/classNames';
import configJSON from '../config/config.json';

const {
    hexMenu: { columns, strokeWidth },
} = configJSON;

const staticValues = {
    heightAspectRatio: {
        flatTop: 0.866,
        pointyTop: 1.1547,
    },
    tilingMultiplierHorizontal: {
        flatTop: 1.5,
        pointyTop: 1,
    },
    tilingMultiplierVertical: {
        flatTop: 1,
        pointyTop: 1.5,
    },
};

const scaleUp = 100;
const hexHeightAspectRatio = staticValues.heightAspectRatio.flatTop;
const hexHalfWidth = 0.5 * scaleUp;
const hexHeight = hexHeightAspectRatio * scaleUp;
const hexHalfHeight = hexHeight / 2;
const hexPaddingFactor = staticValues.tilingMultiplierHorizontal.flatTop;
const totalWidthAtCenter = (columns * hexPaddingFactor - (hexPaddingFactor - 1)) * scaleUp;
const totalHeight = totalWidthAtCenter * hexHeightAspectRatio;

// 'translate-x-0' added to enable use of '--tw-rotate' (etc) from the start
const leftClasses =
    /* tw */ 'left pointer-events-auto translate-x-0 fill-theme-primary-darker transition-[transform,fill] duration-200 delay-[20ms] hover-active:fill-theme-primary [--tw-scale-x:--hex-scale-stroked] [--tw-scale-y:--hex-scale-stroked]';
const rightClasses =
    /* tw */ 'right pointer-events-auto translate-x-0 fill-theme-secondary-darker transition-[transform,fill] duration-200 delay-[20ms] hover-active:fill-theme-secondary [--tw-scale-x:--hex-scale-stroked] [--tw-scale-y:--hex-scale-stroked]';
const centerStub =
    /* tw */ 'center transition-[transform,fill] duration-200 delay-[20ms] translate-x-0 [--tw-scale-x:--hex-scale-stroked] [--tw-scale-y:--hex-scale-stroked]' +
    ' ';

const centerClasses = centerStub + /* tw */ 'pointer-events-auto fill-white/50 hover-active:fill-white';
const linkClasses = centerStub + /* tw */ 'pointer-events-auto fill-[url(#myGradient)] hover-active:fill-theme-primary group-hover-active:scale-110';
const linkTextClasses =
    centerStub + /* tw */ 'text pointer-events-none select-none fill-red-500 text-[40px] font-bold tracking-tight group-hover-active:scale-110';

const HexagonTiles: FC<{ extraClassNames?: string }> = ({ extraClassNames }) => {
    const [hoverState, setHoverState] = useState<'code' | '3d' | 'log' | null>(null);

    return (
        <svg
            className={classNames(
                '[--hex-gradient-color-1:theme(colors.theme.primary)] [--hex-gradient-color-2:theme(colors.theme.secondary)]',
                'transition-transform delay-100 duration-1000',
                '[&_.left]:has-[.class-code:hover,.class-3d:hover,.class-log:hover]:pointer-events-none [&_.left]:has-[.left:hover]:scale-[0.85] [&_.left]:has-[.right:hover]:scale-95',
                '[&_.right]:has-[.class-code:hover,.class-3d:hover,.class-log:hover]:pointer-events-none [&_.right]:has-[.left:hover]:scale-95 [&_.right]:has-[.right:hover]:scale-[0.85]',
                '[&_.center:not(.text)]:has-[.left:hover,.right:hover]:scale-95',

                hoverState === 'code' ? 'rotate-[60deg]' : hoverState === '3d' ? 'rotate-[-60deg]' : hoverState === 'log' ? 'rotate-[180deg]' : '',
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
                    points={`
                                0,${0.433 * scaleUp}
                                ${0.25 * scaleUp},0
                                ${0.75 * scaleUp},0
                                ${1 * scaleUp},${0.433 * scaleUp}
                                ${0.75 * scaleUp},${0.866 * scaleUp}
                                ${0.25 * scaleUp},${0.866 * scaleUp}
                            `}
                />

                <polygon
                    id='flat-top-hex-half'
                    points={`
                                0,${0.433 * scaleUp}
                                ${1 * scaleUp},${0.433 * scaleUp}
                                ${0.75 * scaleUp},${0.866 * scaleUp}
                                ${0.25 * scaleUp},${0.866 * scaleUp}
                            `}
                />

                <linearGradient id='myGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
                    <stop offset='0%' stopColor='var(--hex-gradient-color-1)' />
                    <stop offset='100%' stopColor='var(--hex-gradient-color-2)' />
                </linearGradient>
            </defs>
            {Object.values(rowsData[columns].cells).map((cellData, rowIndex) => getHexagonsPerRow(rowIndex, cellData))}

            {/* Links drawn last (no z-index in svg) */}
            {Object.values(rowsData[columns].links).map((linkData) => getHexagonLinks(linkData, setHoverState))}
        </svg>
    );
};

export default HexagonTiles;

const getHexagonsPerRow = (row: number, cellData: CellData) => {
    const { count, leftIndices, borderRotationDeg, centerIndices, xOffset } = cellData;

    return getNumberedArrayOfLength(count, xOffset).map((colCount, idx, arr) => {
        const column = colCount - 1; // getNumberedArrayOfLength(n, offset) returns array of numbers starting at 1, so for correct offsets etc we subtract 1 again
        const isHalfPolygon =
            typeof borderRotationDeg === 'number' && (idx === 0 || idx === arr.length - 1 || borderRotationDeg === 0 || borderRotationDeg === 180);
        const classes = leftIndices?.includes(column) ? leftClasses : centerIndices?.includes(column) ? centerClasses : rightClasses;
        const isLink = rowsData[columns].links.findIndex(({ rowCol: [linkRow, linkCol] }) => row === linkRow && column === linkCol) >= 0;

        return !isLink ? (
            <use
                id={`hex-row-${row}-column-${column}`}
                key={`hex-row-${row}-column-${column}`}
                className={classes}
                href={isHalfPolygon ? '#flat-top-hex-half' : '#flat-top-hex'}
                {...getOffsetsAndScale(
                    column,
                    row,
                    strokeWidth,
                    isHalfPolygon ? ({ '--tw-rotate': `${idx === 0 ? -borderRotationDeg : borderRotationDeg}deg` } as CSSProperties) : undefined,
                )}
            />
        ) : null;
    });
};

const getHexagonLinks = (linkData: LinkData, setHoverState: React.Dispatch<React.SetStateAction<'code' | '3d' | 'log' | null>>) => {
    const {
        name,
        url,
        rowCol: [linkRow, linkColumn],
        rotationDeg,
    } = linkData;

    const offsetsAndScale = getOffsetsAndScale(linkColumn, linkRow, strokeWidth, { '--tw-rotate': `${rotationDeg}deg` } as CSSProperties);

    return (
        <Link key={`hex-row-${linkRow}-column-${linkColumn}`} to={url} className='group no-underline'>
            <use
                id={`hex-row-${linkRow}-column-${linkColumn}`}
                href='#flat-top-hex'
                className={linkClasses + ` class-${name}`}
                {...offsetsAndScale}
                onMouseEnter={() => setHoverState(name)}
            />
            <text
                x={offsetsAndScale.x + hexHalfWidth}
                y={offsetsAndScale.y + hexHalfHeight}
                textAnchor='middle'
                alignmentBaseline='central'
                className={linkTextClasses}
                style={offsetsAndScale.style}
            >
                {name}
            </text>
        </Link>
    );
};

const getOffsetsAndScale = (column: number, row: number, strokeWidth: number, extraStyles: CSSProperties = {}) => {
    const shouldAdjustGlobalXOffset = ((columns * 3 - 1) / 2) % 2 == 0;
    const xOffsetPerRow = row % 2 === 0 ? (shouldAdjustGlobalXOffset ? 0 : 0.75) : shouldAdjustGlobalXOffset ? -0.75 : 0;
    const xValue = (1.5 * column + xOffsetPerRow) * scaleUp;

    const yOffsetPerRow = hexHalfHeight;
    const yValue = (row - 1) * yOffsetPerRow;

    return {
        x: xValue,
        y: yValue,
        style: {
            'transformOrigin': `${((xValue + hexHalfWidth) / totalWidthAtCenter) * 100}% ${((yValue + hexHalfHeight) / totalHeight) * 100}%`,
            '--hex-scale-stroked': `${1 - strokeWidth}`,
            ...extraStyles,
        },
    };
};

const rowsData: Record<number, RowData> = {
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
            { name: 'code', url: '/0', rowCol: [3, 1], rotationDeg: -60 },
            { name: '3d', url: '/1', rowCol: [3, 2], rotationDeg: 60 },
            { name: 'log', url: '/3', rowCol: [6, 1], rotationDeg: 180 },
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
            { name: 'code', url: '/0', rowCol: [6, 1], rotationDeg: 60 },
            { name: '3d', url: '/1', rowCol: [6, 2], rotationDeg: 60 },
            { name: 'log', url: '/3', rowCol: [9, 2], rotationDeg: 60 },
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
            { name: 'code', url: '/0', rowCol: [9, 3], rotationDeg: 60 },
            { name: '3d', url: '/1', rowCol: [9, 4], rotationDeg: 60 },
            { name: 'log', url: '/3', rowCol: [12, 3], rotationDeg: 60 },
        ],
    },
};

/* Types */
type CellData = { count: number; leftIndices: number[]; borderRotationDeg?: number; centerIndices?: number[]; xOffset?: number };
type LinkData = { name: 'code' | '3d' | 'log'; url: string; rowCol: [number, number]; rotationDeg: number };
type RowData = { cells: CellData[]; links: [LinkData, LinkData, LinkData] };
