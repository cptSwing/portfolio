import { FC, ReactNode, useEffect, useState } from "react";
import classNames from "../lib/classNames";
import Main from "./Main";

const ParallaxScene = () => {
    const menuHomeIsClickedState = useState(false);
    // const [menuHomeIsClicked, setMenuHomeIsClicked] = menuHomeIsClickedState;

    useEffect(() => {
        parallaxEffect(10);
    }, []);

    return (
        <div className="size-full">
            <div className="pointer-events-none absolute left-0 top-0 size-full perspective-1000">
                <div className="parallax-transform mt-8 h-svh w-svw backface-hidden transform-style-3d">
                    <ParallaxVisuals />

                    <ParallaxMenu isEffectLayer={false} menuHomeIsClickedState={menuHomeIsClickedState} />
                </div>
            </div>

            {/* Creates new stacking context: */}
            <div className="pointer-events-none absolute left-0 top-0 size-full perspective-1000">
                <div className="parallax-transform mt-8 h-svh w-svw backface-hidden transform-style-3d">
                    <ParallaxMenu isEffectLayer={true} menuHomeIsClickedState={menuHomeIsClickedState} />
                </div>
            </div>
        </div>
    );
};

export default ParallaxScene;

const ParallaxVisuals = () => {
    return (
        <>
            {/* Top: */}
            <ParallaxLayer
                key={4}
                parallaxLevelClassName="translate-z-32"
                extraClassNames="!shadow-green-600/50 !shadow-inner-sm filter-bloom will-change-filter !overflow-visible outline outline-2 outline-green-900/50 outline-offset-8"
                content={<></>}
            />

            <ParallaxLayer key={3} parallaxLevelClassName="translate-z-24" extraClassNames="!shadow-green-700/10 " content={<></>} />

            {/* Quad Layer: */}
            <ParallaxLayer
                parallaxLevelClassName="translate-z-16"
                extraClassNames="!size-full !shadow-none !border-0"
                content={<ParallaxQuadLayer />}
            />

            <ParallaxLayer key={2} parallaxLevelClassName="translate-z-16" content={<></>} />

            <ParallaxLayer
                key={1}
                parallaxLevelClassName="translate-z-8"
                extraClassNames="border-opacity-90 filter-bloom will-change-filter"
                content={<></>}
            />

            {/* Zero: */}
            <ParallaxLayer key={0} parallaxLevelClassName="translate-z-0" extraClassNames="border-opacity-80" content={<></>} />

            <ParallaxLayer key={-1} parallaxLevelClassName="-translate-z-8" extraClassNames="border-opacity-70" content={<></>} />
            <ParallaxLayer key={-2} parallaxLevelClassName="-translate-z-16" extraClassNames="border-opacity-60" content={<></>} />
            <ParallaxLayer key={-3} parallaxLevelClassName="-translate-z-24" extraClassNames="border-opacity-50" content={<></>} />
            <ParallaxLayer key={-4} parallaxLevelClassName="-translate-z-32" extraClassNames="border-opacity-40" content={<></>} />

            {/* Bottom: */}
            <ParallaxLayer key={-5} parallaxLevelClassName="-translate-z-40" extraClassNames="bg-black border-opacity-10" content={<></>} />
        </>
    );
};

const ParallaxLayer: FC<{
    content: ReactNode;
    parallaxLevelClassName: string;
    extraClassNames?: string;
}> = ({ content, parallaxLevelClassName, extraClassNames }) => {
    return (
        <div
            className={classNames(
                "absolute bottom-0 left-0 right-0 top-0 m-auto h-2/3 w-4/5 transform overflow-hidden rounded-md border-2 border-green-800 shadow-inner-md shadow-black",
                parallaxLevelClassName,
                extraClassNames,
            )}
        >
            {content}
        </div>
    );
};

const ParallaxMenuLayer: FC<{
    content: ReactNode;
    parallaxLevelClassName: string;
    extraClassNames?: string;
}> = ({ content, parallaxLevelClassName, extraClassNames }) => {
    return (
        <div
            className={classNames(
                "pointer-events-none absolute bottom-0 left-0 right-0 top-0 m-auto transform overflow-hidden rounded-md transition-transform will-change-transform",
                parallaxLevelClassName,
                extraClassNames,
            )}
            onMouseOver={(e) => console.log("%c[ParallaxScene]", "color: #29c793", `e.target :`, e.target)}
        >
            {content}
        </div>
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

                    <div className="filter-bloom absolute bottom-0 left-1/2 mb-8 flex -translate-x-1/2 flex-col items-start justify-end rounded-md border-2 border-green-800 bg-green-1000 px-8 py-2 will-change-filter">
                        <div className="">jens brandenburg</div>

                        <div className="text-sm italic text-white/40">I build websites, I build 3D scenes. Then I combine the two.</div>
                    </div>
                </div>
                <div className="filter-bloom h-full w-[10%] border-b border-l border-green-900/50 will-change-filter"></div>
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

const ParallaxMenu: FC<{ isEffectLayer: boolean; menuHomeIsClickedState: [boolean, React.Dispatch<React.SetStateAction<boolean>>] }> = ({
    isEffectLayer,
    menuHomeIsClickedState,
}) => {
    const [menuHomeIsClicked] = menuHomeIsClickedState;

    return (
        <>
            {/* Menu: */}
            {isEffectLayer && <TopLeftMenu menuHomeIsClickedState={menuHomeIsClickedState} />}

            {/* Menu: */}
            {/* TODO This is stubbornly not working */}
            {isEffectLayer && (
                <ParallaxMenuLayer
                    key={3}
                    parallaxLevelClassName="translate-z-28"
                    extraClassNames="!overflow-visible"
                    content={
                        <div className="absolute bottom-0 left-0 right-0 top-0 mb-24 size-full">
                            <TOCMenu menuHomeIsClickedState={menuHomeIsClickedState} />
                        </div>
                    }
                />
            )}

            {/* Content: */}
            {isEffectLayer && (
                <ParallaxMenuLayer
                    key={0}
                    parallaxLevelClassName={"translate-z-0"}
                    extraClassNames={classNames(
                        "p-6 delay-200 duration-300  h-2/3 w-4/5",
                        menuHomeIsClicked ? "-translate-x-full" : "translate-x-0",
                    )}
                    content={<Main />}
                />
            )}

            <ParallaxMenuLayer
                key={-2.5}
                parallaxLevelClassName={classNames(menuHomeIsClicked ? "translate-z-16 hover:translate-z-[4.5rem]" : "-translate-z-16")}
                extraClassNames="p-8  h-2/3 w-4/5 delay-100 duration-500 hover:delay-0 hover:duration-100"
                content={
                    <div
                        className={classNames(
                            "h-1/5 w-1/5 translate-x-[400%] translate-y-1/4 rounded-md border-2 border-purple-400 p-1",
                            isEffectLayer
                                ? "filter-bloom pointer-events-auto cursor-pointer will-change-filter hover:border-2 hover:border-green-600"
                                : "bg-gray-400",
                        )}
                    >
                        {!isEffectLayer && "Menu Item #2"}
                    </div>
                }
            />

            <ParallaxMenuLayer
                key={-3.5}
                parallaxLevelClassName={classNames(menuHomeIsClicked ? "translate-z-16 hover:translate-z-[4.5rem]" : "-translate-z-40")}
                extraClassNames="p-8  h-2/3 w-4/5 delay-100 duration-500 hover:delay-0 hover:duration-100"
                content={
                    <div
                        className={classNames(
                            "h-1/5 w-1/5 translate-x-[300%] translate-y-[400%] rounded-md border-2 border-red-900 p-1",
                            isEffectLayer
                                ? "filter-bloom pointer-events-auto cursor-pointer will-change-filter hover:border-2 hover:border-red-400"
                                : "bg-gray-400 hover:bg-yellow-500",
                        )}
                    >
                        {!isEffectLayer && "Menu Item #3"}
                    </div>
                }
            />

            <ParallaxMenuLayer
                key={-1.5}
                parallaxLevelClassName={classNames(menuHomeIsClicked ? "translate-z-16 hover:translate-z-[4.5rem]" : "-translate-z-8")}
                extraClassNames="p-8  h-2/3 w-4/5 delay-100 duration-500 hover:delay-0 hover:duration-100"
                content={
                    <div
                        className={classNames(
                            "h-1/5 w-1/5 translate-x-[0%] translate-y-[100%] rounded-md border-2 border-dashed border-transparent p-1 outline outline-offset-2 outline-green-800/50",
                            isEffectLayer
                                ? "pointer-events-auto cursor-pointer hover:border-2 hover:border-l-white hover:border-t-white hover:outline-4 hover:outline-green-800/70"
                                : "bg-gray-400 outline-2",
                        )}
                    >
                        {isEffectLayer && <h2>Menu Item #1</h2>}
                    </div>
                }
            />
        </>
    );
};

const TopLeftMenu: FC<{
    menuHomeIsClickedState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}> = ({ menuHomeIsClickedState }) => {
    return (
        <>
            <ParallaxMenuLayer
                key={4}
                parallaxLevelClassName={"translate-z-36"}
                extraClassNames="!overflow-visible size-full"
                content={
                    <div className="ml-48 mr-auto mt-32 h-full">
                        <TOCMenu menuHomeIsClickedState={menuHomeIsClickedState} />
                    </div>
                }
            />
            <ParallaxMenuLayer
                key={3.9}
                parallaxLevelClassName={"translate-z-32"}
                extraClassNames="!overflow-visible size-full"
                content={
                    <div className="ml-48 mr-auto mt-32 h-full">
                        <div className="size-full border-2 border-gray-600"></div>
                    </div>
                }
            />
            <ParallaxMenuLayer
                key={3.8}
                parallaxLevelClassName={"translate-z-28"}
                extraClassNames="!overflow-visible size-full"
                content={
                    <div className="ml-48 mr-auto mt-32 h-full">
                        <div className="size-full border-2 border-gray-600"></div>
                    </div>
                }
            />
        </>
    );
};

const TOCMenu: FC<{ menuHomeIsClickedState: [boolean, React.Dispatch<React.SetStateAction<boolean>>] }> = ({ menuHomeIsClickedState }) => {
    const [, setMenuHomeIsClicked] = menuHomeIsClickedState;

    return (
        <div className="filter-bloom pointer-events-auto w-1/5 border-2 border-slate-400 p-1.5 will-change-filter">
            <label className="relative size-full">
                <input
                    type="checkbox"
                    className="peer pointer-events-none hidden"
                    onChange={() => setMenuHomeIsClicked((menuHomeIsClicked) => !menuHomeIsClicked)}
                />
                <div className="inline-block cursor-pointer select-none border-2 border-fuchsia-500 p-1 filter-none hover:bg-blue-500/25 peer-checked:border-transparent peer-checked:bg-yellow-500/50 peer-checked:text-black">
                    Menu
                </div>
            </label>
        </div>
    );
};

export const mainContentClassNames = "bg-black/10 pointer-events-auto overflow-y-visible";

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
