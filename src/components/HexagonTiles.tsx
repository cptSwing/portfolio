import { CSSProperties, FC, memo, useLayoutEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getNumberedArrayOfLength } from '../lib/getNumberedArrayOfLength';
import classNames from '../lib/classNames';
import configJSON from '../config/config.json';
import { NavigationExpansionState } from '../views/Main';

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

const hiddenClasses = /* tw */ 'opacity-0 transition-opacity duration-500';

const HexagonTiles: FC<{ extraClassNames?: string }> = ({ extraClassNames }) => {
    const { catId, postId } = useParams();
    const [[expansionState, formerExpansionState], setExpansionState] = useState<[NavigationExpansionState, NavigationExpansionState]>(['home', 'home']);
    const [hoverState, setHoverState] = useState<'code' | '3d' | 'log' | null>(null);

    useLayoutEffect(() => {
        if (catId) {
            if (postId) {
                setExpansionState(([stale, _obsolete]) => ['post', stale]);
            } else {
                setExpansionState(([stale, _obsolete]) => ['category', stale]);
            }
            setHoverState(null);
        } else {
            setExpansionState(([stale, _obsolete]) => ['home', stale]);
        }
    }, [catId, postId]);

    return (
        <svg
            className={classNames(
                '[--hex-gradient-color-1:theme(colors.theme.primary)] [--hex-gradient-color-2:theme(colors.theme.secondary)]',
                'transition-transform delay-100 duration-1000',
                '[&_.left]:has-[.class-code:hover,.class-3d:hover,.class-log:hover]:pointer-events-none [&_.left]:has-[.left:hover]:scale-[0.85] [&_.left]:has-[.right:hover]:scale-95',
                '[&_.right]:has-[.class-code:hover,.class-3d:hover,.class-log:hover]:pointer-events-none [&_.right]:has-[.left:hover]:scale-95 [&_.right]:has-[.right:hover]:scale-[0.85]',
                '[&_.center:not(.text)]:has-[.left:hover,.right:hover]:scale-95',

                hoverState === 'code' ? 'rotate-[60deg]' : hoverState === '3d' ? 'rotate-[-60deg]' : hoverState === 'log' ? 'rotate-[180deg]' : 'rotate-0',
                // expansionState === 'category' ? '*:scale-75 *:transition-transform *:duration-1000 ' : '',
                expansionState === 'category'
                    ? '[--hex-scale-exp-state:0.75] [&_.center]:-translate-x-1/4 [&_.left]:-translate-x-1/4 [&_.right]:translate-x-1/4'
                    : expansionState === 'post'
                      ? '[--hex-scale-exp-state:0.5]'
                      : '[--hex-scale-exp-state:1]',

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

            <HexagonRows rowsData={rowsDataSet[expansionState]} />

            {/* Links drawn last (no z-index in svg) */}
            <HexagonLinks linksData={rowsDataSet[expansionState].links} expansionState={expansionState} setHoverState={setHoverState} />
        </svg>
    );
};

export default HexagonTiles;

const HexagonRows: FC<{ rowsData: RowData }> = memo(({ rowsData }) => {
    const { cells, links } = rowsData;
    const linksRowCols = links.map(({ rowCol }) => rowCol);

    return (
        <>
            {cells.map((cellData, rowIndex) => (
                <HexagonRow cellData={cellData} rowIndex={rowIndex} linksRowCols={linksRowCols} />
            ))}
        </>
    );
});

const HexagonRow: FC<{ cellData: CellData; rowIndex: number; linksRowCols: [number, number][] }> = ({ cellData, rowIndex, linksRowCols }) => {
    const { count, leftIndices, centerIndices, hiddenIndices, rotationDeg, xIndexOffset } = cellData;

    const arrayOfHexagons_Memo = useMemo(() => {
        const numberedArray = getNumberedArrayOfLength(count, xIndexOffset);

        return numberedArray.map((offsetColumn, idx, arr) => {
            const columnIndex = offsetColumn - 1; // getNumberedArrayOfLength(n, offset) returns array of numbers starting at 1, so for correct offsets etc we subtract 1 again
            const isHalfPolygon = typeof rotationDeg === 'number' && (idx === 0 || idx === arr.length - 1 || rotationDeg === 0 || rotationDeg === 180);
            const isLink = linksRowCols.findIndex(([linkRowIndex, linkColIndex]) => rowIndex === linkRowIndex && columnIndex === linkColIndex) >= 0;

            const classes = leftIndices?.includes(columnIndex)
                ? leftClasses
                : centerIndices?.includes(columnIndex)
                  ? centerClasses
                  : hiddenIndices?.includes(columnIndex)
                    ? hiddenClasses
                    : rightClasses;

            return !isLink ? (
                <use
                    id={`hex-row-${rowIndex}-column-${columnIndex}`}
                    key={`hex-row-${rowIndex}-column-${columnIndex}`}
                    className={classes}
                    href={isHalfPolygon ? '#flat-top-hex-half' : '#flat-top-hex'}
                    {...getOffsetsAndScale(
                        columnIndex,
                        rowIndex,
                        strokeWidth,
                        isHalfPolygon ? ({ '--tw-rotate': `${idx === 0 ? -rotationDeg : rotationDeg}deg` } as CSSProperties) : undefined,
                    )}
                />
            ) : null;
        });
    }, [count, xIndexOffset, rotationDeg, leftIndices, centerIndices, hiddenIndices, linksRowCols, rowIndex]);

    return <>{arrayOfHexagons_Memo.map((useElement) => useElement)}</>;
};

const HexagonLinks: FC<{
    linksData: [LinkData, LinkData, LinkData];
    expansionState: NavigationExpansionState;
    setHoverState: React.Dispatch<React.SetStateAction<'code' | '3d' | 'log' | null>>;
}> = memo(({ linksData, expansionState, setHoverState }) => {
    return (
        <>
            {linksData.map((linkData) => {
                const {
                    name,
                    url,
                    rowCol: [linkRow, linkColumn],
                    rotationDeg,
                } = linkData;

                const offsetsAndScale = getOffsetsAndScale(linkColumn, linkRow, strokeWidth, {
                    '--tw-rotate': `${expansionState === 'home' ? rotationDeg : 0}deg`,
                } as CSSProperties);

                return (
                    <Link key={`hex-row-${linkRow}-column-${linkColumn}`} to={url} className='group no-underline'>
                        <use
                            id={`hex-row-${linkRow}-column-${linkColumn}`}
                            href='#flat-top-hex'
                            className={linkClasses + ` class-${name}`}
                            {...offsetsAndScale}
                            onMouseEnter={() => setHoverState(expansionState === 'home' ? name : null)}
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
            })}
        </>
    );
});

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
            '--hex-scale-stroked': `calc(${1 - strokeWidth} * var(--hex-scale-exp-state))`,
            ...extraStyles,
        },
    };
};

const rowsData: Record<number, Record<NavigationExpansionState, RowData>> = {
    3: {
        home: {
            cells: [
                { count: 1, leftIndices: [1], rotationDeg: 0, xIndexOffset: 1 },
                { count: 2, leftIndices: [1], xIndexOffset: 1 },
                { count: 3, leftIndices: [0], rotationDeg: 60 },
                { count: 2, leftIndices: [1], xIndexOffset: 1 },

                { count: 3, leftIndices: [0], centerIndices: [1] },

                { count: 2, leftIndices: [1], xIndexOffset: 1 },
                { count: 3, leftIndices: [0], rotationDeg: 120 },
                { count: 2, leftIndices: [1], xIndexOffset: 1 },
                { count: 1, leftIndices: [1], rotationDeg: 180, xIndexOffset: 1 },
            ],
            links: [
                { name: 'code', url: '/0', rowCol: [3, 1], rotationDeg: -60 },
                { name: '3d', url: '/1', rowCol: [3, 2], rotationDeg: 60 },
                { name: 'log', url: '/3', rowCol: [6, 1], rotationDeg: 180 },
            ],
        },
        category: {
            cells: [
                { count: 3, leftIndices: [0], hiddenIndices: [1], rotationDeg: 60, xIndexOffset: 0 },
                { count: 2, leftIndices: [1], hiddenIndices: [2], rotationDeg: -60, xIndexOffset: 1 },
                { count: 3, leftIndices: [0], hiddenIndices: [1] },
                { count: 2, leftIndices: [1], hiddenIndices: [1, 2], xIndexOffset: 1 },

                { count: 3, leftIndices: [0], hiddenIndices: [1] },

                { count: 2, leftIndices: [1], hiddenIndices: [2], xIndexOffset: 1 },
                { count: 3, leftIndices: [0], hiddenIndices: [1] },
                { count: 2, leftIndices: [1], hiddenIndices: [2], rotationDeg: -120, xIndexOffset: 1 },
                { count: 3, leftIndices: [0], hiddenIndices: [1], rotationDeg: 120, xIndexOffset: 0 },
            ],
            links: [
                { name: 'code', url: '/0', rowCol: [3, 1], rotationDeg: -60 },
                { name: '3d', url: '/1', rowCol: [5, 1], rotationDeg: 60 },
                { name: 'log', url: '/3', rowCol: [6, 0], rotationDeg: 180 },
            ],
        },
        post: {
            cells: [
                { count: 1, leftIndices: [1], rotationDeg: 0, xIndexOffset: 1 },
                { count: 2, leftIndices: [1], xIndexOffset: 1 },
                { count: 3, leftIndices: [0], rotationDeg: 60 },
                { count: 2, leftIndices: [1], xIndexOffset: 1 },

                { count: 3, leftIndices: [0], centerIndices: [1] },

                { count: 2, leftIndices: [1], xIndexOffset: 1 },
                { count: 3, leftIndices: [0], rotationDeg: 120 },
                { count: 2, leftIndices: [1], xIndexOffset: 1 },
                { count: 1, leftIndices: [1], rotationDeg: 180, xIndexOffset: 1 },
            ],
            links: [
                { name: 'code', url: '/0', rowCol: [3, 1], rotationDeg: -60 },
                { name: '3d', url: '/1', rowCol: [3, 2], rotationDeg: 60 },
                { name: 'log', url: '/3', rowCol: [6, 1], rotationDeg: 180 },
            ],
        },
    },

    5: {
        home: {
            cells: [
                { count: 2, leftIndices: [1, 2], rotationDeg: 0, xIndexOffset: 1 },
                { count: 3, leftIndices: [1, 2, 3], xIndexOffset: 1 },
                { count: 4, leftIndices: [0, 1, 2], rotationDeg: 60 },
                { count: 3, leftIndices: [1, 2], xIndexOffset: 1 },
                { count: 4, leftIndices: [0, 1, 2] },
                { count: 5, leftIndices: [0, 1], rotationDeg: 60, centerIndices: [2] },
                { count: 4, leftIndices: [0], centerIndices: [1, 2] },

                { count: 5, leftIndices: [0, 1], centerIndices: [2] },

                { count: 4, leftIndices: [0], centerIndices: [1, 2] },
                { count: 5, leftIndices: [0, 1], rotationDeg: 120, centerIndices: [2] },
                { count: 4, leftIndices: [0, 1] },
                { count: 3, leftIndices: [1], xIndexOffset: 1 },
                { count: 4, leftIndices: [0], rotationDeg: 120 },
                { count: 3, leftIndices: [1], xIndexOffset: 1 },
                { count: 2, leftIndices: [], rotationDeg: 180, xIndexOffset: 1 },
            ],
            links: [
                { name: 'code', url: '/0', rowCol: [6, 1], rotationDeg: 60 },
                { name: '3d', url: '/1', rowCol: [6, 2], rotationDeg: 60 },
                { name: 'log', url: '/3', rowCol: [9, 2], rotationDeg: 60 },
            ],
        },
        category: {
            cells: [
                { count: 2, leftIndices: [1, 2], rotationDeg: 0, xIndexOffset: 1 },
                { count: 3, leftIndices: [1, 2, 3], xIndexOffset: 1 },
                { count: 4, leftIndices: [0, 1, 2], rotationDeg: 60 },
                { count: 3, leftIndices: [1, 2], xIndexOffset: 1 },
                { count: 4, leftIndices: [0, 1, 2] },
                { count: 5, leftIndices: [0, 1], rotationDeg: 60, centerIndices: [2] },
                { count: 4, leftIndices: [0], centerIndices: [1, 2] },

                { count: 5, leftIndices: [0, 1], centerIndices: [2] },

                { count: 4, leftIndices: [0], centerIndices: [1, 2] },
                { count: 5, leftIndices: [0, 1], rotationDeg: 120, centerIndices: [2] },
                { count: 4, leftIndices: [0, 1] },
                { count: 3, leftIndices: [1], xIndexOffset: 1 },
                { count: 4, leftIndices: [0], rotationDeg: 120 },
                { count: 3, leftIndices: [1], xIndexOffset: 1 },
                { count: 2, leftIndices: [], rotationDeg: 180, xIndexOffset: 1 },
            ],
            links: [
                { name: 'code', url: '/0', rowCol: [6, 1], rotationDeg: 60 },
                { name: '3d', url: '/1', rowCol: [6, 2], rotationDeg: 60 },
                { name: 'log', url: '/3', rowCol: [9, 2], rotationDeg: 60 },
            ],
        },
        post: {
            cells: [
                { count: 2, leftIndices: [1, 2], rotationDeg: 0, xIndexOffset: 1 },
                { count: 3, leftIndices: [1, 2, 3], xIndexOffset: 1 },
                { count: 4, leftIndices: [0, 1, 2], rotationDeg: 60 },
                { count: 3, leftIndices: [1, 2], xIndexOffset: 1 },
                { count: 4, leftIndices: [0, 1, 2] },
                { count: 5, leftIndices: [0, 1], rotationDeg: 60, centerIndices: [2] },
                { count: 4, leftIndices: [0], centerIndices: [1, 2] },

                { count: 5, leftIndices: [0, 1], centerIndices: [2] },

                { count: 4, leftIndices: [0], centerIndices: [1, 2] },
                { count: 5, leftIndices: [0, 1], rotationDeg: 120, centerIndices: [2] },
                { count: 4, leftIndices: [0, 1] },
                { count: 3, leftIndices: [1], xIndexOffset: 1 },
                { count: 4, leftIndices: [0], rotationDeg: 120 },
                { count: 3, leftIndices: [1], xIndexOffset: 1 },
                { count: 2, leftIndices: [], rotationDeg: 180, xIndexOffset: 1 },
            ],
            links: [
                { name: 'code', url: '/0', rowCol: [6, 1], rotationDeg: 60 },
                { name: '3d', url: '/1', rowCol: [6, 2], rotationDeg: 60 },
                { name: 'log', url: '/3', rowCol: [9, 2], rotationDeg: 60 },
            ],
        },
    },

    7: {
        home: {
            cells: [
                { count: 3, leftIndices: [2], rotationDeg: 0, xIndexOffset: 2 },
                { count: 4, leftIndices: [2, 3], xIndexOffset: 2 },
                { count: 5, leftIndices: [1, 2], rotationDeg: 60, xIndexOffset: 1 },
                { count: 4, leftIndices: [2, 3], xIndexOffset: 2 },
                { count: 5, leftIndices: [1, 2], xIndexOffset: 1 },
                { count: 6, leftIndices: [1, 2, 3], rotationDeg: 60, xIndexOffset: 1 },
                { count: 5, leftIndices: [1, 2], xIndexOffset: 1, centerIndices: [3] },
                { count: 6, leftIndices: [1, 2], xIndexOffset: 1, centerIndices: [3, 4] },
                { count: 7, leftIndices: [0, 1], rotationDeg: 60, centerIndices: [2, 3, 4] },
                { count: 6, leftIndices: [1, 2], xIndexOffset: 1, centerIndices: [3, 4] },

                { count: 7, leftIndices: [0, 1], centerIndices: [2, 3, 4] },

                { count: 6, leftIndices: [1, 2], xIndexOffset: 1, centerIndices: [3, 4] },
                { count: 7, leftIndices: [0, 1], rotationDeg: 120, centerIndices: [2, 3, 4] },
                { count: 6, leftIndices: [1, 2], xIndexOffset: 1, centerIndices: [3, 4] },
                { count: 5, leftIndices: [1, 2], xIndexOffset: 1, centerIndices: [3] },
                { count: 6, leftIndices: [1, 2, 3], rotationDeg: 120, xIndexOffset: 1 },
                { count: 5, leftIndices: [1, 2], xIndexOffset: 1 },
                { count: 4, leftIndices: [2, 3], xIndexOffset: 2 },
                { count: 5, leftIndices: [1, 2], rotationDeg: 120, xIndexOffset: 1 },
                { count: 4, leftIndices: [2, 3], xIndexOffset: 2 },
                { count: 3, leftIndices: [2], rotationDeg: 180, xIndexOffset: 2 },
            ],
            links: [
                { name: 'code', url: '/0', rowCol: [9, 3], rotationDeg: 60 },
                { name: '3d', url: '/1', rowCol: [9, 4], rotationDeg: 60 },
                { name: 'log', url: '/3', rowCol: [12, 3], rotationDeg: 60 },
            ],
        },
        category: {
            cells: [
                { count: 3, leftIndices: [2], rotationDeg: 0, xIndexOffset: 2 },
                { count: 4, leftIndices: [2, 3], xIndexOffset: 2 },
                { count: 5, leftIndices: [1, 2], rotationDeg: 60, xIndexOffset: 1 },
                { count: 4, leftIndices: [2, 3], xIndexOffset: 2 },
                { count: 5, leftIndices: [1, 2], xIndexOffset: 1 },
                { count: 6, leftIndices: [1, 2, 3], rotationDeg: 60, xIndexOffset: 1 },
                { count: 5, leftIndices: [1, 2], xIndexOffset: 1, centerIndices: [3] },
                { count: 6, leftIndices: [1, 2], xIndexOffset: 1, centerIndices: [3, 4] },
                { count: 7, leftIndices: [0, 1], rotationDeg: 60, centerIndices: [2, 3, 4] },
                { count: 6, leftIndices: [1, 2], xIndexOffset: 1, centerIndices: [3, 4] },

                { count: 7, leftIndices: [0, 1], centerIndices: [2, 3, 4] },

                { count: 6, leftIndices: [1, 2], xIndexOffset: 1, centerIndices: [3, 4] },
                { count: 7, leftIndices: [0, 1], rotationDeg: 120, centerIndices: [2, 3, 4] },
                { count: 6, leftIndices: [1, 2], xIndexOffset: 1, centerIndices: [3, 4] },
                { count: 5, leftIndices: [1, 2], xIndexOffset: 1, centerIndices: [3] },
                { count: 6, leftIndices: [1, 2, 3], rotationDeg: 120, xIndexOffset: 1 },
                { count: 5, leftIndices: [1, 2], xIndexOffset: 1 },
                { count: 4, leftIndices: [2, 3], xIndexOffset: 2 },
                { count: 5, leftIndices: [1, 2], rotationDeg: 120, xIndexOffset: 1 },
                { count: 4, leftIndices: [2, 3], xIndexOffset: 2 },
                { count: 3, leftIndices: [2], rotationDeg: 180, xIndexOffset: 2 },
            ],
            links: [
                { name: 'code', url: '/0', rowCol: [9, 3], rotationDeg: 60 },
                { name: '3d', url: '/1', rowCol: [9, 4], rotationDeg: 60 },
                { name: 'log', url: '/3', rowCol: [12, 3], rotationDeg: 60 },
            ],
        },
        post: {
            cells: [
                { count: 3, leftIndices: [2], rotationDeg: 0, xIndexOffset: 2 },
                { count: 4, leftIndices: [2, 3], xIndexOffset: 2 },
                { count: 5, leftIndices: [1, 2], rotationDeg: 60, xIndexOffset: 1 },
                { count: 4, leftIndices: [2, 3], xIndexOffset: 2 },
                { count: 5, leftIndices: [1, 2], xIndexOffset: 1 },
                { count: 6, leftIndices: [1, 2, 3], rotationDeg: 60, xIndexOffset: 1 },
                { count: 5, leftIndices: [1, 2], xIndexOffset: 1, centerIndices: [3] },
                { count: 6, leftIndices: [1, 2], xIndexOffset: 1, centerIndices: [3, 4] },
                { count: 7, leftIndices: [0, 1], rotationDeg: 60, centerIndices: [2, 3, 4] },
                { count: 6, leftIndices: [1, 2], xIndexOffset: 1, centerIndices: [3, 4] },

                { count: 7, leftIndices: [0, 1], centerIndices: [2, 3, 4] },

                { count: 6, leftIndices: [1, 2], xIndexOffset: 1, centerIndices: [3, 4] },
                { count: 7, leftIndices: [0, 1], rotationDeg: 120, centerIndices: [2, 3, 4] },
                { count: 6, leftIndices: [1, 2], xIndexOffset: 1, centerIndices: [3, 4] },
                { count: 5, leftIndices: [1, 2], xIndexOffset: 1, centerIndices: [3] },
                { count: 6, leftIndices: [1, 2, 3], rotationDeg: 120, xIndexOffset: 1 },
                { count: 5, leftIndices: [1, 2], xIndexOffset: 1 },
                { count: 4, leftIndices: [2, 3], xIndexOffset: 2 },
                { count: 5, leftIndices: [1, 2], rotationDeg: 120, xIndexOffset: 1 },
                { count: 4, leftIndices: [2, 3], xIndexOffset: 2 },
                { count: 3, leftIndices: [2], rotationDeg: 180, xIndexOffset: 2 },
            ],
            links: [
                { name: 'code', url: '/0', rowCol: [9, 3], rotationDeg: 60 },
                { name: '3d', url: '/1', rowCol: [9, 4], rotationDeg: 60 },
                { name: 'log', url: '/3', rowCol: [12, 3], rotationDeg: 60 },
            ],
        },
    },
};

const rowsDataSet = rowsData[columns];

/* Types */
type CellData = { count: number; leftIndices: number[]; rotationDeg?: number; centerIndices?: number[]; hiddenIndices?: number[]; xIndexOffset?: number };
type LinkData = { name: 'code' | '3d' | 'log'; url: string; rowCol: [number, number]; rotationDeg: number };
type RowData = { cells: CellData[]; links: [LinkData, LinkData, LinkData] };
