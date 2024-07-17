import { FC, ReactNode, useCallback, useEffect, useLayoutEffect, useState } from "react";
import classNames from "../lib/classNames";
import Main from "./Main";
import NavMenu from "./NavMenu";
import TocMenu from "./TocMenu";
import pickRandomFromArray from "../lib/pickRandomFromArray";

const parallaxHoleDimensionClassNames = "h-2/3 w-4/5";
export type MenuCheckedType = {
    [key: string]: boolean;
};

const ParallaxScene = () => {
    const menuCheckedStateSet = useState<MenuCheckedType>({
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
                    <ParallaxMenu isEffectLayer={false} menuCheckedStateSet={menuCheckedStateSet} />
                    <ParallaxVisuals />
                </div>
            </div>

            {/* Creates new stacking context: */}
            <div id="parallax-menu" className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 mt-8 perspective-1000">
                <div className="parallax-transform size-full backface-hidden transform-style-3d">
                    <ParallaxMenu isEffectLayer={true} menuCheckedStateSet={menuCheckedStateSet} />
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
                extraClassNames="!shadow-green-600/50 !shadow-inner-sm bloom will-change-filter !overflow-visible outline outline-2 outline-green-900/50 outline-offset-8"
                content={<></>}
            />

            <ParallaxLayer key={3} parallaxLevelClassName="translate-z-24" extraClassNames="!shadow-green-700/10" content={<></>} />

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
                extraClassNames="border-opacity-90 bloom will-change-filter"
                content={<></>}
            />

            {/* Zero: */}
            <ParallaxLayer key={0} parallaxLevelClassName="translate-z-0" extraClassNames="border-opacity-80" content={<></>} />

            {/* Below Zero */}
            <ParallaxLayer key={-1} parallaxLevelClassName="-translate-z-8" extraClassNames="border-opacity-70" content={<></>} />
            <ParallaxLayer key={-2} parallaxLevelClassName="-translate-z-16" extraClassNames="border-opacity-60" content={<></>} />
            <ParallaxLayer key={-3} parallaxLevelClassName="-translate-z-24" extraClassNames="border-opacity-50" content={<></>} />
            <ParallaxLayer key={-4} parallaxLevelClassName="-translate-z-32" extraClassNames="border-opacity-40" content={<></>} />

            {/* Bottom: */}
            <ParallaxLayer key={-5} parallaxLevelClassName="-translate-z-40" extraClassNames="bg-black border-opacity-10" content={<></>} />
        </>
    );
};

const ParallaxMenu: FC<{
    isEffectLayer: boolean;
    menuCheckedStateSet: [MenuCheckedType, React.Dispatch<React.SetStateAction<MenuCheckedType>>];
}> = ({ isEffectLayer, menuCheckedStateSet }) => {
    const [menuChecked] = menuCheckedStateSet;

    return (
        <>
            {/* Menu: */}
            {isEffectLayer && (
                <MenuWrapper menuCheckedStateSet={menuCheckedStateSet} isNavMenu={true} positionClassNames="top-2 left-2 w-48 h-12" />
            )}

            {/* Menu: */}
            {isEffectLayer && (
                <MenuWrapper menuCheckedStateSet={menuCheckedStateSet} isNavMenu={false} positionClassNames="bottom-0 right-0 w-40 h-12" />
            )}

            {/* Content: */}
            {isEffectLayer && (
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
            )}

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
                                ? "bloom pointer-events-auto cursor-pointer will-change-filter hover:border-2 hover:border-green-600"
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
                                ? "bloom pointer-events-auto cursor-pointer will-change-filter hover:border-2 hover:border-red-400"
                                : "bg-gray-400",
                        )}
                    >
                        {!isEffectLayer && "3D Art"}
                    </div>
                }
                menuCheckedStateSet={menuCheckedStateSet}
            />
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

                    <div className="parallax-border bloom absolute bottom-0 left-1/2 mb-8 flex -translate-x-1/2 flex-col items-start justify-end rounded-md border-2 border-green-800 bg-green-1000 px-8 py-2 will-change-filter">
                        <div className="filter-none">jens brandenburg</div>
                        <div className="text-sm italic text-white/40 filter-none">
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

const MenuWrapper: FC<{
    menuCheckedStateSet: [MenuCheckedType, React.Dispatch<React.SetStateAction<MenuCheckedType>>];
    isNavMenu: boolean;
    positionClassNames: string;
}> = ({ menuCheckedStateSet, isNavMenu, positionClassNames }) => {
    const menuClassNames = "rounded-md bloom pointer-events-none absolute border-2 border-slate-400 p-1.5";

    return (
        <>
            <ParallaxMenuLayer
                key={3.7}
                parallaxLevelClassName={"translate-z-[8.5rem]"}
                extraClassNames="transform"
                content={<div className={classNames(menuClassNames, positionClassNames)} />}
                menuCheckedStateSet={menuCheckedStateSet}
            />
            <ParallaxMenuLayer
                key={3.8}
                parallaxLevelClassName={"translate-z-[8.75rem]"}
                extraClassNames="transform"
                content={<div className={classNames(menuClassNames, positionClassNames)} />}
                menuCheckedStateSet={menuCheckedStateSet}
            />

            <ParallaxMenuLayer
                key={4}
                parallaxLevelClassName={"translate-z-36"}
                extraClassNames="transform"
                content={
                    isNavMenu ? (
                        <NavMenu
                            menuCheckedStateSet={menuCheckedStateSet}
                            menuClassNames={classNames(menuClassNames, positionClassNames)}
                        />
                    ) : (
                        <TocMenu
                            menuCheckedStateSet={menuCheckedStateSet}
                            menuClassNames={classNames(menuClassNames, positionClassNames)}
                        />
                    )
                }
                menuCheckedStateSet={menuCheckedStateSet}
            />

            <ParallaxMenuLayer
                key={4.1}
                parallaxLevelClassName={"translate-z-[9.25rem]"}
                extraClassNames="transform"
                content={<div className={classNames(menuClassNames, positionClassNames)} />}
                menuCheckedStateSet={menuCheckedStateSet}
            />
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
                "absolute bottom-0 left-0 right-0 top-0 m-auto transform overflow-hidden rounded-md border-2 border-green-800 shadow-inner-md shadow-black",
                parallaxHoleDimensionClassNames,
                parallaxLevelClassName,
                extraClassNames,
            )}
        >
            {content}
        </div>
    );
};

const usedIndices: Record<string, number> = {};

const ParallaxMenuLayer: FC<{
    content: ReactNode;
    menuCheckedStateSet: [MenuCheckedType, React.Dispatch<React.SetStateAction<MenuCheckedType>>];
    parallaxLevelClassName: string;
    extraClassNames?: string;
    style?: React.CSSProperties;
    id?: string;
}> = ({ content, menuCheckedStateSet, parallaxLevelClassName, extraClassNames, style, id }) => {
    const [menuChecked] = menuCheckedStateSet;
    const [nodeAnim, setNodeAnim] = useState<[HTMLDivElement, Animation]>();

    const measureRef = useCallback((node: HTMLDivElement) => {
        if (node) {
            const id = node.getAttribute("id");
            if (id) {
                let startTileSet, startTile, startTileIndex;

                if (id in usedIndices) {
                    startTileIndex = usedIndices[id];
                    startTile = tileLocations[startTileIndex];
                } else {
                    startTileSet = pickRandomFromArray(tileLocations);
                    startTile = startTileSet[0];
                    startTileIndex = startTileSet[1];
                }

                if (!(id in usedIndices)) {
                    usedIndices[id] = startTileIndex;
                }

                const [startTileX, startTileY] = startTile;

                node.style.setProperty("transform", `translate3d(${wrapLocation(startTileX)}%, ${wrapLocation(startTileY)}%, initial)`);

                const movement = pickRandomFromArray(Object.values(keyframes(startTile, startTileIndex)))[0];
                const anim = node.animate(...movement);
                anim.finish();
                setNodeAnim([node, anim]);
            }
        }
    }, []);

    useLayoutEffect(() => {
        if (nodeAnim) {
            const [node, anim] = nodeAnim;
            anim.reverse();
        }
    }, [menuChecked.home, nodeAnim]);

    return (
        <div
            id={`${id ? id.replace(" ", "") : id}-wrapper`}
            ref={measureRef}
            className={classNames(
                "absolute bottom-0 left-0 right-0 top-0 m-auto rounded-md",
                parallaxHoleDimensionClassNames,
                parallaxLevelClassName,
                extraClassNames,
            )}
            style={style}
        >
            {content}
        </div>
    );
};

const tileLocations = [
    [0, 0],
    [20, 0],
    [40, 0],
    [60, 0],
    [80, 0],
    [0, 20],
    [0, 40],
    [0, 60],
    [0, 80],
] as [number, number][];

const delays = tileLocations.map((tileLoc, idx) => 100 * idx);

const fadeInKeyframe: (startTile: [number, number]) => [PropertyIndexedKeyframes, KeyframeAnimationOptions] = (
    startTile: [number, number],
) => {
    const [startTileX, startTileY] = wrapLocation(startTile);

    return [
        {
            transform: [`translate3d(${startTileX}%, ${startTileY}%, -10rem)`, `translate3d(${startTileX}%, ${startTileY}%, -4rem)`],
            opacity: [0, 1],
            offset: [0.2],
        },
        {
            duration: 500,
            direction: "normal",
            fill: "forwards",
            iterations: 1,
            delay: 100,
            // playbackRate: 0,
        },
    ];
};

const keyframes: (
    startTile: [number, number],
    delayIndex: number,
) => Record<string, [PropertyIndexedKeyframes, KeyframeAnimationOptions]> = (startTile: [number, number], delayIndex) => {
    const [startTileX, startTileY] = startTile;

    return {
        leftToRight: [
            {
                opacity: [0.25, 1],
                transform: [
                    `translate3d(${wrapLocation(startTileX)}%, ${wrapLocation(startTileY)}%, -8rem)`,
                    `translate3d(${wrapLocation(startTileX + 40)}%, ${wrapLocation(startTileY)}%, -4rem)`,
                    `translate3d(${wrapLocation(startTileX + 40)}%, ${wrapLocation(startTileY + 60)}%, -4rem)`,
                    `translate3d(${wrapLocation(startTileX + 40)}%, ${wrapLocation(startTileY + 60)}%, 4rem)`,
                ],
                offset: [0.001, 0.2, 0.666],
            },
            {
                duration: 700,
                direction: "normal",
                fill: "forwards",
                iterations: 1,
                delay: delays[delayIndex],
                // playbackRate: 0,
            },
        ],
        // rightToLeft: [
        //     {
        //         opacity: [0, 1],
        //         transform: [
        //             `translate3d(${startTileX}%, ${startTileY}%, -4rem)`,
        //             `translate3d(${startTileX}%, ${startTileY}%, -4rem)`,
        //             `translate3d(${startTileX}%, ${startTileY}%, -4rem)`,
        //             `translate3d(${startTileX}%, ${startTileY}%, 4rem)`,
        //         ],
        //         offset: [0.3, 0.6],
        //     },
        //     {
        //         duration: 1500,
        //         direction: "normal",
        //         fill: "forwards",
        //         iterations: 1,
        //         delay: 100,
        //         // playbackRate: 0,
        //     },
        // ],
    };
};

const wrapLocation = (tileAxisLoc: number) => {
    let newTileAxisLoc = tileAxisLoc;

    if (newTileAxisLoc >= 80) {
        newTileAxisLoc = 0;
    }

    return newTileAxisLoc;
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