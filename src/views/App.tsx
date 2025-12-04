import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useZustand } from '../lib/zustand';
import { classNames } from 'cpts-javascript-utilities';
import MenuModal from '../components/MenuModal';
import BundleRoutes from '../components/routes/BundleRoutes';
import NoRouteMatched from '../components/routes/NoRouteMatched';
import useSetRouteData from '../hooks/useSetRouteData';
import { ROUTE } from '../types/enums';
import { globalCssVariables } from '../styles/globalCssVariables';
import HexagonTiles from '../components/HexagonTiles';
import useUpdateTheme from '../hooks/useUpdateTheme';
import useSetHistoryRouter from '../hooks/useSetHistoryRouter';
import '../styles/style_main.css';
import useFetchApiContent from '../hooks/useFetchApiContent';
import { lazy, Suspense } from 'react';

const App = () => {
    const apiContent = useZustand((s) => s.apiContent);

    useFetchApiContent();
    useUpdateTheme();

    return apiContent ? (
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
    ) : null;
};

const Post = lazy(() => import('../components/routes/Post'));

const Main = () => {
    const routeName = useZustand((store) => store.values.routeData.name);

    useSetRouteData();
    useSetHistoryRouter();

    return (
        // TODO could replace with container queries?
        <div
            className={classNames(
                '[--scrollbar-thumb:theme(colors.theme.primary-darker)]',
                'relative aspect-hex-flat text-theme-text transition-[height] scrollbar-track-transparent',
                'after:pointer-events-none after:fixed after:bottom-[9dvh] after:left-[-20dvw] after:right-[-20dvw] after:flex after:h-[8dvh] after:translate-y-full after:rotate-[-10deg] after:items-center after:justify-center after:bg-red-950 after:text-neutral-300 after:opacity-70 after:content-["Mobile_version_still_incomplete.._try_using_a_wider_screen_:)"] after:[font-size:3dvw] after:sm:content-none',
                routeName === ROUTE.home
                    ? 'h-[min(70dvh,70dvw)]'
                    : routeName === ROUTE.category
                      ? 'h-[min(80dvh,80dvw)]'
                      : // ROUTE.post
                        'h-[min(95dvh,82.5dvw)] sm:mt-[unset] sm:h-[min(95dvh,80dvw)] lg:h-[min(95dvh,90dvw)]',
            )}
            style={globalCssVariables}
        >
            {routeName === ROUTE.post && (
                <Suspense fallback={<div>Loading</div>}>
                    <Post show={routeName === ROUTE.post} />
                </Suspense>
            )}

            <HexagonTiles />
            <MenuModal />
        </div>
    );
};

export default App;
