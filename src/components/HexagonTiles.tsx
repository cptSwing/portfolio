import { CSSProperties, lazy, Suspense, useLayoutEffect, useMemo, useState } from 'react';
import { classNames } from 'cpts-javascript-utilities';
import { CategoryName, RotateShortestDistance, TransitionTargetReached } from '../types/types';
import {
    regularHexagonElements,
    halfregularHexagonElements,
    functionalButtonElements,
    openHamburgerButtonElement,
    categoryLinkButtonElements,
} from '../lib/hexagonElements';
import { useZustand } from '../lib/zustand';
import { getCurrentElementRotation } from 'cpts-javascript-utilities';
import { CATEGORY, ROUTE } from '../types/enums';
import { CenterHexagon, HalfHexagon, Hexagon, MarkActiveCategoryHexagon } from './HexagonShapes';
import Brand from './Brand';
import GetChildSize from './utilityComponents/GetChildSize';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import useRotateDegrees from '../hooks/useRotateDegrees';
import useMouseRotate from '../hooks/useMouseRotate';
import CategoryBlurb from './CategoryBlurb';
import { CategoryLinkButton, FunctionalButton, FunctionalButtonOpenHamburgerMenu } from './HexagonShapeButtons';

const Category = lazy(() => import('./routes/Category'));

const HexagonTiles = () => {
    const routeName = useZustand((store) => store.values.routeData.name);

    const homeMenuTransitionStateUpdates = useState<[CategoryName | null, TransitionTargetReached, RotateShortestDistance]>([null, false, true]);
    const [homeMenuTransitionState, setHomeMenuTransitionState] = homeMenuTransitionStateUpdates;
    const [homeMenuTransitionTarget, homeMenuTransitionTargetReached, shortestDistance] = homeMenuTransitionState;

    useMouseRotate(setHomeMenuTransitionState, routeName === ROUTE.home);
    const rotationDegrees = useRotateDegrees(homeMenuTransitionTarget, shortestDistance, routeName === ROUTE.home);

    useLayoutEffect(() => {
        if (routeName !== ROUTE.home) {
            setHomeMenuTransitionState([null, true, true]);
        }
    }, [routeName, setHomeMenuTransitionState]);

    const navMenuTransitionClasses_Memo = useMemo(
        () => getHomeMenuTransitionClasses(homeMenuTransitionTarget, homeMenuTransitionTargetReached),
        [homeMenuTransitionTarget, homeMenuTransitionTargetReached],
    );

    return (
        <GetChildSize context={GetChildSizeContext}>
            <div
                className={classNames(
                    'container-size pointer-events-none absolute z-0 size-full transform-gpu overflow-visible duration-[--ui-animation-menu-transition-duration]',
                    routeName === ROUTE.home ? navMenuTransitionClasses_Memo : '',
                )}
                style={{ '--home-menu-rotation': rotationDegrees + 'deg' } as CSSProperties}
                onTransitionEnd={({ target, currentTarget }) => {
                    if (target === currentTarget) {
                        const elementRotation = getCurrentElementRotation(currentTarget);
                        if (homeMenuTransitionTarget && homeMenuRotationValues[homeMenuTransitionTarget] === elementRotation) {
                            setHomeMenuTransitionState(([prevTarget]) => [prevTarget, true, true]); // Set transition target as reached
                        }
                    }
                }}
            >
                {/* "Regular" Hexagons at ROUTE.category */}
                {regularHexagonElements.map((regularHexagonData, idx) => (
                    <Hexagon key={`hex-regular-index-${idx}`} data={regularHexagonData} routeName={routeName} />
                ))}

                <CenterHexagon routeName={routeName} homeMenuTransitionTargetReached={homeMenuTransitionTargetReached} />
                <CategoryBlurb show={routeName === ROUTE.home} homeMenuTransitionTarget={homeMenuTransitionTarget} />

                {/* "Half" Hexagons at ROUTE.category */}
                {halfregularHexagonElements.map((regularHexagonData, idx) => (
                    <HalfHexagon key={`hex-half-regular-index-${idx}`} data={regularHexagonData} routeName={routeName} />
                ))}

                {routeName === ROUTE.category && (
                    <Suspense fallback={<div>Loading</div>}>
                        <Category show={routeName === ROUTE.category} />
                    </Suspense>
                )}

                <Brand homeMenuTransitionState={homeMenuTransitionState} />

                {categoryLinkButtonElements.map((categoryLinkButtonData, idx) => (
                    <CategoryLinkButton
                        key={`hex-category-link-button-index-${idx}`}
                        buttonData={categoryLinkButtonData}
                        homeMenuTransitionStateUpdates={homeMenuTransitionStateUpdates}
                    />
                ))}

                <MarkActiveCategoryHexagon homeMenuTransitionState={homeMenuTransitionState} />

                {functionalButtonElements.map((functionalButtonData, idx) => (
                    <FunctionalButton key={`hex-functional-button-index-${idx}`} buttonData={functionalButtonData} />
                ))}

                <FunctionalButtonOpenHamburgerMenu buttonData={openHamburgerButtonElement} homeMenuTransitionTarget={homeMenuTransitionTarget} />
            </div>
        </GetChildSize>
    );
};

export default HexagonTiles;

// Local Values

const homeMenuRotationValues: Record<CategoryName, number> = {
    'code': 60,
    '3d': -60,
    'log': 180,
};

const homeMenuTransitionGenericClasses = {
    base: /* tw */ 'rotate-[--home-menu-rotation,0deg] ',
    transitioning: /* tw */ '', // [&_.regular-hexagon-named-class]:[--glassmorphic-backdrop-saturate:4]
    completed: /* tw */ '',
};

const homeMenuTransitionBespokeClasses: Record<CategoryName, { transitioning: string; completed: string }> = {
    'code': {
        transitioning: /* tw */ '[&_.navigation-button-hexagon-class-code]:[--glassmorphic-backdrop-saturate:1.5]',
        completed:
            /* tw */ '[&_:is(.navigation-button-hexagon-class-3d,.navigation-button-hexagon-class-log)]:[--glassmorphic-backdrop-blur:3px] [&_:is(.navigation-button-hexagon-class-3d,.navigation-button-hexagon-class-log)]:[--glassmorphic-backdrop-saturate:2] [&_:is(.navigation-button-hexagon-class-3d,.navigation-button-hexagon-class-log)]:scale-95 [&_.navigation-button-hexagon-class-code]:[--glassmorphic-backdrop-saturate:4] [&_.navigation-button-hexagon-class-code]:scale-[1.2] [&_.regular-hexagon-named-class:not(.regular-hexagon-center-named-class)]:has-[.navigation-button-hexagon-class-code:hover]:[--glassmorphic-backdrop-saturate:1.25] [&_.regular-hexagon-named-class:not(.regular-hexagon-center-named-class)]:has-[.navigation-button-hexagon-class-code:hover]:!delay-[calc(var(--ui-animation-menu-transition-duration)/2*var(--regular-hexagon-transition-random-factor))]',
    },
    '3d': {
        transitioning: /* tw */ '[&_.navigation-button-hexagon-class-3d]:[--glassmorphic-backdrop-saturate:1.5]',
        completed:
            /* tw */ '[&_:is(.navigation-button-hexagon-class-code,.navigation-button-hexagon-class-log)]:[--glassmorphic-backdrop-blur:3px] [&_:is(.navigation-button-hexagon-class-code,.navigation-button-hexagon-class-log)]:[--glassmorphic-backdrop-saturate:2] [&_:is(.navigation-button-hexagon-class-code,.navigation-button-hexagon-class-log)]:scale-95 [&_.navigation-button-hexagon-class-3d]:[--glassmorphic-backdrop-saturate:4] [&_.navigation-button-hexagon-class-3d]:scale-[1.2] [&_.regular-hexagon-named-class:not(.regular-hexagon-center-named-class)]:has-[.navigation-button-hexagon-class-3d:hover]:[--glassmorphic-backdrop-saturate:1.25] [&_.regular-hexagon-named-class:not(.regular-hexagon-center-named-class)]:has-[.navigation-button-hexagon-class-3d:hover]:!delay-[calc(var(--ui-animation-menu-transition-duration)/2*var(--regular-hexagon-transition-random-factor))]',
    },
    'log': {
        transitioning: /* tw */ '[&_.navigation-button-hexagon-class-log]:[--glassmorphic-backdrop-saturate:1.5]',
        completed:
            /* tw */ '[&_:is(.navigation-button-hexagon-class-code,.navigation-button-hexagon-class-3d)]:[--glassmorphic-backdrop-blur:3px] [&_:is(.navigation-button-hexagon-class-code,.navigation-button-hexagon-class-3d)]:[--glassmorphic-backdrop-saturate:2] [&_:is(.navigation-button-hexagon-class-code,.navigation-button-hexagon-class-3d)]:scale-95 [&_.navigation-button-hexagon-class-log]:[--glassmorphic-backdrop-saturate:4] [&_.navigation-button-hexagon-class-log]:scale-[1.2] [&_.regular-hexagon-named-class:not(.regular-hexagon-center-named-class)]:has-[.navigation-button-hexagon-class-log:hover]:[--glassmorphic-backdrop-saturate:1.25] [&_.regular-hexagon-named-class:not(.regular-hexagon-center-named-class)]:has-[.navigation-button-hexagon-class-log:hover]:!delay-[calc(var(--ui-animation-menu-transition-duration)/2*var(--regular-hexagon-transition-random-factor))]',
    },
};

// Local Functions

function getHomeMenuTransitionClasses(category: CategoryName | null, transitionCompleted: boolean) {
    let classNames = homeMenuTransitionGenericClasses.base;

    if (category && Object.keys(CATEGORY).includes(category)) {
        if (transitionCompleted) {
            classNames = `${classNames} ${homeMenuTransitionGenericClasses.completed} ${homeMenuTransitionBespokeClasses[category].completed}`;
        } else {
            classNames = `${classNames} ${homeMenuTransitionGenericClasses.transitioning} ${homeMenuTransitionBespokeClasses[category].transitioning}`;
        }
    }
    return classNames;
}
