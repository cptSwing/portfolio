import { CSSProperties, FC, memo, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames, cycleThrough } from 'cpts-javascript-utilities';
import {
    Category,
    CategoryName,
    CategoryNavigationButtonRouteData,
    HexagonRouteData,
    MenuButtonRouteData,
    PostNavigationButtonRouteData,
} from '../types/types';
import {
    regularHexagons,
    categoryNavigationButtons,
    calcCSSVariables,
    categoryNavigationButtonPositions,
    postNavigationButtons,
    hexagonRouteOffsetValues,
} from '../lib/hexagonDataNew';
import { useZustand } from '../lib/zustand';
import { getCurrentElementRotation } from 'cpts-javascript-utilities';
import { CATEGORY, ROUTE } from '../types/enums';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import HamburgerMenu from './HamburgerMenu';
import { GlassmorphicButtonWrapper } from './GlassmorphicClipped';

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
            {regularHexagons.map((regularHexagonData, idx) => (
                <RegularHexagon
                    key={`hex-regular-index-${idx}`}
                    data={regularHexagonData}
                    routeName={routeName}
                    containerSize={containerSize}
                    hamburgerMenuActive={hamburgerMenuIsActive}
                />
            ))}

            {categoryNavigationButtons.map((categoryNavigationButtonData, idx) => (
                <CategoryNavigationButton
                    key={`hex-nav-index-${idx}`}
                    buttonData={categoryNavigationButtonData}
                    containerSize={containerSize}
                    homeMenuTransitionStateUpdates={homeMenuTransitionStateUpdates}
                />
            ))}

            {/* Hamburger Menu */}
            <HamburgerMenu routeName={routeName} containerSize={containerSize} hamburgerMenuIsActive={hamburgerMenuIsActive} />

            {postNavigationButtons.map((postNavigationButtonData, idx) => (
                <MenuButton
                    key={`hex-post-navigation-index-${idx}`}
                    buttonData={postNavigationButtonData}
                    routeName={routeName}
                    containerSize={containerSize}
                />
            ))}
        </div>
    );
};

export default HexagonTiles;

export const RegularHexagon: FC<{
    data: HexagonRouteData;
    routeName: ROUTE;
    containerSize: {
        width: number;
        height: number;
    };
    hamburgerMenuActive?: boolean;
}> = memo(({ data, routeName, containerSize, hamburgerMenuActive = false }) => {
    const { position, rotation, scale, isHalf, shouldOffset } = data[routeName];
    const breakpoint = useZustand((state) => state.values.breakpoint);

    const cssVariables_Memo = useMemo(
        () => calcCSSVariables(position, rotation, scale, containerSize, { shouldOffset, offset: hexagonRouteOffsetValues[routeName][breakpoint ?? 'base'] }),
        [position, rotation, scale, containerSize, shouldOffset, routeName, breakpoint],
    );

    const random_Memo = useMemo(() => Math.random(), []);

    return (
        <div
            className={classNames(
                'regular-hexagon-class glassmorphic-backdrop-filter glassmorphic-grain-before lighting-gradient transform-hexagon pointer-events-auto absolute aspect-hex-flat w-[--hexagon-clip-path-width] origin-center bg-[--hexagon-fill-color] transition-[transform,--hexagon-fill-color,--hexagon-lighting-gradient-counter-rotation,clip-path,backdrop-filter]',
                isHalf ? '[clip-path:--half-hexagon-clip-path]' : '[clip-path:--hexagon-clip-path]',
                routeName === ROUTE.post
                    ? '!bg-none ![--hexagon-fill-color:theme(colors.theme.text-background)] [backdrop-filter:_] before:content-none'
                    : '!to-white/10',
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

const CategoryNavigationButton: FC<{
    buttonData: CategoryNavigationButtonRouteData;
    containerSize: {
        width: number;
        height: number;
    };
    homeMenuTransitionStateUpdates: [[CategoryName | null, boolean], React.Dispatch<React.SetStateAction<[CategoryName | null, boolean]>>];
}> = memo(({ buttonData, containerSize, homeMenuTransitionStateUpdates }) => {
    const { title, name, target } = buttonData;
    const { name: routeName, content: routeContent } = useZustand((store) => store.values.routeData);

    const { position, rotation, scale, shouldOffset } = buttonData[routeName];
    const breakpoint = useZustand((state) => state.values.breakpoint);
    const [[menuTransitionTarget, menuTransitionTargetReached], setMenuTransitionStates] = homeMenuTransitionStateUpdates;
    const navigate = useNavigate();

    const isActiveCategoryButton = routeName === ROUTE.category ? isActiveCategory(name, routeContent.category) : false;

    const cssVariables_Memo = useMemo(() => {
        if (routeName === ROUTE.category) {
            const previousCategory = cycleThrough(
                Object.values(CATEGORY).filter((val) => !isNaN(val as number)),
                routeContent.category.id,
                'previous',
            );

            let transforms, z;
            if (isActiveCategoryButton) {
                transforms = categoryNavigationButtonPositions['active'];
                z = 20;
            } else if (CATEGORY[name] === previousCategory) {
                transforms = categoryNavigationButtonPositions['left'];
                z = 0;
            } else {
                transforms = categoryNavigationButtonPositions['right'];
                z = 10;
            }

            const { position, rotation, scale } = transforms;
            const style = calcCSSVariables(position, rotation, scale, containerSize, {
                shouldOffset,
                offset: hexagonRouteOffsetValues[routeName][breakpoint ?? 'base'],
            });
            return { ...style, zIndex: z };
        } else {
            return calcCSSVariables(position, rotation, scale, containerSize, {
                shouldOffset,
                offset: hexagonRouteOffsetValues[routeName][breakpoint ?? 'base'],
            });
        }
    }, [breakpoint, containerSize, isActiveCategoryButton, name, position, rotation, routeContent.category?.id, routeName, scale, shouldOffset]);

    const isVisible = scale > 0;

    function handleClick() {
        navigate(target);
    }

    function handleMouseEnter() {
        if (routeName === ROUTE.home && menuTransitionTargetReached && menuTransitionTarget !== name) {
            setMenuTransitionStates([name as CategoryName, false]);
            // ^^^  Prevent parent from prematurely rotating again, and again, and again
        }
    }

    return (
        <GlassmorphicButtonWrapper
            name={name}
            isActive={isActiveCategoryButton}
            style={cssVariables_Memo}
            isRouteNavigation
            clickHandler={handleClick}
            mouseEnterHandler={handleMouseEnter}
            lightingGradient
            innerShadowRadius={6}
        >
            <div
                className={classNames(
                    'absolute left-0 top-0 flex size-full select-none items-center justify-center font-fjalla-one text-4xl font-semibold text-theme-secondary-lighter/75 transition-transform duration-[--ui-animation-menu-transition-duration]',
                    routeName === ROUTE.home ? '' : 'rotate-[calc(var(--hexagon-rotate)*-1)]',
                )}
            >
                {title}
            </div>
        </GlassmorphicButtonWrapper>
    );
});

export const MenuButton: FC<{
    buttonData: MenuButtonRouteData | PostNavigationButtonRouteData;
    routeName: ROUTE;
    containerSize: {
        width: number;
        height: number;
    };
    isHamburgerChild?: boolean;
    hamburgerMenuIsActive?: boolean;
    innerShadowRadius?: number;
    strokeRadius?: number;
}> = memo(({ buttonData, routeName, containerSize, isHamburgerChild = false, hamburgerMenuIsActive = false, innerShadowRadius, strokeRadius }) => {
    const { name, svgIconPath, target } = buttonData;
    const title = 'title' in buttonData ? buttonData.title : undefined;

    const { position, rotation, scale, shouldOffset } = buttonData[routeName];

    const breakpoint = useZustand((state) => state.values.breakpoint);

    const cssVariables_Memo = useMemo(
        () =>
            calcCSSVariables(
                position,
                isHamburgerChild ? (hamburgerMenuIsActive ? rotation - 30 : rotation) : rotation,
                isHamburgerChild ? (hamburgerMenuIsActive ? scale : 0) : scale,
                containerSize,
                {
                    shouldOffset,
                    offset: hexagonRouteOffsetValues[routeName][breakpoint ?? 'base'],
                },
            ),
        [position, rotation, isHamburgerChild, hamburgerMenuIsActive, scale, containerSize, shouldOffset, routeName, breakpoint],
    );

    const navigate = useNavigate();
    function handleClick(ev: React.MouseEvent<HTMLButtonElement>) {
        const targetResult = typeof target === 'string' ? target : target(ev);
        targetResult && navigate(targetResult);
    }

    return (
        <GlassmorphicButtonWrapper
            name={name}
            title={title}
            style={cssVariables_Memo}
            innerShadowRadius={innerShadowRadius}
            strokeRadius={strokeRadius}
            clickHandler={handleClick}
        >
            <MenuButtonSvg svgIconPath={svgIconPath} />
        </GlassmorphicButtonWrapper>
    );
});

export const MenuButtonSvg: FC<{
    svgIconPath: string;
    counterRotate?: boolean;
}> = ({ svgIconPath, counterRotate = true }) => {
    return (
        <div
            className={classNames(
                'size-full bg-theme-text-background/50 [mask-position:center] [mask-repeat:no-repeat] [mask-size:65%] group-hover-active:bg-theme-secondary-lighter/50',
                counterRotate ? 'rotate-[calc(var(--hexagon-rotate)*-1)] transition-transform duration-[--ui-animation-menu-transition-duration]' : '',
            )}
            style={
                {
                    maskImage: `url(${svgIconPath})`,
                } as CSSProperties
            }
        />
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

function isActiveCategory(name: CategoryName, category: Category) {
    return CATEGORY[name] === category.id;
}

// Local Values

const navRotationValues: Record<CategoryName, { deg: number }> = {
    'code': { deg: 60 },
    '3d': { deg: -60 },
    'log': { deg: 180 },
};

// TODO filter lighter-inner to be replaced
const homeMenuTransitionClasses = {
    'code': {
        base: /* tw */ '[--home-menu-rotation:60deg] rotate-[--home-menu-rotation] [&_.navigation-button-hexagon-class-code]:[filter:url(#lighter-inner)]',
        completed:
            /* tw */ '[&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-code:hover]:grayscale-[0.5] [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-code:hover]:!delay-0 [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-code:hover]:!duration-150',
    },
    '3d': {
        base: /* tw */ '[--home-menu-rotation:-60deg] rotate-[--home-menu-rotation] [&_.navigation-button-hexagon-class-3d]:[filter:url(#lighter-inner)]',
        completed:
            /* tw */ '[&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-3d:hover]:grayscale-[0.5] [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-3d:hover]:!delay-0 [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-3d:hover]:!duration-150 ',
    },
    'log': {
        base: /* tw */ '[--home-menu-rotation:180deg] rotate-[--home-menu-rotation] [&_.navigation-button-hexagon-class-log]:[filter:url(#lighter-inner)]',
        completed:
            /* tw */ '[&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-log:hover]:grayscale-[0.5] [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-log:hover]:!delay-0 [&_.regular-hexagon-class]:has-[.navigation-button-hexagon-class-log:hover]:!duration-150',
    },
};

// Local Types

type TransitionTargetReached = boolean;
