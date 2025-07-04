import { CSSProperties, FC, useLayoutEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import classNames from '../lib/classNames';
import configJSON from '../config/config.json';
import { NavigationExpansionState } from '../views/Main';
import { HexagonData, HexagonLink } from '../types/types';
import hexShape, { staticValues } from '../config/hexagonData';

const {
    hexMenu: { columns, strokeWidth, scaleUp },
} = configJSON;

const hexPaddingFactor = staticValues.tilingMultiplierHorizontal.flatTop;
const totalWidthAtCenter = (columns * hexPaddingFactor - (hexPaddingFactor - 1)) * scaleUp;
const totalHeight = totalWidthAtCenter * staticValues.heightAspectRatio.flatTop;
const hexHeight = staticValues.heightAspectRatio.flatTop * scaleUp;
const hexHalfHeight = hexHeight / 2;
const hexHalfWidth = (staticValues.tilingMultiplierVertical.flatTop / 2) * scaleUp;

const HexagonTiles = () => {
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
                'pointer-events-none absolute left-0 right-0 top-[--flat-hex-margin-top] z-10 mx-auto h-[--flat-hex-height] w-[--anim-overall-width] overflow-visible transition-transform delay-100 duration-1000',
                // '[&_.left]:has-[.class-code:hover,.class-3d:hover,.class-log:hover]:pointer-events-none [&_.left]:has-[.left:hover]:scale-[0.85] [&_.left]:has-[.right:hover]:scale-95',
                // '[&_.right]:has-[.class-code:hover,.class-3d:hover,.class-log:hover]:pointer-events-none [&_.right]:has-[.left:hover]:scale-95 [&_.right]:has-[.right:hover]:scale-[0.85]',
                hoverState === 'code' ? 'rotate-[60deg]' : hoverState === '3d' ? 'rotate-[-60deg]' : hoverState === 'log' ? 'rotate-[180deg]' : 'rotate-0',
                expansionState === 'home' ? '' : expansionState === 'category' ? '' /* [&_.left]:-translate-x-1/4 */ : expansionState === 'post' ? '' : '',
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

            {/* <HexagonRows rowsData={rowsDataSet[expansionState]} /> */}
            <Hexagons expansionState={expansionState} />

            {/* Links drawn last (no z-index in svg) */}
            <HexagonLinks expansionState={expansionState} setHoverState={setHoverState} />
        </svg>
    );
};

export default HexagonTiles;

const Hexagons: FC<{
    expansionState: NavigationExpansionState;
}> = ({ expansionState }) => {
    const hexagons_Memo = useMemo(() => {
        const hexArray = [];

        for (let i = 0; i < hexShape.length; i++) {
            for (let j = 0; j < hexShape[i].length; j++) {
                const shapeData = hexShape[i][j];
                if (shapeData && !shapeData.title) {
                    const { position, rotation, scale, isHalf } = hexShape[i][j]![expansionState];
                    hexArray.push(
                        <use
                            id={`hex-row-${i}-column-${j}`}
                            key={`hex-row-${i}-column-${j}`}
                            x={0}
                            y={0}
                            className={classNames(
                                'left pointer-events-auto origin-[12.5%_12.5%] translate-x-0 fill-theme-primary-darker/75 transition-[transform,fill,clip-path] duration-1000 hover-active:fill-theme-primary',
                                isHalf ? 'clip-inset-t-1/2' : 'clip-inset-0',
                                '[--tw-scale-x:--hex-scale-stroked] [--tw-scale-y:--hex-scale-stroked]',
                            )}
                            href='#flat-top-hex'
                            style={
                                {
                                    '--hex-scale-stroked': (1 - strokeWidth) * scale,
                                    '--tw-rotate': `${rotation}deg`,
                                    '--tw-translate-x': `${(position.x / totalWidthAtCenter) * 100}%`,
                                    '--tw-translate-y': `${(position.y / totalHeight) * 100}%`,
                                } as CSSProperties
                            }
                        />,
                    );
                }
            }
        }

        return hexArray;
    }, [expansionState]);

    return <>{hexagons_Memo.map((useElem) => useElem)}</>;
};

const HexagonLinks: FC<{
    expansionState: NavigationExpansionState;
    setHoverState: React.Dispatch<React.SetStateAction<'code' | '3d' | 'log' | null>>;
}> = ({ expansionState, setHoverState }) => {
    const hexagonLinks_Memo = useMemo(() => {
        const hexLinks = linkMenuHexShapes.map((linkHex) => {
            const { title, url } = linkHex;
            const { position, rotation, scale, isHalf, origin } = linkHex[expansionState];

            return (
                <Link
                    key={`hex-link-${title}`}
                    to={`/${url!}`}
                    className={classNames(
                        'group block origin-[12.5%_12.5%] translate-x-0 no-underline transition-transform',
                        '[--tw-scale-x:--hex-scale-stroked] [--tw-scale-y:--hex-scale-stroked]',
                        isHalf ? 'clip-inset-t-1/2' : 'clip-inset-0',
                    )}
                    style={
                        {
                            '--tw-translate-x': `${(position.x / totalWidthAtCenter) * 100}%`,
                            '--tw-translate-y': `${(position.y / totalHeight) * 100}%`,
                            '--tw-rotate': `${rotation}deg`,
                            '--hex-scale-stroked': (1 - strokeWidth) * scale,
                            'transformOrigin': origin ?? undefined,
                        } as CSSProperties
                    }
                >
                    <use
                        id={`hex-link-${title}`}
                        href='#flat-top-hex'
                        x={0}
                        y={0}
                        className='pointer-events-auto origin-[12.5%_12.5%] fill-[url(#myGradient)] transition-[fill] group-hover-active:scale-110 group-hover-active:fill-theme-primary'
                        onMouseEnter={() => setHoverState(expansionState === 'home' ? title! : null)}
                    />
                    <text
                        x={hexHalfWidth}
                        y={hexHalfHeight}
                        textAnchor='middle'
                        alignmentBaseline='central'
                        className='text pointer-events-none origin-[12.5%_12.5%] select-none fill-red-500 text-[40px] font-bold tracking-tight group-hover-active:scale-110'
                    >
                        {title}
                    </text>
                </Link>
            );
        });

        return hexLinks;
    }, [expansionState, setHoverState]);

    return hexagonLinks_Memo.map((useElem) => useElem);
};

/**
This needs a-changing:

Desired outcomes: 
- Fixed number of hexagons / half hexagons (leave at values from "3" for now).
- These tween/transition from xy to different xy, depending on ExpansionState (---> do x and y values set to a <use> "transition"?)
- Array of rows, which in turn are an array of columns. If array element is null, no hex is drawn, else either a full hex or a half hex is drawn. all have rot values.
- Hex's X/Y value derived from array positions. These are fixed, ie arr[row][col] = x:12.5%, y:32.5%. Changing these should hence afford us a transition.
- On expansionState change, array row and column positions are changed (enabling half hexes to move upwards/downwards on vertical)

Possibly:
- Get rid of two-tone coloring of hexes, gradually transition all hexes colors to that of category (so 3 colors all together)

*/

const linkMenuHexShapes = hexShape.flat().filter((hexElem) => hexElem?.title) as (Record<NavigationExpansionState, HexagonData> & HexagonLink)[];

/* Types */
