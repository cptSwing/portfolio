import { CSSProperties, FC, Fragment, useMemo, useRef, useState } from 'react';
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

const AnimatedHexagon: FC<{
    shapeData: Record<NavigationExpansionState, HexagonData>;
    expansionState: NavigationExpansionState;
    arrayIndex: number;
}> = ({ shapeData, expansionState, arrayIndex }) => {
    const localShapeData_Memo = useMemo(() => shapeData[expansionState], [expansionState, shapeData]);
    const { position, rotation, scale, isHalf, offsets } = localShapeData_Memo;
    const cssVariables_Memo = useMemo(() => calcCSSVariables(position, rotation, scale, offsets), [offsets, position, rotation, scale]);
    const path_Memo = useMemo(() => (isHalf ? halfRoundedHexagonPath : roundedHexagonPath), [isHalf]);

    const keyId = `hex-index-${arrayIndex}`;

    return (
        <Fragment key={keyId}>
            <clipPath id={`${keyId}-clip`}>
                <path d={path_Memo} className='transition-[d]' style={{ transitionDuration: `${svgTransitionDurationMs}ms` }} />
            </clipPath>

            <path
                id={keyId}
                d={path_Memo}
                className={classNames(
                    'left-class pointer-events-auto origin-[12.5%_12.5%] translate-x-0 transition-[fill,transform,stroke,stroke-width,d] delay-75 [--tw-scale-x:--hex-scale-stroked] [--tw-scale-y:--hex-scale-stroked]',
                    expansionState === 'home'
                        ? 'fill-theme-primary/50 stroke-theme-primary-lighter/25 hover-active:fill-theme-primary/55 hover-active:stroke-theme-primary-lighter/20'
                        : expansionState === 'category'
                          ? 'fill-theme-primary/95 stroke-theme-primary-lighter/50 hover-active:fill-theme-primary hover-active:stroke-theme-primary-lighter/45'
                          : /* post */
                            'fill-theme-text-background stroke-theme-text-background',
                )}
                style={{
                    ...cssVariables_Memo,
                    transitionDuration: `50ms, ${svgTransitionDurationMs}ms`,
                }}
                strokeWidth={expansionState === 'home' ? `${8 / scale}` : expansionState === 'category' ? `${4 / scale}` : /* post */ '50'}
                clipPath={`url(#${keyId}-clip)`}
            />
        </Fragment>
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
            <path
                d={roundedHexagonPath}
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

/* Local Values */

const nonLinkHexes: Record<NavigationExpansionState, HexagonData>[] = [];
const linkHexes: (Record<NavigationExpansionState, HexagonData> & HexagonLink)[] = [];

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

const roundedHexagonPath = getHexagonPathData(hexHalfWidth, 5);
const halfRoundedHexagonPath = getHexagonPathData(hexHalfWidth, 5, true);

/* Local functions */

function getHexagonPathData(sideLength = 1, cornerRadius = 8, isHalf = false) {
    const points: { x: number; y: number }[] = [];
    const moveZeroPoint = 180;
    const centerX = sideLength;
    const centerY = sideLength * staticValues.heightAspectRatio.flatTop;

    for (let i = 0; i < 6; i++) {
        const angle_deg = 60 * i + moveZeroPoint;
        const x = centerX + sideLength * cos(angle_deg);
        const y = centerY + sideLength * sin(angle_deg);
        points.push({ x, y });
    }

    const cornerSinOffset = cornerRadius * sin(30);
    const cornerCosOffset = cornerRadius * cos(30);

    return isHalf
        ? `
        M ${points[0].x + cornerSinOffset},${points[0].y + cornerCosOffset}
        Q ${points[0].x},${points[0].y} ${points[0].x + cornerSinOffset * 2},${points[0].y}

        L ${points[1].x + cornerSinOffset},${points[0].y}
        Q ${points[1].x},${points[0].y} ${points[1].x + cornerSinOffset * 2},${points[0].y}
        

        L ${points[2].x - cornerSinOffset * 2},${points[3].y}
        Q ${points[2].x},${points[3].y} ${points[2].x + cornerSinOffset},${points[3].y}
        

        L ${points[3].x - cornerSinOffset * 2},${points[3].y}
        Q ${points[3].x},${points[0].y} ${points[3].x - cornerSinOffset},${points[3].y + cornerCosOffset}
        
        
        L ${points[4].x + cornerSinOffset},${points[4].y - cornerCosOffset}
        Q ${points[4].x},${points[4].y} ${points[4].x - cornerSinOffset * 2},${points[4].y}
        
        
        L ${points[5].x + cornerSinOffset * 2},${points[5].y}
        Q ${points[5].x},${points[5].y} ${points[5].x - cornerSinOffset},${points[5].y - cornerCosOffset}
        
        Z
      `
        : `
        M ${points[0].x + cornerSinOffset},${points[0].y + cornerCosOffset}
        Q ${points[0].x},${points[0].y} ${points[0].x + cornerSinOffset},${points[0].y - cornerCosOffset}

        L ${points[1].x - cornerSinOffset},${points[1].y + cornerCosOffset}
        Q ${points[1].x},${points[1].y} ${points[1].x + cornerSinOffset * 2},${points[1].y}
        

        L ${points[2].x - cornerSinOffset * 2},${points[2].y}
        Q ${points[2].x},${points[2].y} ${points[2].x + cornerSinOffset},${points[2].y + cornerCosOffset}
        

        L ${points[3].x - cornerSinOffset},${points[3].y - cornerCosOffset}
        Q ${points[3].x},${points[3].y} ${points[3].x - cornerSinOffset},${points[3].y + cornerCosOffset}
        
        
        L ${points[4].x + cornerSinOffset},${points[4].y - cornerCosOffset}
        Q ${points[4].x},${points[4].y} ${points[4].x - cornerSinOffset * 2},${points[4].y}
        
        
        L ${points[5].x + cornerSinOffset * 2},${points[5].y}
        Q ${points[5].x},${points[5].y} ${points[5].x - cornerSinOffset},${points[5].y - cornerCosOffset}
        
        Z
      `;

    function degToRad(deg: number) {
        return (Math.PI / 180) * deg;
    }
    function sin(deg: number) {
        return Math.sin(degToRad(deg));
    }
    function cos(deg: number) {
        return Math.cos(degToRad(deg));
    }
}
