import { classNames, keyDownA11y } from 'cpts-javascript-utilities';
import { CSSProperties, FC, memo, useMemo } from 'react';
import { ROUTE } from '../types/enums';
import {
    calcCSSVariables,
    hamburgerBackgroundHexagon,
    hamburgerBackgroundHexagonOffsets,
    hexagonRouteOffsetValues,
    offsetHexagonTransforms,
} from '../lib/hexagonDataNew';
import { useZustand } from '../lib/zustand';
import { HexagonRouteData, MenuButtonRouteData, PostNavigationButtonRouteData } from '../types/types';
import { useNavigate } from 'react-router-dom';

const baseClasses =
    /* tw */ 'glassmorphic-backdrop glassmorphic-level-3 lighting-gradient transform-hexagon pointer-events-auto absolute aspect-hex-flat w-[--hexagon-clip-path-width] origin-center bg-[--hexagon-fill-color] [clip-path:--hexagon-clip-path] ';
const baseTransitionClasses =
    /* tw */
    'transition-[transform,--hexagon-fill-color,--hexagon-lighting-gradient-counter-rotation,clip-path,backdrop-filter] delay-[calc(var(--ui-animation-menu-transition-duration)*var(--regular-hexagon-transition-random-factor)),_calc(var(--ui-animation-menu-transition-duration)*var(--regular-hexagon-transition-random-factor)),_calc(var(--ui-animation-menu-transition-duration)*var(--regular-hexagon-transition-random-factor)),_0ms,_0ms] duration-[calc(var(--ui-animation-menu-transition-duration)*(var(--regular-hexagon-transition-random-factor)+1)),_calc(var(--ui-animation-menu-transition-duration)*(var(--regular-hexagon-transition-random-factor)+1)),_calc(var(--ui-animation-menu-transition-duration)*(var(--regular-hexagon-transition-random-factor)+1)),_var(--ui-animation-menu-transition-duration),_var(--ui-animation-menu-transition-duration)]';

export const Hexagon: FC<{
    data: HexagonRouteData;
    routeName: ROUTE;
    containerSize: {
        width: number;
        height: number;
    };
    hamburgerMenuIsActive?: boolean;
}> = memo(({ data, routeName, containerSize, hamburgerMenuIsActive = false }) => {
    const breakpoint = useZustand((state) => state.values.breakpoint);

    const cssVariables_Memo = useMemo(() => {
        const { position, rotation, scale, isHalf, shouldOffset } = data[routeName];
        return calcCSSVariables(position, rotation, scale, isHalf, containerSize, {
            shouldOffset,
            offset: hexagonRouteOffsetValues[routeName][breakpoint ?? 'base'],
        });
    }, [data, routeName, containerSize, breakpoint]);

    const random_Memo = useMemo(() => Math.random(), []);

    return (
        <div
            className={classNames(
                baseClasses,
                baseTransitionClasses,
                'regular-hexagon-named-class glassmorphic-grain-after after:![background-size:150%]',

                routeName === ROUTE.home
                    ? hamburgerMenuIsActive
                        ? '!to-white/10 ![--glassmorphic-backdrop-blur:2px] ![--glassmorphic-backdrop-saturate:0.75]'
                        : '!to-white/10'
                    : routeName === ROUTE.category
                      ? hamburgerMenuIsActive
                          ? '!to-white/[0.075] ![--glassmorphic-backdrop-blur:2px] ![--glassmorphic-backdrop-saturate:0.75] [--hexagon-fill-color:theme(colors.theme.primary-darker/0.2)]'
                          : '!to-white/[0.075] ![--glassmorphic-backdrop-blur:4px] [--hexagon-fill-color:theme(colors.theme.primary-darker/0.4)]'
                      : 'glassmorphic-off [--hexagon-fill-color:theme(colors.theme.text-background)]', // ROUTE.post
            )}
            style={
                {
                    ...cssVariables_Memo,
                    '--regular-hexagon-transition-random-factor': random_Memo,
                } as CSSProperties
            }
        />
    );
});

export const HamburgerBackgroundHexagon: FC<{
    routeName: ROUTE;
    containerSize: {
        width: number;
        height: number;
    };
    hamburgerMenuIsActive: boolean;
}> = memo(({ routeName, containerSize, hamburgerMenuIsActive }) => {
    const breakpoint = useZustand((state) => state.values.breakpoint);

    const cssVariables_Memo = useMemo(() => {
        let backgroundRouteData = hamburgerBackgroundHexagon;
        if (hamburgerMenuIsActive && hamburgerBackgroundHexagonOffsets[routeName]) {
            backgroundRouteData = offsetHexagonTransforms(hamburgerBackgroundHexagon, hamburgerBackgroundHexagonOffsets);
        }
        const { position, rotation, scale, isHalf, shouldOffset } = backgroundRouteData[routeName];
        return calcCSSVariables(position, rotation, scale, isHalf, containerSize, {
            shouldOffset,
            offset: hexagonRouteOffsetValues[routeName][breakpoint ?? 'base'],
        });
    }, [hamburgerMenuIsActive, routeName, containerSize, breakpoint]);

    return (
        <div
            className={classNames(
                baseClasses,
                baseTransitionClasses,
                '!to-white/10 [--regular-hexagon-transition-random-factor:0.5]',
                hamburgerMenuIsActive ? '!glassmorphic-level-4' : 'regular-hexagon-named-class glassmorphic-grain-after after:![background-size:150%]',
                routeName === ROUTE.home
                    ? ''
                    : routeName === ROUTE.category
                      ? '!glassmorphic-level-1 !to-white/[0.075] [--hexagon-fill-color:theme(colors.theme.primary-darker/0.4)]'
                      : 'glassmorphic-off [--hexagon-fill-color:theme(colors.theme.text-background)]', // ROUTE.post
            )}
            style={cssVariables_Memo as CSSProperties}
        />
    );
});

export const MenuButtonHexagon: FC<{
    buttonData: MenuButtonRouteData | PostNavigationButtonRouteData;
    routeName: ROUTE;
    containerSize: {
        width: number;
        height: number;
    };
    hamburgerMenuIsActive?: boolean;
}> = memo(({ buttonData, routeName, containerSize, hamburgerMenuIsActive = false }) => {
    const { svgIconPath, target } = buttonData;
    const title = 'title' in buttonData ? buttonData.title : undefined;
    const breakpoint = useZustand((state) => state.values.breakpoint);

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
