import { useEffect, useRef } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ParallaxLayer from "../components/ParallaxLayer";
import Main from "../components/Main";

const App = () => {
    const appRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        parallaxEffect(1, appRef);
    }, []);

    return (
        <>
            <Header />
            <div ref={appRef} className="perspective-1000 overflow-y z-0 size-full overflow-hidden">
                <div
                    className="transform-style-3d backface-hidden pointer-events-none h-[90svh] will-change-transform"
                    style={{
                        transform: "rotateX(var(--parallax-horizontal)) rotateY(var(--parallax-vertical))",
                        transition: "transform var(--parallax-transition)",
                    }}
                >
                    <ParallaxLayer
                        level={"bg"}
                        content={
                            // TODO Use tiling svg in bg img or something? (need border color mutable)
                            <div className="flex size-full flex-col items-center justify-start">
                                <div className="flex h-[calc(100%*calc(1/6)/2)] w-full items-start justify-start">
                                    <div className="h-full w-[calc(100%*calc(1/6)/2)] border border-green-900"></div>
                                    <div className="h-full w-5/6"></div>
                                    <div className="h-full w-[calc(100%*calc(1/6)/2)] border border-green-900"></div>
                                </div>
                                <div className="flex h-full w-full items-start justify-start">
                                    <div className="h-full w-[calc(100%*calc(1/6)/2)] divide-x-4 divide-white"></div>
                                    <div className="h-full w-5/6"></div>
                                    <div className="h-full w-[calc(100%*calc(1/6)/2)] divide-x-4 divide-white"></div>
                                </div>
                                <div className="flex h-[calc(100%*calc(1/6)/2)] w-full items-start justify-start">
                                    <div className="h-full w-[calc(100%*calc(1/6)/2)] border border-green-900"></div>
                                    <div className="h-full w-5/6"></div>
                                    <div className="h-full w-[calc(100%*calc(1/6)/2)] border border-green-900"></div>
                                </div>
                            </div>
                        }
                    />

                    <ParallaxLayer level={4} content={<></>} />
                    <ParallaxLayer level={3} content={<></>} />
                    <ParallaxLayer level={2} content={<></>} />
                    <ParallaxLayer level={1} content={<></>} />
                    <ParallaxLayer level={0} content={<Main />} />
                    <ParallaxLayer level={-1} content={<></>} />
                    <ParallaxLayer
                        level={-2}
                        boostZ
                        content={
                            <div className="z-50 h-1/5 w-1/5 translate-x-[400%] translate-y-1/4 rounded-md bg-gray-400 p-1">
                                Menu Item #2
                            </div>
                        }
                    />
                    <ParallaxLayer
                        level={-3}
                        boostZ
                        content={
                            <div className="h-1/5 w-1/5 translate-x-[300%] translate-y-[400%] rounded-md bg-gray-400 p-1">Menu Item #3</div>
                        }
                    />
                    <ParallaxLayer level={-4} content={<></>} />

                    {/* TODO separate ui component; Duplicate whole transform part, draw over ?  */}
                    <ParallaxLayer
                        level={-1.5}
                        boostZ
                        content={
                            <div className="size-full p-20">
                                <div className="pointer-events-auto h-1/5 w-1/5 translate-x-[0%] translate-y-[100%] scale-[150%] cursor-pointer rounded-bl-sm rounded-tl-md border-2 border-dashed border-b-transparent border-r-transparent bg-gray-400 p-1 outline-offset-1 hover:outline">
                                    Menu Item #1
                                </div>
                            </div>
                        }
                    />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default App;

const parallaxEffect = (smoothing: number, ref: React.MutableRefObject<HTMLDivElement | null>) => {
    const root = document.documentElement;
    smoothing /= 100;

    ref.current &&
        ref.current.addEventListener("mousemove", (event) => {
            // calculate transformation values
            const rotateHoriz = (event.clientY - window.innerHeight / 2) * smoothing;
            const rotateVert = ((event.clientX - window.innerWidth / 2) * -smoothing) / 2;

            // set CSS variables
            root.style.setProperty("--parallax-horizontal", `${rotateHoriz}deg`);
            root.style.setProperty("--parallax-vertical", `${rotateVert}deg`);
        });
};
