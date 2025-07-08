import { CSSProperties, MutableRefObject, useLayoutEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Category from '../components/Category';
import classNames from '../lib/classNames';
import useOutsideClick from '../hooks/useOutsideClick';
import DisplayPost from '../components/DisplayPost';
import HexagonTiles from '../components/HexagonTiles';
import MenuToggle from '../components/MenuToggle';
import { useZustand } from '../lib/zustand';

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
                'relative aspect-[1/0.866] font-miriam-libre text-theme-text transition-[width,height] duration-500 scrollbar-track-transparent [--scrollbar-thumb:theme(colors.theme.primary-darker)]',
                expansionState === 'home' ? 'h-[70vh]' : expansionState === 'category' ? 'h-[85vh]' /* [&_.left-class]:-translate-x-1/4 */ : 'h-[95vh]',
            )}
            style={
                {
                    // Test
                    '--flat-hex-outer-radius': 'calc(var(--anim-overall-width) / 2)',
                    '--flat-hex-inner-radius': 'calc(var(--flat-hex-outer-radius) * sin(60deg))' /* r*sin60 */,
                    '--flat-hex-margin-top': 'calc(var(--flat-hex-outer-radius) - var(--flat-hex-inner-radius))',
                    '--flat-hex-margin-bottom': 'calc(100% - var(--flat-hex-margin-top))',
                    '--flat-hex-height': 'calc(100% - 2 * var(--flat-hex-margin-top))',
                } as CSSProperties
            }
        >
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
                <DisplayPost />
            </div>

            <MenuToggle />
        </div>
    );
};

export default Main;
