import { CSSProperties, FC, useContext, useLayoutEffect, useRef, useState } from 'react';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import useTimeout from '../hooks/useTimeout';
import { brandElement, categoryLinkButtonElements, brandBlurbOffsets } from '../lib/hexagonElements';
import { calcCSSVariables, offsetHexagonTransforms } from '../lib/shapeFunctions';
import { useZustand } from '../lib/zustand';
import { ROUTE } from '../types/enums';
import { CategoryName, TransitionTargetReached, RotateShortestDistance } from '../types/types';
import { config, database } from '../types/exportTyped';
import useMountTransition from '../hooks/useMountTransition';

const transitionDuration_MS = config.ui.animation.menuTransition_Ms;

const CategoryBlurb: FC<{ show: boolean; homeMenuTransitionState: [CategoryName | null, TransitionTargetReached, RotateShortestDistance] }> = ({
    show,
    homeMenuTransitionState,
}) => {
    const [homeMenuTransitionTarget, homeMenuTransitionTargetReached] = homeMenuTransitionState;
    const categoryBlurbRef = useRef<HTMLDivElement | null>(null);

    const routeName = useZustand((store) => store.values.routeData.name);
    const containerSize = useContext(GetChildSizeContext);
    const isMounted = useMountTransition(categoryBlurbRef, show, ['!clip-inset-[-10%]']);

    const [cssVariables, setCssVariables] = useState<ReturnType<typeof calcCSSVariables> | CSSProperties>();

    useLayoutEffect(() => {
        if (routeName === ROUTE.home && homeMenuTransitionTarget) {
            const routeTransformsBlurb = categoryLinkButtonElements.find((linkButton) => linkButton.name === homeMenuTransitionTarget)![routeName];
            setCssVariables({
                ...calcCSSVariables(
                    routeTransformsBlurb.position,
                    routeTransformsBlurb.rotation + 30,
                    routeTransformsBlurb.scale,
                    routeTransformsBlurb.isHalf,
                    containerSize,
                    {},
                ),
                'opacity': 0,
                '--tw-clip-inset-t': '100%',
            });
        }
    }, [containerSize, homeMenuTransitionTarget, routeName]);

    const timer_Ref = useTimeout(
        () => {
            clearTimeout(timer_Ref.current);
            const routeTransformsBlurb = offsetHexagonTransforms(brandElement, brandBlurbOffsets[homeMenuTransitionTarget!])[routeName];

            setCssVariables(
                calcCSSVariables(
                    routeTransformsBlurb.position,
                    routeTransformsBlurb.rotation,
                    routeTransformsBlurb.scale,
                    routeTransformsBlurb.isHalf,
                    containerSize,
                    {},
                ),
            );
        },
        homeMenuTransitionTargetReached ? transitionDuration_MS * 2 : null,
    );

    return isMounted ? (
        <div
            ref={categoryBlurbRef}
            className="transform-hexagon pointer-events-none absolute z-50 flex aspect-hex-flat w-[--hexagon-clip-path-width] select-none flex-col items-center justify-end transition-[transform,opacity,clip-path] duration-[calc(var(--ui-animation-menu-transition-duration)*3)] clip-inset-[-100%]"
            style={cssVariables as CSSProperties}
        >
            {homeMenuTransitionTarget && (
                <>
                    <span className="w-[200%] text-center font-fjalla-one text-sm leading-tight tracking-tight text-theme-root-background/50">
                        {database[homeMenuTransitionTarget].categoryBlurb}
                    </span>
                    <div className="basis-[60%]" />
                </>
            )}
        </div>
    ) : null;
};

export default CategoryBlurb;
