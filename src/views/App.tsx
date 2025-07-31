import { BrowserRouter, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { MutableRefObject, useLayoutEffect } from 'react';
import { useZustand } from '../lib/zustand';
import useOutsideClick from '../hooks/useOutsideClick';
import RoundedHexagonSVG from '../components/RoundedHexagonSVG';
import HexagonTiles from '../components/HexagonTiles';
import classNames from '../lib/classNames';
import Category from '../components/routes/Category';
import MenuModal from '../components/MenuModal';
import Post from '../components/routes/Post';
import BundleRoutes from '../components/routes/BundleRoutes';
import NoRouteMatched from '../components/routes/NoRouteMatched';

const App = () => {
    return (
        <div className='flex h-dvh w-dvw items-center justify-center overflow-hidden bg-theme-root-background font-merriweather'>
            <BrowserRouter>
                <Routes>
                    <Route path='/:catId?/:postId?' element={<Main />} />

                    <Route path='/bundles/:bundlePath' element={<BundleRoutes />} />

                    <Route path='*' element={<NoRouteMatched />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

const store_setExpansionState = useZustand.getState().methods.store_setExpansionState;

const Main = () => {
    const { catId, postId } = useParams();
    const expansionState = useZustand((store) => store.values.expansionState);

    useLayoutEffect(() => {
        if (catId) {
            if (postId) {
                store_setExpansionState('post');
            } else {
                store_setExpansionState('category');
            }
        } else {
            store_setExpansionState('home');
        }
    }, [catId, postId]);

    const _navigate = useNavigate();
    /* Contract <Category> when click outside */
    const _ref = useOutsideClick(() => {
        if (!postId) {
            // should not trigger when post is displayed
            // navigate('/');
            // setExpansionState('home');
        }
    }) as MutableRefObject<HTMLDivElement | null>;

    return (
        <div
            className={classNames(
                'relative flex aspect-hex-flat max-h-[95vh] max-w-[calc(95vh/0.866)] items-center justify-center text-theme-text transition-[width,height] scrollbar-track-transparent [--scrollbar-thumb:theme(colors.theme.primary-darker)] 2xl:max-h-[90vh] 2xl:max-w-[calc(90vh/0.866)]',
                expansionState === 'category'
                    ? 'w-[65vw] lg:w-[55vw] xl:w-[45vw]'
                    : expansionState === 'post'
                      ? '!aspect-square w-[85vw] sm:w-[80vw] md:w-[75vw] lg:w-[70vw] xl:w-[65vw]'
                      : // 'home'
                        'w-[90vw] sm:w-[80vw] xl:w-[50vw]',
            )}
        >
            {/* Used as clip-shape multiple times down the line */}
            <RoundedHexagonSVG showPath={false} useClipPath idSuffix='-default' />

            <HexagonTiles />

            <div
                className={classNames(
                    'relative flex size-full items-start justify-start transition-[opacity,clip-path] delay-500 duration-300',
                    expansionState === 'home'
                        ? 'opacity-100 [--clip-category:100%] [--clip-post:100%]'
                        : expansionState === 'category'
                          ? 'opacity-100 [--clip-category:0%] [--clip-post:100%]'
                          : 'opacity-100 [--clip-category:100%] [--clip-post:0%]',
                )}
            >
                <Category />
                <Post />
            </div>

            <MenuModal />
        </div>
    );
};

export default App;
