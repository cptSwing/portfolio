import { classNames, keyDownA11y } from 'cpts-javascript-utilities';
import { CSSProperties, FC, memo, useContext, useMemo, useState } from 'react';
import { ROUTE } from '../types/enums';
import {
    calcCSSVariables,
    halfStrokedHexagonClipPathStatic,
    offsetHexagonTransforms,
    strokedHexagonClipPathStatic,
    transformCategoryHalfHexagons,
} from '../lib/shapeFunctions';
import { useZustand } from '../lib/zustand';
import { FunctionalButtonRouteData, HexagonRouteData } from '../types/types';
import { useNavigate } from 'react-router-dom';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import { categoryCardActiveHexagon } from '../lib/hexagonElements';
import useTimeout from '../hooks/useTimeout';

const baseClasses =
    /* tw */ 'glassmorphic-backdrop pointer-events-none glassmorphic-level-3 lighting-gradient transform-hexagon  absolute aspect-hex-flat w-[--hexagon-clip-path-width] origin-center bg-[--hexagon-fill-color] [clip-path:--hexagon-clip-path] ';
const baseTransitionClasses =
    /* tw */
    'transition-[transform,--hexagon-fill-color,--hexagon-lighting-gradient-counter-rotation,clip-path,backdrop-filter] delay-[calc(var(--ui-animation-menu-transition-duration)*var(--regular-hexagon-transition-random-factor)),_calc(var(--ui-animation-menu-transition-duration)*var(--regular-hexagon-transition-random-factor)),_calc(var(--ui-animation-menu-transition-duration)*var(--regular-hexagon-transition-random-factor)),_calc(var(--ui-animation-menu-transition-duration)*var(--regular-hexagon-transition-random-factor)),_0ms] duration-[calc(var(--ui-animation-menu-transition-duration)*(var(--regular-hexagon-transition-random-factor)+1)),_calc(var(--ui-animation-menu-transition-duration)*(var(--regular-hexagon-transition-random-factor)+1)),_calc(var(--ui-animation-menu-transition-duration)*(var(--regular-hexagon-transition-random-factor)+1)),_var(--ui-animation-menu-transition-duration),_var(--ui-animation-menu-transition-duration)]';

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
                baseClasses,
                baseTransitionClasses,
                'regular-hexagon-named-class after-glassmorphic-grain',
                routeName === ROUTE.home
                    ? '!to-white/10'
                    : routeName === ROUTE.category
                      ? 'glassmorphic-off !to-white/[0.075] [--hexagon-fill-color:theme(colors.theme.root-background/0.666)]'
                      : // ROUTE.post
                        'glassmorphic-off [--hexagon-fill-color:theme(colors.theme.text-background)]',
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
            const halfHexagonCategoryOffsets = transformCategoryHalfHexagons(data[routeName], 4, true);
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

    const centerHexagonCssVariables_Memo = useMemo(
        () => calcCSSVariables(categoryCardActiveHexagon.position, 0, scale, false, containerSize),
        [containerSize, scale],
    );

    return (
        <div
            className={classNames(
                baseClasses,
                baseTransitionClasses,
                'regular-hexagon-named-class after-glassmorphic-grain',
                routeName === ROUTE.home
                    ? '!to-white/10'
                    : routeName === ROUTE.category
                      ? '!to-white/0 ![--glassmorphic-backdrop-blur:0px] ![--glassmorphic-backdrop-saturate:1] [--hexagon-fill-color:theme(colors.theme.secondary-darker/0.5)]'
                      : // ROUTE.post
                        'glassmorphic-off [--hexagon-fill-color:theme(colors.theme.text-background)]',
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
                              '--hexagon-scale-x': `calc(${cssVariables_Memo['--hexagon-scale-x']} * ${cardTransition ? 1.2 : 1})`,
                              '--hexagon-scale-y': `calc(${cssVariables_Memo['--hexagon-scale-y']} * ${cardTransition ? 1.2 : 1})`,
                              '--hexagon-clip-path': cardTransition ? 'var(--hexagon-clip-path-half)' : 'var(--hexagon-clip-path-half-stroked)',

                              'transitionDuration': `calc(var(--ui-animation-menu-transition-duration) * ${cardTransition ? 1.1 : 4}), calc(var(--ui-animation-menu-transition-duration) * (var(--regular-hexagon-transition-random-factor) + 1)), calc(var(--ui-animation-menu-transition-duration) * (var(--regular-hexagon-transition-random-factor) + 1)), calc(var(--ui-animation-menu-transition-duration) * ${cardTransition ? 1 : 8}), var(--ui-animation-menu-transition-duration)`,
                              'transitionDelay': `calc(var(--ui-animation-menu-transition-duration) * var(--regular-hexagon-transition-random-factor) * ${cardTransition ? 0 : 1}), calc(var(--ui-animation-menu-transition-duration) * var(--regular-hexagon-transition-random-factor)), calc(var(--ui-animation-menu-transition-duration) * var(--regular-hexagon-transition-random-factor)), calc(var(--ui-animation-menu-transition-duration) * var(--regular-hexagon-transition-random-factor) * ${cardTransition ? 0 : 0.75}), 0ms`,
                          }
                        : {}),
                } as CSSProperties
            }
        />
    );
};

export const HexagonDebugOne: FC<{
    data: HexagonRouteData;
    routeName: ROUTE;
}> = memo(({ data, routeName }) => {
    const { position, rotation, scale, isHalf } = data[routeName];

    const containerSize = useContext(GetChildSizeContext);

    const [shouldStroke, setShouldStroke] = useState(false);
    useTimeout(() => setShouldStroke((oldState) => !oldState), shouldStroke ? 3000 : 1500);

    const cssVariables_Memo = useMemo(
        () =>
            calcCSSVariables(position, rotation, scale, isHalf, containerSize, {
                clipStroke: shouldStroke,
            }),
        [position, rotation, scale, isHalf, containerSize, shouldStroke],
    );

    const random_Memo = useMemo(() => Math.random(), []);

    return (
        <div
            className={classNames(
                baseClasses,
                baseTransitionClasses,
                'regular-hexagon-named-class after-glassmorphic-grain',
                routeName === ROUTE.home
                    ? '!to-white/10'
                    : routeName === ROUTE.category
                      ? 'glassmorphic-off !to-white/[0.075] [--hexagon-fill-color:theme(colors.theme.root-background/0.666)]'
                      : // ROUTE.post
                        'glassmorphic-off [--hexagon-fill-color:theme(colors.theme.text-background)]',
            )}
            style={
                { ...cssVariables_Memo, '--regular-hexagon-transition-random-factor': random_Memo, '--glassmorphic-grain-scale': 0.5 / scale } as CSSProperties
            }
        />
    );
});

export const HexagonDebugTwo: FC<{
    data: HexagonRouteData;
    routeName: ROUTE;
}> = memo(({ data, routeName }) => {
    const { position, rotation, scale } = data[routeName];

    const containerSize = useContext(GetChildSizeContext);

    const [shouldBeHalf, setShouldBeHalf] = useState(false);
    useTimeout(() => setShouldBeHalf((oldState) => !oldState), shouldBeHalf ? 3000 : 1500);

    const cssVariables_Memo = useMemo(
        () => calcCSSVariables({ x: position.x - 200, y: position.y }, rotation, scale * 0.75, shouldBeHalf, containerSize),
        [position, rotation, scale, containerSize, shouldBeHalf],
    );

    const random_Memo = useMemo(() => Math.random(), []);

    return (
        <div
            className={classNames(
                baseClasses,
                baseTransitionClasses,
                'regular-hexagon-named-class after-glassmorphic-grain',
                routeName === ROUTE.home
                    ? '!to-white/10'
                    : routeName === ROUTE.category
                      ? 'glassmorphic-off !to-white/[0.075] [--hexagon-fill-color:theme(colors.theme.root-background/0.666)]'
                      : // ROUTE.post
                        'glassmorphic-off [--hexagon-fill-color:theme(colors.theme.text-background)]',
            )}
            style={
                { ...cssVariables_Memo, '--regular-hexagon-transition-random-factor': random_Memo, '--glassmorphic-grain-scale': 0.5 / scale } as CSSProperties
            }
        >
            <div
                className={baseTransitionClasses + ' absolute size-full bg-red-400 transition-[clip-path]'}
                style={{ clipPath: shouldBeHalf ? halfStrokedHexagonClipPathStatic : strokedHexagonClipPathStatic }}
            />
        </div>
    );
});

export const HexagonDebugThree: FC<{
    data: HexagonRouteData;
    routeName: ROUTE;
}> = memo(({ data, routeName }) => {
    const { position, rotation, scale } = data[routeName];

    const containerSize = useContext(GetChildSizeContext);

    const [shouldStroke, setShouldStroke] = useState(false);
    useTimeout(() => setShouldStroke((oldState) => !oldState), shouldStroke ? 3000 : 1500);

    const cssVariables_Memo = useMemo(
        () =>
            calcCSSVariables({ x: position.x + 200, y: position.y }, rotation, scale * 0.75, true, containerSize, {
                clipStroke: shouldStroke,
            }),
        [position, rotation, scale, containerSize, shouldStroke],
    );

    const random_Memo = useMemo(() => Math.random(), []);

    return (
        <div
            className={classNames(
                baseClasses,
                baseTransitionClasses,
                'regular-hexagon-named-class after-glassmorphic-grain',
                routeName === ROUTE.home
                    ? '!to-white/10'
                    : routeName === ROUTE.category
                      ? 'glassmorphic-off !to-white/[0.075] [--hexagon-fill-color:theme(colors.theme.root-background/0.666)]'
                      : // ROUTE.post
                        'glassmorphic-off [--hexagon-fill-color:theme(colors.theme.text-background)]',
            )}
            style={
                { ...cssVariables_Memo, '--regular-hexagon-transition-random-factor': random_Memo, '--glassmorphic-grain-scale': 0.5 / scale } as CSSProperties
            }
        />
    );
});

export const HexagonModalMenuButton: FC<{
    buttonData: FunctionalButtonRouteData;
    routeName: ROUTE;

    hamburgerMenuIsActive?: boolean;
}> = memo(({ buttonData, routeName, hamburgerMenuIsActive = false }) => {
    const { svgIconPath, target } = buttonData;
    const title = 'title' in buttonData ? buttonData.title : undefined;
    const containerSize = useContext(GetChildSizeContext);

    const cssVariables_Memo = useMemo(() => {
        const { position, rotation, scale, isHalf } = buttonData[routeName];

        return calcCSSVariables(position, rotation, scale, isHalf, containerSize, {
            gutterWidth: 0,
        });
    }, [buttonData, routeName, containerSize]);

    const random_Memo = useMemo(() => Math.random(), []);

    const navigate = useNavigate();
    function handleClick(ev: React.MouseEvent<HTMLDivElement>) {
        const targetResult = typeof target === 'string' ? target : target(ev);
        targetResult && navigate(targetResult);
    }

    return (
        <div
            className={classNames(
                baseClasses,
                baseTransitionClasses,
                'pointer-events-auto hover-active:delay-0 hover-active:duration-100 hover-active:[--tw-scale-x:calc(var(--hexagon-scale-x)*1.1)] hover-active:[--tw-scale-y:calc(var(--hexagon-scale-y)*1.1)]',
                hamburgerMenuIsActive ? '!glassmorphic-level-3' : 'glassmorphic-level-4',
                routeName === ROUTE.home
                    ? '!to-white/10'
                    : routeName === ROUTE.category
                      ? '!glassmorphic-level-none !to-white/10 [--hexagon-fill-color:theme(colors.theme.primary-darker/0.1)]'
                      : 'glassmorphic-off [--hexagon-fill-color:theme(colors.theme.text-background)]', // ROUTE.post
            )}
            style={
                {
                    ...cssVariables_Memo,
                    '--regular-hexagon-transition-random-factor': random_Memo,
                } as CSSProperties
            }
            onClick={handleClick}
            onKeyDown={keyDownA11y(handleClick)}
            role={'button'}
            tabIndex={-1}
        >
            <MenuButtonSvg svgIconPath={svgIconPath} title={title} />
        </div>
    );
});

export const MenuButtonSvg: FC<{
    svgIconPath: string;
    title?: string;
    counterRotate?: boolean;
}> = ({ svgIconPath, title, counterRotate = true }) => {
    return (
        <div
            className={classNames(
                'group flex size-full flex-col items-center justify-center',
                counterRotate ? 'rotate-[calc(var(--hexagon-rotate)*-1)] transition-transform duration-[--ui-animation-menu-transition-duration]' : '',
            )}
        >
            <div
                className="w-full flex-auto bg-theme-primary-lighter/50 matrix-transform matrix-scale-x-[calc(0.5/var(--hexagon-scale-x))] matrix-scale-y-[calc(0.5/var(--hexagon-scale-y))] [mask-position:50%_50%] [mask-repeat:no-repeat] [mask-size:calc(var(--hexagon-clip-path-width)*1.25*var(--hexagon-scale-x))] group-hover-active:bg-theme-text-background/50"
                style={
                    {
                        maskImage: `url(${svgIconPath})`,
                    } as CSSProperties
                }
            />

            {title && (
                <span className="-mt-2 select-none pb-2 font-lato text-2xl leading-none tracking-tighter text-theme-primary matrix-transform matrix-scale-x-[calc(0.5/var(--hexagon-scale-x))] matrix-scale-y-[calc(0.5/var(--hexagon-scale-y))] group-hover-active:text-theme-secondary-lighter">
                    {title}
                </span>
            )}
        </div>
    );
};
