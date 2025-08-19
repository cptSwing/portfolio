import { CSSProperties, FC, memo, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from '../lib/classNames';
import {
    ButtonName,
    CategoryName,
    HexagonMenuButtonRouteData,
    HexagonNavigationCategoryButtonRouteData,
    HexagonNavigationDefaultButtonRouteData,
    HexagonRouteData,
    RouteData,
} from '../types/types';
import {
    halfRoundedHexagonPath,
    regularHexagons,
    roundedHexagonPath,
    staticValues,
    cos,
    sin,
    navigationButtonHexagons,
    menuButtonHexagons,
    degToRad,
    matrixNearZeroScale,
} from '../lib/hexagonDataMatrix';
import { useZustand } from '../lib/zustand';
import elementGetCurrentRotation from '../lib/elementGetCurrentRotation';
import { CATEGORY, ROUTE } from '../types/enums';
import { config } from '../types/exportTyped';
import { keyDownA11y } from '../lib/handleA11y';
import { BreakpointName } from '../hooks/useBreakPoint';

const {
    ui: {
        animation: { menuTransition_Ms },
        hexMenu: { strokeWidth, scaleUp },
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
            viewBox="0 0 400 346.4"
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

            {regularHexagons.map((hexagonData, idx) => (
                <RegularHexagon shapeData={hexagonData} routeName={routeName} key={`hex-regular-index-${idx}`} />
            ))}

            {navigationButtonHexagons.map((hexagonNavigationButtonData, idx) => (
                <NavigationButtonHexagon
                    shapeData={hexagonNavigationButtonData}
                    routeName={routeName}
                    menuTransitionStateUpdates={menuTransitionStateUpdates}
                    key={`hex-link-index-${idx}`}
                />
            ))}

            {menuButtonHexagons.map((hexagonMenuButtonData, idx) => (
                <MenuButtonHexagon shapeData={hexagonMenuButtonData} routeName={routeName} key={`hex-link-index-${idx}`} />
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
    shapeData: HexagonRouteData;
    routeName: ROUTE;
}> = memo(({ shapeData, routeName }) => {
    const { position, rotation, scale, isHalf, shouldOffset } = shapeData[routeName];
    const breakpoint = useZustand((state) => state.values.breakpoint);

    const cssVariables_Memo = useMemo(
        () => position && calcCSSVariables(position, rotation, scale, { shouldOffset, offset: routeOffsetValues[routeName][breakpoint ?? 'base'] }),
        [position, rotation, scale, shouldOffset, routeName, breakpoint],
    );

    const random_Memo = useMemo(() => Math.random(), []);

    return (
        <use
            href={'#' + (isHalf ? halfRoundedHexagonPathName : roundedHexagonPathName)}
            clipPath={`url(#${isHalf ? halfRoundedHexagonPathName : roundedHexagonPathName}-clipPath)`}
            className={classNames(
                'regular-hexagon-class pointer-events-auto origin-[12.5%_12.5%] transition-[stroke,transform,fill,stroke-width] matrix-transform [--hover-stroke-duration:--ui-animation-menu-transition-duration] hover-active:[--hover-stroke-duration:50ms]',
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

const NavigationButtonHexagon: FC<{
    shapeData: HexagonNavigationDefaultButtonRouteData | HexagonNavigationCategoryButtonRouteData;
    routeName: ROUTE;
    menuTransitionStateUpdates: [[CategoryName | null, boolean], React.Dispatch<React.SetStateAction<[CategoryName | null, boolean]>>];
}> = memo(({ shapeData, routeName, menuTransitionStateUpdates }) => {
    const { title, name, svgIconPath, target } = shapeData;
    const { position, rotation, scale, shouldOffset } = shapeData[routeName];
    const breakpoint = useZustand((state) => state.values.breakpoint);
    const [[menuTransitionTarget, menuTransitionTargetReached], setMenuTransitionStates] = menuTransitionStateUpdates;
    const navigate = useNavigate();

    const random_Memo = useMemo(() => Math.random(), []);

    const cssVariables_Memo = useMemo(
        () => position && calcCSSVariables(position, rotation, scale, { shouldOffset, offset: routeOffsetValues[routeName][breakpoint ?? 'base'] }),
        [position, rotation, scale, shouldOffset, routeName, breakpoint],
    );

    const isVisible = scale > matrixNearZeroScale;

    function handleClick(ev: React.MouseEvent<SVGGElement>) {
        const targetResult = typeof target === 'string' ? target : target(ev);
        navigate(targetResult);
    }

    function handleMouseEnter() {
        if (isCategoryNavigation(name)) {
            if (routeName === ROUTE.home && menuTransitionTargetReached && menuTransitionTarget !== name) {
                setMenuTransitionStates([name as CategoryName, false]);
                // ^^^  Prevent parent from prematurely rotating again, and again, and again
            }
        }
    }

    return (
        <g
            className={classNames(
                '[--button-scale:--tw-matrix-scale-x]',
                'group origin-[12.5%_12.5%] cursor-pointer fill-theme-primary no-underline transition-[stroke,transform,fill,stroke-width] matrix-transform',
                routeName === ROUTE.home
                    ? 'stroke-theme-primary-lighter/90'
                    : routeName === ROUTE.category
                      ? 'stroke-theme-primary-lighter/80'
                      : 'stroke-theme-text-background',
                `navigation-button-hexagon-class-${name}`,
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
                className="pointer-events-auto origin-[12.5%_12.5%] group-hover-active:scale-105"
                // paintOrder='stroke'
            />

            {isCategoryNavigation(name) ? (
                <text
                    x={hexHalfWidth}
                    y={hexHalfHeight}
                    textAnchor="middle"
                    alignmentBaseline="central"
                    className="pointer-events-none origin-[12.5%_12.5%] select-none fill-theme-secondary-lighter/75 stroke-none font-fjalla-one text-4xl font-semibold transition-[transform,fill] group-hover-active:scale-105 group-hover-active:fill-theme-secondary-lighter"
                >
                    {title}
                </text>
            ) : (
                <MenuButtonSvg title={title} svgIconPath={svgIconPath!} routeName={routeName} />
            )}
        </g>
    );
});

const MenuButtonHexagon: FC<{
    shapeData: HexagonMenuButtonRouteData;
    routeName: ROUTE;
}> = memo(({ shapeData, routeName }) => {
    const { name, title, svgIconPath, target } = shapeData;
    const { position, rotation, scale, shouldOffset } = shapeData[routeName];
    const breakpoint = useZustand((state) => state.values.breakpoint);

    const cssVariables_Memo = useMemo(
        () => position && calcCSSVariables(position, rotation, scale, { shouldOffset, offset: routeOffsetValues[routeName][breakpoint ?? 'base'] }),
        [position, rotation, scale, shouldOffset, routeName, breakpoint],
    );
    const random_Memo = useMemo(() => Math.random(), []);
    const isVisible = scale > matrixNearZeroScale;

    function handleClick(ev: React.MouseEvent<SVGGElement>) {
        target(ev);
    }

    return (
        <g
            className={classNames(
                isVisible ? '[--button-scale:--tw-matrix-scale-x]' : '[--button-scale:0]',
                'group origin-[12.5%_12.5%] cursor-pointer fill-theme-primary no-underline transition-[stroke,transform,fill,stroke-width] matrix-transform',
                routeName === ROUTE.home
                    ? 'stroke-theme-primary-lighter/90'
                    : routeName === ROUTE.category
                      ? 'stroke-theme-primary-lighter/80'
                      : 'stroke-theme-text-background',
                `menu-button-hexagon-class-${name}`,
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
            onClick={handleClick}
            onKeyDown={keyDownA11y(handleClick)}
        >
            <use
                href={'#' + roundedHexagonPathName}
                clipPath={`url(#${roundedHexagonPathName}-clipPath)`}
                className="pointer-events-auto origin-[12.5%_12.5%] group-hover-active:scale-105" // group-hover-active:matrix-scale-105 matrix- transition-transform
            />

            <MenuButtonSvg title={title} svgIconPath={svgIconPath} routeName={routeName} />
        </g>
    );
});

const MenuButtonSvg: FC<{
    title?: string;
    svgIconPath: string;
    routeName: RouteData['name'];
}> = ({ title, svgIconPath, routeName }) => {
    return (
        <foreignObject
            x="0"
            y="0"
            width="100"
            height="86.66"
            overflow="visible"
            className="relative flex origin-[12.5%_12.5%] flex-col items-center justify-start group-hover-active:scale-105"
        >
            <div
                className="z-50 size-full bg-theme-text-background [mask-position:center] [mask-repeat:no-repeat] [mask-size:57.5%] group-hover-active:bg-theme-secondary-lighter"
                style={
                    {
                        maskImage: `url(${svgIconPath})`,
                    } as CSSProperties
                }
            />

            <span
                className={classNames(
                    'scale-[calc(0.5/var(--button-scale))]', // de-scale menu-text
                    // 'before:absolute before:left-[-5%] before:top-[-2.5%] before:-z-10 before:block before:h-[105%] before:w-[110%] before:bg-theme-text-background',
                    'mx-auto mt-[5%] w-fit text-right font-lato text-3xs uppercase text-theme-text-background/35',
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

function getHomeMenuTransitionClasses(category: CategoryName | null, transitionCompleted: boolean) {
    let classNames = 'rotate-0';
    if (category) {
        classNames = homeMenuTransitionClasses[category].base;

        if (transitionCompleted) classNames += ` ${homeMenuTransitionClasses[category].completed}`;
    }
    return classNames;
}

function calcCSSVariables(
    translate: { x: number; y: number },
    rotation: number,
    scale: number,
    options?: { shouldOffset?: boolean; offset?: number; clampTo?: number },
) {
    const { shouldOffset, offset, clampTo: _clampTo } = options ?? {};
    return {
        '--tw-matrix-e': shouldOffset && offset ? translate.x + offset : translate.x,
        '--tw-matrix-f': translate.y,
        '--tw-matrix-rotate-cos': cos(rotation, 5),
        '--tw-matrix-rotate-sin': sin(rotation, 5),
        '--tw-matrix-scale-x': (1 - strokeWidth) * scale,
        '--tw-matrix-scale-y': (1 - strokeWidth) * scale,
    };
}

function _toSvgTransform(
    translate?: { x: number; y: number },
    rotate_DEG?: number,
    scale?: { x: number; y: number },
    options?: { shouldOffset?: boolean; offset?: number; clampTo?: number },
) {
    const { shouldOffset, offset, clampTo: _clampTo } = options ?? {};

    const translation = translate ? `translate(${shouldOffset && offset ? translate.x + offset : translate.x} ${translate.y}) ` : '';
    const rotation = rotate_DEG ? `rotate(${rotate_DEG}) ` : '';
    const scaling = scale ? `scale(${scale.x}, ${scale.y}) ` : '';

    return translation + rotation + scaling;
}

function _toSvgTransformMatrix(
    translate = { x: 0, y: 0 },
    rotate_DEG = 0,
    scale = { x: 1, y: 1 },
    options?: { shouldOffset?: boolean; offset?: number; clampTo?: number },
) {
    const { shouldOffset, offset, clampTo } = options ?? {};

    const angle = degToRad(rotate_DEG); // Convert to radians
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // Apply scale and rotation
    const a = scale.x * cos;
    const b = scale.x * sin;
    const c = -scale.y * sin;
    const d = scale.y * cos;
    const e = shouldOffset && offset ? translate.x + offset : translate.x;
    const f = translate.y;

    return `matrix(${a.toFixed(clampTo ?? 6)} ${b.toFixed(clampTo ?? 6)} ${c.toFixed(clampTo ?? 6)} ${d.toFixed(clampTo ?? 6)} ${e.toFixed(clampTo ?? 6)} ${f.toFixed(clampTo ?? 6)})`;
}

function isCategoryNavigation(name: ButtonName): name is CategoryName {
    return Object.keys(CATEGORY).includes(name);
}

// Local Values

const roundedHexagonPathName = 'roundedHexagonPath';
const halfRoundedHexagonPathName = 'halfRoundedHexagonPath';

const hexHeight = staticValues.heightAspect.flatTop * scaleUp;
const hexHalfHeight = hexHeight / 2;
const hexHalfWidth = (staticValues.tilingMultiplierVertical.flatTop / 2) * scaleUp;

const navRotationValues: Record<CategoryName, { deg: number; sin: number; cos: number }> = {
    'code': { deg: 60, sin: sin(60), cos: cos(60) },
    '3d': { deg: -60, sin: sin(-60), cos: cos(-60) },
    'log': { deg: 180, sin: sin(180), cos: cos(180) },
};

const routeOffsetValues: Record<ROUTE, Record<BreakpointName | 'base', number>> = {
    [ROUTE.home]: { 'base': 0, 'sm': 0, 'md': 0, 'lg': 0, 'xl': 0, '2xl': 0 },
    [ROUTE.category]: { 'base': 0, 'sm': 0, 'md': 0, 'lg': 0, 'xl': 0, '2xl': 67.5 },
    [ROUTE.post]: { 'base': 0, 'sm': 0, 'md': 0, 'lg': 0, 'xl': 0, '2xl': 63 },
};

const homeMenuTransitionClasses = {
    'code': {
        base: /* tw */ 'matrix-rotate-[60deg] [&_.navigation-button-hexagon-class-code]:!matrix-scale-95 [&_.navigation-button-hexagon-class-code]:[filter:url(#lighter-inner-off)] [&_.menu-button-hexagon-class-contact]:!matrix-rotate-[-60deg] [&_.menu-button-hexagon-class-config]:!matrix-rotate-[-60deg] [&_.menu-button-hexagon-class-login]:!matrix-rotate-[-60deg] [&_.menu-button-hexagon-class-contact]:!matrix-translate-x-[154] [&_.menu-button-hexagon-class-contact]:!matrix-translate-y-[131] [&_.menu-button-hexagon-class-config]:!matrix-translate-x-[132] [&_.menu-button-hexagon-class-config]:!matrix-translate-y-[144] [&_.menu-button-hexagon-class-login]:!matrix-translate-x-[154.5] [&_.menu-button-hexagon-class-login]:!matrix-translate-y-[105.5]',
        completed:
            /* tw */ '[&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-code:hover]:!matrix-scale-90 [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-code:hover]:!delay-0 [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-code:hover]:!duration-150 [&_.navigation-button-hexagon-class-code]:matrix-scale-90',
    },
    '3d': {
        base: /* tw */ 'matrix-rotate-[-60deg] [&_.navigation-button-hexagon-class-3d]:!matrix-scale-95 [&_.navigation-button-hexagon-class-3d]:[filter:url(#lighter-inner-off)] [&_.menu-button-hexagon-class-contact]:!matrix-rotate-[60deg] [&_.menu-button-hexagon-class-config]:!matrix-rotate-[60deg] [&_.menu-button-hexagon-class-login]:!matrix-rotate-[60deg] [&_.menu-button-hexagon-class-contact]:!matrix-translate-x-[147] [&_.menu-button-hexagon-class-contact]:!matrix-translate-y-[134] [&_.menu-button-hexagon-class-config]:!matrix-translate-x-[146.5] [&_.menu-button-hexagon-class-config]:!matrix-translate-y-[108.5] [&_.menu-button-hexagon-class-login]:!matrix-translate-x-[169] [&_.menu-button-hexagon-class-login]:!matrix-translate-y-[147.5]',
        completed:
            /* tw */ '[&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-3d:hover]:!matrix-scale-95 [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-3d:hover]:!delay-0 [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-3d:hover]:!duration-150 [&_.navigation-button-hexagon-class-3d]:matrix-scale-90',
    },
    'log': {
        base: /* tw */ 'matrix-rotate-[180deg] [&_.navigation-button-hexagon-class-log]:!matrix-scale-95 [&_.navigation-button-hexagon-class-log]:[filter:url(#lighter-inner-off)] [&_.menu-button-hexagon-class-contact]:!matrix-rotate-[-180deg] [&_.menu-button-hexagon-class-config]:!matrix-rotate-[-180deg] [&_.menu-button-hexagon-class-login]:!matrix-rotate-[-180deg] [&_.menu-button-hexagon-class-contact]:!matrix-translate-y-[125] [&_.menu-button-hexagon-class-config]:!matrix-translate-x-[172.5] [&_.menu-button-hexagon-class-config]:!matrix-translate-y-[137.5] [&_.menu-button-hexagon-class-login]:!matrix-translate-x-[127.5] [&_.menu-button-hexagon-class-login]:!matrix-translate-y-[137.5]',
        completed:
            /* tw */ '[&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-log:hover]:!matrix-scale-90 [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-log:hover]:!delay-0 [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-log:hover]:!duration-150 [&_.navigation-button-hexagon-class-log]:matrix-scale-90',
    },
};

// Local Types

type TransitionTargetReached = boolean;
