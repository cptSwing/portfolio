import { classNames, keyDownA11y } from 'cpts-javascript-utilities';
import { CSSProperties, FC, memo, useContext, useMemo } from 'react';
import { ROUTE } from '../types/enums';
import {
    calcCSSVariables,
    categoryCardActiveHexagon,
    hexagonRouteOffsetValues,
    offsetHexagonTransforms,
    transformCategoryHalfHexagons,
} from '../lib/hexagonDataNew';
import { useZustand } from '../lib/zustand';
import { HexagonRouteData, MenuButtonRouteData, PostNavigationButtonRouteData } from '../types/types';
import { useNavigate } from 'react-router-dom';
import GetChildSizeContext from '../contexts/GetChildSizeContext';

const baseClasses =
    /* tw */ 'glassmorphic-backdrop pointer-events-none glassmorphic-level-3 lighting-gradient transform-hexagon  absolute aspect-hex-flat w-[--hexagon-clip-path-width] origin-center bg-[--hexagon-fill-color] [clip-path:--hexagon-clip-path] ';
const baseTransitionClasses =
    /* tw */
    'transition-[transform,--hexagon-fill-color,--hexagon-lighting-gradient-counter-rotation,clip-path,backdrop-filter] delay-[calc(var(--ui-animation-menu-transition-duration)*var(--regular-hexagon-transition-random-factor)),_calc(var(--ui-animation-menu-transition-duration)*var(--regular-hexagon-transition-random-factor)),_calc(var(--ui-animation-menu-transition-duration)*var(--regular-hexagon-transition-random-factor)),_0ms,_0ms] duration-[calc(var(--ui-animation-menu-transition-duration)*(var(--regular-hexagon-transition-random-factor)+1)),_calc(var(--ui-animation-menu-transition-duration)*(var(--regular-hexagon-transition-random-factor)+1)),_calc(var(--ui-animation-menu-transition-duration)*(var(--regular-hexagon-transition-random-factor)+1)),_var(--ui-animation-menu-transition-duration),_var(--ui-animation-menu-transition-duration)]';

export const Hexagon: FC<{
    data: HexagonRouteData;
    routeName: ROUTE;
}> = memo(({ data, routeName }) => {
    const { position, rotation, scale, isHalf, shouldOffset } = data[routeName];

    const runIrisTransition = useZustand((state) => state.values.runIrisTransition);
    const breakpoint = useZustand((state) => state.values.breakpoint);

    const containerSize = useContext(GetChildSizeContext);

    const cssVariables_Memo = useMemo(
        () =>
            calcCSSVariables(position, rotation, scale, isHalf, containerSize, {
                shouldOffset,
                offset: hexagonRouteOffsetValues[routeName][breakpoint ?? 'base'],
            }),
        [position, rotation, scale, isHalf, containerSize, shouldOffset, routeName, breakpoint],
    );

    const centerHexagonCssVariables_Memo = useMemo(
        () =>
            calcCSSVariables(categoryCardActiveHexagon.position, 0, scale, false, containerSize, {
                shouldOffset,
                offset: hexagonRouteOffsetValues[routeName][breakpoint ?? 'base'],
            }),
        [breakpoint, containerSize, routeName, scale, shouldOffset],
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
                      ? isHalf
                          ? '!to-white/[0.075] ![--glassmorphic-backdrop-blur:1px] [--hexagon-fill-color:theme(colors.theme.primary-darker/0.25)]'
                          : 'glassmorphic-off !to-white/[0.075] [--hexagon-fill-color:theme(colors.theme.root-background/0.666)]'
                      : // ROUTE.post
                        'glassmorphic-off [--hexagon-fill-color:theme(colors.theme.text-background)]',
            )}
            style={
                {
                    ...cssVariables_Memo,
                    '--regular-hexagon-transition-random-factor': random_Memo,
                    '--glassmorphic-grain-scale': 0.5 / scale,
                    ...(routeName === ROUTE.category && isHalf
                        ? {
                              '--hexagon-translate-x': runIrisTransition
                                  ? centerHexagonCssVariables_Memo['--hexagon-translate-x']
                                  : cssVariables_Memo['--hexagon-translate-x'],
                              '--hexagon-translate-y': runIrisTransition
                                  ? centerHexagonCssVariables_Memo['--hexagon-translate-y']
                                  : cssVariables_Memo['--hexagon-translate-y'],
                              '--hexagon-rotate': `calc(${cssVariables_Memo['--hexagon-rotate']} + (240deg * ${runIrisTransition ? 1 : 0}))`,
                              '--hexagon-scale-x': `calc(${cssVariables_Memo['--hexagon-scale-x']} * ${runIrisTransition ? 1.2 : 1})`,
                              '--hexagon-scale-y': `calc(${cssVariables_Memo['--hexagon-scale-y']} * ${runIrisTransition ? 1.2 : 1})`,

                              'transitionDuration': `calc(var(--ui-animation-menu-transition-duration) / ${runIrisTransition ? 1.5 : 1}), calc(var(--ui-animation-menu-transition-duration) * (${random_Memo} + 1)), calc(var(--ui-animation-menu-transition-duration) * (${random_Memo} + 1)), var(--ui-animation-menu-transition-duration), var(--ui-animation-menu-transition-duration)`,
                              'transitionDelay': `calc(var(--ui-animation-menu-transition-duration) * ${random_Memo} * ${runIrisTransition ? 0 : 1}), calc(var(--ui-animation-menu-transition-duration) * ${random_Memo}), calc(var(--ui-animation-menu-transition-duration) * ${random_Memo}), 0ms, 0ms`,
                          }
                        : {}),
                } as CSSProperties
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

    return <Hexagon data={categoryAdjustedData_Memo} routeName={routeName} />;
};

export const HexagonModalMenuButton: FC<{
    buttonData: MenuButtonRouteData | PostNavigationButtonRouteData;
    routeName: ROUTE;

    hamburgerMenuIsActive?: boolean;
}> = memo(({ buttonData, routeName, hamburgerMenuIsActive = false }) => {
    const { svgIconPath, target } = buttonData;
    const title = 'title' in buttonData ? buttonData.title : undefined;
    const breakpoint = useZustand((state) => state.values.breakpoint);
    const containerSize = useContext(GetChildSizeContext);

    const cssVariables_Memo = useMemo(() => {
        const { position, rotation, scale, isHalf, shouldOffset } = buttonData[routeName];

        return calcCSSVariables(position, rotation, scale, isHalf, containerSize, {
            strokeWidth: 0,
            shouldOffset,
            offset: hexagonRouteOffsetValues[routeName][breakpoint ?? 'base'],
        });
    }, [buttonData, routeName, containerSize, breakpoint]);

    const random_Memo = useMemo(() => Math.random(), []);

    const navigate = useNavigate();
    function handleClick(ev: React.MouseEvent<HTMLDivElement>) {
        // @ts-expect-error this will not lead to problems, trust me
        const targetResult = typeof target === 'string' ? target : target(ev);
        targetResult && navigate(targetResult);
    }

    return (
        <div
            className={classNames(
                baseClasses,
                baseTransitionClasses,
                'hover-active:delay-0 hover-active:duration-100 hover-active:[--tw-scale-x:calc(var(--hexagon-scale-x)*1.1)] hover-active:[--tw-scale-y:calc(var(--hexagon-scale-y)*1.1)]',
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
                className="w-full flex-auto bg-theme-primary-lighter/50 matrix-transform matrix-scale-x-[calc(0.5/var(--hexagon-scale-x))] matrix-scale-y-[calc(0.5/var(--hexagon-scale-y))] [mask-position:50%_40%] [mask-repeat:no-repeat] [mask-size:75%] group-hover-active:bg-theme-text-background/50"
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
