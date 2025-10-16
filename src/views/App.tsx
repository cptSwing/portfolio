import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useZustand } from '../lib/zustand';
import { classNames } from 'cpts-javascript-utilities';
import MenuModal from '../components/MenuModal';
import Post from '../components/routes/Post';
import BundleRoutes from '../components/routes/BundleRoutes';
import NoRouteMatched from '../components/routes/NoRouteMatched';
import useSetRouteData from '../hooks/useSetRouteData';
import { ROUTE } from '../types/enums';
import { globalCssVariables } from '../styles/globalCssVariables';
import { useBreakpoint } from '../hooks/useBreakPoint';
import HexagonTiles from '../components/HexagonTiles';
import useUpdateTheme from '../hooks/useUpdateTheme';
import useSetHistoryRouter from '../hooks/useSetHistoryRouter';

const store_setBreakpoint = useZustand.getState().methods.store_setBreakpoint;

const App = () => {
    useBreakpoint(store_setBreakpoint);
    useUpdateTheme();

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
        </BrowserRouter>
    );
};

const Main = () => {
    const routeName = useZustand((store) => store.values.routeData.name);

    useSetRouteData();
    useSetHistoryRouter();

    return (
        // TODO could replace with container queries?
        <div
            className={classNames(
                '[--scrollbar-thumb:theme(colors.theme.primary-darker)]',
                'relative flex aspect-hex-flat items-center justify-center text-theme-text transition-[height] scrollbar-track-transparent',
                routeName === ROUTE.home
                    ? 'h-[min(70vh,70vw)] w-auto'
                    : routeName === ROUTE.category
                      ? 'h-[min(80vh,80vw)] w-auto'
                      : // ROUTE.post // TODO expand to full height?
                        'h-[min(95vh,90vw)] w-auto',
            )}
            style={globalCssVariables}
        >
            <Post show={routeName === ROUTE.post} />
            <HexagonTiles />
            <MenuModal />
        </div>
    );
};

export default App;
