import { classNames } from 'cpts-javascript-utilities';
import { CSSProperties, FC, memo, useContext, useLayoutEffect, useMemo, useState } from 'react';
import { ROUTE } from '../types/enums';
import { calcCSSVariables, offsetHexagonTransforms, shutterAnimationTransforms } from '../lib/shapeFunctions';
import { useZustand } from '../lib/zustand';
import { CategoryName, HexagonRouteData, RotateShortestDistance, TransitionTargetReached } from '../types/types';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import {
    categoryCardActive,
    categoryLinkButtonElements,
    centerHexagonElement,
    centerHexagonElementOffsets,
    markActiveHexagonElement,
    markActiveHexagonElementOffsets,
} from '../lib/hexagonElements';
import { database } from '../types/exportTyped';

export const Hexagon: FC<{
    data: HexagonRouteData;
    routeName: ROUTE;
}> = memo(({ data, routeName }) => {
    const { position, rotation, scale, isHalf } = data[routeName];
    const containerSize = useContext(GetChildSizeContext);

    const cssVariables_Memo = useMemo(
        () => calcCSSVariables(position, rotation, scale, isHalf, containerSize),
        [position, rotation, scale, isHalf, containerSize],
    );

    const random_Memo = useMemo(() => Math.random(), []);

    return (
        <div
            className={classNames(
                'regular-hexagon-base regular-hexagon-transitions regular-hexagon-named-class',
                routeName === ROUTE.home
                    ? '[--glassmorphic-backdrop-blur:2px] [--glassmorphic-backdrop-saturate:2] [--lighting-gradient-to:theme(colors.white/0.1)]'
                    : routeName === ROUTE.category
                      ? '!to-white/[0.025] backdrop-blur-none [--glassmorphic-backdrop-saturate:1.5] [--hexagon-fill-color:theme(colors.theme.root-background/0.666)]'
                      : // ROUTE.post
                        '!to-transparent ![--glassmorphic-backdrop-blur:0px] ![--glassmorphic-backdrop-saturate:1] ![--hexagon-fill-color:theme(colors.theme.text-background)] after:!content-none',
            )}
            style={
                { ...cssVariables_Memo, '--regular-hexagon-transition-random-factor': random_Memo, '--glassmorphic-grain-scale': 0.5 / scale } as CSSProperties
            }
        />
    );
});

export const CenterHexagon: FC<{
    routeName: ROUTE;
    homeMenuTransitionTargetReached: boolean;
}> = memo(({ routeName, homeMenuTransitionTargetReached }) => {
    const cardTransition = useZustand((state) => state.values.cardTransition);
    const containerSize = useContext(GetChildSizeContext);
    const [scale, setScale] = useState(centerHexagonElement[routeName].scale);

    const cssVariables_Memo = useMemo(() => {
        let routeTransforms = centerHexagonElement[routeName];
        if (routeName === ROUTE.home && homeMenuTransitionTargetReached) {
            routeTransforms = offsetHexagonTransforms(centerHexagonElement, centerHexagonElementOffsets)[routeName];
        } else if (routeName === ROUTE.category && cardTransition) {
            routeTransforms = offsetHexagonTransforms(centerHexagonElement, centerHexagonElementOffsets)[routeName];
        }

        const { position, rotation, scale, isHalf } = routeTransforms;
        setScale(scale);

        return calcCSSVariables(
            position,
            rotation,
            scale,
            isHalf,
            containerSize,
            routeName === ROUTE.category
                ? {
                      clipStroke: true,
                      gutterWidth: 0,
                  }
                : {},
        );
    }, [cardTransition, containerSize, homeMenuTransitionTargetReached, routeName]);

    return (
        <div
            className={classNames(
                'regular-hexagon-base regular-hexagon-transitions regular-hexagon-center-named-class',
                routeName === ROUTE.home
                    ? `[--glassmorphic-backdrop-saturate:2] [--lighting-gradient-to:theme(colors.white/0.1)] ${!cardTransition && homeMenuTransitionTargetReached ? '[--glassmorphic-backdrop-blur:2px] ![--hexagon-clip-path:--hexagon-clip-path-rectangle]' : '[--glassmorphic-backdrop-blur:1px]'}` // '!to-white/10 [--glassmorphic-backdrop-blur:2px] [--glassmorphic-backdrop-saturate:2]' //
                    : routeName === ROUTE.category
                      ? '[--glassmorphic-backdrop-blur:0px] [--glassmorphic-backdrop-saturate:1] [--lighting-gradient-to:transparent] ' +
                        (cardTransition // must have transition-duration synced to store_setTimedCardTransition(), and no delay!
                            ? '[--hexagon-fill-color:transparent] ![clip-path:--hexagon-clip-path-full-wider-stroke]'
                            : '[--hexagon-fill-color:theme(colors.neutral.400/0.10)] ![clip-path:--hexagon-clip-path-full-stroke]')
                      : // ROUTE.post
                        '[--glassmorphic-backdrop-blur:0px] [--glassmorphic-backdrop-saturate:1] [--hexagon-fill-color:theme(colors.theme.text-background)]',
            )}
            style={{ ...cssVariables_Memo, '--regular-hexagon-transition-random-factor': 0, '--glassmorphic-grain-scale': 0.5 / scale } as CSSProperties}
        />
    );
});

export const HalfHexagon: FC<{
    data: HexagonRouteData;
    routeName: ROUTE;
}> = ({ data, routeName }) => {
    const categoryAdjustedData_Memo = useMemo(() => {
        if (routeName === ROUTE.category) {
            const halfHexagonCategoryOffsets = shutterAnimationTransforms(data[routeName], 4, true);
            return offsetHexagonTransforms(data, halfHexagonCategoryOffsets);
        } else {
            return data;
        }
    }, [data, routeName]);

    const { position, rotation, scale, isHalf } = categoryAdjustedData_Memo[routeName];

    const cardTransition = useZustand((state) => state.values.cardTransition);
    const containerSize = useContext(GetChildSizeContext);

    const random_Memo = useMemo(() => Math.random() + 1, []);

    const cssVariables_Memo = useMemo(
        () => calcCSSVariables(position, rotation, scale, isHalf, containerSize),
        [position, rotation, scale, isHalf, containerSize],
    );

    const centerHexagonCssVariables_Memo = useMemo(() => calcCSSVariables(categoryCardActive.position, 0, scale, false, containerSize), [containerSize, scale]);

    return (
        <div
            className={classNames(
                'regular-hexagon-base regular-hexagon-transitions regular-hexagon-named-class',
                routeName === ROUTE.home
                    ? '[--glassmorphic-backdrop-blur:2px] [--glassmorphic-backdrop-saturate:2] [--lighting-gradient-to:theme(colors.white/0.1)]'
                    : routeName === ROUTE.category
                      ? '[--glassmorphic-backdrop-blur:2px] [--glassmorphic-backdrop-saturate:1.5] [--hexagon-fill-color:theme(colors.theme.secondary-darker/0.5)] [--lighting-gradient-to:theme(colors.transparent)]'
                      : // ROUTE.post
                        '[--glassmorphic-backdrop-blur:0px] [--glassmorphic-backdrop-saturate:1] [--hexagon-fill-color:theme(colors.theme.text-background)]',
            )}
            style={
                {
                    ...cssVariables_Memo,
                    '--regular-hexagon-transition-random-factor': random_Memo,
                    '--glassmorphic-grain-scale': 0.5 / scale,
                    ...(routeName === ROUTE.category
                        ? {
                              '--hexagon-translate-x': cardTransition
                                  ? centerHexagonCssVariables_Memo['--hexagon-translate-x']
                                  : cssVariables_Memo['--hexagon-translate-x'],
                              '--hexagon-translate-y': cardTransition
                                  ? centerHexagonCssVariables_Memo['--hexagon-translate-y']
                                  : cssVariables_Memo['--hexagon-translate-y'],
                              '--hexagon-rotate': `calc(${cssVariables_Memo['--hexagon-rotate']} + (240deg * ${cardTransition ? 1 : 0}))`,
                              '--hexagon-scale-x': `calc(${cssVariables_Memo['--hexagon-scale-x']} * ${cardTransition ? 0.5 : 1})`,
                              '--hexagon-scale-y': `calc(${cssVariables_Memo['--hexagon-scale-y']} * ${cardTransition ? 0.5 : 1})`,
                              '--hexagon-clip-path': cardTransition ? 'var(--hexagon-clip-path-half)' : 'var(--hexagon-clip-path-half-stroked)',

                              'transitionDuration': `calc(var(--ui-animation-menu-transition-duration) * ${cardTransition ? 1 : 4}), calc(var(--ui-animation-menu-transition-duration) * (var(--regular-hexagon-transition-random-factor) + 1)), calc(var(--ui-animation-menu-transition-duration) * (var(--regular-hexagon-transition-random-factor) + 1)), calc(var(--ui-animation-menu-transition-duration) * ${cardTransition ? 1 : 8}), var(--ui-animation-menu-transition-duration)`,
                              'transitionDelay': `calc(var(--ui-animation-menu-transition-duration) * var(--regular-hexagon-transition-random-factor) * ${cardTransition ? 0 : 1}), calc(var(--ui-animation-menu-transition-duration) * var(--regular-hexagon-transition-random-factor)), calc(var(--ui-animation-menu-transition-duration) * var(--regular-hexagon-transition-random-factor)), calc(var(--ui-animation-menu-transition-duration) * var(--regular-hexagon-transition-random-factor) * ${cardTransition ? 0 : 0.75}), 0ms`,
                          }
                        : {}),
                } as CSSProperties
            }
        />
    );
};

export const MarkActiveCategoryHexagon: FC<{
    homeMenuTransitionState: [CategoryName | null, TransitionTargetReached, RotateShortestDistance];
}> = ({ homeMenuTransitionState }) => {
    const [homeMenuTransitionTarget, homeMenuTransitionTargetReached] = homeMenuTransitionState;

    const cardTransition = useZustand((state) => state.values.cardTransition);
    const {
        name: routeName,
        content: { category },
    } = useZustand((state) => state.values.routeData);

    const containerSize = useContext(GetChildSizeContext);

    const [activeCategory, setActiveCategory] = useState<CategoryName | null>(null);
    useLayoutEffect(() => {
        if (routeName === ROUTE.home && homeMenuTransitionTargetReached) {
            setActiveCategory(homeMenuTransitionTarget);
        } else if (routeName === ROUTE.category && category) {
            const activeCategory = Object.keys(database).find((categoryName) => database[categoryName as CategoryName].id === category.id) as CategoryName;
            setActiveCategory(activeCategory);
        }
    }, [category, homeMenuTransitionTarget, homeMenuTransitionTargetReached, routeName]);

    const cssVariables_Memo = useMemo(() => {
        let routeTransforms = markActiveHexagonElement[routeName];

        if (activeCategory) {
            const categoryIndex = categoryIndices[activeCategory] ?? 0;
            const categoryPosition = categoryLinkButtonElements[categoryIndex][routeName].position;
            const updatedOffsets = {
                ...markActiveHexagonElementOffsets,
                [routeName]: { ...markActiveHexagonElementOffsets[routeName], position: categoryPosition },
            };

            routeTransforms = offsetHexagonTransforms(markActiveHexagonElement, updatedOffsets)[routeName];
        } else if (cardTransition) {
            routeTransforms = offsetHexagonTransforms(markActiveHexagonElement, markActiveHexagonElementOffsets)[routeName];
        }

        const { position, rotation, scale, isHalf } = routeTransforms;
        return calcCSSVariables(position, rotation, scale, isHalf, containerSize, {
            clipStroke: true,
            gutterWidth: 0,
        });
    }, [activeCategory, cardTransition, containerSize, routeName]);

    return (
        <div
            className={classNames(
                'transform-hexagon absolute z-50 aspect-hex-flat w-[--hexagon-clip-path-width] transition-[background-color,clip-path,transform] duration-[--ui-animation-menu-transition-duration]',
                routeName === ROUTE.home
                    ? 'bg-theme-secondary-lighter/70 [clip-path:--hexagon-clip-path-full-stroke]'
                    : routeName === ROUTE.category
                      ? 'bg-theme-secondary-lighter/50 [clip-path:--hexagon-clip-path-full-wider-stroke]'
                      : '',
            )}
            style={{ ...cssVariables_Memo } as CSSProperties}
        />
    );
};

const categoryIndices: Partial<Record<CategoryName, number>> = {};
categoryLinkButtonElements.forEach((routeData, index) => {
    categoryIndices[routeData.name] = index;
});
