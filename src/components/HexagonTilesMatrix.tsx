import { CSSProperties, FC, memo, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from '../lib/classNames';
import { HexagonData, HexagonLink, RouteData, UI_CategoryLink, UIButton } from '../types/types';
import { halfRoundedHexagonPath, buttonHexagons, regularHexagons, roundedHexagonPath, staticValues, cos, sin } from '../lib/hexagonDataMatrix';
import { useZustand } from '../lib/zustand';
import elementGetCurrentRotation from '../lib/elementGetCurrentRotation';
import { CATEGORY, ROUTE } from '../types/enums';
import { config } from '../types/exportTyped';
import { keyDownA11y } from '../lib/handleA11y';

const {
    ui: {
        animation: { menuTransition_Ms },
        hexMenu: { columns, strokeWidth, scaleUp },
    },
} = config;

const HexagonTilesMatrix = () => {
    const menuTransitionStateUpdates = useState<[keyof typeof CATEGORY | null, TransitionTargetReached]>([null, true]);
    const [[menuTransitionTarget, menuTransitionTargetReached], setMenuTransitionStates] = menuTransitionStateUpdates;

    const routeName = useZustand((store) => store.values.routeData.name);

    useEffect(() => {
        if (routeName !== ROUTE.home) {
            setMenuTransitionStates([null, true]);
        }
    }, [routeName, setMenuTransitionStates]);

    const navMenuTransitionClasses_Memo = useMemo(
        () => getHomeMenuTransitionClasses(menuTransitionTarget, menuTransitionTargetReached),
        [menuTransitionTarget, menuTransitionTargetReached],
    );

    const svgRef = useRef<SVGSVGElement | null>(null);

    return (
        <svg
            ref={svgRef}
            className={classNames(
                'pointer-events-none absolute z-10 h-auto w-full overflow-visible transition-transform sm:h-full sm:w-auto',
                routeName === ROUTE.home ? navMenuTransitionClasses_Memo : 'matrix-rotate-90 sm:matrix-rotate-0',
            )}
            viewBox={viewBoxes['hexFlat']}
            style={
                {
                    transitionDuration: `${menuTransition_Ms}ms`,
                } as CSSProperties
            }
            onTransitionEnd={({ target, currentTarget }) => {
                if (target === currentTarget) {
                    // ^^^  condition filters out bubbled child events
                    const elementRotation = elementGetCurrentRotation(currentTarget);
                    if (menuTransitionTarget && navRotationValues[menuTransitionTarget].deg === elementRotation) {
                        // Set transition target as reached:
                        setMenuTransitionStates(([prevTarget, _prevReached]) => [prevTarget, true]);
                    }
                }
            }}
        >
            <HexagonSvgDefs />

            {regularHexagons.map((hexData, idx) => (
                <RegularHexagon shapeData={hexData} routeName={routeName} key={`hex-regular-index-${idx}`} />
            ))}

            {buttonHexagons.map((hexData, idx) => (
                <ButtonHexagon
                    shapeData={hexData}
                    routeName={routeName}
                    menuTransitionStateUpdates={menuTransitionStateUpdates}
                    key={`hex-link-index-${idx}`}
                />
            ))}
        </svg>
    );
};

export default HexagonTilesMatrix;

const HexagonSvgDefs = memo(() => {
    return (
        <defs>
            <path
                id={roundedHexagonPathName}
                d={roundedHexagonPath}
                // TODO set as options in Settings ?
                shapeRendering="geometricPrecision"
                // shapeRendering="crispEdges"
                // shapeRendering="optimizeSpeed"
            />
            <path id={halfRoundedHexagonPathName} d={halfRoundedHexagonPath} />

            <clipPath id={roundedHexagonPathName + '-clipPath'}>
                <use href={'#' + roundedHexagonPathName} />
            </clipPath>
            <clipPath id={halfRoundedHexagonPathName + '-clipPath'}>
                <use href={'#' + halfRoundedHexagonPathName} />
            </clipPath>

            <filter id="lighter-none">
                <feFlood className="[flood-color:theme(colors.theme.primary-lighter/1)]" />
                <feComposite operator="out" in2="SourceGraphic" />
                <feMorphology operator="dilate" radius="0" />
                <feGaussianBlur stdDeviation="0" />
                <feComposite operator="atop" in2="SourceGraphic" />
            </filter>

            <filter id="lighter-inner">
                <feFlood className="[flood-color:theme(colors.theme.primary-lighter/0.5)]" />
                <feComposite operator="out" in2="SourceGraphic" />
                <feMorphology operator="dilate" radius="4" />
                <feGaussianBlur stdDeviation="5" />
                <feComposite operator="atop" in2="SourceGraphic" />
            </filter>

            <linearGradient id="linearGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" className="[stop-color:theme(colors.theme.primary-darker/1)]" />
                <stop offset="50%" className="[stop-color:theme(colors.theme.primary-lighter/0.75)]" />
                <stop offset="100%" className="[stop-color:theme(colors.theme.primary-darker/1)]" />
            </linearGradient>
        </defs>
    );
});

const RegularHexagon: FC<{
    shapeData: Record<RouteData['name'], HexagonData>;
    routeName: RouteData['name'];
}> = memo(({ shapeData, routeName }) => {
    const localShapeData_Memo = useMemo(() => shapeData[routeName], [routeName, shapeData]);
    const { position, rotation, scale, isHalf, isRightSide } = localShapeData_Memo;

    const cssVariables_Memo = useMemo(() => position && calcCSSVariables(position, rotation, scale, isRightSide), [isRightSide, position, rotation, scale]);
    const random_Memo = useMemo(() => Math.random(), []);

    return (
        <use
            href={'#' + (isHalf ? halfRoundedHexagonPathName : roundedHexagonPathName)}
            clipPath={`url(#${isHalf ? halfRoundedHexagonPathName : roundedHexagonPathName}-clipPath)`}
            className={classNames(
                'regular-hexagon-class matrix-transform pointer-events-auto origin-[12.5%_12.5%] transition-[stroke,transform,fill,stroke-width] [--hover-stroke-duration:--ui-animation-menu-transition-duration] hover-active:[--hover-stroke-duration:50ms]',
                routeName === ROUTE.home
                    ? 'fill-theme-primary/25 stroke-theme-primary-lighter/5 hover-active:stroke-theme-primary-lighter/15'
                    : routeName === ROUTE.category
                      ? 'fill-theme-primary/10 stroke-theme-primary-lighter/[0.025] hover-active:stroke-theme-primary-lighter/[0.075]'
                      : /* post */
                        'fill-theme-text-background stroke-theme-text-background',
            )}
            style={
                {
                    ...cssVariables_Memo,
                    strokeWidth: routeName === ROUTE.home ? `${8 / scale}` : routeName === ROUTE.category ? `${4 / scale}` : /* post */ '0',
                    transitionDuration: `var(--hover-stroke-duration), calc(var(--ui-animation-menu-transition-duration) * ${random_Memo + 1})`,
                    transitionDelay: `0ms, calc(var(--ui-animation-menu-transition-duration) * ${random_Memo})`,
                } as CSSProperties
            }
        />
    );
});

const ButtonHexagon: FC<{
    shapeData: Record<RouteData['name'], HexagonData> & HexagonLink;
    routeName: RouteData['name'];
    menuTransitionStateUpdates: [[UI_CategoryLink | null, boolean], React.Dispatch<React.SetStateAction<[UI_CategoryLink | null, boolean]>>];
}> = memo(({ shapeData, routeName, menuTransitionStateUpdates }) => {
    const [[menuTransitionTarget, menuTransitionTargetReached], setMenuTransitionStates] = menuTransitionStateUpdates;

    const localShapeData_Memo = useMemo(() => shapeData[routeName], [routeName, shapeData]);
    const { title, svgIconPath, target } = shapeData;
    const { position, rotation, scale, isRightSide } = localShapeData_Memo;

    const cssVariables_Memo = useMemo(() => position && calcCSSVariables(position, rotation, scale, isRightSide), [isRightSide, position, rotation, scale]);

    const isCategory = title && isCategoryLink(title);
    const isVisible = !cssVariables_Memo['--tw-matrix-scale-x'];

    const random_Memo = useMemo(() => Math.random(), []);

    const navigate = useNavigate();

    function handleClick(ev: React.MouseEvent<SVGGElement>) {
        let targetResult = target;
        if (typeof targetResult !== 'string') {
            targetResult = (target as (ev: React.MouseEvent<SVGGElement>) => void | string)(ev) ?? '';
        }
        navigate(targetResult);
    }

    const handleMouseEnter =
        isCategory && routeName === ROUTE.home && menuTransitionTarget !== title && menuTransitionTargetReached
            ? //  Prevent parent from prematurely rotating again, and again, and again: --------- ^^^
              () => setMenuTransitionStates([title as UI_CategoryLink, false])
            : undefined;

    return (
        <g
            className={classNames(
                '[--button-scale:--tw-matrix-scale-x]',
                'matrix-transform hover:matrix-scale-105 group origin-[12.5%_12.5%] cursor-pointer no-underline transition-[stroke,transform,fill,stroke-width]',
                routeName === ROUTE.home
                    ? 'stroke-theme-primary-lighter/90'
                    : routeName === ROUTE.category
                      ? 'stroke-theme-primary-lighter/80'
                      : 'stroke-theme-text-background',
                `button-hexagon-class button-hexagon-class-${title}`,
            )}
            style={
                {
                    ...cssVariables_Memo,
                    transitionDuration: `calc(var(--ui-animation-menu-transition-duration) * ${random_Memo + 1})`,
                    transitionDelay: `calc(var(--ui-animation-menu-transition-duration) * ${random_Memo})`,
                    strokeWidth:
                        routeName === ROUTE.home
                            ? `${(svgIconPath ? 2 : 4) / scale}`
                            : routeName === ROUTE.category
                              ? `${(svgIconPath ? 2 : 4) / scale}`
                              : /* post */ `${2 / scale}`,
                } as CSSProperties
            }
            role="button"
            tabIndex={isVisible ? -1 : 0}
            onMouseEnter={handleMouseEnter}
            onClick={handleClick}
            onKeyDown={keyDownA11y(handleClick)}
        >
            <use
                href={'#' + roundedHexagonPathName}
                clipPath={`url(#${roundedHexagonPathName}-clipPath)`}
                className="pointer-events-auto fill-theme-primary" // group-hover-active:matrix-scale-105 matrix-transform origin-[12.5%_12.5%] transition-transform
                // paintOrder='stroke'
            />

            {svgIconPath ? (
                <MenuNavButton title={title} svgIconPath={svgIconPath} routeName={routeName} />
            ) : (
                // This is a main menu-category button
                <text
                    x={hexHalfWidth}
                    y={hexHalfHeight}
                    textAnchor="middle"
                    alignmentBaseline="central"
                    className="pointer-events-none select-none fill-theme-secondary-lighter/75 stroke-none font-fjalla-one text-4xl font-semibold transition-[transform,fill] group-hover-active:fill-theme-secondary-lighter sm:origin-[12.5%_12.5%]" // group-hover-active:matrix-scale-105 matrix-rotate-90 sm:matrix-rotate-0
                >
                    {title}
                </text>
            )}
        </g>
    );
});

const MenuNavButton: FC<{
    title?: string;
    svgIconPath: string;
    routeName: RouteData['name'];
}> = ({ title, svgIconPath, routeName }) => {
    return (
        // This is a regular menu button (with an icon by default)
        <foreignObject x="0" y="0" width="100" height="86.66" overflow="visible">
            <div
                className="size-full bg-theme-text-background transition-transform [mask-position:center] [mask-repeat:no-repeat] [mask-size:57.5%] group-hover-active:bg-theme-secondary-lighter"
                style={
                    {
                        // '--tw-rotate': 'calc(var(--svg-mobile-rotate) * -1)',
                        maskImage: `url(${svgIconPath})`,
                    } as CSSProperties
                }
            />
            <span
                className={classNames(
                    'scale-[calc(0.5/var(--button-scale))]', // de-scale menu-text
                    'absolute left-1/2 top-full mt-[7.5%] -translate-x-1/2 transform-gpu font-lato text-3xs uppercase text-theme-text-background/35',
                    routeName === ROUTE.home
                        ? 'text-theme-root-background group-hover-active:text-theme-secondary-lighter'
                        : routeName === ROUTE.category
                          ? 'group-hover-active:text-theme-text-background'
                          : '!text-theme-primary group-hover-active:text-theme-primary',
                )}
            >
                {title}
            </span>
        </foreignObject>
    );
};

// Local Functions

function getHomeMenuTransitionClasses(category: UI_CategoryLink | null, transitionCompleted: boolean) {
    let classNames = 'rotate-0';
    if (category) {
        classNames = homeMenuTransitionClasses[category].base;

        if (transitionCompleted) classNames += ` ${homeMenuTransitionClasses[category].completed}`;
    }
    return classNames;
}

function calcCSSVariables(position: { x: number; y: number }, rotation: number, scale: number, isRightSide: boolean) {
    return {
        '--tw-matrix-e': isRightSide ? `calc(${position.x} + var(--translate-menu-offset))` : position.x,
        '--tw-matrix-f': position.y,

        '--tw-matrix-rotate-cos': cos(rotation, 5),
        '--tw-matrix-rotate-sin': sin(rotation, 5),

        '--tw-matrix-scale-x': (1 - strokeWidth) * scale,
        '--tw-matrix-scale-y': (1 - strokeWidth) * scale,
    };
}

function isCategoryLink(title: UIButton) {
    return title === 'code' || title === '3d' || title === 'log';
}

// Local Values

const roundedHexagonPathName = 'roundedHexagonPath';
const halfRoundedHexagonPathName = 'halfRoundedHexagonPath';

const hexPaddingFactor = staticValues.tilingMultiplierHorizontal.flatTop;
const totalWidthAtCenter = (columns * hexPaddingFactor - (hexPaddingFactor - 1)) * scaleUp;

const totalHeight = totalWidthAtCenter * staticValues.heightAspect.flatTop;
const hexHeight = staticValues.heightAspect.flatTop * scaleUp;
const hexHalfHeight = hexHeight / 2;
const hexHalfWidth = (staticValues.tilingMultiplierVertical.flatTop / 2) * scaleUp;

const navRotationValues: Record<UI_CategoryLink, { deg: number; sin: number; cos: number }> = {
    'code': { deg: 60, sin: sin(60), cos: cos(60) },
    '3d': { deg: -60, sin: sin(-60), cos: cos(-60) },
    'log': { deg: 180, sin: sin(180), cos: cos(180) },
};

const viewBoxes = {
    square: `0 0 ${totalWidthAtCenter} ${totalWidthAtCenter}`,
    hexFlat: `0 0 ${totalWidthAtCenter} ${totalHeight}`,
    hexPointy: `0 0 ${totalHeight} ${totalWidthAtCenter}`,
};

const homeMenuTransitionClasses = {
    'code': {
        base: /* tw */ 'matrix-rotate-[60deg] [&_.button-hexagon-class-code]:!matrix-scale-95 [&_.button-hexagon-class-code]:[filter:url(#lighter-inner-off)] [&_.button-hexagon-class-contact]:!matrix-rotate-[-60deg] [&_.button-hexagon-class-config]:!matrix-rotate-[-60deg] [&_.button-hexagon-class-login]:!matrix-rotate-[-60deg] [&_.button-hexagon-class-contact]:!matrix-translate-x-[150] [&_.button-hexagon-class-contact]:!matrix-translate-y-[120] [&_.button-hexagon-class-config]:!matrix-translate-x-[127.5] [&_.button-hexagon-class-config]:!matrix-translate-y-[132.5] [&_.button-hexagon-class-login]:!matrix-translate-x-[172.5] [&_.button-hexagon-class-login]:!matrix-translate-y-[132.5]',
        completed:
            /* tw */ '[&_.regular-hexagon-class]:has-[.button-hexagon-class-code:hover]:!matrix-scale-90 [&_.regular-hexagon-class]:has-[.button-hexagon-class-code:hover]:!delay-0 [&_.regular-hexagon-class]:has-[.button-hexagon-class-code:hover]:!duration-150 [&_.button-hexagon-class-code]:matrix-scale-90',
    },
    '3d': {
        base: /* tw */ 'matrix-rotate-[-60deg] [&_.button-hexagon-class-3d]:!matrix-scale-95 [&_.button-hexagon-class-3d]:[filter:url(#lighter-inner-off)] [&_.button-hexagon-class-contact]:!matrix-rotate-[60deg] [&_.button-hexagon-class-config]:!matrix-rotate-[60deg] [&_.button-hexagon-class-login]:!matrix-rotate-[60deg] [&_.button-hexagon-class-contact]:!matrix-translate-x-[150] [&_.button-hexagon-class-contact]:!matrix-translate-y-[120] [&_.button-hexagon-class-config]:!matrix-translate-x-[127.5] [&_.button-hexagon-class-config]:!matrix-translate-y-[132.5] [&_.button-hexagon-class-login]:!matrix-translate-x-[172.5] [&_.button-hexagon-class-login]:!matrix-translate-y-[132.5]',
        completed:
            /* tw */ '[&_.regular-hexagon-class]:has-[.button-hexagon-class-3d:hover]:!matrix-scale-90 [&_.regular-hexagon-class]:has-[.button-hexagon-class-3d:hover]:!delay-0 [&_.regular-hexagon-class]:has-[.button-hexagon-class-3d:hover]:!duration-150 [&_.button-hexagon-class-3d]:matrix-scale-90',
    },
    'log': {
        base: /* tw */ 'matrix-rotate-[180deg] [&_.button-hexagon-class-log]:!matrix-scale-95 [&_.button-hexagon-class-log]:[filter:url(#lighter-inner-off)] [&_.button-hexagon-class-contact]:!matrix-rotate-[-180deg] [&_.button-hexagon-class-config]:!matrix-rotate-[-180deg] [&_.button-hexagon-class-login]:!matrix-rotate-[-180deg] [&_.button-hexagon-class-contact]:!matrix-translate-y-[125] [&_.button-hexagon-class-config]:!matrix-translate-x-[172.5] [&_.button-hexagon-class-config]:!matrix-translate-y-[137.5] [&_.button-hexagon-class-login]:!matrix-translate-x-[127.5] [&_.button-hexagon-class-login]:!matrix-translate-y-[137.5]',
        completed:
            /* tw */ '[&_.regular-hexagon-class]:has-[.button-hexagon-class-log:hover]:!matrix-scale-90 [&_.regular-hexagon-class]:has-[.button-hexagon-class-log:hover]:!delay-0 [&_.regular-hexagon-class]:has-[.button-hexagon-class-log:hover]:!duration-150 [&_.button-hexagon-class-log]:matrix-scale-90',
    },
};

// Local Types

type TransitionTargetReached = boolean;
