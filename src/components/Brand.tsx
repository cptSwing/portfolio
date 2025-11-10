import { CSSProperties, FC, memo, useContext, useEffect, useState } from 'react';
import { calcCSSVariables, offsetHexagonTransforms } from '../lib/shapeFunctions';
import { useZustand } from '../lib/zustand';
import { brandElement, brandElementOffsets } from '../lib/hexagonElements';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import { classNames } from 'cpts-javascript-utilities';
import { ROUTE } from '../types/enums';
import { config } from '../types/exportTyped';
import useTimeout from '../hooks/useTimeout';
import { CategoryName, RotateShortestDistance, TransitionTargetReached } from '../types/types';
const transitionDuration_MS = config.ui.animation.menuTransition_Ms;

const Brand: FC<{ homeMenuTransitionState: [CategoryName | null, TransitionTargetReached, RotateShortestDistance] }> = memo(({ homeMenuTransitionState }) => {
    const [homeMenuTransitionTarget, homeMenuTransitionTargetReached] = homeMenuTransitionState;

    const routeName = useZustand((store) => store.values.routeData.name);
    const containerSize = useContext(GetChildSizeContext);
    const [cssVariablesBrand, setCssVariablesBrand] = useState<
        ReturnType<typeof calcCSSVariables> | CSSProperties | { '--tw-clip-inset-r'?: string; '--tw-clip-inset-l'?: string }
    >();

    useEffect(() => {
        let routeTransformsBrand;
        if (routeName === ROUTE.home && homeMenuTransitionTarget) {
            routeTransformsBrand = offsetHexagonTransforms(brandElement, brandElementOffsets[homeMenuTransitionTarget!])[routeName];
            setCssVariablesBrand({
                ...calcCSSVariables(
                    routeTransformsBrand.position,
                    routeTransformsBrand.rotation,
                    routeTransformsBrand.scale,
                    routeTransformsBrand.isHalf,
                    containerSize,
                    {},
                ),
                'opacity': 0,
                '--tw-clip-inset-l': '50%',
                '--tw-clip-inset-r': '50%',
            });
        } else {
            routeTransformsBrand = brandElement[routeName];
            setCssVariablesBrand(
                calcCSSVariables(
                    routeTransformsBrand.position,
                    routeTransformsBrand.rotation,
                    routeTransformsBrand.scale,
                    routeTransformsBrand.isHalf,
                    containerSize,
                    {},
                ),
            );
        }
    }, [containerSize, homeMenuTransitionTarget, routeName]);

    const timer_Ref = useTimeout(
        () => {
            clearTimeout(timer_Ref.current);
            const routeTransformsBrand = offsetHexagonTransforms(brandElement, brandElementOffsets[homeMenuTransitionTarget!])[routeName];

            setCssVariablesBrand(
                calcCSSVariables(
                    routeTransformsBrand.position,
                    routeTransformsBrand.rotation,
                    routeTransformsBrand.scale,
                    routeTransformsBrand.isHalf,
                    containerSize,
                    {},
                ),
            );
        },
        homeMenuTransitionTargetReached ? transitionDuration_MS * 2 : null,
    );

    return (
        <div
            className={classNames(
                'transform-hexagon pointer-events-none absolute z-50 flex aspect-hex-flat w-[--hexagon-clip-path-width] select-none flex-col justify-center transition-[transform,opacity,clip-path] duration-[calc(var(--ui-animation-menu-transition-duration)*3)] clip-inset-0',
                routeName === ROUTE.home
                    ? 'items-center before:content-none'
                    : 'items-end before:absolute before:left-[-25%] before:top-[34.5%] before:-z-10 before:h-[35%] before:w-[150%] before:rounded-2xl before:bg-theme-root-background/[0.1] before:mask-edges-x-[5%] before:mask-edges-y-[15%]',
            )}
            style={cssVariablesBrand as CSSProperties}
        >
            <span className="w-full text-center font-fjalla-one text-[length:calc(var(--hexagon-clip-path-height)/6)] leading-none tracking-tighter text-theme-primary/100">
                jens brandenburg
            </span>
            <span className="-mb-[5%] w-full text-center font-lato text-[length:calc(var(--hexagon-clip-path-height)/10)] leading-none tracking-tighter text-theme-primary/50">
                web developer & 3d artist
            </span>
            {homeMenuTransitionTarget && <div className="basis-[42.5%]" />}
        </div>
    );
});

export default Brand;
