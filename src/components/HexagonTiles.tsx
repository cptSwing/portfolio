import { CSSProperties, FC, memo, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from 'cpts-javascript-utilities';
import {
    ButtonName,
    CategoryName,
    HexagonMenuButtonRouteData,
    HexagonNavigationCategoryButtonRouteData,
    HexagonNavigationDefaultButtonRouteData,
    HexagonRouteData,
    valueof,
} from '../types/types';
import { regularHexagons, navigationButtonHexagons, menuButtonHexagons, degToRad, calcCSSVariables } from '../lib/hexagonDataNew';
import { useZustand } from '../lib/zustand';
import { getCurrentElementRotation } from 'cpts-javascript-utilities';
import { CATEGORY, ROUTE } from '../types/enums';
import { keyDownA11y } from 'cpts-javascript-utilities';
import { BreakpointName } from '../hooks/useBreakPoint';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import GlassmorphicClipped from './GlassmorphicClipped';

const HexagonTiles = () => {
    const menuTransitionStateUpdates = useState<[keyof typeof CATEGORY | null, TransitionTargetReached]>([null, true]);
    const [[menuTransitionTarget, menuTransitionTargetReached], setMenuTransitionStates] = menuTransitionStateUpdates;

    const routeName = useZustand((store) => store.values.routeData.name);
    const containerSize = useContext(GetChildSizeContext);

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
                'pointer-events-none absolute size-full transform-gpu overflow-visible transition-transform duration-[--ui-animation-menu-transition-duration]',
                routeName === ROUTE.home ? navMenuTransitionClasses_Memo : 'rotate-90 sm:rotate-0',
            )}
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
                <RegularHexagonDiv key={`hex-regular-index-${idx}`} shapeData={hexagonData} routeName={routeName} containerSize={containerSize} />
            ))}

            {navigationButtonHexagons.map((hexagonNavigationButtonData, idx) => (
                <NavigationButtonHexagonDiv
                    key={`hex-link-index-${idx}`}
                    shapeData={hexagonNavigationButtonData}
                    routeName={routeName}
                    containerSize={containerSize}
                    menuTransitionStateUpdates={menuTransitionStateUpdates}
                />
            ))}

            {menuButtonHexagons.map((hexagonMenuButtonData, idx) => (
                <MenuButtonHexagonDiv key={`hex-link-index-${idx}`} shapeData={hexagonMenuButtonData} routeName={routeName} containerSize={containerSize} />
            ))}
        </div>
    );
};

export default HexagonTiles;

const RegularHexagonDiv: FC<{
    shapeData: HexagonRouteData;
    routeName: ROUTE;
    containerSize: {
        width: number;
        height: number;
    };
}> = memo(({ shapeData, routeName, containerSize }) => {
    const { position, rotation, scale, isHalf, shouldOffset } = shapeData[routeName];
    const breakpoint = useZustand((state) => state.values.breakpoint);

    const cssVariables_Memo = useMemo(
        () => calcCSSVariables(position, rotation, scale, containerSize, { shouldOffset, offset: routeOffsetValues[routeName][breakpoint ?? 'base'] }),
        [position, rotation, scale, containerSize, shouldOffset, routeName, breakpoint],
    );

    const random_Memo = useMemo(() => Math.random(), []);

    return (
        <div
            className={classNames(
                'regular-hexagon-class glassmorphic pointer-events-auto absolute aspect-hex-flat w-[--hexagon-clip-path-width] origin-center transform-gpu bg-[--hexagon-fill-color] transition-[transform,--hexagon-fill-color,--hexagon-lighting-gradient-counter-rotation,clip-path]',
                isHalf ? '[clip-path:--half-hexagon-clip-path]' : '[clip-path:--hexagon-clip-path]',
                routeName === ROUTE.post ? '!glassmorphic-off ![--hexagon-fill-color:theme(colors.theme.text-background)]' : '!to-white/10',
            )}
            style={
                {
                    ...cssVariables_Memo,
                    transitionDuration: `calc(var(--ui-animation-menu-transition-duration) * ${random_Memo + 1}), calc(var(--ui-animation-menu-transition-duration) * ${random_Memo + 1}), var(--ui-animation-menu-transition-duration), var(--ui-animation-menu-transition-duration)`,
                    transitionDelay: `calc(var(--ui-animation-menu-transition-duration) * ${random_Memo}), calc(var(--ui-animation-menu-transition-duration) * ${random_Memo}), 0ms, 0ms`,
                } as CSSProperties
            }
        />
    );
});

const NavigationButtonHexagonDiv: FC<{
    shapeData: HexagonNavigationDefaultButtonRouteData | HexagonNavigationCategoryButtonRouteData;
    routeName: ROUTE;
    containerSize: {
        width: number;
        height: number;
    };
    menuTransitionStateUpdates: [[CategoryName | null, boolean], React.Dispatch<React.SetStateAction<[CategoryName | null, boolean]>>];
}> = memo(({ shapeData, routeName, containerSize, menuTransitionStateUpdates }) => {
    const { title, name, svgIconPath, target } = shapeData;
    const { position, rotation, scale, shouldOffset } = shapeData[routeName];
    const breakpoint = useZustand((state) => state.values.breakpoint);
    const [[menuTransitionTarget, menuTransitionTargetReached], setMenuTransitionStates] = menuTransitionStateUpdates;
    const navigate = useNavigate();

    const cssVariables_Memo = useMemo(
        () => calcCSSVariables(position, rotation, scale, containerSize, { shouldOffset, offset: routeOffsetValues[routeName][breakpoint ?? 'base'] }),
        [position, rotation, scale, containerSize, shouldOffset, routeName, breakpoint],
    );

    const isVisible = scale > 0;

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
        <GlassmorphicButtonWrapper
            name={name}
            isVisible={isVisible}
            style={cssVariables_Memo}
            isRouteNavigation
            clickHandler={handleClick}
            mouseEnterHandler={handleMouseEnter}
        >
            {isCategoryNavigation(name) ? (
                <div className="absolute left-0 top-0 flex size-full select-none items-center justify-center font-fjalla-one text-4xl font-semibold text-theme-secondary-lighter/75">
                    {title}
                </div>
            ) : (
                <MenuButtonSvg title={title} svgIconPath={svgIconPath!} />
            )}
        </GlassmorphicButtonWrapper>
    );
});

const MenuButtonHexagonDiv: FC<{
    shapeData: HexagonMenuButtonRouteData;
    routeName: ROUTE;
    containerSize: {
        width: number;
        height: number;
    };
}> = memo(({ shapeData, routeName, containerSize }) => {
    const { name, title, svgIconPath, target } = shapeData;
    const { position, rotation, scale, shouldOffset } = shapeData[routeName];

    const breakpoint = useZustand((state) => state.values.breakpoint);

    const cssVariables_Memo = useMemo(
        () => calcCSSVariables(position, rotation, scale, containerSize, { shouldOffset, offset: routeOffsetValues[routeName][breakpoint ?? 'base'] }),
        [position, rotation, scale, containerSize, shouldOffset, routeName, breakpoint],
    );
    const isVisible = scale > 0;

    function handleClick(ev: React.MouseEvent<HTMLDivElement>) {
        target(ev);
    }

    return (
        <GlassmorphicButtonWrapper name={name} isVisible={isVisible} style={cssVariables_Memo} clickHandler={handleClick}>
            <MenuButtonSvg title={title} svgIconPath={svgIconPath} />
        </GlassmorphicButtonWrapper>
    );
});

const GlassmorphicButtonWrapper: FC<{
    children: ReactNode;
    name: string;
    isVisible: boolean;
    isRouteNavigation?: boolean;
    style: Record<string, valueof<CSSProperties>>;
    clickHandler: (ev: React.MouseEvent<HTMLDivElement>) => void;
    mouseEnterHandler?: () => void;
}> = ({ children, name, isVisible, isRouteNavigation = false, style, clickHandler, mouseEnterHandler }) => {
    const routeName = useZustand((store) => store.values.routeData.name);
    const random_Memo = useMemo(() => Math.random(), []);
    const strokeRadius = 2 / (style['--tw-scale-x'] as number);

    return (
        <GlassmorphicClipped
            clipPath="var(--hexagon-clip-path)"
            strokeRadius={isFinite(strokeRadius) ? strokeRadius : 0}
            className={classNames(
                '![--glassmorphic-backdrop-blur:8px]',
                'group pointer-events-auto absolute aspect-hex-flat w-[--hexagon-clip-path-width] origin-center transform-gpu transition-[transform,--hexagon-blur-color,--scale-property,--hexagon-lighting-gradient-counter-rotation] [clip-path:--hexagon-clip-path]',
                'hover-active:!scale-[calc(var(--scale-property)*1.05)] hover-active:!delay-0 hover-active:!duration-150 hover-active:![--hexagon-blur-color:theme(colors.theme.primary-lighter)]',
                routeName === ROUTE.post
                    ? '[--hexagon-blur-color:transparent] [--hexagon-fill-color:theme(colors.theme.primary/0.5)] [--hexagon-stroke-color:transparent]'
                    : '[--hexagon-blur-color:theme(colors.theme.primary/0.75)] [--hexagon-fill-color:theme(colors.theme.secondary/0.35)] [--hexagon-stroke-color:theme(colors.theme.primary-lighter/0.5)]',
                isRouteNavigation ? `navigation-button-hexagon-class-${name}` : `menu-button-hexagon-class-${name}`,
            )}
            style={
                {
                    ...style,
                    transitionDuration: `calc(var(--ui-animation-menu-transition-duration) * ${random_Memo + 1}), 150ms, 150ms, var(--ui-animation-menu-transition-duration)`,
                    transitionDelay: `calc(var(--ui-animation-menu-transition-duration) * ${random_Memo}), 0ms, 0ms, 0ms`,
                } as CSSProperties
            }
            role={'button'}
            tabIndex={isVisible ? -1 : 0}
            onMouseEnter={mouseEnterHandler}
            onClick={clickHandler}
            onKeyDown={keyDownA11y(clickHandler)}
        >
            {children}
        </GlassmorphicClipped>
    );
};

const MenuButtonSvg: FC<{
    title?: string;
    svgIconPath: string;
}> = ({ title, svgIconPath }) => {
    return (
        <div className="absolute left-0 top-0 flex size-full flex-col items-center justify-center">
            <div
                className="-mb-1 -mt-1 aspect-square h-2/3 w-auto bg-theme-text-background/50 [mask-position:top] [mask-repeat:no-repeat] [mask-size:85%] group-hover-active:bg-theme-secondary-lighter/50"
                style={
                    {
                        maskImage: `url(${svgIconPath})`,
                    } as CSSProperties
                }
            />

            <span
                className="pr-px font-lato text-xs leading-none tracking-tighter text-theme-primary-darker group-hover-active:text-theme-secondary-lighter" // scale-[calc(0.5/var(--button-scale))]
            >
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
        base: /* tw */ '[--home-menu-rotation:60deg] rotate-[--home-menu-rotation] [&_.navigation-button-hexagon-class-code]:[filter:url(#lighter-inner)] [&_.menu-button-hexagon-class-contact]:![--tw-rotate:-60deg] [&_.menu-button-hexagon-class-config]:![--tw-rotate:-60deg] [&_.menu-button-hexagon-class-login]:![--tw-rotate:-60deg] [&_.menu-button-hexagon-class-contact]:![--tw-translate-x:35.8%] [&_.menu-button-hexagon-class-contact]:![--tw-translate-y:36.2%] [&_.menu-button-hexagon-class-config]:![--tw-translate-x:35.75%] [&_.menu-button-hexagon-class-config]:![--tw-translate-y:43.5%] [&_.menu-button-hexagon-class-login]:![--tw-translate-x:41.25%] [&_.menu-button-hexagon-class-login]:![--tw-translate-y:32.5%]',
        completed:
            /* tw */ '[&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-code:hover]:grayscale-[0.5] [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-code:hover]:!delay-0 [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-code:hover]:!duration-150',
    },
    '3d': {
        base: /* tw */ '[--home-menu-rotation:-60deg] rotate-[--home-menu-rotation] [&_.navigation-button-hexagon-class-3d]:[filter:url(#lighter-inner)] [&_.menu-button-hexagon-class-contact]:![--tw-rotate:60deg] [&_.menu-button-hexagon-class-config]:![--tw-rotate:60deg] [&_.menu-button-hexagon-class-login]:![--tw-rotate:60deg] [&_.menu-button-hexagon-class-contact]:![--tw-translate-x:39.35%] [&_.menu-button-hexagon-class-contact]:![--tw-translate-y:36.2%] [&_.menu-button-hexagon-class-config]:![--tw-translate-x:33.7%] [&_.menu-button-hexagon-class-config]:![--tw-translate-y:32.6%] [&_.menu-button-hexagon-class-login]:![--tw-translate-x:39.3%] [&_.menu-button-hexagon-class-login]:![--tw-translate-y:43.6%]',
        completed:
            /* tw */ '[&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-3d:hover]:grayscale-[0.5] [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-3d:hover]:!delay-0 [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-3d:hover]:!duration-150 ',
    },
    'log': {
        base: /* tw */ '[--home-menu-rotation:180deg] rotate-[--home-menu-rotation] [&_.navigation-button-hexagon-class-log]:[filter:url(#lighter-inner)] [&_.menu-button-hexagon-class-contact]:![--tw-rotate:-180deg] [&_.menu-button-hexagon-class-config]:![--tw-rotate:-180deg] [&_.menu-button-hexagon-class-login]:![--tw-rotate:-180deg] [&_.menu-button-hexagon-class-contact]:![--tw-translate-y:39.75%] [&_.menu-button-hexagon-class-config]:![--tw-translate-x:43%] [&_.menu-button-hexagon-class-config]:![--tw-translate-y:36%] [&_.menu-button-hexagon-class-login]:![--tw-translate-x:32%] [&_.menu-button-hexagon-class-login]:![--tw-translate-y:36%]',
        completed:
            /* tw */ '[&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-log:hover]:grayscale-[0.5] [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-log:hover]:!delay-0 [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-log:hover]:!duration-150',
    },
};

// Local Types

type TransitionTargetReached = boolean;
