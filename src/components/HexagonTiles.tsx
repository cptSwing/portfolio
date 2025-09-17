import { FC, memo, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames, cycleThrough } from 'cpts-javascript-utilities';
import { Category, CategoryName, CategoryNavigationButtonRouteData } from '../types/types';
import {
    regularHexagons,
    categoryNavigationButtons,
    calcCSSVariables,
    categoryNavigationButtonPositions,
    postNavigationButtons,
    hexagonRouteOffsetValues,
    backgroundHexagons,
    halfRegularHexagons,
} from '../lib/hexagonDataNew';
import { useZustand } from '../lib/zustand';
import { getCurrentElementRotation } from 'cpts-javascript-utilities';
import { CATEGORY, ROUTE } from '../types/enums';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import HamburgerMenu from './HamburgerMenu';
import { GlassmorphicButtonWrapper } from './GlassmorphicClipped';
import { Hexagon, MenuButtonHexagon } from './HexagonShapes';

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
                // 'container-size  [--hexagon-container-aspect:calc(var(--hexagon-container-unitless-width-px)/var(--hexagon-container-unitless-height-px))] [--hexagon-container-property-100cqh:100cqh] [--hexagon-container-property-100cqw:100cqw] [--hexagon-container-unitless-height-px:calc(10000*tan(atan2(var(--hexagon-container-property-100cqh),10000px)))] [--hexagon-container-unitless-width-px:calc(10000*tan(atan2(var(--hexagon-container-property-100cqw),10000px)))] [--hexagon-height-container-to-viewbox:calc(var(--hexagon-container-unitless-height-px)/346.6)] [--hexagon-ratio-of-aspects:calc((400/346.6)/var(--hexagon-container-aspect))] [--hexagon-width-container-to-viewbox:calc(var(--hexagon-container-unitless-width-px)/400)]',
                // 'after:absolute after:right-0 after:top-0 after:h-[50px] after:w-[200px] after:content-["w:_"_counter(w)_"h:_"_counter(h)_"aspect:_"_counter(aspect)] after:[counter-reset:w_var(--hexagon-container-unitless-width-px)_h_var(--hexagon-container-unitless-height-px)_aspect_var(--hexagon-container-aspect)]',
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
            <div className="opacity-15">
                {backgroundHexagons.map((regularHexagonData, idx) => (
                    <Hexagon
                        key={`hex-background-index-${idx}`}
                        data={regularHexagonData}
                        routeName={routeName}
                        containerSize={containerSize}
                        hamburgerMenuIsActive={false}
                    />
                ))}
            </div>

            {regularHexagons.map((regularHexagonData, idx) => (
                <Hexagon
                    key={`hex-regular-index-${idx}`}
                    data={regularHexagonData}
                    routeName={routeName}
                    containerSize={containerSize}
                    hamburgerMenuIsActive={hamburgerMenuIsActive}
                />
            ))}

            {/* Background */}
            <div
                className={classNames(
                    'before-glassmorphic-backdrop glassmorphic-level-4 before:!bottom-[3.5%] before:!left-[37%] before:!top-auto before:!h-[6%] before:!w-[26%] before:origin-bottom before:rounded-[8%_8%_8%_8%/35%_35%_35%_35%] before:border before:border-theme-text-background/[0.04] before:bg-theme-root-background/30 before:shadow-xl before:transition-transform before:delay-[--ui-animation-menu-transition-duration] before:duration-[calc(var(--ui-animation-menu-transition-duration)*2)]',
                    'absolute size-full',
                    'glassmorphic-grain-after after:!bottom-[3.5%] after:!left-[37%] after:!top-auto after:!h-[6%] after:!w-[26%] after:origin-bottom after:rounded-[8%_8%_8%_8%/35%_35%_35%_35%] after:transition-transform after:delay-[--ui-animation-menu-transition-duration] after:duration-[--ui-animation-menu-transition-duration]',
                    routeName === ROUTE.category ? 'before:scale-y-100 after:scale-y-100' : 'before:scale-y-0 after:scale-y-0',
                )}
            >
                {categoryNavigationButtons.map((categoryNavigationButtonData, idx) => (
                    <CategoryNavigationButton
                        key={`hex-nav-index-${idx}`}
                        buttonData={categoryNavigationButtonData}
                        containerSize={containerSize}
                        homeMenuTransitionStateUpdates={homeMenuTransitionStateUpdates}
                    />
                ))}
            </div>

            {halfRegularHexagons.map((regularHexagonData, idx) => (
                <Hexagon
                    key={`hex-half-regular-index-${idx}`}
                    data={regularHexagonData}
                    routeName={routeName}
                    containerSize={containerSize}
                    hamburgerMenuIsActive={hamburgerMenuIsActive}
                />
            ))}

            {/* Hamburger Menu, includes further <RegularHexagon> and <MenuButton>s */}
            <HamburgerMenu routeName={routeName} containerSize={containerSize} hamburgerMenuIsActive={hamburgerMenuIsActive} />

            {postNavigationButtons.map((postNavigationButtonData, idx) => (
                <MenuButtonHexagon
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

            let newTransforms, z;
            if (isActiveCategoryButton) {
                newTransforms = categoryNavigationButtonPositions['active'];
                z = 20;
            } else if (CATEGORY[name] === previousCategory) {
                newTransforms = categoryNavigationButtonPositions['left'];
                z = 0;
            } else {
                newTransforms = categoryNavigationButtonPositions['right'];
                z = 10;
            }

            const offsetTransforms = { ...buttonData[routeName], ...newTransforms };
            const { position, rotation, scale, isHalf, shouldOffset } = offsetTransforms;
            const style = calcCSSVariables(position, rotation, scale, isHalf, containerSize, {
                strokeWidth: 0,
                shouldOffset,
                offset: hexagonRouteOffsetValues[routeName][breakpoint ?? 'base'],
            });
            return { ...style, zIndex: z };
        } else {
            const { position, rotation, scale, isHalf, shouldOffset } = buttonData[routeName];

            return calcCSSVariables(position, rotation, scale, isHalf, containerSize, {
                shouldOffset,
                offset: hexagonRouteOffsetValues[routeName][breakpoint ?? 'base'],
            });
        }
    }, [breakpoint, buttonData, containerSize, isActiveCategoryButton, name, routeContent.category?.id, routeName]);

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
            strokeRadius={1}
            innerShadowRadius={6}
        >
            <span
                className={classNames(
                    'absolute left-0 top-0 flex size-full select-none items-center justify-center font-fjalla-one text-4xl font-semibold text-theme-secondary-lighter/75 transition-transform duration-[--ui-animation-menu-transition-duration]',
                    routeName === ROUTE.home ? '' : 'rotate-[calc(var(--hexagon-rotate)*-1)]',
                )}
            >
                {title}
            </span>
        </GlassmorphicButtonWrapper>
    );
});

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
            /* tw */ '[&_.regular-hexagon-named-class]:has-[.navigation-button-hexagon-class-code:hover]:[--glassmorphic-backdrop-saturate:0.75] [&_.regular-hexagon-named-class]:has-[.navigation-button-hexagon-class-code:hover]:!delay-[calc(var(--ui-animation-menu-transition-duration)/4*var(--regular-hexagon-transition-random-factor))]',
    },
    '3d': {
        base: /* tw */ '[--home-menu-rotation:-60deg] rotate-[--home-menu-rotation] [&_.navigation-button-hexagon-class-3d]:[filter:url(#lighter-inner)]',
        completed:
            /* tw */ '[&_.regular-hexagon-named-class]:has-[.navigation-button-hexagon-class-3d:hover]:[--glassmorphic-backdrop-saturate:0.75] [&_.regular-hexagon-named-class]:has-[.navigation-button-hexagon-class-3d:hover]:!delay-[calc(var(--ui-animation-menu-transition-duration)/4*var(--regular-hexagon-transition-random-factor))]',
    },
    'log': {
        base: /* tw */ '[--home-menu-rotation:180deg] rotate-[--home-menu-rotation] [&_.navigation-button-hexagon-class-log]:[filter:url(#lighter-inner)]',
        completed:
            /* tw */ '[&_.regular-hexagon-named-class]:has-[.navigation-button-hexagon-class-log:hover]:[--glassmorphic-backdrop-saturate:0.75] [&_.regular-hexagon-named-class]:has-[.navigation-button-hexagon-class-log:hover]:!delay-[calc(var(--ui-animation-menu-transition-duration)/4*var(--regular-hexagon-transition-random-factor))]',
    },
};

// Local Types

type TransitionTargetReached = boolean;

// delay-[--regular-hexagon-transition-delay] duration-[--regular-hexagon-transition-duration]
