import { CSSProperties, FC, memo, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames, cycleThrough, roundNumberToDecimal } from 'cpts-javascript-utilities';
import {
    ButtonName,
    Category,
    CategoryName,
    HexagonMenuButtonRouteData,
    HexagonNavigationCategoryButtonRouteData,
    HexagonNavigationDefaultButtonRouteData,
    HexagonRouteData,
    valueof,
} from '../types/types';
import {
    regularHexagons,
    navigationButtonHexagons,
    functionalButtonHexagons,
    degToRad,
    calcCSSVariables,
    categoryNavigationButtonPositions,
    hamburgerButtonHexagon,
    postNavigationButtonHexagons,
} from '../lib/hexagonDataNew';
import { useZustand } from '../lib/zustand';
import { getCurrentElementRotation } from 'cpts-javascript-utilities';
import { CATEGORY, ROUTE } from '../types/enums';
import { keyDownA11y } from 'cpts-javascript-utilities';
import { BreakpointName } from '../hooks/useBreakPoint';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import GlassmorphicClipped from './GlassmorphicClipped';

const HexagonTiles = () => {
    const homeMenuTransitionStateUpdates = useState<[keyof typeof CATEGORY | null, TransitionTargetReached]>([null, true]);
    const [[menuTransitionTarget, menuTransitionTargetReached], setMenuTransitionStates] = homeMenuTransitionStateUpdates;

    const routeName = useZustand((store) => store.values.routeData.name);
    const hamburgerMenuIsActive = useZustand((store) => store.values.hamburgerIsOpen);

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
                <RegularHexagonDiv
                    key={`hex-regular-index-${idx}`}
                    shapeData={hexagonData}
                    routeName={routeName}
                    containerSize={containerSize}
                    hamburgerMenuActive={hamburgerMenuIsActive}
                />
            ))}

            {navigationButtonHexagons.map((hexagonNavigationButtonData, idx) => (
                <NavigationButtonHexagonDiv
                    key={`hex-nav-index-${idx}`}
                    shapeData={hexagonNavigationButtonData}
                    containerSize={containerSize}
                    homeMenuTransitionStateUpdates={homeMenuTransitionStateUpdates}
                />
            ))}

            {/* Hamburger Menu */}
            <HamburgerMenuHexagonDiv
                key={`hex-link-index-hamburger`}
                shapeData={hamburgerButtonHexagon}
                routeName={routeName}
                containerSize={containerSize}
                hamburgerMenuActive={hamburgerMenuIsActive}
            />

            {postNavigationButtonHexagons.map((hexagonPostButtonData, idx) => (
                <FunctionalButtonHexagonDiv
                    key={`hex-post-navigation-index-${idx}`}
                    shapeData={hexagonPostButtonData}
                    routeName={routeName}
                    containerSize={containerSize}
                />
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
    hamburgerMenuActive?: boolean;
}> = memo(({ shapeData, routeName, containerSize, hamburgerMenuActive = false }) => {
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
                'regular-hexagon-class glassmorphic transform-hexagon pointer-events-auto absolute aspect-hex-flat w-[--hexagon-clip-path-width] origin-center bg-[--hexagon-fill-color] transition-[transform,--hexagon-fill-color,--hexagon-lighting-gradient-counter-rotation,clip-path,backdrop-filter]',
                isHalf ? '[clip-path:--half-hexagon-clip-path]' : '[clip-path:--hexagon-clip-path]',
                routeName === ROUTE.post ? '!glassmorphic-off ![--hexagon-fill-color:theme(colors.theme.text-background)]' : '!to-white/10',
                hamburgerMenuActive ? '!backdrop-saturate-[0.75]' : '',
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
    containerSize: {
        width: number;
        height: number;
    };
    homeMenuTransitionStateUpdates: [[CategoryName | null, boolean], React.Dispatch<React.SetStateAction<[CategoryName | null, boolean]>>];
}> = memo(({ shapeData, containerSize, homeMenuTransitionStateUpdates }) => {
    const { title, name, svgIconPath, target } = shapeData;
    const { name: routeName, content: routeContent } = useZustand((store) => store.values.routeData);

    const { position, rotation, scale, shouldOffset } = shapeData[routeName];
    const breakpoint = useZustand((state) => state.values.breakpoint);
    const [[menuTransitionTarget, menuTransitionTargetReached], setMenuTransitionStates] = homeMenuTransitionStateUpdates;
    const navigate = useNavigate();

    const isCategoryNavigationButton = isCategoryNavigation(name);
    const isCategoryNavigationButtonAndIsCategoryRoute = isCategoryNavigationButton && routeName === ROUTE.category;
    const isActiveCategoryButton = isCategoryNavigationButtonAndIsCategoryRoute ? isActiveCategory(name, routeContent.category) : false;

    const cssVariables_Memo = useMemo(() => {
        if (isCategoryNavigationButtonAndIsCategoryRoute) {
            const previous = cycleThrough(
                Object.values(CATEGORY).filter((val) => !isNaN(val as number)),
                routeContent.category.id,
                'previous',
            );

            let transforms, z;
            if (isActiveCategoryButton) {
                transforms = categoryNavigationButtonPositions['active'];
                z = 20;
            } else if (CATEGORY[name] === previous) {
                transforms = categoryNavigationButtonPositions['left'];
                z = 0;
            } else {
                transforms = categoryNavigationButtonPositions['right'];
                z = 10;
            }

            const { position, rotation, scale } = transforms;
            const style = calcCSSVariables(position, rotation, scale, containerSize, {
                shouldOffset,
                offset: routeOffsetValues[routeName][breakpoint ?? 'base'],
            });
            return { ...style, zIndex: z };
        } else {
            return calcCSSVariables(position, rotation, scale, containerSize, { shouldOffset, offset: routeOffsetValues[routeName][breakpoint ?? 'base'] });
        }
    }, [
        breakpoint,
        containerSize,
        isActiveCategoryButton,
        isCategoryNavigationButtonAndIsCategoryRoute,
        name,
        position,
        rotation,
        routeContent.category?.id,
        routeName,
        scale,
        shouldOffset,
    ]);

    const isVisible = scale > 0;

    function handleClick(ev: React.MouseEvent<HTMLButtonElement>) {
        const targetResult = typeof target === 'string' ? target : target(ev);
        navigate(targetResult);
    }

    function handleMouseEnter() {
        if (isCategoryNavigationButton) {
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
            isActive={isActiveCategoryButton}
            style={cssVariables_Memo}
            isRouteNavigation
            clickHandler={handleClick}
            mouseEnterHandler={handleMouseEnter}
        >
            {isCategoryNavigationButton ? (
                <div
                    className={classNames(
                        'absolute left-0 top-0 flex size-full select-none items-center justify-center font-fjalla-one text-4xl font-semibold text-theme-secondary-lighter/75 transition-transform duration-[--ui-animation-menu-transition-duration]',
                        routeName === ROUTE.home ? '' : 'rotate-[calc(var(--hexagon-rotate)*-1)]',
                    )}
                >
                    {title}
                </div>
            ) : (
                <MenuButtonSvg title={title} svgIconPath={svgIconPath!} />
            )}
        </GlassmorphicButtonWrapper>
    );
});

const FunctionalButtonHexagonDiv: FC<{
    shapeData: HexagonMenuButtonRouteData | HexagonNavigationDefaultButtonRouteData;
    routeName: ROUTE;
    containerSize: {
        width: number;
        height: number;
    };
    isHamburgerChild?: boolean;
    hamburgerMenuActive?: boolean;
}> = memo(({ shapeData, routeName, containerSize, isHamburgerChild = false, hamburgerMenuActive = false }) => {
    const { name, title, svgIconPath, target } = shapeData;
    const { position, rotation, scale, shouldOffset } = shapeData[routeName];

    const breakpoint = useZustand((state) => state.values.breakpoint);
    const navigate = useNavigate();

    const cssVariables_Memo = useMemo(
        () =>
            calcCSSVariables(
                position,
                isHamburgerChild ? (hamburgerMenuActive ? rotation - 30 : rotation) : rotation,
                isHamburgerChild ? (hamburgerMenuActive ? scale : 0) : scale,
                containerSize,
                {
                    shouldOffset,
                    offset: routeOffsetValues[routeName][breakpoint ?? 'base'],
                },
            ),
        [position, rotation, isHamburgerChild, hamburgerMenuActive, scale, containerSize, shouldOffset, routeName, breakpoint],
    );
    const isVisible = scale > 0;

    function handleClick(ev: React.MouseEvent<HTMLButtonElement>) {
        const targetResult = typeof target === 'string' ? target : target(ev);
        targetResult && navigate(targetResult);
    }

    return (
        <GlassmorphicButtonWrapper name={name} title={title} isVisible={isVisible} style={cssVariables_Memo} strokeRadius={0} clickHandler={handleClick}>
            <MenuButtonSvg svgIconPath={svgIconPath} />
        </GlassmorphicButtonWrapper>
    );
});

const HamburgerMenuHexagonDiv: FC<{
    shapeData: HexagonMenuButtonRouteData;
    routeName: ROUTE;
    containerSize: {
        width: number;
        height: number;
    };
    hamburgerMenuActive: boolean;
}> = memo(({ shapeData, routeName, containerSize, hamburgerMenuActive }) => {
    const { name, title, svgIconPath, target } = shapeData;
    const { position, rotation, scale, shouldOffset } = shapeData[routeName];

    const breakpoint = useZustand((state) => state.values.breakpoint);

    const hamburgerCssVariables_Memo = useMemo(
        () =>
            calcCSSVariables(position, hamburgerMenuActive ? rotation - 30 : rotation, scale, containerSize, {
                shouldOffset,
                offset: routeOffsetValues[routeName][breakpoint ?? 'base'],
            }),
        [position, hamburgerMenuActive, rotation, scale, containerSize, shouldOffset, routeName, breakpoint],
    );

    const isVisible = scale > 0;

    function handleClick(ev: React.MouseEvent<HTMLButtonElement>) {
        target(ev);
    }

    return (
        <>
            <RegularHexagonDiv
                shapeData={{
                    [ROUTE.home]: {
                        position: {
                            x: 150,
                            y: 129.9,
                        },
                        rotation: 0,
                        isHalf: false,
                        scale: 1,
                        shouldOffset: false,
                    },
                    [ROUTE.category]: {
                        position: {
                            x: 150,
                            y: 0,
                        },
                        rotation: hamburgerMenuActive ? -60 : 30,
                        isHalf: false,
                        scale: hamburgerMenuActive ? 0.95 : 0.866,
                        shouldOffset: false,
                    },
                    [ROUTE.post]: {
                        position: {
                            x: 75,
                            y: 0,
                        },
                        rotation: 30,
                        isHalf: true,
                        scale: 0,
                        shouldOffset: false,
                    },
                }}
                routeName={routeName}
                containerSize={containerSize}
            />

            {functionalButtonHexagons.map((hexagonFunctionalButtonData, idx) => {
                return (
                    <FunctionalButtonHexagonDiv
                        key={`hex-link-index-${idx}`}
                        shapeData={hexagonFunctionalButtonData}
                        routeName={routeName}
                        containerSize={containerSize}
                        hamburgerMenuActive={hamburgerMenuActive}
                        isHamburgerChild
                    />
                );
            })}

            <GlassmorphicButtonWrapper
                name={name}
                isVisible={isVisible}
                isActive={hamburgerMenuActive}
                style={hamburgerCssVariables_Memo}
                clickHandler={handleClick}
            >
                <MenuButtonSvg svgIconPath={svgIconPath} />
            </GlassmorphicButtonWrapper>
        </>
    );
});

const GlassmorphicButtonWrapper: FC<{
    children: ReactNode;
    name: string;
    title?: string;
    style: Record<string, valueof<CSSProperties>>;
    clickHandler: (ev: React.MouseEvent<HTMLButtonElement>) => void;
    isVisible: boolean;
    isActive?: boolean;
    isRouteNavigation?: boolean;
    mouseEnterHandler?: () => void;
    strokeRadius?: number;
}> = ({ children, name, title, style, clickHandler, isVisible, isActive = false, isRouteNavigation = false, mouseEnterHandler, strokeRadius }) => {
    const routeName = useZustand((store) => store.values.routeData.name);
    const random_Memo = useMemo(() => Math.random(), []);

    let scaledStrokeRadius = strokeRadius;

    if (strokeRadius) {
        const averagedStroke = (style['--hexagon-scale-x'] as number) + (style['--hexagon-scale-y'] as number) / 2;
        scaledStrokeRadius = roundNumberToDecimal(strokeRadius / averagedStroke, 2);
        scaledStrokeRadius = isFinite(scaledStrokeRadius) ? scaledStrokeRadius : undefined;
    }

    return (
        <button
            className="transform-hexagon group absolute transition-transform"
            style={{
                ...style,
                transitionDuration: `calc(var(--ui-animation-menu-transition-duration) * ${random_Memo + 1})`,
                transitionDelay: `calc(var(--ui-animation-menu-transition-duration) * ${random_Memo})`,
            }}
            onClick={clickHandler}
        >
            <GlassmorphicClipped
                clipPath="var(--hexagon-clip-path)"
                strokeRadius={scaledStrokeRadius}
                className={classNames(
                    '![--glassmorphic-backdrop-blur:8px]',
                    'pointer-events-auto aspect-hex-flat w-[--hexagon-clip-path-width] origin-center transition-[--hexagon-blur-color,--hexagon-lighting-gradient-counter-rotation]',
                    'group-hover-active:!scale-x-[1.05] group-hover-active:!scale-y-[1.05] group-hover-active:![--hexagon-blur-color:theme(colors.theme.primary-lighter)]',
                    isActive ? '![--hexagon-blur-color:theme(colors.theme.primary-lighter)]' : '',
                    routeName === ROUTE.post
                        ? '[--hexagon-blur-color:transparent] [--hexagon-fill-color:theme(colors.theme.primary/0.5)] [--hexagon-stroke-color:transparent]'
                        : '[--hexagon-blur-color:theme(colors.theme.primary/0.75)] [--hexagon-fill-color:theme(colors.theme.secondary/0.35)] [--hexagon-stroke-color:theme(colors.theme.primary-lighter/0.5)]',
                    isRouteNavigation ? `navigation-button-hexagon-class-${name}` : `menu-button-hexagon-class-${name}`,
                )}
                style={
                    {
                        transitionDuration: `150ms, var(--ui-animation-menu-transition-duration)`,
                    } as CSSProperties
                }
                role={'button'}
                tabIndex={isVisible ? -1 : 0}
                onMouseEnter={mouseEnterHandler}
            >
                {children}
            </GlassmorphicClipped>

            <span
                className="absolute left-1/2 top-full block -translate-x-1/2 translate-y-1/2 rotate-[calc(var(--hexagon-rotate)*-1)] scale-x-[calc(1/var(--hexagon-scale-x))] scale-y-[calc(1/var(--hexagon-scale-y))] font-lato text-xs leading-none tracking-tighter text-theme-primary transition-transform group-hover-active:text-theme-secondary-lighter" // scale-[calc(0.5/var(--button-scale))]
            >
                {title}
            </span>
        </button>
    );
};

const MenuButtonSvg: FC<{
    title?: string;
    svgIconPath: string;
}> = ({ title, svgIconPath }) => {
    return (
        <div className="absolute left-0 top-0 flex size-full rotate-[calc(var(--hexagon-rotate)*-1)] flex-col items-center justify-center transition-transform duration-[--ui-animation-menu-transition-duration]">
            <div
                className="aspect-square h-full w-auto bg-theme-text-background/50 [mask-position:center] [mask-repeat:no-repeat] [mask-size:67.5%] group-hover-active:bg-theme-secondary-lighter/50"
                style={
                    {
                        maskImage: `url(${svgIconPath})`,
                    } as CSSProperties
                }
            />
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

function isActiveCategory(name: CategoryName, category: Category) {
    return CATEGORY[name] === category.id;
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
