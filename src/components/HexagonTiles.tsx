import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from '../lib/classNames';
import configJSON from '../config/config.json';
import { HexagonData, HexagonLink, MenuLinks, NavigationExpansionState } from '../types/types';
import hexShape, { staticValues } from '../config/hexagonData';
import { useZustand } from '../lib/zustand';

const {
    hexMenu: { columns, strokeWidth, scaleUp },
} = configJSON;

const hexPaddingFactor = staticValues.tilingMultiplierHorizontal.flatTop;
const totalWidthAtCenter = (columns * hexPaddingFactor - (hexPaddingFactor - 1)) * scaleUp;
const totalHeight = totalWidthAtCenter * staticValues.heightAspectRatio.flatTop;
const hexHeight = staticValues.heightAspectRatio.flatTop * scaleUp;
const hexHalfHeight = hexHeight / 2;
const hexHalfWidth = (staticValues.tilingMultiplierVertical.flatTop / 2) * scaleUp;
const svgTransitionDurationMs = 500;

const debug = false;

const nonLinkHexes: Record<NavigationExpansionState, HexagonData>[] = [];
const linkHexes: (Record<NavigationExpansionState, HexagonData> & HexagonLink)[] = [];

hexShape.forEach((hexRow) =>
    hexRow.forEach((hexCol) => {
        if (hexCol) {
            if ((hexCol as Record<NavigationExpansionState, HexagonData> & HexagonLink).title) {
                linkHexes.push(hexCol as Record<NavigationExpansionState, HexagonData> & HexagonLink);
            } else {
                nonLinkHexes.push(hexCol);
            }
        }
    }),
);

const HexagonTiles = () => {
    const [menuHoverState, setMenuHoverState] = useState<MenuLinks | null>(null);
    const newHoverReadyState = useState(true);
    const [canSetNewHover, setCanSetNewHover] = newHoverReadyState;

    return (
        <svg
            className={classNames(
                'pointer-events-none absolute top-[--flat-hex-margin-top] z-10 size-full overflow-visible transition-transform delay-100',
                // '[&_.left-class]:has-[.class-code:hover,.class-3d:hover,.class-log:hover]:pointer-events-none [&_.left-class]:has-[.left-class:hover]:scale-[0.85] [&_.left-class]:has-[.right:hover]:scale-95',
                // '[&_.right]:has-[.class-code:hover,.class-3d:hover,.class-log:hover]:pointer-events-none [&_.right]:has-[.left-class:hover]:scale-95 [&_.right]:has-[.right:hover]:scale-[0.85]',
                menuHoverState === 'code'
                    ? 'rotate-[60deg]'
                    : menuHoverState === '3d'
                      ? 'rotate-[-60deg]'
                      : menuHoverState === 'log'
                        ? 'rotate-[180deg]'
                        : 'rotate-0',
            )}
            viewBox={`0 0 ${totalWidthAtCenter} ${totalHeight}`}
            style={
                {
                    'transitionDuration': `${svgTransitionDurationMs}ms`,
                    '--hex-center-scale': 1 - strokeWidth,
                } as CSSProperties
            }
        >
            <defs>
                <filter id='light-inner'>
                    <feFlood className='[flood-color:theme(colors.theme.primary-darker/0.5)]' />
                    <feComposite operator='out' in2='SourceGraphic' />
                    <feMorphology operator='dilate' radius='2' />
                    {/* <feGaussianBlur stdDeviation='1' /> */}
                    <feComposite operator='atop' in2='SourceGraphic' />
                </filter>

                <filter id='lighter-inner'>
                    <feFlood className='[flood-color:theme(colors.theme.primary-lighter/0.5)]' />
                    <feComposite operator='out' in2='SourceGraphic' />
                    <feMorphology operator='dilate' radius='7' />
                    <feGaussianBlur stdDeviation='5' />
                    <feComposite operator='atop' in2='SourceGraphic' />
                </filter>

                <linearGradient id='linearGradient' x1='0%' y1='100%' x2='0%' y2='0%'>
                    <stop offset='0%' className='[stop-color:theme(colors.theme.primary-darker/1)]' />
                    <stop offset='50%' className='[stop-color:theme(colors.theme.primary-lighter/0.75)]' />
                    <stop offset='100%' className='[stop-color:theme(colors.theme.primary-darker/1)]' />
                </linearGradient>

                <radialGradient id='radialGradient'>
                    <stop offset='90%' className='[stop-color:theme(colors.theme.primary-darker/1)]' />
                    <stop offset='100%' className='[stop-color:theme(colors.theme.primary-lighter/1)]' />
                </radialGradient>
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

            {nonLinkHexes.map((hexData, idx) => (
                <AnimatedHexagon shapeData={hexData} arrayIndex={idx} />
            ))}

            {linkHexes.map((hexData, idx) => (
                <LinkHexagon shapeData={hexData} arrayIndex={idx} newHoverReadyState={newHoverReadyState} setMenuHoverState={setMenuHoverState} />
            ))}
        </svg>
    );
};

export default HexagonTiles;

const polygonPoints = {
    from: `
            0,${0.433 * scaleUp}
            ${0.25 * scaleUp},0
            ${0.75 * scaleUp},0
            ${1 * scaleUp},${0.433 * scaleUp}
            ${0.75 * scaleUp},${0.866 * scaleUp}
            ${0.25 * scaleUp},${0.866 * scaleUp}
        `,
    to: `
            0,${0.433 * scaleUp}
            ${0.1 * scaleUp},${0.433 * scaleUp}
            ${0.9 * scaleUp},${0.433 * scaleUp}
            ${1 * scaleUp},${0.433 * scaleUp}
            ${0.75 * scaleUp},${0.866 * scaleUp}
            ${0.25 * scaleUp},${0.866 * scaleUp}
    `,
};

const AnimatedHexagon: FC<{ shapeData: Record<NavigationExpansionState, HexagonData>; arrayIndex: number }> = ({ shapeData, arrayIndex }) => {
    const expansionState = useZustand((store) => store.values.expansionState);
    const keyId = `hex-index-${arrayIndex}`;

    const localShapeData_Memo = useMemo(() => shapeData[expansionState], [expansionState, shapeData]);
    const { position, rotation, scale, isHalf, offsets } = localShapeData_Memo;
    const cssVariables_Memo = useMemo(
        () =>
            ({
                '--tw-translate-x': `${(position.x / totalWidthAtCenter) * 100 + (offsets?.x ?? 0)}%`,
                '--tw-translate-y': `${(position.y / totalHeight) * 100 + (offsets?.y ?? 0)}%`,
                '--tw-rotate': `${rotation}deg`,
                '--hex-scale-stroked': (1 - strokeWidth) * scale,
            }) as CSSProperties,
        [offsets?.x, offsets?.y, position.x, position.y, rotation, scale],
    );

    const forward_Ref = useRef<SVGAnimateElement | null>(null);
    const reverse_Ref = useRef<SVGAnimateElement | null>(null);
    const hasHalved_Ref = useRef(false);

    useEffect(() => {
        if (isHalf === true) {
            forward_Ref.current?.beginElement();
            hasHalved_Ref.current = true;
        } else if (isHalf === false && hasHalved_Ref.current) {
            reverse_Ref.current?.beginElement();
        }
    }, [isHalf]);

    return (
        <polygon
            id={keyId}
            key={keyId}
            points={polygonPoints.from}
            className={classNames(
                'left-class pointer-events-auto origin-[12.5%_12.5%] translate-x-0 transition-[transform,fill,stroke] duration-500 [--tw-scale-x:--hex-scale-stroked] [--tw-scale-y:--hex-scale-stroked] [filter:url(#light-inner)]',
                expansionState === 'home'
                    ? 'fill-theme-primary stroke-theme-text-background/0'
                    : expansionState === 'category'
                      ? 'fill-theme-primary stroke-theme-text-background/0'
                      : /* post */
                        'fill-theme-text-background stroke-theme-text-background/100',
            )}
            style={cssVariables_Memo}
        >
            <animate
                id='flat-top-hex-animation-halve-forward'
                ref={forward_Ref}
                attributeName='points'
                from={polygonPoints.from}
                to={polygonPoints.to}
                dur='500ms'
                begin='indefinite'
                fill='freeze'
            />
            <animate
                id='flat-top-hex-animation-halve-reverse'
                ref={reverse_Ref}
                attributeName='points'
                from={polygonPoints.to}
                to={polygonPoints.from}
                dur='500ms'
                begin='indefinite'
                fill='freeze'
            />
        </polygon>
        // debug && (
        //     <text
        //         key={`debug-hex-row-${i}-column-${j}`}
        //         x={hexHalfWidth}
        //         y={hexHalfHeight}
        //         textAnchor='middle'
        //         alignmentBaseline='central'
        //         className='origin-[12.5%_12.5%] translate-x-0 stroke-none text-2xs [--tw-scale-x:--hex-scale-stroked] [--tw-scale-y:--hex-scale-stroked]'
        //         style={cssVariables_Memo}
        //     >
        //         row: {i} col: {j}
        //     </text>
        // ),
    );
};

const LinkHexagon: FC<{
    shapeData: Record<NavigationExpansionState, HexagonData> & HexagonLink;
    setMenuHoverState: React.Dispatch<React.SetStateAction<MenuLinks | null>>;
    newHoverReadyState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    arrayIndex: number;
}> = ({ shapeData, setMenuHoverState, newHoverReadyState, arrayIndex }) => {
    const expansionState = useZustand((store) => store.values.expansionState);

    const localShapeData_Memo = useMemo(() => shapeData[expansionState], [expansionState, shapeData]);

    const { title, target } = shapeData;
    const { position, rotation, scale, offsets } = localShapeData_Memo;
    const [canSetNewHover, setCanSetNewHover] = newHoverReadyState;

    const cssVariables_Memo = useMemo(
        () =>
            ({
                '--tw-translate-x': `${(position.x / totalWidthAtCenter) * 100 + (offsets?.x ?? 0)}%`,
                '--tw-translate-y': `${(position.y / totalHeight) * 100 + (offsets?.y ?? 0)}%`,
                '--tw-rotate': `${rotation}deg`,
                '--hex-scale-stroked': (1 - strokeWidth) * scale,
            }) as CSSProperties,
        [offsets?.x, offsets?.y, position.x, position.y, rotation, scale],
    );

    const keyId = `hex-link-index-${arrayIndex}`;

    return (
        <Link
            key={keyId}
            to={typeof target === 'string' ? `/${target}` : ''}
            className={classNames(
                '[--tw-scale-x:--hex-scale-stroked] [--tw-scale-y:--hex-scale-stroked]',
                'pointer-events-none block origin-[12.5%_12.5%] translate-x-0 stroke-none no-underline drop-shadow-omni-md transition-transform duration-1000',
                `link-class link-class-${title}`,
            )}
            style={cssVariables_Memo}
            onMouseEnter={() => {
                if (canSetNewHover) {
                    expansionState === 'home' && setMenuHoverState(title);
                    setCanSetNewHover(false);

                    const timer = setTimeout(() => {
                        setCanSetNewHover(true);
                        clearTimeout(timer);
                    }, svgTransitionDurationMs + 100);
                }
            }}
            onClick={typeof target === 'function' ? () => target() : undefined}
        >
            <polygon
                points={polygonPoints.from}
                className='peer pointer-events-auto origin-[12.5%_12.5%] fill-theme-primary transition-[fill] [filter:url(#light-inner)] hover-active:scale-110 hover-active:[filter:url(#lighter-inner)]' /* fill-[url(#linearGradient)] */
            />
            <text
                x={hexHalfWidth}
                y={hexHalfHeight}
                textAnchor='middle'
                alignmentBaseline='central'
                className='text pointer-events-none origin-[12.5%_12.5%] select-none fill-theme-secondary text-[40px] font-semibold leading-none tracking-tight peer-hover-active:scale-110 peer-hover-active:fill-theme-secondary-lighter'
                dangerouslySetInnerHTML={{ __html: title }}
            />
        </Link>
    );
};
