import { FC, useEffect, useState } from "react";
import classNames from "../lib/classNames";
import Main from "./Main";
import MenuWrapper from "./MenuWrapper";
import { ParallaxLayer, ParallaxMenuLayer, SvgLayer } from "./ParallaxLayers";

export const parallaxHoleDimensionClassNames = "h-2/3 w-4/5";

export type MenuCheckedType = {
    [key: string]: boolean;
};

const ParallaxScene = () => {
    const menuCheckedStateSet = useState<MenuCheckedType>({
        default: true,
        home: false,
        back: false,
        forward: false,
        settings: false,
        viewCode: false,
        resume: false,
        code: false,
        art: false,
    });

    useEffect(() => {
        parallaxEffect(1);
    }, []);

    return (
        <div id="parallax" className="h-dvh w-dvw">
            <div id="parallax-visuals" className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 mt-8 perspective-1000">
                <div className="parallax-transform size-full translate-z-36 backface-hidden transform-style-3d">
                    <ParallaxVisuals isEffectLayer={true} menuCheckedStateSet={menuCheckedStateSet} />
                </div>
            </div>
        </div>
    );
};

export default ParallaxScene;

const ParallaxVisuals: FC<{
    isEffectLayer: boolean;
    menuCheckedStateSet: [MenuCheckedType, React.Dispatch<React.SetStateAction<MenuCheckedType>>];
}> = ({ isEffectLayer, menuCheckedStateSet }) => {
    const [menuChecked] = menuCheckedStateSet;

    return (
        <>
            <SvgLayer
                parallaxLevelClassName="translate-z-32"
                svgStroke="rgba(0, 255, 0, 1)"
                svgStrokeWidth="0.05"
                svgFill="rgba(0, 255, 0, 0.5)"
                content={<></>}
            />

            <SvgLayer
                parallaxLevelClassName="translate-z-24"
                svgStroke="none"
                svgStrokeWidth="0"
                svgFill="rgba(0, 255, 0, 0.5)"
                content={<></>}
            />

            {/* Quad Layer: */}
            <ParallaxLayer
                parallaxLevelClassName="translate-z-16"
                extraClassNames="!size-full shadow-inner-svg-none !parallax-border-none"
                content={<ParallaxQuadLayer />}
            />

            <SvgLayer
                parallaxLevelClassName="translate-z-16"
                svgStroke="none"
                svgStrokeWidth="0"
                svgFill="rgba(0, 255, 0, 0.5)"
                content={<Main menuCheckedStateSet={menuCheckedStateSet} />}
            />
            <SvgLayer
                parallaxLevelClassName="translate-z-8"
                svgStroke="none"
                svgStrokeWidth="0"
                svgFill="rgba(0, 255, 0, 0.5)"
                content={<></>}
            />
            <SvgLayer
                parallaxLevelClassName="translate-z-0"
                svgStroke="none"
                svgStrokeWidth="0"
                svgFill="rgba(0, 255, 0, 0.5)"
                content={<></>}
            />
            <SvgLayer
                parallaxLevelClassName="-translate-z-8"
                svgStroke="none"
                svgStrokeWidth="0"
                svgFill="rgba(0, 255, 0, 0.4)"
                content={<></>}
                fill
            />
            <SvgLayer
                parallaxLevelClassName="-translate-z-16"
                svgStroke="none"
                svgStrokeWidth="0"
                svgFill="rgba(0, 255, 0, 0.3)"
                content={<></>}
                fill
            />
            <SvgLayer
                parallaxLevelClassName="-translate-z-24"
                svgStroke="none"
                svgStrokeWidth="0"
                svgFill="rgba(0, 255, 0, 0.2)"
                content={<></>}
                fill
            />
            <SvgLayer
                parallaxLevelClassName="-translate-z-32"
                svgStroke="none"
                svgStrokeWidth="0"
                svgFill="rgba(0, 255, 0, 0.1)"
                content={<></>}
                fill
            />

            {/* Content: */}
            {/* {isEffectLayer && (
                <ParallaxMenuLayer
                    key={0}
                    parallaxLevelClassName={"translate-z-0"}
                    extraClassNames={classNames(
                        "p-6 delay-200 duration-300 transform",
                        menuChecked.home ? "-translate-x-full" : "translate-x-0",
                    )}
                    content={<Main menuCheckedStateSet={menuCheckedStateSet} />}
                    menuCheckedStateSet={menuCheckedStateSet}
                />
            )} */}

            <ParallaxMenuLayer
                id="Resume"
                key={-1.5}
                parallaxLevelClassName="-translateZ-400"
                extraClassNames="p-8  opacity-0"
                content={
                    <div
                        className={classNames(
                            "h-1/5 w-1/5 rounded-md border-2 border-dashed border-transparent p-1 outline outline-offset-2 outline-green-800/50",
                            isEffectLayer
                                ? "pointer-events-auto cursor-pointer hover:border-2 hover:border-l-white hover:border-t-white hover:outline-4 hover:outline-green-800/70"
                                : "bg-gray-400 outline-2",
                        )}
                    >
                        {isEffectLayer && <h2>Resume</h2>}
                    </div>
                }
                menuCheckedStateSet={menuCheckedStateSet}
            />

            <ParallaxMenuLayer
                id="Code"
                key={-2.5}
                parallaxLevelClassName="-translateZ-400"
                extraClassNames="p-8  opacity-0"
                content={
                    <div
                        className={classNames(
                            "h-1/5 w-1/5 rounded-md border-2 border-purple-400 p-1",
                            isEffectLayer
                                ? "bloom-svg pointer-events-auto cursor-pointer will-change-filter hover:border-2 hover:border-green-600"
                                : "bg-gray-400",
                        )}
                    >
                        {!isEffectLayer && "Code"}
                    </div>
                }
                menuCheckedStateSet={menuCheckedStateSet}
            />

            <ParallaxMenuLayer
                id="3D Art"
                key={-3.5}
                parallaxLevelClassName="-translateZ-400"
                extraClassNames={classNames("p-8  opacity-0")}
                content={
                    <div
                        className={classNames(
                            "h-1/5 w-1/5 rounded-md border-2 border-red-900 p-1",
                            isEffectLayer
                                ? "bloom-svg pointer-events-auto cursor-pointer will-change-filter hover:border-2 hover:border-red-400"
                                : "bg-gray-400",
                        )}
                    >
                        {!isEffectLayer && "3D Art"}
                    </div>
                }
                menuCheckedStateSet={menuCheckedStateSet}
            />

            {/* Nav Menu: */}
            {isEffectLayer && (
                <MenuWrapper menuCheckedStateSet={menuCheckedStateSet} isNavMenu={true} positionClassNames="top-2 left-2 w-48 h-12" />
            )}

            {/* TOC Menu: */}
            {isEffectLayer && (
                <MenuWrapper menuCheckedStateSet={menuCheckedStateSet} isNavMenu={false} positionClassNames="bottom-0 right-12 w-40 h-12" />
            )}
        </>
    );
};
const ParallaxQuadLayer = () => {
    return (
        <div className="m-auto flex size-full flex-col items-center justify-start">
            {/* Top row (horizontal) */}
            <div className="flex h-[16.6666%] w-full items-start justify-start">
                <div className="h-full w-[10%] border-b border-r border-green-900/50"></div>
                <div className="relative h-full w-4/5">
                    <div className="flex size-full divide-x divide-green-900/50">
                        <div className="h-full w-1/5" />
                        <div className="h-full w-1/5" />
                        <div className="h-full w-1/5" />
                        <div className="h-full w-1/5" />
                        <div className="h-full w-1/5" />
                    </div>

                    <div className="parallax-border-animated bloom-svg absolute bottom-0 left-1/2 mb-8 flex -translate-x-1/2 flex-col items-start justify-end rounded-md border-2 border-green-800 bg-green-1000 px-8 py-2 will-change-filter">
                        <div className="!filter-none">jens brandenburg</div>
                        <div className="text-sm italic text-white/40 !filter-none">
                            I build websites, I build 3D scenes. Then I combine the two.
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle row (horizontal) */}
            <div className="flex h-2/3 w-full items-start justify-start">
                <div className="h-full w-[10%]">
                    <div className="flex size-full flex-col divide-y divide-green-900/50">
                        <div className="h-1/4 w-full" />
                        <div className="h-1/4 w-full" />
                        <div className="h-1/4 w-full" />
                        <div className="h-1/4 w-full" />
                    </div>
                </div>
                <div className="h-full w-4/5"></div>
                <div className="h-full w-[10%]">
                    <div className="flex size-full flex-col divide-y divide-green-900/50">
                        <div className="h-1/4 w-full" />
                        <div className="h-1/4 w-full" />
                        <div className="h-1/4 w-full" />
                        <div className="h-1/4 w-full" />
                    </div>
                </div>
            </div>

            {/* Bottom row (horizontal) */}
            <div className="flex h-[16.6666%] w-full items-start justify-start">
                <div className="h-full w-[10%] border-r border-t border-green-900/50"></div>
                <div className="flex h-full w-4/5 divide-x divide-green-900/50">
                    <div className="h-full w-1/5" />
                    <div className="h-full w-1/5" />
                    <div className="h-full w-1/5" />
                    <div className="h-full w-1/5" />
                    <div className="h-full w-1/5" />
                </div>
                <div className="h-full w-[10%] border-l border-t border-green-900/50"></div>
            </div>
        </div>
    );
};

const parallaxEffect = (smoothing: number) => {
    const root = document.documentElement;
    smoothing /= 100;

    root.addEventListener("mousemove", (event) => {
        // calculate transformation values
        const rotateHoriz = (event.clientY - window.innerHeight / 2) * smoothing;
        const rotateVert = ((event.clientX - window.innerWidth / 2) * -smoothing) / 2;

        // set CSS variables
        root.style.setProperty("--parallax-horizontal", `${rotateHoriz}deg`);
        root.style.setProperty("--parallax-vertical", `${rotateVert}deg`);
    });
};
