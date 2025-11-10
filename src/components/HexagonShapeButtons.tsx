import { CSSProperties, FC, memo, useContext, useEffect, useMemo, useState } from 'react';
import {
    CategoryLinkButtonRouteData,
    CategoryName,
    FunctionalButtonRouteData,
    HexagonStyleObject,
    RotateShortestDistance,
    TransitionTargetReached,
} from '../types/types';
import { useZustand } from '../lib/zustand';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import { useNavigate } from 'react-router-dom';
import { calcCSSVariables, offsetHexagonTransforms } from '../lib/shapeFunctions';
import { ROUTE } from '../types/enums';
import { GlassmorphicButton } from './GlassmorphicClipped';
import { openHamburgerMenuButtonOffsets } from '../lib/hexagonElements';
import { classNames } from 'cpts-javascript-utilities';

const _ = ' ';
const hexagonButtonBaseClasses = 'regular-hexagon-base regular-hexagon-transitions [--regular-hexagon-transition-random-factor:0]';

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
                cardTransition
                    ? 'scale-[calc(var(--hexagon-scale-x)*0.95)]'
                    : 'hover-active:scale-[calc(var(--hexagon-scale-x)*1.05)] hover-active:duration-75',
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
        const targetResult = target(routeName, ev);
        targetResult && navigate(...targetResult);
    }
});

const hexagonOpenHamburgerMenuBaseClasses =
    hexagonButtonBaseClasses +
    _ +
    'full-hexagon-stroke-before !pointer-events-auto [--regular-hexagon-transition-random-factor:0] before:!bg-theme-secondary/10 hover-active:scale-[calc(var(--hexagon-scale-x)*1.05)] hover-active:[--glassmorphic-backdrop-saturate:3] before:hover-active:!bg-theme-secondary/50';

export const FunctionalButtonOpenHamburgerMenu: FC<{
    buttonData: FunctionalButtonRouteData;
    homeMenuTransitionTarget?: CategoryName | null;
}> = memo(({ buttonData, homeMenuTransitionTarget }) => {
    const { target, svgIconPath } = buttonData;
    const routeName = useZustand((store) => store.values.routeData.name);
    const counterRotate = buttonData[routeName].counterRotate;

    const containerSize = useContext(GetChildSizeContext);
    const navigate = useNavigate();

    const [classes, setClasses] = useState(hexagonOpenHamburgerMenuBaseClasses);
    const [styles, setStyles] = useState<HexagonStyleObject>(
        calcCSSVariables(
            buttonData[routeName].position,
            buttonData[routeName].rotation,
            buttonData[routeName].scale,
            buttonData[routeName].isHalf,
            containerSize,
        ),
    );

    useEffect(() => {
        let classes = hexagonOpenHamburgerMenuBaseClasses;
        let routeTransforms;
        const routeOptions: {
            gutterWidth?: number | undefined;
            clipStroke?: boolean | undefined;
            clampTo?: number | undefined;
        } = {};

        switch (routeName) {
            case ROUTE.home: {
                classes += _ + '[--glassmorphic-backdrop-blur:2px] [--glassmorphic-backdrop-saturate:2] [--lighting-gradient-to:theme(colors.white/0.1)]';
                if (homeMenuTransitionTarget) {
                    routeTransforms = offsetHexagonTransforms(buttonData, openHamburgerMenuButtonOffsets[homeMenuTransitionTarget])[routeName];
                } else {
                    routeTransforms = buttonData[ROUTE.home];
                }
                break;
            }
            case ROUTE.category: {
                classes +=
                    _ +
                    '[--glassmorphic-backdrop-blur:8px] [--glassmorphic-backdrop-saturate:2] [--lighting-gradient-to:theme(colors.white/0.25)] [--hexagon-fill-color:theme(colors.theme.secondary/0.25)]';
                routeTransforms = buttonData[ROUTE.category];
                break;
            }
            case ROUTE.post: {
                classes +=
                    _ +
                    ' [--lighting-gradient-to:transparent] [--glassmorphic-backdrop-blur:0px] [--glassmorphic-backdrop-saturate:1] [--hexagon-fill-color:theme(colors.theme.text-background)]  before:!bg-transparent after:!content-none';
                routeTransforms = buttonData[ROUTE.post];
                break;
            }
        }

        setClasses(classes);
        const { position, rotation, scale, isHalf } = routeTransforms;
        const newStyle = calcCSSVariables(position, rotation, scale, isHalf, containerSize, routeOptions);
        setStyles({
            ...newStyle,
            '--glassmorphic-grain-scale': 0.5 / scale,
        });
    }, [buttonData, containerSize, homeMenuTransitionTarget, routeName]);

    return (
        <button className={classes} style={styles as CSSProperties} onClick={handleClick}>
            <MaskedButton svgIconPath={svgIconPath} counterRotate={counterRotate} />
        </button>
    );

    function handleClick(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const targetResult = target(routeName, ev);
        targetResult && navigate(...targetResult);
    }
});

export const CategoryLinkButton: FC<{
    buttonData: CategoryLinkButtonRouteData;
    homeMenuTransitionStateUpdates: [
        [CategoryName | null, TransitionTargetReached, RotateShortestDistance],
        React.Dispatch<React.SetStateAction<[CategoryName | null, TransitionTargetReached, RotateShortestDistance]>>,
    ];
}> = memo(({ buttonData, homeMenuTransitionStateUpdates }) => {
    const { title, name, target } = buttonData;
    const routeName = useZustand((store) => store.values.routeData.name);
    const { position, rotation, scale, isHalf } = buttonData[routeName];

    const [[homeMenuTransitionTarget], setHomeMenuTransitionState] = homeMenuTransitionStateUpdates;

    const containerSize = useContext(GetChildSizeContext);
    const navigate = useNavigate();

    const cssVariables_Memo = useMemo(
        () => calcCSSVariables(position, rotation, scale, isHalf, containerSize),
        [position, rotation, scale, isHalf, containerSize],
    );

    return (
        <GlassmorphicButton
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
        </GlassmorphicButton>
    );

    function handleClick() {
        if (routeName === ROUTE.home && homeMenuTransitionTarget !== name) {
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
