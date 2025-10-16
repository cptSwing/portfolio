import { CSSProperties, FC, memo, useContext, useEffect, useMemo } from 'react';
import {
    Category,
    CategoryLinkButtonRouteData,
    CategoryName,
    FunctionalButtonRouteData,
    RotateShortestDistance,
    TransitionTargetReached,
} from '../types/types';
import { useZustand } from '../lib/zustand';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import { useNavigate } from 'react-router-dom';
import { calcCSSVariables, offsetHexagonTransforms } from '../lib/shapeFunctions';
import { CATEGORY, ROUTE } from '../types/enums';
import { GlassmorphicButtonWrapper } from './GlassmorphicClipped';
import { hamburgerButtonOffsets } from '../lib/hexagonElements';
import { classNames } from 'cpts-javascript-utilities';

export const FunctionalButton: FC<{
    buttonData: FunctionalButtonRouteData;
    homeMenuTransitionTarget?: CategoryName | null;
}> = memo(({ buttonData, homeMenuTransitionTarget }) => {
    const { name, target, svgIconPath } = buttonData;
    const routeName = useZustand((store) => store.values.routeData.name);
    // const cardTransition = useZustand((store) => store.values.cardTransition);

    const counterRotate = buttonData[routeName].counterRotate;

    const containerSize = useContext(GetChildSizeContext);
    const navigate = useNavigate();

    const cssVariables_Memo = useMemo(() => {
        let routeTransforms;
        if (routeName === ROUTE.home && homeMenuTransitionTarget) {
            routeTransforms = offsetHexagonTransforms(buttonData, hamburgerButtonOffsets[homeMenuTransitionTarget])[routeName];
        } else {
            routeTransforms = buttonData[routeName];
        }

        const { position, rotation, scale, isHalf } = routeTransforms;
        return calcCSSVariables(position, rotation, scale, isHalf, containerSize);
    }, [buttonData, containerSize, homeMenuTransitionTarget, routeName]);

    return (
        <GlassmorphicButtonWrapper
            name={name}
            style={{
                ...cssVariables_Memo,
                zIndex: 20,
            }}
            isRouteNavigation={false}
            clickHandler={handleClick}
            lightingGradient={routeName === ROUTE.home}
            strokeRadius={1}
            innerShadowRadius={6}
        >
            <MenuButton svgIconPath={svgIconPath} counterRotate={counterRotate} />
        </GlassmorphicButtonWrapper>
    );

    function handleClick(ev?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined) {
        const targetResult = target(ev);
        targetResult && navigate(...targetResult);
    }
});

export const CategoryLinkButton: FC<{
    buttonData: CategoryLinkButtonRouteData;
    homeMenuTransitionStateUpdates: [
        [CategoryName | null, TransitionTargetReached, RotateShortestDistance],
        React.Dispatch<React.SetStateAction<[CategoryName | null, TransitionTargetReached, RotateShortestDistance]>>,
    ];
    setPositionOnCategoryLinks: React.Dispatch<React.SetStateAction<[string, string]>>;
}> = memo(({ buttonData, homeMenuTransitionStateUpdates, setPositionOnCategoryLinks }) => {
    const { title, name, target } = buttonData;
    const routeName = useZustand((store) => store.values.routeData.name);
    const { position, rotation, scale, isHalf } = buttonData[routeName];

    const containerSize = useContext(GetChildSizeContext);
    const navigate = useNavigate();

    const [[menuTransitionTarget, menuTransitionTargetReached], setMenuTransitionStates] = homeMenuTransitionStateUpdates;

    const cssVariables_Memo = useMemo(
        () => calcCSSVariables(position, rotation, scale, isHalf, containerSize),
        [position, rotation, scale, isHalf, containerSize],
    );

    // TODO clean up / get rid of this menu bar stuff
    const category = useZustand((store) => store.values.routeData.content.category);
    const isActiveCategoryLinkButton = routeName === ROUTE.category && category ? isActiveCategory(name, category) : false;
    useEffect(() => {
        if (isActiveCategoryLinkButton) {
            setPositionOnCategoryLinks([
                `calc(${cssVariables_Memo['--hexagon-translate-x']} - var(--menu-bar-dimensions-left) + 50px)`,
                `calc(${cssVariables_Memo['--hexagon-translate-y']} - var(--menu-bar-dimensions-top) + 43.3px)`,
            ]);
        }
    }, [cssVariables_Memo, isActiveCategoryLinkButton, setPositionOnCategoryLinks]);

    return (
        <GlassmorphicButtonWrapper
            name={name}
            isActive={isActiveCategoryLinkButton}
            style={{ ...cssVariables_Memo }}
            isRouteNavigation={true}
            clickHandler={handleClick}
            mouseEnterHandler={handleMouseEnter}
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
        navigate(...target);
    }

    function handleMouseEnter() {
        if (routeName === ROUTE.home && menuTransitionTarget !== name && menuTransitionTargetReached) {
            setMenuTransitionStates([name, false, true]);
            // ^^^  Prevent parent from prematurely rotating again, and again, and again
        }
    }
});

const MenuButton: FC<{
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
                className="w-full flex-auto bg-theme-secondary-darker/75 transition-[background-color] duration-75 matrix-transform matrix-scale-x-[calc(0.5/var(--hexagon-scale-x))] matrix-scale-y-[calc(0.5/var(--hexagon-scale-y))] [mask-position:50%_50%] [mask-repeat:no-repeat] [mask-size:calc(var(--hexagon-clip-path-width)*1.25*var(--hexagon-scale-x))] group-hover-active:bg-theme-secondary"
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

/* Local Functions */

function isActiveCategory(name: CategoryName, category: Category) {
    return CATEGORY[name] === category.id;
}
