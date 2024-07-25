import { menuSetter } from "./NavMenu";
import { MenuCheckedType } from "./ParallaxScene";
import { FC } from "react";

const TocMenu: FC<{
    menuCheckedStateSet: [MenuCheckedType, React.Dispatch<React.SetStateAction<MenuCheckedType>>];
    menuClassNames: string;
}> = ({ menuCheckedStateSet, menuClassNames }) => {
    const [{ resume, code, art }, setMenuChecked] = menuCheckedStateSet;

    return (
        <nav className={"flex items-center justify-between gap-x-1" + " " + menuClassNames}>
            <label>
                <input
                    type="checkbox"
                    className="peer pointer-events-none hidden"
                    onChange={() => setMenuChecked((menuChecked) => menuSetter(menuChecked, "resume"))}
                    checked={resume}
                />
                <div className="pointer-events-auto inline-block cursor-pointer select-none rounded-sm border-pink-500 p-1 hover:bg-blue-500/25 peer-checked:border-transparent peer-checked:bg-yellow-500/50 peer-checked:text-black">
                    Resumé
                </div>
            </label>

            <label>
                <input
                    type="checkbox"
                    className="peer pointer-events-none hidden"
                    onChange={() => setMenuChecked((menuChecked) => menuSetter(menuChecked, "code"))}
                    checked={code}
                />
                <div className="pointer-events-auto inline-block cursor-pointer select-none rounded-sm border-indigo-500 p-1 hover:bg-blue-500/25 peer-checked:border-transparent peer-checked:bg-yellow-500/50 peer-checked:text-black">
                    Code
                </div>
            </label>

            <label>
                <input
                    type="checkbox"
                    className="peer pointer-events-none hidden"
                    onChange={() => setMenuChecked((menuChecked) => menuSetter(menuChecked, "art"))}
                    checked={art}
                />
                <div className="pointer-events-auto inline-block cursor-pointer select-none rounded-sm border-fuchsia-500 p-1 hover:bg-blue-500/25 peer-checked:border-transparent peer-checked:bg-yellow-500/50 peer-checked:text-black">
                    3D
                </div>
            </label>
        </nav>
    );
};

export default TocMenu;
