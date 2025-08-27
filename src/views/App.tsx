import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useZustand } from '../lib/zustand';
// import useOutsideClick from '../hooks/useOutsideClick';
import RoundedHexagonSVG from '../components/RoundedHexagonSVG';
import { classNames } from 'cpts-javascript-utilities';
import Category from '../components/routes/Category';
import MenuModal from '../components/MenuModal';
import Post from '../components/routes/Post';
import BundleRoutes from '../components/routes/BundleRoutes';
import NoRouteMatched from '../components/routes/NoRouteMatched';
import HexagonNavigation from '../components/HexagonNavigation';
import useSetRouteData from '../hooks/useSetRouteData';
import { ROUTE } from '../types/enums';
import { globalCssVariables } from '../styles/globalCssVariables';
import { useBreakpoint } from '../hooks/useBreakPoint';

const store_setBreakpoint = useZustand.getState().methods.store_setBreakpoint;

const App = () => {
    useBreakpoint(store_setBreakpoint);

    return (
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <Routes>
                <Route path="/:param_categoryId?/:param_postId?" element={<Main />} />

                <Route path="/bundles/:bundlePath" element={<BundleRoutes />} />

                <Route path="*" element={<NoRouteMatched />} />
            </Routes>

            <SvgBackground />
        </BrowserRouter>
    );
};

const Main = () => {
    useSetRouteData();
    const routeName = useZustand((store) => store.values.routeData.name);

    // const _navigate = useNavigate();
    /* Contract <Category> when click outside */
    // const _ref = useOutsideClick(() => {
    // if (!param_postId) {
    // should not trigger when post is displayed
    // navigate('/');
    // setExpansionState('home');
    // }
    // }) as MutableRefObject<HTMLDivElement | null>;

    return (
        <div
            className={classNames(
                '[--scrollbar-thumb:theme(colors.theme.primary-darker)]',
                'relative flex items-center justify-center text-theme-text transition-[aspect-ratio,height] scrollbar-track-transparent',
                routeName === ROUTE.category
                    ? 'aspect-[0.55/1] h-auto w-[min(100vw,80vh)] sm:aspect-hex-flat sm:h-[min(90vh,62.5vw)] sm:w-auto 2xl:aspect-[1/0.75]'
                    : routeName === ROUTE.post
                      ? 'aspect-[0.55/1] h-auto w-[min(100vw,80vh)] sm:aspect-hex-flat sm:h-[min(95vh,80vw)] sm:w-auto 2xl:aspect-[1/0.75]'
                      : // ROUTE.home
                        'aspect-hex-flat h-[min(80vh,80vw)] sm:h-[min(70vh,70vw)]',
            )}
            style={globalCssVariables}
        >
            {/* TODO Used as clip-shape multiple times down the line, could be served in HexagonTiles as well? */}
            <RoundedHexagonSVG showPath={false} useClipPath idSuffix="-default" />

            <Category show={routeName === ROUTE.category} />
            <Post show={routeName === ROUTE.post} />
            <HexagonNavigation />
            <MenuModal />
        </div>
    );
};

const SvgBackground = () => {
    return (
        <svg
            viewBox="0 0 900 600"
            xmlns="http://www.w3.org/2000/svg"
            xlinkHref="http://www.w3.org/1999/xlink"
            version="1.1"
            width="120%"
            height="120%"
            preserveAspectRatio="none"
            className="pointer-events-none fixed z-[-9999]" //animate-[float-background_120s_linear_infinite]
        >
            <defs>
                <filter
                    id="blurry-filter"
                    x="0%"
                    y="0%"
                    width="100%"
                    height="100%"
                    filterUnits="objectBoundingBox"
                    primitiveUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feGaussianBlur stdDeviation="1" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur" />
                </filter>

                <linearGradient id="grad1_0" x1="33.3%" y1="0%" x2="100%" y2="100%">
                    <stop offset="20%" stopColor="rgb(var(--theme-secondary))" stopOpacity="1"></stop>
                    <stop offset="80%" stopColor="rgb(var(--theme-secondary-darker))" stopOpacity="1"></stop>
                </linearGradient>

                <linearGradient id="grad1_1" x1="33.3%" y1="0%" x2="100%" y2="100%">
                    <stop offset="20%" stopColor="rgb(var(--theme-secondary))" stopOpacity="1"></stop>
                    <stop offset="80%" stopColor="rgb(var(--theme-primary))" stopOpacity="1"></stop>
                </linearGradient>

                <linearGradient id="grad1_2" x1="33.3%" y1="0%" x2="100%" y2="100%">
                    <stop offset="20%" stopColor="rgb(var(--theme-primary-darker))" stopOpacity="1"></stop>
                    <stop offset="80%" stopColor="rgb(var(--theme-primary))" stopOpacity="1"></stop>
                </linearGradient>

                <linearGradient id="grad1_3" x1="33.3%" y1="0%" x2="100%" y2="100%">
                    <stop offset="20%" stopColor="rgb(var(--theme-primary-darker))" stopOpacity="1"></stop>
                    <stop offset="80%" stopColor="rgb(var(--theme-secondary))" stopOpacity="1"></stop>
                </linearGradient>

                <linearGradient id="grad1_4" x1="33.3%" y1="0%" x2="100%" y2="100%">
                    <stop offset="20%" stopColor="rgb(var(--theme-secondary-darker))" stopOpacity="1"></stop>
                    <stop offset="80%" stopColor="rgb(var(--theme-secondary))" stopOpacity="1"></stop>
                </linearGradient>

                <linearGradient id="grad2_0" x1="0%" y1="0%" x2="66.7%" y2="100%">
                    <stop offset="20%" stopColor="rgb(var(--theme-secondary-darker))" stopOpacity="1"></stop>
                    <stop offset="80%" stopColor="rgb(var(--theme-secondary))" stopOpacity="1"></stop>
                </linearGradient>

                <linearGradient id="grad2_1" x1="0%" y1="0%" x2="66.7%" y2="100%">
                    <stop offset="20%" stopColor="rgb(var(--theme-primary))" stopOpacity="1"></stop>
                    <stop offset="80%" stopColor="rgb(var(--theme-secondary))" stopOpacity="1"></stop>
                </linearGradient>

                <linearGradient id="grad2_2" x1="0%" y1="0%" x2="66.7%" y2="100%">
                    <stop offset="20%" stopColor="rgb(var(--theme-primary))" stopOpacity="1"></stop>
                    <stop offset="80%" stopColor="rgb(var(--theme-primary-darker))" stopOpacity="1"></stop>
                </linearGradient>

                <linearGradient id="grad2_3" x1="0%" y1="0%" x2="66.7%" y2="100%">
                    <stop offset="20%" stopColor="rgb(var(--theme-secondary))" stopOpacity="1"></stop>
                    <stop offset="80%" stopColor="rgb(var(--theme-primary-darker))" stopOpacity="1"></stop>
                </linearGradient>

                <linearGradient id="grad2_4" x1="0%" y1="0%" x2="66.7%" y2="100%">
                    <stop offset="20%" stopColor="rgb(var(--theme-secondary))" stopOpacity="1"></stop>
                    <stop offset="80%" stopColor="rgb(var(--theme-secondary-darker))" stopOpacity="1"></stop>
                </linearGradient>
            </defs>

            <g filter="url(#blurry-filter)">
                <rect x="0" y="0" width="900" height="600" fill="rgb(var(--theme-root-background))" />

                <g transform="translate(900, 0)">
                    <path
                        d="M0 459.7C-50.9 455.1 -101.8 450.5 -138.4 426.1C-175.1 401.6 -197.4 357.4 -242.2 333.3C-286.9 309.2 -354.2 305.4 -371.9 270.2C-389.6 235 -357.9 168.6 -364.3 118.4C-370.6 68.1 -415.2 34.1 -459.7 0L0 0Z"
                        fill="url(#grad1_0)"
                    ></path>
                    <path
                        d="M0 367.8C-40.7 364.1 -81.5 360.4 -110.8 340.9C-140 321.3 -157.9 285.9 -193.7 266.7C-229.6 247.4 -283.3 244.3 -297.5 216.2C-311.7 188 -286.3 134.9 -291.4 94.7C-296.5 54.5 -332.1 27.2 -367.8 0L0 0Z"
                        fill="url(#grad1_1)"
                    ></path>
                    <path
                        d="M0 275.8C-30.5 273.1 -61.1 270.3 -83.1 255.6C-105 241 -118.4 214.4 -145.3 200C-172.2 185.5 -212.5 183.2 -223.1 162.1C-233.8 141 -214.7 101.2 -218.6 71C-222.4 40.9 -249.1 20.4 -275.8 0L0 0Z"
                        fill="url(#grad1_2)"
                    ></path>
                    <path
                        d="M0 183.9C-20.4 182 -40.7 180.2 -55.4 170.4C-70 160.7 -79 143 -96.9 133.3C-114.8 123.7 -141.7 122.1 -148.8 108.1C-155.9 94 -143.1 67.4 -145.7 47.3C-148.3 27.2 -166.1 13.6 -183.9 0L0 0Z"
                        fill="url(#grad1_3)"
                    ></path>
                    <path
                        d="M0 91.9C-10.2 91 -20.4 90.1 -27.7 85.2C-35 80.3 -39.5 71.5 -48.4 66.7C-57.4 61.8 -70.8 61.1 -74.4 54C-77.9 47 -71.6 33.7 -72.9 23.7C-74.1 13.6 -83 6.8 -91.9 0L0 0Z"
                        fill="url(#grad1_4)"
                    ></path>
                </g>
                <g transform="translate(0, 600)">
                    <path
                        d="M0 -459.7C46.9 -449.2 93.8 -438.8 137.8 -424.2C181.9 -409.6 223.1 -390.8 266.3 -366.5C309.4 -342.2 354.5 -312.4 371.9 -270.2C389.3 -228 379 -173.5 389 -126.4C399 -79.3 429.4 -39.6 459.7 0L0 0Z"
                        fill="url(#grad2_0)"
                    ></path>
                    <path
                        d="M0 -367.8C37.5 -359.4 75 -351 110.3 -339.3C145.5 -327.6 178.5 -312.6 213 -293.2C247.5 -273.8 283.6 -249.9 297.5 -216.2C311.4 -182.4 303.2 -138.8 311.2 -101.1C319.2 -63.4 343.5 -31.7 367.8 0L0 0Z"
                        fill="url(#grad2_1)"
                    ></path>
                    <path
                        d="M0 -275.8C28.1 -269.5 56.3 -263.3 82.7 -254.5C109.1 -245.7 133.9 -234.5 159.8 -219.9C185.7 -205.3 212.7 -187.4 223.1 -162.1C233.6 -136.8 227.4 -104.1 233.4 -75.8C239.4 -47.6 257.6 -23.8 275.8 0L0 0Z"
                        fill="url(#grad2_2)"
                    ></path>
                    <path
                        d="M0 -183.9C18.8 -179.7 37.5 -175.5 55.1 -169.7C72.8 -163.8 89.2 -156.3 106.5 -146.6C123.8 -136.9 141.8 -125 148.8 -108.1C155.7 -91.2 151.6 -69.4 155.6 -50.6C159.6 -31.7 171.7 -15.9 183.9 0L0 0Z"
                        fill="url(#grad2_3)"
                    ></path>
                    <path
                        d="M0 -91.9C9.4 -89.8 18.8 -87.8 27.6 -84.8C36.4 -81.9 44.6 -78.2 53.3 -73.3C61.9 -68.4 70.9 -62.5 74.4 -54C77.9 -45.6 75.8 -34.7 77.8 -25.3C79.8 -15.9 85.9 -7.9 91.9 0L0 0Z"
                        fill="url(#grad2_4)"
                    ></path>
                </g>
            </g>
        </svg>
    );
};

// const SvgBackground: FC = () => {
//     return (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             version="1.1"
//             xmlnsXlink="http://www.w3.org/1999/xlink"
//             viewBox="0 0 800 450"
//             width="200%"
//             height="200%"
//             preserveAspectRatio="none"
//             className="pointer-events-none fixed z-[-9999] animate-[float-background_60s_linear_infinite]"
//         >
//             <defs>
//                 <filter
//                     id="blurry-filter"
//                     x="-200%"
//                     y="-200%"
//                     width="400%"
//                     height="400%"
//                     filterUnits="objectBoundingBox"
//                     primitiveUnits="userSpaceOnUse"
//                     colorInterpolationFilters="sRGB"
//                 >
//                     <feGaussianBlur stdDeviation="20" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur" />
//                 </filter>
//             </defs>
//             <rect fill="rgb(var(--theme-root-background))" width="800" height="450" />

//             {/* <rect width="100%" height="100%" fill="gray" /> */}

//             <g filter="url(#blurry-filter)">
//                 <ellipse rx="500" ry="300" cx="-100" cy="-50" fill="rgb(var(--theme-secondary)/0.1)" />
//                 <ellipse rx="100" ry="300" cx="600" cy="325" fill="rgb(var(--theme-secondary-darker)/0.25)" />
//             </g>
//         </svg>
//     );
// };

export default App;
