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
            <div ref={appRef} className="perspective-1000 z-0 size-full">
                <div
                    className="transform-style-3d backface-hidden pointer-events-none mt-2 h-svh w-svw will-change-transform"
                    style={{
                        // transform: "rotation3d(var(--parallax-horizontal), var(--parallax-vertical, 0)",

                        transform: " rotateX(var(--parallax-horizontal)) rotateY(var(--parallax-vertical))",
                        transition: "transform var(--parallax-transition)",
                    }}
                >
                    <ParallaxLayer
                        level={"bg"}
                        content={
                            // TODO Use tiling svg in bg img or something? (need border color mutable)
                            <div className="m-auto flex size-full flex-col items-center justify-start">
                                <div className="flex h-[16.6666%] w-full items-start justify-start">
                                    <div className="h-full w-[10%] border border-green-900/50"></div>
                                    <div className="relative h-full w-4/5">
                                        <div className="flex size-full divide-x divide-green-900/50">
                                            <div className="h-full w-1/6" />
                                            <div className="h-full w-1/6" />
                                            <div className="h-full w-1/6" />
                                            <div className="h-full w-1/6" />
                                            <div className="h-full w-1/6" />
                                            <div className="h-full w-1/6" />
                                        </div>

                                        <div className="absolute bottom-0 left-1/2 mb-8 flex -translate-x-1/2 flex-col items-start justify-end rounded-md border border-green-900/50 px-8 py-2">
                                            <div className="">jens brandenburg</div>
                                            <div className="text-sm italic text-white/40">
                                                I build websites and 3D scenes. Then I combine the two.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-full w-[10%] border border-green-900/50"></div>
                                </div>

                                <div className="flex h-2/3 w-full items-start justify-start">
                                    <div className="h-full w-[10%]">
                                        <div className="flex size-full flex-col divide-y divide-green-900/50">
                                            <div className="h-1/5 w-full" />
                                            <div className="h-1/5 w-full" />
                                            <div className="h-1/5 w-full" />
                                            <div className="h-1/5 w-full" />
                                            <div className="h-1/5 w-full" />
                                        </div>
                                    </div>
                                    <div className="h-full w-4/5"></div>
                                    <div className="h-full w-[10%]">
                                        <div className="flex size-full flex-col divide-y divide-green-900/50">
                                            <div className="h-1/5 w-full" />
                                            <div className="h-1/5 w-full" />
                                            <div className="h-1/5 w-full" />
                                            <div className="h-1/5 w-full" />
                                            <div className="h-1/5 w-full" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex h-[16.6666%] w-full items-start justify-start">
                                    <div className="h-full w-[10%] border border-green-900/50"></div>
                                    <div className="flex h-full w-4/5 divide-x divide-green-900/50">
                                        <div className="h-full w-1/6" />
                                        <div className="h-full w-1/6" />
                                        <div className="h-full w-1/6" />
                                        <div className="h-full w-1/6" />
                                        <div className="h-full w-1/6" />
                                        <div className="h-full w-1/6" />
                                    </div>
                                    <div className="h-full w-[10%] border border-green-900/50"></div>
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
                                <div className="pointer-events-auto h-1/5 w-1/5 translate-x-[0%] translate-y-[100%] scale-[150%] cursor-pointer rounded-bl-sm rounded-tl-md border-2 border-dashed border-transparent bg-gray-400 p-1 outline outline-2 outline-offset-2 outline-green-800/50 transition-colors hover:border-l-white hover:border-t-white hover:outline-4 hover:outline-green-800/70">
                                    <h2>Menu Item #1</h2>
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
