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
import HexagonTilesMatrix from '../components/HexagonTilesMatrix';
import useSetRouteData from '../hooks/useSetRouteData';
import { ROUTE } from '../types/enums';
import { globalCssVariables } from '../styles/globalCssVariables';
import { useBreakpoint } from '../hooks/useBreakPoint';

const store_setBreakpoint = useZustand.getState().methods.store_setBreakpoint;

const App = () => {
    useBreakpoint(store_setBreakpoint);

    return (
        <div className="flex h-dvh w-dvw items-center justify-center overflow-hidden bg-theme-root-background font-merriweather" style={globalCssVariables}>
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
            </BrowserRouter>
        </div>
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
        >
            {/* TODO Used as clip-shape multiple times down the line, could be served in HexagonTiles as well? */}
            <RoundedHexagonSVG showPath={false} useClipPath idSuffix="-default" />

            <HexagonTilesMatrix />
            <Category show={routeName === ROUTE.category} />
            <Post show={routeName === ROUTE.post} />

            <MenuModal />
        </div>
    );
};

export default App;
