import {
    AdjustmentsHorizontalIcon,
    ArrowUturnLeftIcon,
    ArrowUturnRightIcon,
    CodeBracketSquareIcon,
    HomeIcon,
} from "@heroicons/react/20/solid";
import { MenuCheckedType } from "./ParallaxScene";
import { FC } from "react";

const NavMenu: FC<{
    menuCheckedStateSet: [MenuCheckedType, React.Dispatch<React.SetStateAction<MenuCheckedType>>];
    menuClassNames: string;
}> = ({ menuCheckedStateSet, menuClassNames }) => {
    const [{ home, back, forward, settings, viewCode }, setMenuChecked] = menuCheckedStateSet;

    return (
        <nav className={"flex items-center justify-between gap-x-1" + " " + menuClassNames}>
            <label>
                <input
                    type="checkbox"
                    className="peer pointer-events-none hidden"
                    onChange={() =>
                        setMenuChecked((menuChecked) => {
                            const newState = { ...menuChecked };
                            for (const key in newState) {
                                newState[key as string] = key === "home" ? !newState[key] : false;
                            }
                            return newState;
                        })
                    }
                    checked={home}
                />
                <HomeIcon className="pointer-events-auto inline-block size-8 cursor-pointer select-none rounded-sm border-pink-500 p-0.5 text-white hover:bg-blue-500/25 peer-checked:border-transparent peer-checked:bg-yellow-500/50 peer-checked:text-black" />
            </label>

            <label>
                <input
                    type="checkbox"
                    className="peer pointer-events-none hidden"
                    onChange={() =>
                        setMenuChecked((menuChecked) => {
                            const newState = { ...menuChecked };
                            for (const key in newState) {
                                newState[key as string] = key === "back" ? !newState[key] : false;
                            }
                            return newState;
                        })
                    }
                    checked={back}
                />
                <ArrowUturnLeftIcon className="pointer-events-auto inline-block size-8 cursor-pointer select-none rounded-sm border-indigo-500 p-0.5 text-white hover:bg-blue-500/25 peer-checked:border-transparent peer-checked:bg-yellow-500/50 peer-checked:text-black" />
            </label>

            <label>
                <input
                    type="checkbox"
                    className="peer pointer-events-none hidden"
                    onChange={() =>
                        setMenuChecked((menuChecked) => {
                            const newState = { ...menuChecked };
                            for (const key in newState) {
                                newState[key as string] = key === "forward" ? !newState[key] : false;
                            }
                            return newState;
                        })
                    }
                    checked={forward}
                />
                <ArrowUturnRightIcon className="pointer-events-auto inline-block size-8 cursor-pointer select-none rounded-sm border-indigo-500 p-0.5 text-white hover:bg-blue-500/25 peer-checked:border-transparent peer-checked:bg-yellow-500/50 peer-checked:text-black" />
            </label>

            <label>
                <input
                    type="checkbox"
                    className="peer pointer-events-none hidden"
                    onChange={() =>
                        setMenuChecked((menuChecked) => {
                            const newState = { ...menuChecked };
                            for (const key in newState) {
                                newState[key as string] = key === "settings" ? !newState[key] : false;
                            }
                            return newState;
                        })
                    }
                    checked={settings}
                />
                <AdjustmentsHorizontalIcon className="pointer-events-auto inline-block size-8 cursor-pointer select-none rounded-sm border-fuchsia-500 p-0.5 text-white hover:bg-blue-500/25 peer-checked:border-transparent peer-checked:bg-yellow-500/50 peer-checked:text-black" />
            </label>

            <label>
                <input
                    type="checkbox"
                    className="peer pointer-events-none hidden"
                    onChange={() =>
                        setMenuChecked((menuChecked) => {
                            const newState = { ...menuChecked };
                            for (const key in newState) {
                                newState[key as string] = key === "viewCode" ? !newState[key] : false;
                            }
                            return newState;
                        })
                    }
                    checked={viewCode}
                />
                <CodeBracketSquareIcon className="pointer-events-auto inline-block size-8 cursor-pointer select-none rounded-sm border-fuchsia-500 p-0.5 text-white hover:bg-blue-500/25 peer-checked:border-transparent peer-checked:bg-yellow-500/50 peer-checked:text-black" />
            </label>
        </nav>
    );
};

export default NavMenu;