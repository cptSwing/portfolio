import { CSSProperties, FC, useLayoutEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import classNames from '../lib/classNames';
import configJSON from '../config/config.json';
import { NavigationExpansionState } from '../views/Main';
import { HexagonData, HexagonLink, MenuLinks } from '../types/types';
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

const debug = true;

const HexagonTiles = () => {
    const { catId, postId } = useParams();
    const [[expansionState, _formerExpansionState], setExpansionState] = useState<[NavigationExpansionState, NavigationExpansionState]>(['home', 'home']);
    const [hoverState, setHoverState] = useState<MenuLinks | null>(null);

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
                '[--hex-gradient-color-1:theme(colors.theme.primary)] [--hex-gradient-color-2:theme(colors.theme.primary-darker)]',
                'pointer-events-none absolute top-[--flat-hex-margin-top] z-10 size-full overflow-visible transition-transform delay-100 duration-500',
                // '[&_.left-class]:has-[.class-code:hover,.class-3d:hover,.class-log:hover]:pointer-events-none [&_.left-class]:has-[.left-class:hover]:scale-[0.85] [&_.left-class]:has-[.right:hover]:scale-95',
                // '[&_.right]:has-[.class-code:hover,.class-3d:hover,.class-log:hover]:pointer-events-none [&_.right]:has-[.left-class:hover]:scale-95 [&_.right]:has-[.right:hover]:scale-[0.85]',
                hoverState === 'code' ? 'rotate-[60deg]' : hoverState === '3d' ? 'rotate-[-60deg]' : hoverState === 'log' ? 'rotate-[180deg]' : 'rotate-0',
                expansionState === 'home' ? '' : expansionState === 'category' ? '' /* [&_.left-class]:-translate-x-1/4 */ : 'stroke-theme-text-background',
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

                <linearGradient id='myGradient' x1='0%' y1='100%' x2='0%' y2='0%'>
                    <stop offset='0%' stopColor='var(--hex-gradient-color-1)' />
                    <stop offset='100%' stopColor='var(--hex-gradient-color-2)' />
                </linearGradient>
            </defs>

            {/* <use
                id='bg-hex'
                x={200 - hexHalfWidth}
                y={173.2 - hexHalfHeight}
                href='#flat-top-hex'
                className={classNames(
                    'origin-center fill-none transition-[transform,fill] duration-1000 [animation-duration:2s]',
                    expansionState === 'home' ? '' : expansionState === 'category' ? 'animate-scale-hex-bg' : 'animate-scale-hex-bg',
                )}
            /> */}

            <Hexagons expansionState={expansionState} setHoverState={setHoverState} />
        </svg>
    );
};

export default HexagonTiles;

const Hexagons: FC<{
    expansionState: NavigationExpansionState;
    setHoverState: React.Dispatch<React.SetStateAction<MenuLinks | null>>;
}> = ({ expansionState, setHoverState }) => {
    const hexagons_Memo = useMemo(() => {
        const hexArray = [];
        const hexLinkArray = [];

        for (let i = 0; i < hexShape.length; i++) {
            for (let j = 0; j < hexShape[i].length; j++) {
                // Weed out empty positions in grid
                if (hexShape[i][j]) {
                    const shapeData = hexShape[i][j] as Record<NavigationExpansionState, HexagonData> & HexagonLink;
                    const { position, rotation, scale, isHalf, offsets } = shapeData[expansionState];

                    const cssVariables = {
                        '--tw-translate-x': `${(position.x / totalWidthAtCenter) * 100 + (offsets?.x ?? 0)}%`,
                        '--tw-translate-y': `${(position.y / totalHeight) * 100 + (offsets?.y ?? 0)}%`,
                        '--tw-rotate': `${rotation}deg`,
                        '--hex-scale-stroked': (1 - strokeWidth) * scale,
                    } as CSSProperties;

                    // Add hexes
                    if (!shapeData.title) {
                        hexArray.push(
                            <use
                                id={`hex-row-${i}-column-${j}`}
                                key={`hex-row-${i}-column-${j}`}
                                x={0}
                                y={0}
                                className={classNames(
                                    '[--tw-scale-x:--hex-scale-stroked] [--tw-scale-y:--hex-scale-stroked]',
                                    'left-class pointer-events-auto origin-[12.5%_12.5%] translate-x-0 fill-theme-primary drop-shadow-omni-md transition-[transform,fill,clip-path] delay-300 duration-500 hover-active:fill-theme-primary hover-active:delay-0 hover-active:duration-500',
                                    isHalf ? 'clip-inset-t-1/2' : 'clip-inset-0',
                                )}
                                href='#flat-top-hex'
                                style={cssVariables}
                            />,
                            debug && (
                                <text
                                    key={`debug-hex-row-${i}-column-${j}`}
                                    x={hexHalfWidth}
                                    y={hexHalfHeight}
                                    textAnchor='middle'
                                    alignmentBaseline='central'
                                    className='origin-[12.5%_12.5%] translate-x-0 stroke-none text-2xs [--tw-scale-x:--hex-scale-stroked] [--tw-scale-y:--hex-scale-stroked]'
                                    style={cssVariables}
                                >
                                    row: {i} col: {j}
                                </text>
                            ),
                        );
                    }
                    // Add links
                    else if (shapeData.title) {
                        const { title, url } = shapeData;
                        hexLinkArray.push(
                            <Link
                                key={`hex-link-${title}`}
                                to={`/${url!}`}
                                className={classNames(
                                    '[--tw-scale-x:--hex-scale-stroked] [--tw-scale-y:--hex-scale-stroked]',
                                    'group block origin-[12.5%_12.5%] translate-x-0 stroke-none no-underline transition-transform duration-1000',
                                    `link-class link-class-${title}`,
                                    isHalf ? 'clip-inset-t-1/2' : 'clip-inset-0',
                                )}
                                style={cssVariables}
                                onMouseEnter={() => setHoverState(expansionState === 'home' ? title! : null)}
                            >
                                <use
                                    id={`hex-link-${title}`}
                                    href='#flat-top-hex'
                                    x={0}
                                    y={0}
                                    className='pointer-events-auto origin-[12.5%_12.5%] fill-[url(#myGradient)] transition-[fill] group-hover-active:scale-110 group-hover-active:fill-theme-primary'
                                />
                                <text
                                    x={hexHalfWidth}
                                    y={hexHalfHeight}
                                    textAnchor='middle'
                                    alignmentBaseline='central'
                                    className='text pointer-events-none origin-[12.5%_12.5%] select-none fill-theme-secondary text-[40px] font-bold tracking-tight group-hover-active:scale-110'
                                >
                                    {title}
                                </text>
                            </Link>,
                        );
                    }
                }
            }
        }

        // Add Links as last elements to draw last (no z-index within SVG's)
        hexArray.push(...hexLinkArray);

        return hexArray;
    }, [expansionState, setHoverState]);

    return <>{hexagons_Memo.map((useElem) => useElem)}</>;
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
