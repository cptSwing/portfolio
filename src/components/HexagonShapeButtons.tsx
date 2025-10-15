import { FC, memo, useContext, useEffect, useMemo } from 'react';
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
import { MenuButtonSvg } from './HexagonShapes';
import { hamburgerButtonOffsets } from '../lib/hexagonElements';
import { classNames } from 'cpts-javascript-utilities';

export const FunctionalButton: FC<{
    buttonData: FunctionalButtonRouteData;
    homeMenuTransitionTarget?: CategoryName | null;
}> = memo(({ buttonData, homeMenuTransitionTarget }) => {
    const { name, target, svgIconPath } = buttonData;
    const routeName = useZustand((store) => store.values.routeData.name);
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
            <MenuButtonSvg svgIconPath={svgIconPath} counterRotate={counterRotate} />
        </GlassmorphicButtonWrapper>
    );

    function handleClick(ev?: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent> | undefined) {
        const targetResult = (target as (ev?: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent> | undefined) => string | void)(ev);
        targetResult && navigate(targetResult);
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
    const isActiveCategoryLinkButton =
        routeName === ROUTE.category && category ? isActiveCategory(name as CategoryLinkButtonRouteData['name'], category) : false;
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

function isActiveCategory(name: CategoryName, category: Category) {
    return CATEGORY[name] === category.id;
}
