import { classNames, cycleThrough } from 'cpts-javascript-utilities';
import { FC, memo, useContext, useMemo } from 'react';
import { calcCSSVariables, categoryNavigationButtonPositions, categoryNavigationButtons, hexagonRouteOffsetValues } from '../lib/hexagonDataNew';
import { CATEGORY, ROUTE } from '../types/enums';
import { Category, CategoryName, CategoryNavigationButtonRouteData } from '../types/types';
import { GlassmorphicButtonWrapper } from './GlassmorphicClipped';
import { useZustand } from '../lib/zustand';
import { useNavigate } from 'react-router-dom';
import GetChildSizeContext from '../contexts/GetChildSizeContext';

const MenuBar: FC<{
    routeName: ROUTE;
    homeMenuTransitionStateUpdates: [[CategoryName | null, boolean], React.Dispatch<React.SetStateAction<[CategoryName | null, boolean]>>];
}> = ({ homeMenuTransitionStateUpdates, routeName }) => {
    return (
        <div
            className={classNames(
                'before-glassmorphic-backdrop glassmorphic-level-4 before:!bottom-[3.5%] before:!left-[37%] before:!top-auto before:!h-[6%] before:!w-[26%] before:origin-bottom before:rounded-[8%_8%_8%_8%/35%_35%_35%_35%] before:border before:border-theme-text-background/[0.04] before:bg-theme-root-background/30 before:shadow-xl before:transition-transform before:delay-[--ui-animation-menu-transition-duration] before:duration-[calc(var(--ui-animation-menu-transition-duration)*2)]',
                'absolute size-full',
                'glassmorphic-grain-after after:!bottom-[3.5%] after:!left-[37%] after:!top-auto after:!h-[6%] after:!w-[26%] after:origin-bottom after:rounded-[8%_8%_8%_8%/35%_35%_35%_35%] after:transition-transform after:delay-[--ui-animation-menu-transition-duration] after:duration-[--ui-animation-menu-transition-duration]',
                routeName === ROUTE.category ? 'before:scale-y-100 after:scale-y-100' : 'before:scale-y-0 after:scale-y-0',
            )}
        >
            {categoryNavigationButtons.map((categoryNavigationButtonData, idx) => (
                <CategoryNavigationButton
                    key={`hex-nav-index-${idx}`}
                    buttonData={categoryNavigationButtonData}
                    homeMenuTransitionStateUpdates={homeMenuTransitionStateUpdates}
                />
            ))}
        </div>
    );
};

export default MenuBar;

const CategoryNavigationButton: FC<{
    buttonData: CategoryNavigationButtonRouteData;
    homeMenuTransitionStateUpdates: [[CategoryName | null, boolean], React.Dispatch<React.SetStateAction<[CategoryName | null, boolean]>>];
}> = memo(({ buttonData, homeMenuTransitionStateUpdates }) => {
    const { title, name, target } = buttonData;
    const { name: routeName, content: routeContent } = useZustand((store) => store.values.routeData);

    const containerSize = useContext(GetChildSizeContext);

    const breakpoint = useZustand((state) => state.values.breakpoint);
    const [[menuTransitionTarget, menuTransitionTargetReached], setMenuTransitionStates] = homeMenuTransitionStateUpdates;
    const navigate = useNavigate();

    const isActiveCategoryButton = routeName === ROUTE.category ? isActiveCategory(name, routeContent.category) : false;

    const cssVariables_Memo = useMemo(() => {
        if (routeName === ROUTE.category) {
            const previousCategory = cycleThrough(
                Object.values(CATEGORY).filter((val) => !isNaN(val as number)),
                routeContent.category.id,
                'previous',
            );

            let newTransforms, z;
            if (isActiveCategoryButton) {
                newTransforms = categoryNavigationButtonPositions['active'];
                z = 20;
            } else if (CATEGORY[name] === previousCategory) {
                newTransforms = categoryNavigationButtonPositions['left'];
                z = 0;
            } else {
                newTransforms = categoryNavigationButtonPositions['right'];
                z = 10;
            }

            const offsetTransforms = { ...buttonData[routeName], ...newTransforms };
            const { position, rotation, scale, isHalf, shouldOffset } = offsetTransforms;
            const style = calcCSSVariables(position, rotation, scale, isHalf, containerSize, {
                strokeWidth: 0,
                shouldOffset,
                offset: hexagonRouteOffsetValues[routeName][breakpoint ?? 'base'],
            });
            return { ...style, zIndex: z };
        } else {
            const { position, rotation, scale, isHalf, shouldOffset } = buttonData[routeName];

            return calcCSSVariables(position, rotation, scale, isHalf, containerSize, {
                shouldOffset,
                offset: hexagonRouteOffsetValues[routeName][breakpoint ?? 'base'],
            });
        }
    }, [breakpoint, buttonData, containerSize, isActiveCategoryButton, name, routeContent.category?.id, routeName]);

    function handleClick() {
        navigate(target);
    }

    function handleMouseEnter() {
        if (routeName === ROUTE.home && menuTransitionTargetReached && menuTransitionTarget !== name) {
            setMenuTransitionStates([name as CategoryName, false]);
            // ^^^  Prevent parent from prematurely rotating again, and again, and again
        }
    }

    return (
        <GlassmorphicButtonWrapper
            name={name}
            isActive={isActiveCategoryButton}
            style={cssVariables_Memo}
            isRouteNavigation
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
});

function isActiveCategory(name: CategoryName, category: Category) {
    return CATEGORY[name] === category.id;
}
