import React, { FC, useEffect, useRef, useState } from "react";

import { MenuCheckedType } from "./ParallaxScene";
import classNames from "../lib/classNames";
import Resume from "./Resume";
import Code from "./Code";
import Art from "./Art";
import Settings from "./Settings";
import ViewCode from "./ViewCode";
import { useCompare } from "../hooks/useCompare";
import Default from "./Default";

const menuContentPairings: Record<keyof MenuCheckedType, JSX.Element> = {
    default: <Default />,
    home: <></>,
    back: <>Back</>,
    forward: <>Forward</>,
    settings: <Settings />,
    viewCode: <ViewCode />,
    resume: <Resume />,
    code: <Code />,
    art: <Art />,
};

const Main: FC<{ menuCheckedStateSet: [MenuCheckedType, React.Dispatch<React.SetStateAction<MenuCheckedType>>] }> = ({
    menuCheckedStateSet,
}) => {
    const [menuChecked] = menuCheckedStateSet;
    const [activeMenuItem, setActiveMenuItem] = useState<keyof MenuCheckedType>("home");
    const activeHasChanged = useCompare(activeMenuItem);

    const [returnComponent, setReturnComponent] = useState(menuContentPairings.default);
    const contentWrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const menuCheckedKeys = Object.keys(menuChecked);

        menuCheckedKeys.every((key, idx, arr) => {
            if (menuChecked[key]) {
                setActiveMenuItem(key);
                setReturnComponent((curState) => (menuContentPairings[key] !== curState ? menuContentPairings[key] : curState));
                return false;
            } else if (idx === arr.length - 1) {
                setReturnComponent(menuContentPairings.default);
                return false;
            } else {
                return true;
            }
        });
    }, [menuChecked]);

    const [classes, setClasses] = useState("-translate-x-full");

    useEffect(() => {
        console.log("%c[Main]", "color: #abe155", `activeHasChanged :`, activeHasChanged);
        if (activeHasChanged) {
            setClasses("translate-x-0");
        } else {
            // setClasses("translate-x-0");
        }
    }, [activeHasChanged]);

    return (
        <main className="pointer-events-auto size-full overflow-x-hidden overflow-y-scroll p-12" /* bg-black/10 */>
            <div
                ref={contentWrapperRef}
                className={classNames("flex w-full flex-col items-center justify-start px-4 transition-transform duration-1000", classes)}
            >
                {returnComponent}
            </div>
        </main>
    );
};

export default Main;
