import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from '../lib/classNames';
import configJSON from '../config/config.json';
import { HexagonData, HexagonLink, MenuLinks, NavigationExpansionState } from '../types/types';
import hexShape, { staticValues } from '../config/hexagonData';
import { useZustand } from '../lib/zustand';
import useWillChange, { useWillChangeHandler } from '../hooks/useWillChange';

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
    const expansionState = useZustand((store) => store.values.expansionState);

    const [menuHoverState, setMenuHoverState] = useState<MenuLinks | null>(null);
    const canSetNewHoverState_Ref = useRef(true); // Prevent prematurely rotating again, and again, and again

    return (
        <svg
            className={classNames(
                'pointer-events-none absolute top-[--flat-hex-margin-top] z-10 size-full overflow-visible transition-transform delay-100',
                // '[&_.left-class]:has-[.class-code:hover,.class-3d:hover,.class-log:hover]:pointer-events-none [&_.left-class]:has-[.left-class:hover]:scale-[0.85] [&_.left-class]:has-[.right:hover]:scale-95',
                // '[&_.right]:has-[.class-code:hover,.class-3d:hover,.class-log:hover]:pointer-events-none [&_.right]:has-[.left-class:hover]:scale-95 [&_.right]:has-[.right:hover]:scale-[0.85]',
                expansionState === 'home'
                    ? menuHoverState === 'code'
                        ? 'rotate-[60deg]'
                        : menuHoverState === '3d'
                          ? 'rotate-[-60deg]'
                          : menuHoverState === 'log'
                            ? 'rotate-[180deg]'
                            : 'rotate-0'
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
                <AnimatedHexagon shapeData={hexData} expansionState={expansionState} arrayIndex={idx} />
            ))}

            {linkHexes.map((hexData, idx) => (
                <LinkHexagon
                    shapeData={hexData}
                    expansionState={expansionState}
                    setMenuHoverState={setMenuHoverState}
                    canSetNewHoverState={canSetNewHoverState_Ref}
                    arrayIndex={idx}
                />
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

const AnimatedHexagon: FC<{
    shapeData: Record<NavigationExpansionState, HexagonData>;
    expansionState: NavigationExpansionState;
    arrayIndex: number;
}> = ({ shapeData, expansionState, arrayIndex }) => {
    const keyId = `hex-index-${arrayIndex}`;

    const localShapeData_Memo = useMemo(() => shapeData[expansionState], [expansionState, shapeData]);
    const { position, rotation, scale, isHalf, offsets } = localShapeData_Memo;
    const cssVariables_Memo = useMemo(() => calcCSSVariables(position, rotation, scale, offsets), [offsets, position, rotation, scale]);

    const animPoly_Ref = useRef<SVGAnimateElement | null>(null);
    const animClip_Ref = useRef<SVGAnimateElement | null>(null);

    const [wasHalved, setWasHalved] = useState(false);
    useEffect(() => {
        if (expansionState !== 'post') {
            if (isHalf) {
                animPoly_Ref.current?.beginElement();
                animClip_Ref.current?.beginElement();
                setWasHalved(true);
            } else if (wasHalved) {
                animPoly_Ref.current?.beginElement();
                animClip_Ref.current?.beginElement();
                setWasHalved(false);
            }
        }
    }, [isHalf, wasHalved, expansionState]);

    return (
        <>
            <clipPath id={`${keyId}-clip`}>
                <polygon id={`${keyId}-clip-polygon`} points={polygonPoints.from}>
                    <animate
                        ref={animClip_Ref}
                        attributeName='points'
                        from={wasHalved ? polygonPoints.from : polygonPoints.to}
                        to={wasHalved ? polygonPoints.to : polygonPoints.from}
                        dur={`${svgTransitionDurationMs}ms`}
                        begin='indefinite'
                        fill='freeze'
                    />
                </polygon>
            </clipPath>

            <polygon
                id={keyId}
                key={keyId}
                points={polygonPoints.from}
                className={classNames(
                    'left-class pointer-events-auto origin-[12.5%_12.5%] translate-x-0 transition-[fill,transform,stroke,stroke-width] [--tw-scale-x:--hex-scale-stroked] [--tw-scale-y:--hex-scale-stroked]',
                    expansionState === 'home'
                        ? 'fill-theme-primary/50 stroke-theme-text-background/25 hover-active:fill-theme-primary/55'
                        : expansionState === 'category'
                          ? 'fill-theme-primary stroke-theme-text-background/25 hover-active:fill-theme-primary/95'
                          : /* post */
                            'fill-theme-text-background stroke-theme-text-background/100',
                )}
                style={{ ...cssVariables_Memo, transitionDuration: `100ms, ${svgTransitionDurationMs}ms` }}
                strokeWidth={expansionState === 'home' ? `${8 / scale}` : expansionState === 'category' ? `${4 / scale}` : /* post */ '50'}
                clipPath={`url(#${keyId}-clip)`}
            >
                <animate
                    ref={animPoly_Ref}
                    attributeName='points'
                    from={wasHalved ? polygonPoints.from : polygonPoints.to}
                    to={wasHalved ? polygonPoints.to : polygonPoints.from}
                    dur={`${svgTransitionDurationMs}ms`}
                    begin='indefinite'
                    fill='freeze'
                />
            </polygon>
        </>
    );
};

const LinkHexagon: FC<{
    shapeData: Record<NavigationExpansionState, HexagonData> & HexagonLink;
    expansionState: NavigationExpansionState;
    setMenuHoverState: React.Dispatch<React.SetStateAction<MenuLinks | null>>;
    canSetNewHoverState: React.MutableRefObject<boolean>;
    arrayIndex: number;
}> = ({ shapeData, expansionState, setMenuHoverState, canSetNewHoverState, arrayIndex }) => {
    const localShapeData_Memo = useMemo(() => shapeData[expansionState], [expansionState, shapeData]);

    const { title, target } = shapeData;
    const { position, rotation, scale, offsets } = localShapeData_Memo;

    const cssVariables_Memo = useMemo(() => calcCSSVariables(position, rotation, scale, offsets), [offsets, position, rotation, scale]);

    const linkRef = useRef<HTMLAnchorElement | null>(null);

    /* Playing around with 'will-change' assigning */
    const [isClicked, setIsClicked] = useState(false);
    useWillChange(linkRef, ['transform'], isClicked, 100, () => setIsClicked(false));
    const withWillChange = useWillChangeHandler(linkRef, ['transform'], 500);

    return (
        <Link
            key={`hex-link-${title}-index-${arrayIndex}`}
            id={`hex-link-${title}-index-${arrayIndex}`}
            ref={linkRef}
            /* Overridden by `onClick` if a function is supplied in `target`: */
            to={typeof target === 'string' ? `/${target}` : ''}
            onClick={typeof target === 'function' ? () => target() : withWillChange()}
            onMouseEnter={
                expansionState === 'home'
                    ? () => {
                          if (canSetNewHoverState.current) {
                              canSetNewHoverState.current = false;
                              setMenuHoverState(title);
                              const timer = setTimeout(() => {
                                  canSetNewHoverState.current = true;
                                  clearTimeout(timer);
                              }, svgTransitionDurationMs + 100);
                          }
                      }
                    : undefined
            }
            style={cssVariables_Memo}
            className={classNames(
                '[--tw-scale-x:--hex-scale-stroked] [--tw-scale-y:--hex-scale-stroked]',
                'pointer-events-none block origin-[12.5%_12.5%] translate-x-0 stroke-none no-underline drop-shadow-omni-md transition-transform duration-700',
                `link-class link-class-${title}`,
            )}
        >
            <polygon
                points={polygonPoints.from}
                className='peer pointer-events-auto origin-[12.5%_12.5%] fill-theme-primary transition-[transform,fill,filter] duration-300 [filter:url(#light-inner)] hover-active:scale-110 hover-active:[filter:url(#lighter-inner)]' /* fill-[url(#linearGradient)] */
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

/* Local functions */

const calcCSSVariables = (
    position: { x: number; y: number },
    rotation: number,
    scale: number,
    offsets?: {
        x: number;
        y: number;
    },
) =>
    ({
        '--tw-translate-x': `${(position.x / totalWidthAtCenter) * 100 + (offsets?.x ?? 0)}%`,
        '--tw-translate-y': `${(position.y / totalHeight) * 100 + (offsets?.y ?? 0)}%`,
        '--tw-rotate': `${rotation}deg`,
        '--hex-scale-stroked': (1 - strokeWidth) * scale,
    }) as CSSProperties;
