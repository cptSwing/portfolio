import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from "react";
import { MenuCheckedType } from "./ParallaxScene";
import Resume from "./Resume";
import Code from "./Code";
import Art from "./Art";
import Settings from "./Settings";
import ViewCode from "./ViewCode";
import { CSSTransition } from "react-transition-group";
import Default from "./Default";
import { usePrevious } from "../hooks/usePrevious";

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

const transitionStateClassNames: Record<string, string> = {
    appear: "-translate-x-full",
    appearActive: "translate-x-0 transition-transform duration-1000",
    appearDone: "translate-x-0",

    enter: "-translate-x-full",
    enterActive: "translate-x-0 transition-transform duration-1000",
    enterDone: "translate-x-0",

    exit: "translate-x-0 ",
    exitActive: "-translate-x-full transition-transform duration-1000",
    exitDone: "-translate-x-full",
};

const Main: FC<{ menuCheckedStateSet: [MenuCheckedType, Dispatch<SetStateAction<MenuCheckedType>>] }> = ({ menuCheckedStateSet }) => {
    const [menuChecked] = menuCheckedStateSet;
    const [activeMenuItem, setActiveMenuItem] = useState<keyof MenuCheckedType>("default");
    const [inProp, setInProp] = useState(true);
    const previousMenuItem = usePrevious(activeMenuItem);

    useEffect(() => {
        const menuCheckedKeys = Object.keys(menuChecked);

        menuCheckedKeys.length &&
            menuCheckedKeys.every((key) => {
                if (menuChecked[key]) {
                    setActiveMenuItem(key);
                    return false;
                } else {
                    return true;
                }
            });
    }, [menuChecked, previousMenuItem, inProp]);

    const nodeRef = useRef(null);

    return (
        <CSSTransition in={inProp} nodeRef={nodeRef} classNames={transitionStateClassNames} appear={true} timeout={100}>
            <main ref={nodeRef} className="pointer-events-auto size-full overflow-x-hidden overflow-y-scroll p-12" /* bg-black/10 */>
                <button onClick={() => setInProp((inProp) => !inProp)}>{`${inProp}`}</button>

                {menuContentPairings[activeMenuItem]}
            </main>
        </CSSTransition>
    );
};

export default Main;
