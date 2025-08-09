import { BrowserRouter, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { MutableRefObject, useLayoutEffect } from 'react';
import { useZustand } from '../lib/zustand';
import useOutsideClick from '../hooks/useOutsideClick';
import RoundedHexagonSVG from '../components/RoundedHexagonSVG';
import classNames from '../lib/classNames';
import Category from '../components/routes/Category';
import MenuModal from '../components/MenuModal';
import Post from '../components/routes/Post';
import BundleRoutes from '../components/routes/BundleRoutes';
import NoRouteMatched from '../components/routes/NoRouteMatched';
import HexagonTiles from '../components/HexagonTiles';

const App = () => {
    return (
        <div className="flex h-dvh w-dvw items-center justify-center overflow-hidden bg-theme-root-background font-merriweather">
            <BrowserRouter>
                <Routes>
                    <Route path="/:catId?/:postId?" element={<Main />} />

                    <Route path="/bundles/:bundlePath" element={<BundleRoutes />} />

                    <Route path="*" element={<NoRouteMatched />} />
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
                '[--scrollbar-thumb:theme(colors.theme.primary-darker)] [--translate-right-offset:0px]',
                'relative w-auto text-theme-text transition-[aspect-ratio] scrollbar-track-transparent',
                expansionState === 'category'
                    ? 'aspect-square h-[min(90vh,70vw)] 2xl:aspect-[1/0.75] 2xl:[--translate-right-offset:122px]'
                    : expansionState === 'post'
                      ? 'aspect-hex-pointy h-[min(95vh,105vw)] lg:aspect-square lg:[--translate-right-offset:52px] 2xl:aspect-hex-flat 2xl:[--translate-right-offset:115px]'
                      : // 'home'
                        'aspect-hex-flat h-[min(80vh,80vw)]',
            )}
        >
            {/* Used as clip-shape multiple times down the line */}
            <RoundedHexagonSVG showPath={false} useClipPath idSuffix="-default" />

            <HexagonTiles />

            <div
                className={classNames(
                    'relative flex size-full items-center justify-center transition-[opacity,clip-path] delay-500 duration-300',
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
