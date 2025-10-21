import { CSSProperties, FC, memo, useContext, useMemo } from 'react';
import { CategoryLinkButtonRouteData, CategoryName, FunctionalButtonRouteData, RotateShortestDistance, TransitionTargetReached } from '../types/types';
import { useZustand } from '../lib/zustand';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import { useNavigate } from 'react-router-dom';
import { calcCSSVariables, offsetHexagonTransforms } from '../lib/shapeFunctions';
import { ROUTE } from '../types/enums';
import { GlassmorphicButtonWrapper } from './GlassmorphicClipped';
import { openHamburgerMenuButtonOffsets } from '../lib/hexagonElements';
import { classNames } from 'cpts-javascript-utilities';

export const FunctionalButton: FC<{
    buttonData: FunctionalButtonRouteData;
}> = memo(({ buttonData }) => {
    const { target, svgIconPath } = buttonData;
    const routeName = useZustand((store) => store.values.routeData.name);
    const cardTransition = useZustand((store) => store.values.cardTransition);

    const counterRotate = buttonData[routeName].counterRotate;

    const containerSize = useContext(GetChildSizeContext);
    const navigate = useNavigate();

    const cssVariables_Memo = useMemo(() => {
        const { position, rotation, scale, isHalf } = buttonData[routeName];
        return calcCSSVariables(position, rotation, scale, isHalf, containerSize);
    }, [buttonData, containerSize, routeName]);

    return (
        <button
            className={classNames(
                'regular-hexagon-base regular-hexagon-transitions full-hexagon-stroke-before !pointer-events-auto [--regular-hexagon-transition-random-factor:0] before:!bg-theme-secondary/10 hover-active:[--glassmorphic-backdrop-saturate:3] before:hover-active:!bg-theme-secondary/50',
                cardTransition ? 'scale-[calc(var(--hexagon-scale-x)*0.95)]' : 'hover-active:scale-[calc(var(--hexagon-scale-x)*1.05)]',
                routeName === ROUTE.home
                    ? '!to-white/10 [--glassmorphic-backdrop-blur:2px] [--glassmorphic-backdrop-saturate:2]'
                    : routeName === ROUTE.category
                      ? '!to-white/[0.025] [--glassmorphic-backdrop-blur:8px] [--glassmorphic-backdrop-saturate:2] [--hexagon-fill-color:theme(colors.theme.secondary/0.25)]'
                      : // ROUTE.post
                        '!to-transparent ![--glassmorphic-backdrop-blur:0px] ![--glassmorphic-backdrop-saturate:1] [--hexagon-fill-color:theme(colors.theme.text-background)] before:!bg-transparent after:!content-none',
            )}
            style={cssVariables_Memo as CSSProperties}
            onClick={handleClick}
        >
            <MaskedButton svgIconPath={svgIconPath} counterRotate={counterRotate} />
        </button>
    );

    function handleClick(ev?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined) {
        const targetResult = target(ev);
        targetResult && navigate(...targetResult);
    }
});

export const FunctionalButtonOpenHamburgerMenu: FC<{
    buttonData: FunctionalButtonRouteData;
    homeMenuTransitionTarget?: CategoryName | null;
}> = memo(({ buttonData, homeMenuTransitionTarget }) => {
    const { target, svgIconPath } = buttonData;
    const routeName = useZustand((store) => store.values.routeData.name);

    const counterRotate = buttonData[routeName].counterRotate;

    const containerSize = useContext(GetChildSizeContext);
    const navigate = useNavigate();

    const cssVariables_Memo = useMemo(() => {
        let routeTransforms;
        if (routeName === ROUTE.home && homeMenuTransitionTarget) {
            routeTransforms = offsetHexagonTransforms(buttonData, openHamburgerMenuButtonOffsets[homeMenuTransitionTarget])[routeName];
        } else {
            routeTransforms = buttonData[routeName];
        }

        const { position, rotation, scale, isHalf } = routeTransforms;
        return calcCSSVariables(position, rotation, scale, isHalf, containerSize);
    }, [buttonData, containerSize, homeMenuTransitionTarget, routeName]);

    return (
        <button
            className={classNames(
                'regular-hexagon-base regular-hexagon-transitions full-hexagon-stroke-before !pointer-events-auto [--regular-hexagon-transition-random-factor:0] before:!bg-theme-secondary/10 hover-active:scale-[calc(var(--hexagon-scale-x)*1.05)] hover-active:[--glassmorphic-backdrop-saturate:3] before:hover-active:!bg-theme-secondary/50',
                routeName === ROUTE.home
                    ? '!to-white/10 [--glassmorphic-backdrop-blur:2px] [--glassmorphic-backdrop-saturate:2]'
                    : routeName === ROUTE.category
                      ? '!to-white/[0.025] [--glassmorphic-backdrop-blur:8px] [--glassmorphic-backdrop-saturate:2] [--hexagon-fill-color:theme(colors.theme.secondary/0.25)]'
                      : // ROUTE.post
                        '!to-transparent ![--glassmorphic-backdrop-blur:0px] ![--glassmorphic-backdrop-saturate:1] [--hexagon-fill-color:theme(colors.theme.text-background)] before:!bg-transparent after:!content-none',
            )}
            style={cssVariables_Memo as CSSProperties}
            onClick={handleClick}
        >
            <MaskedButton svgIconPath={svgIconPath} counterRotate={counterRotate} />
        </button>
    );

    function handleClick(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const targetResult = target(ev);
        targetResult && navigate(...targetResult);
    }
});

export const CategoryLinkButton: FC<{
    buttonData: CategoryLinkButtonRouteData;
    setHomeMenuTransitionState: React.Dispatch<React.SetStateAction<[CategoryName | null, TransitionTargetReached, RotateShortestDistance]>>;
}> = memo(({ buttonData, setHomeMenuTransitionState }) => {
    const { title, name, target } = buttonData;
    const routeName = useZustand((store) => store.values.routeData.name);
    const { position, rotation, scale, isHalf } = buttonData[routeName];

    const containerSize = useContext(GetChildSizeContext);
    const navigate = useNavigate();

    const cssVariables_Memo = useMemo(
        () => calcCSSVariables(position, rotation, scale, isHalf, containerSize),
        [position, rotation, scale, isHalf, containerSize],
    );

    return (
        <GlassmorphicButtonWrapper
            name={name}
            style={{ ...cssVariables_Memo }}
            isRouteNavigation={true}
            clickHandler={handleClick}
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

    function handleClick() {
        if (routeName === ROUTE.home) {
            setHomeMenuTransitionState([name, false, true]);
        } else {
            navigate(...target);
        }
    }
});

const MaskedButton: FC<{
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
                className="w-full flex-auto bg-theme-secondary/75 transition-[background-color] duration-75 matrix-transform matrix-scale-x-[calc(0.5/var(--hexagon-scale-x))] matrix-scale-y-[calc(0.5/var(--hexagon-scale-y))] [mask-position:50%_50%] [mask-repeat:no-repeat] [mask-size:calc(var(--hexagon-clip-path-width)*1.25*var(--hexagon-scale-x))] group-hover-active:bg-theme-secondary"
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
