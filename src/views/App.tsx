import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useZustand } from '../lib/zustand';
// import useOutsideClick from '../hooks/useOutsideClick';
import RoundedHexagonSVG from '../components/RoundedHexagonSVG';
import classNames from '../lib/classNames';
import Category from '../components/routes/Category';
import MenuModal from '../components/MenuModal';
import Post from '../components/routes/Post';
import BundleRoutes from '../components/routes/BundleRoutes';
import NoRouteMatched from '../components/routes/NoRouteMatched';
import HexagonTiles from '../components/HexagonTiles';
import useSetRouteData from '../hooks/useSetRouteData';
import { ROUTE } from '../types/enums';
import { globalCssVariables } from '../styles/globalCssVariables';

const App = () => {
    return (
        <div className="flex h-dvh w-dvw items-center justify-center overflow-hidden bg-theme-root-background font-merriweather">
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
                '[--scrollbar-thumb:theme(colors.theme.primary-darker)] [--translate-right-offset:0px]',
                'relative w-auto text-theme-text transition-[aspect-ratio,height] scrollbar-track-transparent',
                routeName === ROUTE.category
                    ? 'aspect-square h-[min(90vh,70vw)] 2xl:aspect-[1/0.75] 2xl:[--translate-right-offset:122px]'
                    : routeName === ROUTE.post
                      ? 'aspect-hex-pointy h-[min(95vh,105vw)] lg:aspect-square lg:[--translate-right-offset:52px] 2xl:aspect-hex-flat 2xl:[--translate-right-offset:115px]'
                      : // ROUTE.home
                        'aspect-hex-flat h-[min(80vh,80vw)]',
            )}
            style={globalCssVariables}
        >
            {/* TODO Used as clip-shape multiple times down the line, could be served in HexagonTiles as well? */}
            <RoundedHexagonSVG showPath={false} useClipPath idSuffix="-default" />

            <HexagonTiles />

            <div className="relative flex size-full items-center justify-center">
                <Category show={routeName === ROUTE.category} />
                <Post show={routeName === ROUTE.post} />
            </div>

            <MenuModal />
        </div>
    );
};

export default App;
