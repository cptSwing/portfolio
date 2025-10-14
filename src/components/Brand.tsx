import { CSSProperties, FC, memo, useContext, useLayoutEffect, useState } from 'react';
import FitText from './utilityComponents/FitText';
import { calcCSSVariables, offsetHexagonTransforms } from '../lib/shapeFunctions';
import { useZustand } from '../lib/zustand';
import { brandBlurbOffsets, brandTransformData, brandTransformOffsets, categoryLinkButtons } from '../lib/hexagonElements';
import GetChildSizeContext from '../contexts/GetChildSizeContext';
import { classNames } from 'cpts-javascript-utilities';
import { ROUTE } from '../types/enums';
import { database } from '../types/exportTyped';
import { config } from '../types/exportTyped';
import useTimeout from '../hooks/useTimeout';
const transitionDuration_MS = config.ui.animation.menuTransition_Ms;

const Brand: FC<{ homeMenuTransitionStates: ['code' | '3d' | 'log' | null, boolean] }> = memo(({ homeMenuTransitionStates }) => {
    const [homeMenuTransitionTarget, homeMenuTransitionTargetReached] = homeMenuTransitionStates;

    const routeName = useZustand((store) => store.values.routeData.name);
    const containerSize = useContext(GetChildSizeContext);
    const [cssVariablesBrand, setCssVariablesBrand] = useState<ReturnType<typeof calcCSSVariables> | CSSProperties>();
    const [cssVariablesBlurb, setCssVariablesBlurb] = useState<ReturnType<typeof calcCSSVariables> | CSSProperties>();

    useLayoutEffect(() => {
        let routeTransformsBrand;
        if (routeName === ROUTE.home && homeMenuTransitionTarget) {
            routeTransformsBrand = offsetHexagonTransforms(brandTransformData, brandTransformOffsets[homeMenuTransitionTarget!])[routeName];
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

            const routeTransformsBlurb = categoryLinkButtons.find((linkButton) => linkButton.name === homeMenuTransitionTarget)![routeName];
            setCssVariablesBlurb({
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
        } else {
            routeTransformsBrand = brandTransformData[routeName];
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
            const routeTransformsBrand = offsetHexagonTransforms(brandTransformData, brandTransformOffsets[homeMenuTransitionTarget!])[routeName];
            const routeTransformsBlurb = offsetHexagonTransforms(brandTransformData, brandBlurbOffsets[homeMenuTransitionTarget!])[routeName];

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
            setCssVariablesBlurb(
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

    return (
        <>
            <div
                className={classNames(
                    'transform-hexagon pointer-events-none absolute z-50 flex aspect-hex-flat w-[--hexagon-clip-path-width] select-none flex-col justify-center transition-[transform,opacity,clip-path] duration-[calc(var(--ui-animation-menu-transition-duration)*3)] clip-inset-0 before:absolute before:left-[-25%] before:top-[34.5%] before:-z-10 before:h-[35%] before:w-[150%] before:rounded-2xl before:mask-edges-x-[5%] before:mask-edges-y-[15%]',
                    routeName === ROUTE.home ? 'items-center before:bg-transparent' : 'items-end before:bg-theme-root-background/[0.1]',
                )}
                style={cssVariablesBrand as CSSProperties}
            >
                <FitText text="jens brandenburg" className="h-1/5 w-full font-lato leading-none tracking-tighter text-theme-primary/20" />
                <FitText
                    text="web developer & 3d artist"
                    className="-mt-[2%] mr-[2%] h-[10%] w-auto max-w-full font-lato leading-none tracking-tighter text-theme-primary-darker/20"
                />
            </div>

            <Blurb cssVariables={cssVariablesBlurb} transitionTarget={homeMenuTransitionTarget} />
        </>
    );
});

export default Brand;

const Blurb: FC<{ cssVariables?: ReturnType<typeof calcCSSVariables> | CSSProperties; transitionTarget: 'code' | '3d' | 'log' | null }> = ({
    cssVariables,
    transitionTarget,
}) => {
    return (
        <div
            className="transform-hexagon pointer-events-none absolute z-50 flex aspect-hex-flat w-[--hexagon-clip-path-width] select-none flex-col items-center justify-end transition-[transform,opacity,clip-path] duration-[calc(var(--ui-animation-menu-transition-duration)*3)] clip-inset-0"
            style={cssVariables as CSSProperties}
        >
            {transitionTarget && (
                <>
                    <span className="w-full whitespace-pre-wrap text-center font-fjalla-one text-sm leading-tight tracking-tight text-theme-root-background/50">
                        {database[transitionTarget].categoryBlurb}
                    </span>
                    <div className="basis-[40%]" />
                </>
            )}
        </div>
    );
};
