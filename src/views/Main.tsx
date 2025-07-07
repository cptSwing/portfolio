import { CSSProperties, MutableRefObject, useLayoutEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Category from '../components/Category';
import classNames from '../lib/classNames';
import useOutsideClick from '../hooks/useOutsideClick';
import DisplayPost from '../components/DisplayPost';
import HexagonTiles from '../components/HexagonTiles';

const Main = () => {
    const { catId, postId } = useParams();
    const _navigate = useNavigate();

    const [[expansionState, _formerExpansionState], setExpansionState] = useState<[NavigationExpansionState, NavigationExpansionState]>(['home', 'home']);

    useLayoutEffect(() => {
        if (catId) {
            if (postId) {
                setExpansionState(([stale, _obsolete]) => ['post', stale]);
            } else {
                setExpansionState(([stale, _obsolete]) => ['category', stale]);
            }
        } else {
            setExpansionState(([stale, _obsolete]) => ['home', stale]);
        }
    }, [catId, postId]);

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
                'relative aspect-[1/0.866] font-miriam-libre text-theme-text transition-[width,height] duration-500 scrollbar-track-transparent [--scrollbar-thumb:theme(colors.theme.primary)]',
                expansionState === 'home' ? 'h-[70vh]' : expansionState === 'category' ? 'h-[80vh]' /* [&_.left-class]:-translate-x-1/4 */ : 'h-[90vh]',
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
                    'relative size-full transition-[opacity,clip-path] delay-500 duration-300',
                    expansionState === 'home' ? 'opacity-0 clip-inset-x-1/2' : expansionState === 'category' ? 'opacity-100 clip-inset-x-0' : 'opacity-100',
                )}
            >
                <Category />
                <DisplayPost />
            </div>
        </div>
    );
};

export default Main;

export type NavigationExpansionState = 'home' | 'category' | 'post';
