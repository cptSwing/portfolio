import { useEffect, useMemo, useState } from 'react';
import { classNames } from 'cpts-javascript-utilities';
import { CategoryName } from '../types/types';
import { regularHexagons, postNavigationButtons, backgroundHexagons, halfRegularHexagons } from '../lib/hexagonDataNew';
import { useZustand } from '../lib/zustand';
import { getCurrentElementRotation } from 'cpts-javascript-utilities';
import { CATEGORY, ROUTE } from '../types/enums';
import HamburgerMenu from './HamburgerMenu';
import { HalfHexagon, Hexagon, HexagonModalMenuButton } from './HexagonShapes';
import MenuBar from './MenuBar';
import Category from './routes/Category';

const HexagonTiles = () => {
    const homeMenuTransitionStateUpdates = useState<[keyof typeof CATEGORY | null, TransitionTargetReached]>([null, true]);
    const [[menuTransitionTarget, menuTransitionTargetReached], setMenuTransitionStates] = homeMenuTransitionStateUpdates;

    const routeName = useZustand((store) => store.values.routeData.name);
    const hamburgerMenuIsActive = useZustand((store) => store.values.hamburgerIsOpen);

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
                'container-size pointer-events-none absolute z-0 size-full transform-gpu overflow-visible transition-transform duration-[--ui-animation-menu-transition-duration]',
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
                    <Hexagon key={`hex-background-index-${idx}`} data={regularHexagonData} routeName={routeName} />
                ))}
            </div>

            {/* "Regular" Hexagons at ROUTE.category */}
            {regularHexagons.map((regularHexagonData, idx) => (
                <Hexagon key={`hex-regular-index-${idx}`} data={regularHexagonData} routeName={routeName} />
            ))}

            <Category show={routeName === ROUTE.category} />

            {/* "Half" Hexagons at ROUTE.category */}
            {halfRegularHexagons.map((regularHexagonData, idx) => (
                <HalfHexagon key={`hex-half-regular-index-${idx}`} data={regularHexagonData} routeName={routeName} />
            ))}

            {/* Hamburger Menu, includes further <RegularHexagon> and <MenuButton>s */}
            <HamburgerMenu routeName={routeName} hamburgerMenuIsActive={hamburgerMenuIsActive} />

            <MenuBar homeMenuTransitionStateUpdates={homeMenuTransitionStateUpdates} />

            {postNavigationButtons.map((postNavigationButtonData, idx) => (
                <HexagonModalMenuButton key={`hex-post-navigation-index-${idx}`} buttonData={postNavigationButtonData} routeName={routeName} />
            ))}
        </div>
    );
};

export default HexagonTiles;

// Local Functions

function getHomeMenuTransitionClasses(category: CategoryName | null, transitionCompleted: boolean) {
    let classNames = 'rotate-0';
    if (category && Object.keys(CATEGORY).includes(category)) {
        classNames = homeMenuTransitionClasses[category].base;
        if (transitionCompleted) classNames += ` ${homeMenuTransitionClasses[category].completed}`;
    }
    return classNames;
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
