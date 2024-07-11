import { FC, ReactNode } from "react";
import classNames from "../lib/classNames";

const ParallaxLayer: FC<{ level: number | "bg"; content: ReactNode; boostZ?: boolean }> = ({ level, content, boostZ }) => {
    return (
        // <div className={classNames(boostZ ? "-z-10" : "z-0")}>
        <div
            className={classNames(
                "parallax-layer m-auto transform overflow-hidden",
                classNamePerLevel(level),
                level === "bg" ? "size-full" : "h-5/6 w-5/6",
            )}
        >
            <div
                className={classNames(
                    "absolute left-0 top-0 size-full rounded-md",
                    level === 4 ? "!shadow-green-400/10" : "shadow-black",
                    level === -1.5 ? "z-50" : "shadow-inner-md z-0 border-2 border-green-800",
                )}
            />
            {content}
        </div>
        // </div>
    );
};

export default ParallaxLayer;

const classNamePerLevel = (level: number | "bg") => {
    switch (level) {
        case "bg":
            return "translate-z-24 bg-red-500/0" /* "parallax-bg-clip" */;

        case 4:
            return "translate-z-32 parallax-clip bg-black/25";
        case 3:
            return "translate-z-24 parallax-clip bg-black/25";
        case 2:
            return "translate-z-16 parallax-clip bg-black/25";
        case 1:
            return "translate-z-8 parallax-clip bg-black/25";

        // case 0
        default:
            return "translate-z-0 bg-black/25";

        case -1:
            return "-translate-z-8 bg-black/50";
        case -1.5:
            // return "scale-[88.999999%]";
            // return "scale-[calc(100%-calc(100*calc(1/9)))]";
            return "";

        case -2:
            return "-translate-z-16 bg-black/50";
        case -3:
            return "-translate-z-24 bg-black/50";
        case -4:
            return "-translate-z-32 bg-black";
    }
};

export const mainContentClassNames = "bg-black/10 pointer-events-auto overflow-y-visible";
