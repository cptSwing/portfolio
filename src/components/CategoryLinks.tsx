import { classNames } from 'cpts-javascript-utilities';
import { CSSProperties, FC, memo, useContext, useEffect, useMemo, useState } from 'react';
import { calcCSSVariables } from '../lib/shapeFunctions';
import { CATEGORY, ROUTE } from '../types/enums';
import { Category, CategoryName, CategoryLinkButtonRouteData } from '../types/types';
import { GlassmorphicButtonWrapper } from './GlassmorphicClipped';
import { useZustand } from '../lib/zustand';
import { useNavigate } from 'react-router-dom';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import { categoryLinkButtons } from '../lib/hexagonElements';

const CategoryLinks: FC<{
    homeMenuTransitionStateUpdates: [[CategoryName | null, boolean], React.Dispatch<React.SetStateAction<[CategoryName | null, boolean]>>];
}> = ({ homeMenuTransitionStateUpdates }) => {
    const [positionOnCategoryLinks, setPositionOnCategoryLinks] = useState<[string, string]>(['-100px', '-86.6px']);

    return (
        <div
            className={classNames('absolute z-20 size-[inherit]')}
            style={
                {
                    '--menu-bar-mask-marker-position-x': positionOnCategoryLinks[0],
                    '--menu-bar-mask-marker-position-y': positionOnCategoryLinks[1],
                } as CSSProperties
            }
        >
            {categoryLinkButtons.map((categoryLinkButtonData, idx) => (
                <CategoryLinkButton
                    key={`hex-category-link-button-index-${idx}`}
                    buttonData={categoryLinkButtonData}
                    homeMenuTransitionStateUpdates={homeMenuTransitionStateUpdates}
                    setPositionOnCategoryLinks={setPositionOnCategoryLinks}
                />
            ))}
        </div>
    );
};

export default CategoryLinks;

const CategoryLinkButton: FC<{
    buttonData: CategoryLinkButtonRouteData;
    homeMenuTransitionStateUpdates: [[CategoryName | null, boolean], React.Dispatch<React.SetStateAction<[CategoryName | null, boolean]>>];
    setPositionOnCategoryLinks: React.Dispatch<React.SetStateAction<[string, string]>>;
}> = memo(({ buttonData, homeMenuTransitionStateUpdates, setPositionOnCategoryLinks }) => {
    const { title, name, target } = buttonData;
    const { name: routeName, content: routeContent } = useZustand((store) => store.values.routeData);
    const { position, rotation, scale, isHalf } = buttonData[routeName];

    const containerSize = useContext(GetChildSizeContext);
    const navigate = useNavigate();

    const isActiveCategoryLinkButton =
        routeName === ROUTE.category ? isActiveCategory(name as CategoryLinkButtonRouteData['name'], routeContent.category) : false;

    const [[menuTransitionTarget, menuTransitionTargetReached], setMenuTransitionStates] = homeMenuTransitionStateUpdates;

    const cssVariables_Memo = useMemo(() => {
        return calcCSSVariables(position, rotation, scale, isHalf, containerSize);
        // }
    }, [position, rotation, scale, isHalf, containerSize]);

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
        navigate(target as string);
    }

    function handleMouseEnter() {
        if (routeName === ROUTE.home && menuTransitionTargetReached && menuTransitionTarget !== name) {
            setMenuTransitionStates([name as CategoryName, false]);
            // ^^^  Prevent parent from prematurely rotating again, and again, and again
        }
    }
});

function isActiveCategory(name: CategoryName, category: Category) {
    return CATEGORY[name] === category.id;
}
