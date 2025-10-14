import { useEffect, useMemo, useState } from 'react';
import { classNames } from 'cpts-javascript-utilities';
import { CategoryName } from '../types/types';
import { regularHexagons, halfRegularHexagons } from '../lib/hexagonElements';
import { useZustand } from '../lib/zustand';
import { getCurrentElementRotation } from 'cpts-javascript-utilities';
import { CATEGORY, ROUTE } from '../types/enums';
import { HalfHexagon, Hexagon } from './HexagonShapes';
import Category from './routes/Category';
import Brand from './Brand';
import CategoryLinks from './CategoryLinks';
import FunctionalButtons from './FunctionalButtons';
import GetChildSize from './utilityComponents/GetChildSize';
import GetChildSizeContext from '../contexts/GetChildSizeContext';

const HexagonTiles = () => {
    const homeMenuTransitionStateUpdates = useState<[keyof typeof CATEGORY | null, TransitionTargetReached]>([null, true]);
    const [homeMenuTransitionStates, setHomeMenuTransitionStates] = homeMenuTransitionStateUpdates;
    const [homeMenuTransitionTarget, homeMenuTransitionTargetReached] = homeMenuTransitionStates;

    const routeName = useZustand((store) => store.values.routeData.name);

    useEffect(() => {
        if (routeName !== ROUTE.home) {
            setHomeMenuTransitionStates([null, true]);
        }
    }, [routeName, setHomeMenuTransitionStates]);

    const navMenuTransitionClasses_Memo = useMemo(
        () => getHomeMenuTransitionClasses(homeMenuTransitionTarget, homeMenuTransitionTargetReached),
        [homeMenuTransitionTarget, homeMenuTransitionTargetReached],
    );

    return (
        <GetChildSize context={GetChildSizeContext}>
            <div
                className={classNames(
                    'container-size pointer-events-none absolute z-0 size-full transform-gpu overflow-visible transition-transform duration-[calc(var(--ui-animation-menu-transition-duration)*1.5)]',
                    routeName === ROUTE.home ? navMenuTransitionClasses_Memo : '',
                )}
                onTransitionEnd={({ target, currentTarget }) => {
                    if (target === currentTarget) {
                        const elementRotation = getCurrentElementRotation(currentTarget);
                        if (homeMenuTransitionTarget && homeMenuRotationValues[homeMenuTransitionTarget].deg === elementRotation) {
                            // Set transition target as reached:
                            setHomeMenuTransitionStates(([prevTarget, _prevReached]) => [prevTarget, true]);
                        }
                    }
                }}
            >
                {/* "Regular" Hexagons at ROUTE.category */}
                {regularHexagons.map((regularHexagonData, idx) => (
                    <Hexagon key={`hex-regular-index-${idx}`} data={regularHexagonData} routeName={routeName} />
                ))}

                {/* "Half" Hexagons at ROUTE.category */}
                {halfRegularHexagons.map((regularHexagonData, idx) => (
                    <HalfHexagon key={`hex-half-regular-index-${idx}`} data={regularHexagonData} routeName={routeName} />
                ))}

                <Category show={routeName === ROUTE.category} />
                <Brand homeMenuTransitionStates={homeMenuTransitionStates} />

                <CategoryLinks homeMenuTransitionStateUpdates={homeMenuTransitionStateUpdates} />
                <FunctionalButtons homeMenuTransitionStates={homeMenuTransitionStates} />
            </div>
        </GetChildSize>
    );
};

export default HexagonTiles;

// Local Functions

function getHomeMenuTransitionClasses(category: CategoryName | null, transitionCompleted: boolean) {
    let classNames = homeMenuTransitionGenericClasses.base;

    if (category && Object.keys(CATEGORY).includes(category)) {
        classNames = `${classNames} ${homeMenuRotationValues[category].class}`;

        if (transitionCompleted) {
            classNames = `${classNames} ${homeMenuTransitionGenericClasses.completed} ${homeMenuTransitionBespokeClasses[category].completed}`;
        } else {
            classNames = `${classNames} ${homeMenuTransitionGenericClasses.transitioning} ${homeMenuTransitionBespokeClasses[category].transitioning}`;
        }
    }
    return classNames;
}

// Local Values

const homeMenuRotationValues: Record<CategoryName, { deg: number; class: string }> = {
    'code': { deg: 60, class: /* tw */ '[--home-menu-rotation:60deg]' },
    '3d': { deg: -60, class: /* tw */ '[--home-menu-rotation:-60deg]' },
    'log': { deg: 180, class: /* tw */ '[--home-menu-rotation:180deg]' },
};

const homeMenuTransitionGenericClasses = {
    base: /* tw */ 'rotate-[--home-menu-rotation,0deg] ',
    transitioning:
        /* tw */ '[&_.regular-hexagon-named-class]:[--glassmorphic-backdrop-saturate:4] [&_.regular-hexagon-center-named-class]:z-0 [&_.regular-hexagon-center-named-class]:scale-x-[calc(var(--hexagon-scale-x)*0.8)] [&_.regular-hexagon-center-named-class]:scale-y-[calc(var(--hexagon-scale-y)*0.8)]',
    completed:
        /* tw */ '[&_.regular-hexagon-center-named-class]:z-10 [&_.regular-hexagon-center-named-class]:[--glassmorphic-backdrop-blur:4px] [&_.regular-hexagon-center-named-class]:[--glassmorphic-backdrop-saturate:1.25] [&_.regular-hexagon-center-named-class]:scale-x-[calc(var(--hexagon-scale-x)*2.2)] [&_.regular-hexagon-center-named-class]:scale-y-[calc(var(--hexagon-scale-y)*2.2)]',
};

// TODO filter lighter-inner to be replaced
const homeMenuTransitionBespokeClasses: Record<CategoryName, { transitioning: string; completed: string }> = {
    'code': {
        transitioning: /* tw */ '[&_.navigation-button-hexagon-class-code]:[--glassmorphic-backdrop-saturate:1.5]',
        completed:
            /* tw */ '[&_:is(.navigation-button-hexagon-class-3d,.navigation-button-hexagon-class-log)]:[--glassmorphic-backdrop-blur:3px] [&_:is(.navigation-button-hexagon-class-3d,.navigation-button-hexagon-class-log)]:[--glassmorphic-backdrop-saturate:2] [&_:is(.navigation-button-hexagon-class-3d,.navigation-button-hexagon-class-log)]:scale-95 [&_.navigation-button-hexagon-class-code]:animate-grow-shrink [&_.navigation-button-hexagon-class-code]:[--glassmorphic-backdrop-saturate:4] [&_.navigation-button-hexagon-class-code]:scale-[1.2] [&_.regular-hexagon-named-class:not(.regular-hexagon-center-named-class)]:has-[.navigation-button-hexagon-class-code:hover]:[--glassmorphic-backdrop-saturate:1.25] [&_.regular-hexagon-named-class:not(.regular-hexagon-center-named-class)]:has-[.navigation-button-hexagon-class-code:hover]:!delay-[calc(var(--ui-animation-menu-transition-duration)/2*var(--regular-hexagon-transition-random-factor))]',
    },
    '3d': {
        transitioning: /* tw */ '[&_.navigation-button-hexagon-class-3d]:[--glassmorphic-backdrop-saturate:1.5]',
        completed:
            /* tw */ '[&_:is(.navigation-button-hexagon-class-code,.navigation-button-hexagon-class-log)]:[--glassmorphic-backdrop-blur:3px] [&_:is(.navigation-button-hexagon-class-code,.navigation-button-hexagon-class-log)]:[--glassmorphic-backdrop-saturate:2] [&_:is(.navigation-button-hexagon-class-code,.navigation-button-hexagon-class-log)]:scale-95 [&_.navigation-button-hexagon-class-3d]:animate-grow-shrink [&_.navigation-button-hexagon-class-3d]:[--glassmorphic-backdrop-saturate:4] [&_.navigation-button-hexagon-class-3d]:scale-[1.2] [&_.regular-hexagon-named-class:not(.regular-hexagon-center-named-class)]:has-[.navigation-button-hexagon-class-3d:hover]:[--glassmorphic-backdrop-saturate:1.25] [&_.regular-hexagon-named-class:not(.regular-hexagon-center-named-class)]:has-[.navigation-button-hexagon-class-3d:hover]:!delay-[calc(var(--ui-animation-menu-transition-duration)/2*var(--regular-hexagon-transition-random-factor))]',
    },
    'log': {
        transitioning: /* tw */ '[&_.navigation-button-hexagon-class-log]:[--glassmorphic-backdrop-saturate:1.5]',
        completed:
            /* tw */ '[&_:is(.navigation-button-hexagon-class-code,.navigation-button-hexagon-class-3d)]:[--glassmorphic-backdrop-blur:3px] [&_:is(.navigation-button-hexagon-class-code,.navigation-button-hexagon-class-3d)]:[--glassmorphic-backdrop-saturate:2] [&_:is(.navigation-button-hexagon-class-code,.navigation-button-hexagon-class-3d)]:scale-95 [&_.navigation-button-hexagon-class-log]:animate-grow-shrink [&_.navigation-button-hexagon-class-log]:[--glassmorphic-backdrop-saturate:4] [&_.navigation-button-hexagon-class-log]:scale-[1.2] [&_.regular-hexagon-named-class:not(.regular-hexagon-center-named-class)]:has-[.navigation-button-hexagon-class-log:hover]:[--glassmorphic-backdrop-saturate:1.25] [&_.regular-hexagon-named-class:not(.regular-hexagon-center-named-class)]:has-[.navigation-button-hexagon-class-log:hover]:!delay-[calc(var(--ui-animation-menu-transition-duration)/2*var(--regular-hexagon-transition-random-factor))]',
    },
};

// [&_.navigation-button-hexagon-class-3d]:[--glassmorphic-backdrop-blur:3px]

// Local Types

type TransitionTargetReached = boolean;
