import { FC, useMemo, ReactNode, useState, useLayoutEffect, useCallback } from "react";
import classNames from "../lib/classNames";
import returnSvg from "../lib/returnSvg";
import { parallaxHoleDimensionClassNames } from "./ParallaxScene";
import pickRandomFromArray from "../lib/pickRandomFromArray";
import { useZustand } from "../lib/zustand";

export const SvgLayer: FC<{
    content: ReactNode;
    svgStroke: string;
    svgStrokeWidth: string;
    svgFill: string;
    parallaxLevelClassName: string;
    fill?: boolean;
    bloom?: boolean;
}> = ({ content, svgStroke, svgStrokeWidth, svgFill, parallaxLevelClassName, fill = false, bloom = false }) => {
    const svgStyle = useMemo(() => {
        const { svg, svgSlice, svgSliceWidth } = returnSvg("frame", svgStroke, svgStrokeWidth, svgFill);

        return {
            borderImageSource: `url('data:image/svg+xml,${svg}')`,

            borderImageSlice: `${svgSlice} ${fill ? "fill" : ""}`,
            borderImageWidth: svgSliceWidth,
            borderImageRepeat: "repeat repeat",
            borderImageOutset: "1rem",
            borderStyle: "solid",
        };
    }, [svgStroke, svgStrokeWidth, svgFill, fill]);

    return (
        <div
            className={classNames(
                "shadow-inner-svg absolute bottom-0 left-0 right-0 top-0 m-auto box-border transform",
                parallaxHoleDimensionClassNames,
                parallaxLevelClassName,
                bloom ? "bloom-svg" : "",
            )}
            style={svgStyle}
        >
            {content}
        </div>
    );
};

export const ParallaxLayer: FC<{
    content: ReactNode;
    parallaxLevelClassName: string;
    extraClassNames?: string;
    svgStyle?: {
        svg: string;
        svgStroke: string;
        svgStrokeWidth: string;
        svgFill: string;
    };
}> = ({ content, parallaxLevelClassName, extraClassNames, svgStyle }) => {
    const [svgParams, setSvgParams] = useState({ svg: "banana", svgStroke: "purple", svgStrokeWidth: "10px", svgFill: "none" });

    useLayoutEffect(() => {
        if (svgStyle) {
            setSvgParams(() => ({
                svg: svgStyle.svg,
                svgStroke: svgStyle.svgStroke,
                svgStrokeWidth: svgStyle.svgStrokeWidth,
                svgFill: svgStyle.svgFill,
            }));
        }
    }, [svgStyle]);

    return (
        <div
            className={classNames(
                // "shadow-inner-md absolute bottom-0 left-0 right-0 top-0 m-auto transform overflow-hidden rounded-md border-2 border-green-800 shadow-black",
                "parallax-border absolute bottom-0 left-0 right-0 top-0 m-auto transform overflow-hidden rounded-md shadow-yellow-500",
                parallaxHoleDimensionClassNames,
                parallaxLevelClassName,
                extraClassNames,
            )}
            style={{
                borderImageSource: `url('data:image/svg+xml,${returnSvg(svgParams.svg, svgParams.svgStroke, svgParams.svgStrokeWidth, svgParams.svgFill)}')`,
            }}
        >
            {content}
        </div>
    );
};

const usedIndices: Record<string, number> = {};

export const ParallaxMenuLayer: FC<{
    content: ReactNode;
    parallaxLevelClassName: string;
    extraClassNames?: string;
    style?: React.CSSProperties;
    id?: string;
}> = ({ content, parallaxLevelClassName, extraClassNames, style, id }) => {
    const menuState = useZustand((state) => state.menuState);

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
    }, [menuState.home, nodeAnim]);

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
    [20, 20],
    [40, 20],
    [60, 20],
    [80, 20],
    [0, 40],
    [20, 40],
    [40, 40],
    [60, 40],
    [80, 40],
    [0, 60],
    [20, 60],
    [40, 60],
    [60, 60],
    [80, 60],
    [0, 80],
    [20, 80],
    [40, 80],
    [60, 80],
    [80, 80],
] as [number, number][];

const delays = tileLocations.map((tileLoc, idx) => 100 * idx);

const wrapLocation = (tileAxisLoc: number) => {
    let newTileAxisLoc = tileAxisLoc;

    if (newTileAxisLoc >= 80) {
        newTileAxisLoc = 0;
    }

    return newTileAxisLoc;
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
                    `translate3d(${startTileX}%, ${startTileY}%, -8rem)`,
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
