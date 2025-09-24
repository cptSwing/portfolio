import { classNames, cycleThrough } from 'cpts-javascript-utilities';
import { CSSProperties, FC, memo, useContext, useEffect, useMemo, useState } from 'react';
import { calcCSSVariables, categoryNavigationButtonPositions, categoryNavigationButtons, hexagonRouteOffsetValues } from '../lib/hexagonDataNew';
import { CATEGORY, ROUTE } from '../types/enums';
import { Category, CategoryName, CategoryNavigationButtonRouteData, MenuButtonRouteData } from '../types/types';
import { GlassmorphicButtonWrapper } from './GlassmorphicClipped';
import { useZustand } from '../lib/zustand';
import { useNavigate } from 'react-router-dom';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import { MenuButtonSvg } from './HexagonShapes';

const MenuBar: FC<{
    homeMenuTransitionStateUpdates: [[CategoryName | null, boolean], React.Dispatch<React.SetStateAction<[CategoryName | null, boolean]>>];
}> = ({ homeMenuTransitionStateUpdates }) => {
    const [positionOnMenuBar, setPositionOnMenuBar] = useState<[string, string]>(['-100px', '-86.6px']);

    return (
        <div
            className={classNames(
                'before:lighting-gradient before-menu-bar-dimensions before:absolute before:left-[--menu-bar-dimensions-left] before:top-[--menu-bar-dimensions-top] before:h-[--menu-bar-dimensions-height] before:w-[--menu-bar-dimensions-width] before:rounded-[3%_3%_3%_3%/10%_10%_10%_10%] before:bg-theme-root-background/50 before:to-white/5 before:transition-[transform,--menu-bar-mask-marker-position-x] before:delay-[--ui-animation-menu-transition-duration] before:duration-[calc(var(--ui-animation-menu-transition-duration)*2)] before:[--glassmorphic-backdrop-blur:8px] before:[--glassmorphic-backdrop-saturate:1.5]',
                'before:nav-test-masks before:glassmorphic-backdrop',
                'absolute size-[inherit]',
            )}
            style={{ '--menu-bar-mask-marker-position-x': positionOnMenuBar[0], '--menu-bar-mask-marker-position-y': positionOnMenuBar[1] } as CSSProperties}
            // onClick={(e) => {
            //     const _t = e.target;
            //     console.log('%c[MenuBar]', 'color: #9431e8', `click , _t.style.getPropertyValue('--i'):`, e, _t.style.getPropertyValue('--i'));
            //     // if (_t.hasAttribute('href')) {
            //     _t.parentNode.style.setProperty('--menu-bar-mask-marker-position-x', +_t.style.getPropertyValue('--i'));
            //     // }
            // }}
            // className={classNames(
            //     'before-glassmorphic-backdrop glassmorphic-level-4 before:!bottom-[3.5%] before:!left-[37%] before:!top-auto before:!h-[6%] before:!w-[26%] before:origin-bottom before:rounded-[8%_8%_8%_8%/35%_35%_35%_35%] before:border before:border-theme-text-background/[0.04] before:bg-theme-root-background/30 before:shadow-xl before:transition-transform before:delay-[--ui-animation-menu-transition-duration] before:duration-[calc(var(--ui-animation-menu-transition-duration)*2)]',
            //     'absolute size-full',
            //     'glassmorphic-grain-after after:!bottom-[3.5%] after:!left-[37%] after:!top-auto after:!h-[6%] after:!w-[26%] after:origin-bottom after:rounded-[8%_8%_8%_8%/35%_35%_35%_35%] after:transition-transform after:delay-[--ui-animation-menu-transition-duration] after:duration-[--ui-animation-menu-transition-duration]',
            //     routeName === ROUTE.category ? 'before:scale-y-100 after:scale-y-100' : 'before:scale-y-0 after:scale-y-0',
            // )}
        >
            {categoryNavigationButtons.map((categoryNavigationButtonData, idx) => (
                <MenuButton
                    key={`hex-nav-index-${idx}`}
                    buttonData={categoryNavigationButtonData}
                    homeMenuTransitionStateUpdates={homeMenuTransitionStateUpdates}
                    setPositionOnMenuBar={setPositionOnMenuBar}
                />
            ))}
        </div>
    );
};

export default MenuBar;

const MenuButton: FC<{
    buttonData: CategoryNavigationButtonRouteData | MenuButtonRouteData;
    homeMenuTransitionStateUpdates: [[CategoryName | null, boolean], React.Dispatch<React.SetStateAction<[CategoryName | null, boolean]>>];
    setPositionOnMenuBar: React.Dispatch<React.SetStateAction<[string, string]>>;
}> = memo(({ buttonData, homeMenuTransitionStateUpdates, setPositionOnMenuBar }) => {
    const { title, name, target } = buttonData;
    const svgIconPath = (buttonData as MenuButtonRouteData).svgIconPath ? (buttonData as MenuButtonRouteData).svgIconPath : undefined;
    const { name: routeName, content: routeContent } = useZustand((store) => store.values.routeData);

    const containerSize = useContext(GetChildSizeContext);

    const breakpoint = useZustand((state) => state.values.breakpoint);
    const [[menuTransitionTarget, menuTransitionTargetReached], setMenuTransitionStates] = homeMenuTransitionStateUpdates;
    const navigate = useNavigate();

    const isActiveCategoryButton = routeName === ROUTE.category ? isActiveCategory(name, routeContent.category) : false;

    const cssVariables_Memo = useMemo(() => {
        // if (routeName === ROUTE.category) {
        //     const previousCategory = cycleThrough(
        //         Object.values(CATEGORY).filter((val) => !isNaN(val as number)),
        //         routeContent.category.id,
        //         'previous',
        //     );

        //     let newTransforms, z;
        //     if (isActiveCategoryButton) {
        //         newTransforms = categoryNavigationButtonPositions['active'];
        //         z = 20;
        //     } else if (CATEGORY[name] === previousCategory) {
        //         newTransforms = categoryNavigationButtonPositions['left'];
        //         z = 0;
        //     } else {
        //         newTransforms = categoryNavigationButtonPositions['right'];
        //         z = 10;
        //     }

        //     const offsetTransforms = { ...buttonData[routeName], ...newTransforms };
        //     const { position, rotation, scale, isHalf, shouldOffset } = offsetTransforms;
        //     const style = calcCSSVariables(position, rotation, scale, isHalf, containerSize, {
        //         strokeWidth: 0,
        //         shouldOffset,
        //         offset: hexagonRouteOffsetValues[routeName][breakpoint ?? 'base'],
        //     });
        //     return { ...style, zIndex: z };
        // } else {
        const { position, rotation, scale, isHalf, shouldOffset } = buttonData[routeName];

        return calcCSSVariables(position, rotation, scale, isHalf, containerSize, {
            shouldOffset,
            offset: hexagonRouteOffsetValues[routeName][breakpoint ?? 'base'],
        });
        // }
    }, [breakpoint, buttonData, containerSize, routeName]);

    useEffect(() => {
        if (isActiveCategoryButton) {
            setPositionOnMenuBar([
                `calc(${cssVariables_Memo['--hexagon-translate-x']} - var(--menu-bar-dimensions-left) + 50px)`,
                `calc(${cssVariables_Memo['--hexagon-translate-y']} - var(--menu-bar-dimensions-top) + 43.3px)`,
            ]);
        }
    }, [cssVariables_Memo, isActiveCategoryButton, setPositionOnMenuBar]);

    function handleClick(ev?: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent> | undefined) {
        let specificTarget: string | ((ev?: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent> | undefined) => string | void);
        if (!svgIconPath) {
            specificTarget = target as string;
            navigate(specificTarget);
        } else {
            specificTarget = target as (ev?: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent> | undefined) => string | void;
            navigate(specificTarget(ev));
        }
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
            style={{ ...cssVariables_Memo }}
            isRouteNavigation
            clickHandler={handleClick}
            mouseEnterHandler={handleMouseEnter}
            lightingGradient
            strokeRadius={1}
            innerShadowRadius={6}
        >
            {svgIconPath ? (
                <MenuButtonSvg
                    svgIconPath={svgIconPath}
                    // counterRotate={routeName === ROUTE.home ? hamburgerMenuIsActive : true}
                />
            ) : (
                <span
                    className={classNames(
                        'absolute left-0 top-0 flex size-full select-none items-center justify-center font-fjalla-one text-4xl font-semibold text-theme-secondary-lighter/75 transition-transform duration-[--ui-animation-menu-transition-duration]',
                        routeName === ROUTE.home ? '' : 'rotate-[calc(var(--hexagon-rotate)*-1)]',
                    )}
                >
                    {title}
                </span>
            )}
        </GlassmorphicButtonWrapper>
        // <div className="nav-item" style={{ '--i': index } as CSSProperties}>

        // </div>
    );
});

function isActiveCategory(name: CategoryName, category: Category) {
    return CATEGORY[name] === category.id;
}
