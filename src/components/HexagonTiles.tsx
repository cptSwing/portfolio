import { CSSProperties, FC, memo, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from 'cpts-javascript-utilities';
import {
    ButtonName,
    CategoryName,
    HexagonMenuButtonRouteData,
    HexagonNavigationCategoryButtonRouteData,
    HexagonNavigationDefaultButtonRouteData,
    HexagonRouteData,
} from '../types/types';
import { regularHexagons, navigationButtonHexagons, menuButtonHexagons, degToRad, matrixNearZeroScale } from '../lib/hexagonDataMatrix';
import { useZustand } from '../lib/zustand';
import { getCurrentElementRotation } from 'cpts-javascript-utilities';
import { CATEGORY, ROUTE } from '../types/enums';
import { config } from '../types/exportTyped';
import { keyDownA11y } from 'cpts-javascript-utilities';
import { BreakpointName } from '../hooks/useBreakPoint';
import GetChildSizeContext from '../contexts/GetChildSizeContext';

const {
    ui: {
        animation: { menuTransition_Ms },
        hexMenu: { strokeWidth },
    },
} = config;

const viewBoxWidth = 400;
const viewBoxHeight = 346.4;

const HexagonTiles = () => {
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

    return (
        <div
            className={classNames(
                'pointer-events-none absolute size-full overflow-visible transition-transform',
                routeName === ROUTE.home ? navMenuTransitionClasses_Memo : 'rotate-90 sm:rotate-0',
            )}
            style={
                {
                    '--hexagon-clip-path': `url(#${roundedHexagonPathName}-clipPath)`,
                    '--half-hexagon-clip-path': `url(#${halfRoundedHexagonPathName}-clipPath)`,
                    'transitionDuration': `${menuTransition_Ms}ms`,
                } as CSSProperties
            }
            onTransitionEnd={({ target, currentTarget }) => {
                if (target === currentTarget) {
                    // ^^^  condition filters out bubbled child events
                    const elementRotation = getCurrentElementRotation(currentTarget);
                    if (menuTransitionTarget && navRotationValues[menuTransitionTarget].deg === elementRotation) {
                        // Set transition target as reached:
                        setMenuTransitionStates(([prevTarget, _prevReached]) => [prevTarget, true]);
                    }
                }
            }}
        >
            {regularHexagons.map((hexagonData, idx) => (
                <RegularHexagonDiv shapeData={hexagonData} routeName={routeName} key={`hex-regular-index-${idx}`} />
            ))}

            {navigationButtonHexagons.map((hexagonNavigationButtonData, idx) => (
                <NavigationButtonHexagonDiv
                    shapeData={hexagonNavigationButtonData}
                    routeName={routeName}
                    menuTransitionStateUpdates={menuTransitionStateUpdates}
                    key={`hex-link-index-${idx}`}
                />
            ))}

            {menuButtonHexagons.map((hexagonMenuButtonData, idx) => (
                <MenuButtonHexagonDiv shapeData={hexagonMenuButtonData} routeName={routeName} key={`hex-link-index-${idx}`} />
            ))}
        </div>
    );
};

export default HexagonTiles;

const RegularHexagonDiv: FC<{
    shapeData: HexagonRouteData;
    routeName: ROUTE;
}> = memo(({ shapeData, routeName }) => {
    const { position, rotation, scale, isHalf, shouldOffset } = shapeData[routeName];
    const breakpoint = useZustand((state) => state.values.breakpoint);
    const parentSize = useContext(GetChildSizeContext);

    const cssVariables_Memo = useMemo(
        () => calcCSSVariablesGlass(position, rotation, scale, parentSize, { shouldOffset, offset: routeOffsetValues[routeName][breakpoint ?? 'base'] }),
        [position, rotation, scale, parentSize, shouldOffset, routeName, breakpoint],
    );

    const random_Memo = useMemo(() => Math.random(), []);

    return (
        <div
            className={classNames(
                'regular-hexagon-class pointer-events-auto absolute aspect-hex-flat w-[100px] origin-center transform backdrop-blur-[3px] backdrop-saturate-150 transition-[transform,filter]',
                isHalf ? '[clip-path:--half-hexagon-clip-path]' : '[clip-path:--hexagon-clip-path]',
                routeName === ROUTE.post ? 'backdrop-blur-none backdrop-saturate-100' : 'backdrop-blur-[3px] backdrop-saturate-150',
            )}
            style={
                {
                    ...cssVariables_Memo,
                    transitionDuration: `calc(var(--ui-animation-menu-transition-duration) * ${random_Memo + 1})`,
                    transitionDelay: `calc(var(--ui-animation-menu-transition-duration) * ${random_Memo})`,
                } as CSSProperties
            }
        >
            <div
                className={classNames(
                    'relative size-full transition-[filter] before:absolute before:left-0 before:top-0 before:-z-10 before:size-full before:transition-[background-color] before:duration-1000',
                    isHalf ? 'before:[clip-path:--half-hexagon-clip-path]' : 'before:[clip-path:--hexagon-clip-path]',
                    routeName === ROUTE.post
                        ? 'filter-none before:bg-theme-text-background'
                        : '[filter:url(#svg-hexagon-regular)] before:bg-theme-root-background',
                )}
            />
        </div>
    );
});

const NavigationButtonHexagonDiv: FC<{
    shapeData: HexagonNavigationDefaultButtonRouteData | HexagonNavigationCategoryButtonRouteData;
    routeName: ROUTE;
    menuTransitionStateUpdates: [[CategoryName | null, boolean], React.Dispatch<React.SetStateAction<[CategoryName | null, boolean]>>];
}> = memo(({ shapeData, routeName, menuTransitionStateUpdates }) => {
    const { title, name, svgIconPath, target } = shapeData;
    const { position, rotation, scale, shouldOffset } = shapeData[routeName];
    const breakpoint = useZustand((state) => state.values.breakpoint);
    const [[menuTransitionTarget, menuTransitionTargetReached], setMenuTransitionStates] = menuTransitionStateUpdates;
    const parentSize = useContext(GetChildSizeContext);
    const navigate = useNavigate();

    const random_Memo = useMemo(() => Math.random(), []);

    const cssVariables_Memo = useMemo(
        () => calcCSSVariablesGlass(position, rotation, scale, parentSize, { shouldOffset, offset: routeOffsetValues[routeName][breakpoint ?? 'base'] }),
        [position, rotation, scale, parentSize, shouldOffset, routeName, breakpoint],
    );

    const isVisible = scale > matrixNearZeroScale;

    function handleClick(ev: React.MouseEvent<HTMLDivElement>) {
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
        <>
            <div
                className={classNames(
                    '[--button-scale:--tw-matrix-scale-x]',
                    'group pointer-events-auto absolute aspect-hex-flat w-[100px] origin-center transform transition-[transform,--hexagon-blur-color-menu] [clip-path:--hexagon-clip-path] hover-active:!scale-[calc(var(--scale-property)*1.1)] hover-active:!delay-0 hover-active:!duration-500 hover-active:![--hexagon-blur-color-menu:red]',
                    `navigation-button-hexagon-class-${name}`,
                )}
                style={
                    {
                        ...cssVariables_Memo,
                        transitionDuration: `calc(var(--ui-animation-menu-transition-duration) * ${random_Memo + 1})`,
                        transitionDelay: `calc(var(--ui-animation-menu-transition-duration) * ${random_Memo})`,
                    } as CSSProperties
                }
                role="button"
                tabIndex={isVisible ? -1 : 0}
                onMouseEnter={handleMouseEnter}
                onClick={handleClick}
                onKeyDown={keyDownA11y(handleClick)}
            >
                <svg width="0" height="0">
                    <defs>
                        <filter id={`svg-hexagon-menu-${name}`}>
                            <feFlood floodColor="var(--hexagon-fill-color-menu)" result="fill-flood" />

                            <feFlood floodColor="var(--hexagon-blur-color-menu)" result="blur-flood" />
                            <feComposite operator="out" in="blur-flood" in2="SourceAlpha" result="blur-composite" />
                            <feMorphology operator="dilate" in="blur-composite" radius="2" result="blur-dilate" />
                            <feGaussianBlur in="blur-dilate" stdDeviation="5" result="blur-gaussian" />

                            <feFlood floodColor="var(--hexagon-stroke-color-menu)" result="stroke-flood" />
                            <feComposite operator="out" in="stroke-flood" in2="SourceAlpha" result="stroke-composite" />
                            <feMorphology operator="dilate" in="stroke-composite" radius="1" result="stroke-dilate" />

                            <feMerge>
                                <feMergeNode in="fill-flood" />
                                <feMergeNode in="blur-gaussian" />
                                <feMergeNode in="stroke-dilate" />
                            </feMerge>
                        </filter>
                    </defs>
                </svg>

                <div
                    className={classNames(
                        'relative size-full [filter:url(#svg-hexagon-menu)] before:absolute before:left-0 before:top-0 before:-z-10 before:size-full before:bg-black before:[clip-path:--hexagon-clip-path]',
                    )}
                    style={{ filter: `url(#svg-hexagon-menu-${name})` }}
                />

                {isCategoryNavigation(name) ? (
                    <div className="absolute left-0 top-0 flex size-full select-none items-center justify-center font-fjalla-one text-4xl font-semibold text-theme-secondary-lighter/75 group-hover-active:scale-105 group-hover-active:fill-theme-secondary-lighter">
                        {title}
                    </div>
                ) : (
                    <MenuButtonSvg title={title} svgIconPath={svgIconPath!} />
                )}
            </div>
        </>
    );
});

const MenuButtonHexagonDiv: FC<{
    shapeData: HexagonMenuButtonRouteData;
    routeName: ROUTE;
}> = memo(({ shapeData, routeName }) => {
    const { name, title, svgIconPath, target } = shapeData;
    const { position, rotation, scale, shouldOffset } = shapeData[routeName];
    const parentSize = useContext(GetChildSizeContext);

    const breakpoint = useZustand((state) => state.values.breakpoint);

    const cssVariables_Memo = useMemo(
        () => calcCSSVariablesGlass(position, rotation, scale, parentSize, { shouldOffset, offset: routeOffsetValues[routeName][breakpoint ?? 'base'] }),
        [position, rotation, scale, parentSize, shouldOffset, routeName, breakpoint],
    );
    const random_Memo = useMemo(() => Math.random(), []);
    const isVisible = scale > 0;

    function handleClick(ev: React.MouseEvent<HTMLDivElement>) {
        target(ev);
    }

    return (
        <div
            className={classNames(
                isVisible ? '[--button-scale:--tw-matrix-scale-x]' : '[--button-scale:0]',
                'group pointer-events-auto absolute aspect-hex-flat w-[100px] origin-center transform backdrop-blur-[3px] backdrop-saturate-150 transition-transform [clip-path:--hexagon-clip-path] hover-active:!scale-[calc(var(--scale-property)*1.1)]',
                `menu-button-hexagon-class-${name}`,
            )}
            style={
                {
                    ...cssVariables_Memo,
                    transitionDuration: `calc(var(--ui-animation-menu-transition-duration) * ${random_Memo + 1})`,
                    transitionDelay: `calc(var(--ui-animation-menu-transition-duration) * ${random_Memo})`,
                } as CSSProperties
            }
            role="button"
            tabIndex={isVisible ? -1 : 0}
            onClick={handleClick}
            onKeyDown={keyDownA11y(handleClick)}
        >
            <div
                className={classNames(
                    'relative size-full [filter:url(#svg-hexagon-menu)] before:absolute before:left-0 before:top-0 before:-z-10 before:size-full before:bg-black before:[clip-path:--hexagon-clip-path]',
                )}
            />

            <MenuButtonSvg title={title} svgIconPath={svgIconPath} />
        </div>
    );
});

const MenuButtonSvg: FC<{
    title?: string;
    svgIconPath: string;
}> = ({ title, svgIconPath }) => {
    return (
        <div className="absolute left-0 top-0 flex size-full flex-col items-center justify-center group-hover-active:scale-105">
            <div
                className="-mb-1 -mt-1 aspect-square h-2/3 w-auto bg-theme-text-background/50 [mask-position:top] [mask-repeat:no-repeat] [mask-size:85%] group-hover-active:bg-theme-secondary-lighter/50"
                style={
                    {
                        maskImage: `url(${svgIconPath})`,
                    } as CSSProperties
                }
            />

            <span className="scale-[calc(0.5/var(--button-scale))] pr-px font-lato text-xs leading-none tracking-tighter text-theme-primary-darker group-hover-active:text-theme-secondary-lighter">
                {title}
            </span>
        </div>
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

const viewBoxAspect = viewBoxWidth / viewBoxHeight;

function getOffset(scale: number) {
    const baseline = 1;
    const factor = 50;
    return factor * (scale - baseline);
}

function calcCSSVariablesGlass(
    translate: { x: number; y: number },
    rotation: number,
    scale: number,
    parentSize: {
        width: number;
        height: number;
    },
    options?: { shouldOffset?: boolean; offset?: number; clampTo?: number },
) {
    const { shouldOffset, offset, clampTo: _clampTo } = options ?? {};

    let { width, height } = parentSize;

    // TODO better than the top left stack-spawn, bu
    if (!width || !height) {
        width = viewBoxWidth;
        height = viewBoxHeight;
    }

    const parentAspect = width / height;
    const ratio = viewBoxAspect / parentAspect;

    const parentToViewboxWidth = width / viewBoxWidth;
    const parentToViewboxHeight = height / viewBoxHeight;
    const insetByStrokeWidth = (1 - strokeWidth) * scale;

    const mappedScaleX = insetByStrokeWidth * parentToViewboxWidth * ratio;
    const mappedScaleY = insetByStrokeWidth * parentToViewboxHeight;

    const mappedTranslateX = translate.x * parentToViewboxWidth * ratio + getOffset(parentToViewboxWidth * ratio);
    const mappedTranslateY = translate.y * parentToViewboxHeight + getOffset(parentToViewboxHeight) * (viewBoxHeight / viewBoxWidth);

    return {
        '--tw-translate-x': mappedTranslateX + 'px',
        '--tw-translate-y': mappedTranslateY + 'px',
        '--tw-rotate': rotation + 'deg',
        '--tw-scale-x': mappedScaleX,
        '--tw-scale-y': mappedScaleY,
        '--scale-property': mappedScaleX,
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

const navRotationValues: Record<CategoryName, { deg: number }> = {
    'code': { deg: 60 },
    '3d': { deg: -60 },
    'log': { deg: 180 },
};

const routeOffsetValues: Record<ROUTE, Record<BreakpointName | 'base', number>> = {
    [ROUTE.home]: { 'base': 0, 'sm': 0, 'md': 0, 'lg': 0, 'xl': 0, '2xl': 0 },
    [ROUTE.category]: { 'base': 160, 'sm': 0, 'md': 0, 'lg': 0, 'xl': 0, '2xl': 28 },
    [ROUTE.post]: { 'base': 163, 'sm': 0, 'md': 0, 'lg': 0, 'xl': 0, '2xl': 31.5 },
};

// TODO filter lighter-inner to be replaced
const homeMenuTransitionClasses = {
    'code': {
        base: /* tw */ 'rotate-[60deg] [&_.navigation-button-hexagon-class-code]:[filter:url(#lighter-inner)] [&_.menu-button-hexagon-class-contact]:![--tw-rotate:-60deg] [&_.menu-button-hexagon-class-config]:![--tw-rotate:-60deg] [&_.menu-button-hexagon-class-login]:![--tw-rotate:-60deg] [&_.menu-button-hexagon-class-contact]:![--tw-translate-x:35.8%] [&_.menu-button-hexagon-class-contact]:![--tw-translate-y:36.2%] [&_.menu-button-hexagon-class-config]:![--tw-translate-x:35.75%] [&_.menu-button-hexagon-class-config]:![--tw-translate-y:43.5%] [&_.menu-button-hexagon-class-login]:![--tw-translate-x:41.25%] [&_.menu-button-hexagon-class-login]:![--tw-translate-y:32.5%]',
        completed:
            /* tw */ '[&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-code:hover]:grayscale-[0.5] [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-code:hover]:!delay-0 [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-code:hover]:!duration-150 [&_.navigation-button-hexagon-class-code]:scale-90',
    },
    '3d': {
        base: /* tw */ 'rotate-[-60deg] [&_.navigation-button-hexagon-class-3d]:[filter:url(#lighter-inner)] [&_.menu-button-hexagon-class-contact]:![--tw-rotate:60deg] [&_.menu-button-hexagon-class-config]:![--tw-rotate:60deg] [&_.menu-button-hexagon-class-login]:![--tw-rotate:60deg] [&_.menu-button-hexagon-class-contact]:![--tw-translate-x:39.35%] [&_.menu-button-hexagon-class-contact]:![--tw-translate-y:36.2%] [&_.menu-button-hexagon-class-config]:![--tw-translate-x:33.7%] [&_.menu-button-hexagon-class-config]:![--tw-translate-y:32.6%] [&_.menu-button-hexagon-class-login]:![--tw-translate-x:39.3%] [&_.menu-button-hexagon-class-login]:![--tw-translate-y:43.6%]',
        completed:
            /* tw */ '[&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-3d:hover]:grayscale-[0.5] [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-3d:hover]:!delay-0 [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-3d:hover]:!duration-150 [&_.navigation-button-hexagon-class-3d]:scale-90',
    },
    'log': {
        base: /* tw */ 'rotate-[180deg] [&_.navigation-button-hexagon-class-log]:[filter:url(#lighter-inner)] [&_.menu-button-hexagon-class-contact]:![--tw-rotate:-180deg] [&_.menu-button-hexagon-class-config]:![--tw-rotate:-180deg] [&_.menu-button-hexagon-class-login]:![--tw-rotate:-180deg] [&_.menu-button-hexagon-class-contact]:![--tw-translate-y:39.75%] [&_.menu-button-hexagon-class-config]:![--tw-translate-x:43%] [&_.menu-button-hexagon-class-config]:![--tw-translate-y:36%] [&_.menu-button-hexagon-class-login]:![--tw-translate-x:32%] [&_.menu-button-hexagon-class-login]:![--tw-translate-y:36%]',
        completed:
            /* tw */ '[&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-log:hover]:grayscale-[0.5] [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-log:hover]:!delay-0 [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-log:hover]:!duration-150 [&_.navigation-button-hexagon-class-log]:scale-90',
    },
};

// Local Types

type TransitionTargetReached = boolean;
