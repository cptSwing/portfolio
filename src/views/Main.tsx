import Titles from '../components/Titles';
import { CSSProperties, MutableRefObject, useLayoutEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Category from '../components/Category';
import classNames from '../lib/classNames';
import useOutsideClick from '../hooks/useOutsideClick';
import DisplayPost from '../components/DisplayPost';
import roundNumToDecimal from '../lib/roundNumToDecimal';

const _hex = (angleDeg: number) => {
    const degToRad = (deg: number) => deg * (Math.PI / 180);

    const angleRad = degToRad(angleDeg);
    const sides = 6;

    let shape = `polygon(`;
    for (let i = 0; i < sides; i++) {
        const x = 50 + 50 * Math.cos(angleRad + (i * 2 * Math.PI) / sides);
        const y = 50 + 50 * Math.sin(angleRad + (i * 2 * Math.PI) / sides);
        shape += `${+x.toFixed(2)}% ${+y.toFixed(2)}%,`;
    }
    shape = shape.slice(0, -1);
    shape += `)`;

    return shape;
};

const clipShapeAngleRad = roundNumToDecimal(20 * (Math.PI / 180), 1);
const clipShapeTan = roundNumToDecimal(Math.tan(clipShapeAngleRad), 2);

const Main = () => {
    const { catId, postId } = useParams();
    const navigate = useNavigate();

    const [[expansionState, formerExpansionState], setExpansionState] = useState<[NavigationExpansionState, NavigationExpansionState]>(['home', 'home']);

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
    const ref = useOutsideClick(() => {
        if (!postId) {
            // should not trigger when post is displayed
            // navigate('/');
            // setExpansionState('home');
        }
    }) as MutableRefObject<HTMLDivElement | null>;

    useLayoutEffect(() => {
        console.log('%c[Main]', 'color: #c8031a', `expansionState, formerExpansionState :`, expansionState, formerExpansionState);
    }, [expansionState, formerExpansionState]);

    return (
        <div className='flex h-dvh w-dvw items-center justify-center overflow-hidden bg-[--bg-color] font-miriam-libre text-[--theme-text] scrollbar-track-transparent scrollbar-thumb-neutral-50'>
            <div
                style={
                    {
                        '--clip-shape-angle': '20deg',
                        '--clip-shape-skew-angle':
                            expansionState === 'home'
                                ? 'calc(var(--clip-shape-angle) * -1)'
                                : expansionState === 'category'
                                  ? 'calc(var(--clip-shape-angle) / 2)'
                                  : /* === 'post' */ 'calc(var(--clip-shape-angle) / 4 * -1)',

                        '--clip-shape-tan': 'round(tan(var(--clip-shape-angle)), 0.05)',

                        '--clip-shape-tan-home': 'calc(var(--clip-shape-tan) * 100vh)',
                        '--clip-shape-tan-category': 'calc(var(--clip-shape-tan-home) / 2)',
                        '--clip-shape-tan-post': 'calc(var(--clip-shape-tan-home) / 4)',

                        '--clip-shape-width-home-inner-space': '1rem',
                        '--clip-shape-width-home-left': '50vw',
                        '--clip-shape-width-home-right': 'calc(var(--clip-shape-width-home-left) + var(--clip-shape-width-home-inner-space))',

                        '--clip-shape-width-category-left': '20vw',
                        '--clip-shape-width-category-right': '80vw',

                        '--clip-shape-width-post-left': '15vw',
                        '--clip-shape-width-post-right': '85vw',

                        '--clip-shape-tan-home-offset': 'calc(var(--clip-shape-tan-home) / 2)',
                        '--clip-shape-tan-home-offset-inverted': 'calc(var(--clip-shape-tan-home) / 2 * -1)',

                        '--clip-shape-tan-category-offset': 'calc(var(--clip-shape-tan-category) / 2)',
                        '--clip-shape-tan-category-offset-inverted': 'calc(var(--clip-shape-tan-category) / 2 * -1)',

                        '--clip-shape-tan-post-offset': 'calc(var(--clip-shape-tan-post) / 2)',
                        '--clip-shape-tan-post-offset-inverted': 'calc(var(--clip-shape-tan-post) / 2 * -1)',

                        '--clip-shape-animation-duration': '500ms',
                        '--clip-shape-animation-delay-stagger': '500ms',

                        '--clip-shape-flipper-inset': expansionState === 'home' ? '100%' : expansionState === 'category' ? '0%' : /* === 'post' */ '100%',
                        '--clip-shape-post-inset': expansionState === 'home' ? '100%' : expansionState === 'category' ? '100%' : /* === 'post' */ '0%',
                    } as CSSProperties
                }
                className='size-full [--nav-category-common-color-1:theme(colors.gray.700)]'
            >
                <div
                    id='clip-shape-left'
                    className={classNames(
                        'pointer-events-none absolute left-0 top-0 z-20 flex size-full flex-row items-center justify-end drop-shadow-omni-lg transition-[padding] duration-[--clip-shape-animation-duration]',
                        'before:absolute before:left-0 before:top-0 before:size-full before:bg-red-800',
                        expansionState === 'home'
                            ? `pr-[calc(100vw-var(--clip-shape-width-home-right)+var(--clip-shape-width-home-inner-space))] ${formerExpansionState === 'category' ? 'before:animate-clip-shape-left-category-reversed' : 'before:animate-clip-shape-left-home'}`
                            : expansionState === 'category'
                              ? `pr-[calc(100vw-var(--clip-shape-width-category-left))] ${formerExpansionState === 'post' ? 'before:animate-clip-shape-left-post-reversed' : 'before:animate-clip-shape-left-category'}`
                              : // === 'post'
                                'before:animate-clip-shape-left-post pr-[calc(100vw-var(--clip-shape-width-post-left))]',
                    )}
                >
                    <Titles />
                </div>

                <div id='clip-shape-main' className='absolute left-0 top-0 z-0 size-full'>
                    <div
                        id='clip-shape-main-category'
                        className={classNames(
                            'absolute left-0 right-0 z-0 mx-auto flex h-full w-[calc(var(--clip-shape-width-category-right)-var(--clip-shape-width-category-left)+var(--clip-shape-tan-category))] items-center justify-center overflow-hidden bg-blue-800 px-[calc(var(--clip-shape-main-padding)*1.5)] transition-[clip-path] duration-[--clip-shape-animation-duration] clip-inset-b-[--clip-shape-flipper-inset] [--clip-shape-main-padding:calc(var(--clip-shape-tan-category)/2)]',
                            expansionState === 'home'
                                ? 'delay-0'
                                : expansionState === 'category'
                                  ? 'delay-[--clip-shape-animation-delay-stagger]'
                                  : // === 'post'
                                    'delay-0',
                        )}
                    >
                        <Category />
                    </div>

                    <div
                        id='clip-shape-main-post'
                        className={classNames(
                            'absolute left-0 top-0 z-10 flex size-full pl-[calc(var(--clip-shape-width-post-left)-(var(--clip-shape-tan-post)/2))] pr-[calc(100vw-(var(--clip-shape-width-post-right)+(var(--clip-shape-tan-post)/2)))] transition-[clip-path] delay-[--clip-shape-animation-delay-stagger] duration-[--clip-shape-animation-duration] clip-inset-t-[--clip-shape-post-inset]',
                            expansionState === 'home'
                                ? 'delay-0'
                                : expansionState === 'category'
                                  ? 'delay-0'
                                  : // === 'post'
                                    'delay-[--clip-shape-animation-delay-stagger]',
                        )}
                    >
                        <DisplayPost />
                    </div>
                </div>

                <div
                    id='clip-shape-right'
                    ref={ref}
                    className={classNames(
                        'pointer-events-none absolute left-0 top-0 z-20 size-full drop-shadow-omni-lg',
                        'before:absolute before:left-0 before:top-0 before:size-full before:bg-green-800',
                        expansionState === 'home'
                            ? formerExpansionState === 'category'
                                ? 'before:animate-clip-shape-right-category-reversed'
                                : 'before:animate-clip-shape-right-home'
                            : expansionState === 'category'
                              ? formerExpansionState === 'post'
                                  ? 'before:animate-clip-shape-right-post-reversed'
                                  : 'before:animate-clip-shape-right-category'
                              : // === 'post'
                                'before:animate-clip-shape-right-post',
                    )}
                />
            </div>
        </div>
    );
};

export default Main;

type NavigationExpansionState = 'home' | 'category' | 'post';
