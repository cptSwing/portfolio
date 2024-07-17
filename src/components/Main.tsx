import { FC, useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import { MenuCheckedType } from "./ParallaxScene";
import classNames from "../lib/classNames";
import Resume from "./Resume";

const mainContentClassNames = "bg-black/10 pointer-events-auto";

const Main: FC<{ menuCheckedStateSet: [MenuCheckedType, React.Dispatch<React.SetStateAction<MenuCheckedType>>] }> = ({
    menuCheckedStateSet,
}) => {
    const [menuChecked] = menuCheckedStateSet;

    return (
        <main
            className={classNames(
                mainContentClassNames,
                "flex w-full flex-col items-center justify-start bg-transparent p-12 text-green-600",
            )}
        >
            {menuChecked.resume ? <Resume /> : <ViteDefault />}
        </main>
    );
};

export default Main;

const ViteDefault = () => {
    const [count, setCount] = useState(0);
    return (
        <>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more Click on the Vite and React logos to learn more Click on the Vite and React
                logos to learn more Click on the Vite and React logos to learn more
            </p>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more Click on the Vite and React logos to learn more Click on the Vite and React
                logos to learn more Click on the Vite and React logos to learn more
            </p>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
        </>
    );
};
