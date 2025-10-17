import { classNames } from 'cpts-javascript-utilities';
import { CSSProperties, FC, memo, useContext, useMemo } from 'react';
import { ROUTE } from '../types/enums';
import { calcCSSVariables, carouselCssVariables, offsetHexagonTransforms, shutterAnimationTransforms } from '../lib/shapeFunctions';
import { useZustand } from '../lib/zustand';
import { HexagonRouteData, HexagonTransformData } from '../types/types';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import { categoryCardActive, hexagonGridTransformCenter } from '../lib/hexagonElements';

const baseClasses =
    /* tw */ 'glassmorphic-backdrop pointer-events-none regular-hexagon-named-class lighting-gradient transform-hexagon absolute aspect-hex-flat w-[--hexagon-clip-path-width] origin-center bg-[--hexagon-fill-color] [clip-path:--hexagon-clip-path]  after-glassmorphic-grain';
const baseTransitionClasses =
    /* tw */
    'transition-[transform,--hexagon-fill-color,--hexagon-lighting-gradient-counter-rotation,clip-path,backdrop-filter] delay-[calc(var(--ui-animation-menu-transition-duration)*var(--regular-hexagon-transition-random-factor)),_calc(var(--ui-animation-menu-transition-duration)*var(--regular-hexagon-transition-random-factor)),_calc(var(--ui-animation-menu-transition-duration)*var(--regular-hexagon-transition-random-factor)),_calc(var(--ui-animation-menu-transition-duration)*var(--regular-hexagon-transition-random-factor)),_0ms] duration-[calc(var(--ui-animation-menu-transition-duration)*(var(--regular-hexagon-transition-random-factor)+1)),_calc(var(--ui-animation-menu-transition-duration)*(var(--regular-hexagon-transition-random-factor)+1)),_calc(var(--ui-animation-menu-transition-duration)*(var(--regular-hexagon-transition-random-factor)+1)),_var(--ui-animation-menu-transition-duration),_var(--ui-animation-menu-transition-duration)]';

export const Hexagon: FC<{
    data: HexagonRouteData;
    routeName: ROUTE;
}> = memo(({ data, routeName }) => {
    const { position, rotation, scale, isHalf } = data[routeName];
    const isCenterHex = data[routeName].position.x === hexagonGridTransformCenter.x && data[routeName].position.y === hexagonGridTransformCenter.y;
    const containerSize = useContext(GetChildSizeContext);

    const cssVariables_Memo = useMemo(
        () => calcCSSVariables(position, rotation, scale, isHalf, containerSize),
        [position, rotation, scale, isHalf, containerSize],
    );

    const random_Memo = useMemo(() => Math.random(), []);

    return (
        <div
            className={classNames(
                baseClasses,
                baseTransitionClasses,
                isCenterHex ? 'regular-hexagon-center-named-class' : '',
                routeName === ROUTE.home
                    ? '!to-white/10 [--glassmorphic-backdrop-blur:2px] [--glassmorphic-backdrop-saturate:2]'
                    : routeName === ROUTE.category
                      ? '!to-white/[0.025] backdrop-blur-none [--glassmorphic-backdrop-saturate:1.5] [--hexagon-fill-color:theme(colors.theme.root-background/0.666)]'
                      : // ROUTE.post
                        '![--glassmorphic-backdrop-blur:0px] ![--glassmorphic-backdrop-saturate:1] [--hexagon-fill-color:theme(colors.theme.text-background)]',
            )}
            style={
                { ...cssVariables_Memo, '--regular-hexagon-transition-random-factor': random_Memo, '--glassmorphic-grain-scale': 0.5 / scale } as CSSProperties
            }
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
                baseClasses,
                baseTransitionClasses,
                routeName === ROUTE.home
                    ? '!to-white/10 [--glassmorphic-backdrop-blur:2px] [--glassmorphic-backdrop-saturate:2]'
                    : routeName === ROUTE.category
                      ? '!to-white/0 ![--glassmorphic-backdrop-blur:2px] ![--glassmorphic-backdrop-saturate:1.5] [--hexagon-fill-color:theme(colors.theme.secondary-darker/0.5)]'
                      : // ROUTE.post
                        '![--glassmorphic-backdrop-blur:0px] ![--glassmorphic-backdrop-saturate:1] [--hexagon-fill-color:theme(colors.theme.text-background)]',
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

export const CategoryOuterStroke: FC<{
    transformData: HexagonTransformData;
    containerSize: {
        width: number;
        height: number;
    };
}> = ({ transformData, containerSize }) => {
    const cardTransition = useZustand((state) => state.values.cardTransition);

    const cssVariables_Memo = useMemo(() => {
        const { position, rotation, scale, isHalf } = transformData!;
        return calcCSSVariables(position, rotation, scale, isHalf, containerSize, {
            clipStroke: false,
            gutterWidth: 0,
        });
    }, [containerSize, transformData]);

    return (
        <div
            className={classNames(
                'transform-hexagon absolute -z-50 aspect-hex-flat w-[--hexagon-clip-path-width] transition-[background-color,clip-path,transform] duration-[--ui-animation-menu-transition-duration]',
                cardTransition // must have transition-duration synced to store_setTimedCardTransition(), and no delay!
                    ? '!scale-[calc(var(--carousel-card-at-front-scale-x)*1.06)] bg-transparent [clip-path:--hexagon-clip-path-full-wider-stroke]'
                    : '!scale-[calc(var(--carousel-card-at-front-scale-x)*1.02)] bg-neutral-400/10 [clip-path:--hexagon-clip-path-full-stroke]',
            )}
            style={{ ...cssVariables_Memo, ...carouselCssVariables } as CSSProperties}
        />
    );
};
