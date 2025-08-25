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
import HexagonTilesGlass from '../components/HexagonTilesGlass';
import useSetRouteData from '../hooks/useSetRouteData';
import { ROUTE } from '../types/enums';
import { globalCssVariables } from '../styles/globalCssVariables';
import { useBreakpoint } from '../hooks/useBreakPoint';
import { FC, memo } from 'react';

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
            <HexagonTilesGlass />

            <MenuModal />
        </div>
    );
};

const SvgBackground: FC = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 800 450"
            width="200%"
            height="200%"
            preserveAspectRatio="none"
            className="pointer-events-none fixed z-[-9999] animate-[float-background_60s_linear_infinite]"
        >
            <defs>
                <filter
                    id="blurry-filter"
                    x="-200%"
                    y="-200%"
                    width="400%"
                    height="400%"
                    filterUnits="objectBoundingBox"
                    primitiveUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feGaussianBlur stdDeviation="20" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur" />
                </filter>
            </defs>
            <rect fill="rgb(var(--theme-root-background))" width="800" height="450" />

            {/* <rect width="100%" height="100%" fill="gray" /> */}

            <g filter="url(#blurry-filter)">
                <ellipse rx="500" ry="300" cx="-100" cy="-50" fill="rgb(var(--theme-secondary)/0.1)" />
                <ellipse rx="100" ry="300" cx="600" cy="325" fill="rgb(var(--theme-secondary-darker)/0.25)" />
            </g>
        </svg>
    );
};

export default App;
