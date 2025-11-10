import { CSSProperties, FC, useContext, useEffect, useLayoutEffect, useState } from 'react';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import { categoryLinkButtonElements } from '../lib/hexagonElements';
import { calcCSSVariables } from '../lib/shapeFunctions';
import { useZustand } from '../lib/zustand';
import { CategoryName, CategoryLinkButtonRouteData } from '../types/types';
import { config, database } from '../types/exportTyped';
import { classNames } from 'cpts-javascript-utilities';
import useTimeout from '../hooks/useTimeout';

const transitionDuration_MS = config.ui.animation.menuTransition_Ms;

const namedRouteTransforms: Partial<Record<CategoryName, CategoryLinkButtonRouteData>> = {};
categoryLinkButtonElements.forEach((categoryLinkButtonElem) => {
    namedRouteTransforms[categoryLinkButtonElem.name] = categoryLinkButtonElem;
});

const CategoryBlurb: FC<{ show: boolean; homeMenuTransitionTarget: CategoryName | null }> = ({ show, homeMenuTransitionTarget }) => {
    const routeName = useZustand((store) => store.values.routeData.name);
    const cardTransition = useZustand((state) => state.values.cardTransition);

    const containerSize = useContext(GetChildSizeContext);
    const [cssVariables, setCssVariables] = useState<ReturnType<typeof calcCSSVariables> | CSSProperties>();
    const [transitionFinished, setTransitionFinished] = useState(true);

    useEffect(() => {
        if (homeMenuTransitionTarget) {
            const routeTransformsBlurb = namedRouteTransforms[homeMenuTransitionTarget]?.[routeName];
            routeTransformsBlurb &&
                setCssVariables(
                    calcCSSVariables(
                        routeTransformsBlurb.position,
                        routeTransformsBlurb.rotation,
                        routeTransformsBlurb.scale,
                        routeTransformsBlurb.isHalf,
                        containerSize,
                    ) as CSSProperties,
                );
        }
    }, [containerSize, homeMenuTransitionTarget, routeName]);

    useLayoutEffect(() => {
        if (cardTransition) setTransitionFinished(false);
    }, [cardTransition]);

    const timer_Ref = useTimeout(
        () => {
            clearTimeout(timer_Ref.current);
            setTransitionFinished(true);
        },
        transitionFinished ? null : transitionDuration_MS * 1.5,
    );

    return show ? (
        <div
            className={classNames(
                'transform-hexagon pointer-events-none absolute flex aspect-hex-flat w-[--hexagon-clip-path-width] select-none transition-[transform,filter,opacity] duration-[calc(var(--ui-animation-menu-transition-duration)*2)]',
                transitionFinished ? 'opacity-100 blur-0' : 'opacity-0 blur-sm',
            )}
            style={cssVariables as CSSProperties}
        >
            <span className="inline-block h-full w-[200%] translate-y-[125%] text-center font-fjalla-one text-sm leading-tight tracking-tight text-theme-root-background/50">
                {homeMenuTransitionTarget && database[homeMenuTransitionTarget].categoryBlurb}
            </span>
        </div>
    ) : null;
};
export default CategoryBlurb;
