import { classNames } from 'cpts-javascript-utilities';
import { CSSProperties, FC, memo, useContext, useEffect, useMemo, useState } from 'react';
import { calcCSSVariables, hexagonRouteOffsetValues } from '../lib/shapeFunctions';
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
            className={classNames(
                // 'before:lighting-gradient before-menu-bar-dimensions z-50 before:absolute before:left-[--menu-bar-dimensions-left] before:top-[--menu-bar-dimensions-top] before:h-[--menu-bar-dimensions-height] before:w-[--menu-bar-dimensions-width] before:rounded-[3%_3%_3%_3%/10%_10%_10%_10%] before:bg-theme-primary-lighter/50 before:to-white/5 before:transition-[transform,--menu-bar-mask-marker-position-x] before:delay-[--ui-animation-menu-transition-duration] before:duration-[calc(var(--ui-animation-menu-transition-duration)*2)] before:[--glassmorphic-backdrop-blur:8px] before:[--glassmorphic-backdrop-saturate:1.5]',
                // 'before:nav-test-masks before:glassmorphic-backdrop',
                'absolute z-20 size-[inherit]',
            )}
            style={
                {
                    '--menu-bar-mask-marker-position-x': positionOnCategoryLinks[0],
                    '--menu-bar-mask-marker-position-y': positionOnCategoryLinks[1],
                } as CSSProperties
            }
            // onClick={(e) => {
            //     const _t = e.target;
            //     console.log('%c[CategoryLinks]', 'color: #9431e8', `click , _t.style.getPropertyValue('--i'):`, e, _t.style.getPropertyValue('--i'));
            //     // if (_t.hasAttribute('href')) {
            //     _t.parentNode.style.setProperty('--menu-bar-mask-marker-position-x', +_t.style.getPropertyValue('--i'));
            //     // }
            // }}
            // className={classNames(
            //     'before-glassmorphic-backdrop glassmorphic-level-4 before:!bottom-[3.5%] before:!left-[37%] before:!top-auto before:!h-[6%] before:!w-[26%] before:origin-bottom before:rounded-[8%_8%_8%_8%/35%_35%_35%_35%] before:border before:border-theme-text-background/[0.04] before:bg-theme-root-background/30 before:shadow-xl before:transition-transform before:delay-[--ui-animation-menu-transition-duration] before:duration-[calc(var(--ui-animation-menu-transition-duration)*2)]',
            //     'absolute size-full',
            //     'after-glassmorphic-grain after:!bottom-[3.5%] after:!left-[37%] after:!top-auto after:!h-[6%] after:!w-[26%] after:origin-bottom after:rounded-[8%_8%_8%_8%/35%_35%_35%_35%] after:transition-transform after:delay-[--ui-animation-menu-transition-duration] after:duration-[--ui-animation-menu-transition-duration]',
            //     routeName === ROUTE.category ? 'before:scale-y-100 after:scale-y-100' : 'before:scale-y-0 after:scale-y-0',
            // )}
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
