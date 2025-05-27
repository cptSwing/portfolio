import Titles from '../components/Titles';
import { CSSProperties, MutableRefObject, useLayoutEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Category from '../components/Category';
import classNames from '../lib/classNames';
import useOutsideClick from '../hooks/useOutsideClick';
import DisplayPost from '../components/DisplayPost';

const degToRad = (deg: number) => deg * (Math.PI / 180);

const _hex = (angleDeg = 0) => {
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

/* https://css-tip.com/hexagon-shape/ */
const _simpleHexClip = (flatTop = true) => {
    const aspectRatio = flatTop ? '1 / cos(30deg)' : 'cos(30deg)';
    const clipPath = flatTop ? 'polygon(50% -50%,100% 50%,50% 150%,0 50%)' : 'polygon(-50% 50%,50% 100%,150% 50%,50% 0)';

    return {
        aspectRatio,
        clipPath,
    };
};

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

    return (
        <div className='bg-theme-root-background text-theme-text flex h-dvh w-dvw items-center justify-center overflow-hidden font-miriam-libre scrollbar-track-transparent [--scrollbar-thumb:theme(colors.theme.primary)]'>
            <div
                style={
                    {
                        '--anim-overall-height': 'min(100vw / 1.33, 100vh)',

                        '--anim-percentage-of-hex-top-to-100vh': 6.7,
                        '--anim-inner-margin': 'calc(var(--anim-overall-height) / 100 * 1.5)',

                        '--clip-shape-angle': '15deg',

                        '--clip-shape-skew-angle-home': 'calc(var(--clip-shape-angle) * -1)',
                        '--clip-shape-skew-angle-category': 'calc(var(--clip-shape-angle) / 2)',
                        '--clip-shape-skew-angle-post': 'calc(var(--clip-shape-angle) / 4 * -1)',

                        '--clip-shape-skew-angle':
                            expansionState === 'home'
                                ? 'var(--clip-shape-skew-angle-home)'
                                : expansionState === 'category'
                                  ? 'var(--clip-shape-skew-angle-category)'
                                  : /* === 'post' */ 'var(--clip-shape-skew-angle-post)',

                        '--clip-shape-tan': 'tan(var(--clip-shape-angle))',
                        '--clip-shape-tan-home': 'calc(var(--clip-shape-tan) * var(--anim-overall-height))',
                        '--clip-shape-tan-category': 'calc(var(--clip-shape-tan-home) / 2)',
                        '--clip-shape-tan-post': 'calc(var(--clip-shape-tan-home) / 4)',

                        '--clip-shape-width-home-left': '50%',
                        '--clip-shape-width-home-right': '50%',

                        '--clip-shape-width-category-left': '20%',
                        '--clip-shape-width-category-right': '80%',

                        '--clip-shape-width-post-left': '15%',
                        '--clip-shape-width-post-right': '85%',

                        '--clip-shape-tan-home-offset': 'calc(var(--clip-shape-tan-home) / 2)',
                        '--clip-shape-tan-home-offset-inverted': 'calc(var(--clip-shape-tan-home) / 2 * -1)',

                        '--clip-shape-tan-category-offset': 'calc(var(--clip-shape-tan-category) / 2)',
                        '--clip-shape-tan-category-offset-inverted': 'calc(var(--clip-shape-tan-category) / 2 * -1)',

                        '--clip-shape-tan-post-offset': 'calc(var(--clip-shape-tan-post) / 2)',
                        '--clip-shape-tan-post-offset-inverted': 'calc(var(--clip-shape-tan-post) / 2 * -1)',

                        '--clip-shape-animation-duration': '600ms',
                        '--clip-shape-animation-delay-stagger': '500ms',

                        '--clip-shape-flipper-inset': expansionState === 'home' ? '40%' : expansionState === 'category' ? '0%' : /* === 'post' */ '0%',
                        '--clip-shape-post-inset': expansionState === 'home' ? '100%' : expansionState === 'category' ? '100%' : /* === 'post' */ '0%',
                    } as CSSProperties
                }
                className='relative h-[--anim-overall-height] w-full [--nav-category-common-color-1:theme(colors.gray.700)]'
            >
                <div
                    id='clip-shape-left'
                    className={classNames(
                        'peer pointer-events-none absolute left-0 top-0 z-20 flex size-full flex-row items-center justify-end drop-shadow-omni-lg transition-[transform,padding] duration-[--clip-shape-animation-duration]',
                        'before:bg-theme-primary before:absolute before:left-0 before:top-0 before:size-full',
                        expansionState === 'home'
                            ? `-translate-x-[calc(var(--anim-inner-margin)/2)] pr-[calc(100%-var(--clip-shape-width-home-right))] hover-active:-translate-x-[--anim-inner-margin] ${formerExpansionState === 'category' ? 'before:animate-clip-shape-left-category-reversed' : 'before:animate-clip-shape-left-home'}`
                            : expansionState === 'category'
                              ? `pr-[calc(100%-var(--clip-shape-width-category-left))] ${formerExpansionState === 'post' ? 'before:animate-clip-shape-left-post-reversed' : 'before:animate-clip-shape-left-category'}`
                              : // === 'post'
                                'before:animate-clip-shape-left-post pr-[calc(100%-var(--clip-shape-width-post-left))]',
                    )}
                >
                    <Titles />
                </div>

                <div
                    id='clip-shape-main'
                    className={classNames(
                        'absolute left-0 right-0 top-[calc(var(--top-margin)+0.5%)] z-0 mx-auto h-[calc(var(--anim-overall-height)-(2*var(--top-margin))-1%)] transition-[top,transform,width,height] duration-[--clip-shape-animation-duration] [--post-close-button-height:4vh] [--top-margin:calc(var(--anim-overall-height)*(var(--anim-percentage-of-hex-top-to-100vh)/100))] [--wipe-clip-inset:100%] [--wipe-delay:calc(var(--clip-shape-animation-duration)/2)]',
                        expansionState === 'home'
                            ? 'w-[calc(var(--anim-inner-margin)*4)] skew-x-[--clip-shape-skew-angle-home]'
                            : expansionState === 'category'
                              ? 'w-[calc(var(--clip-shape-width-category-right)-var(--clip-shape-width-category-left))] ![--wipe-delay:0ms]'
                              : // === 'post'
                                '!top-[1.5%] !h-[97%] w-[calc(var(--clip-shape-width-post-right)-var(--clip-shape-width-post-left))] ![--wipe-clip-inset:0%]',
                    )}
                >
                    <Category />
                    <DisplayPost />
                </div>

                <div
                    id='clip-shape-right'
                    ref={ref}
                    className={classNames(
                        'pointer-events-none absolute left-0 top-0 z-10 size-full drop-shadow-omni-lg transition-transform',
                        'before:bg-theme-primary before:absolute before:left-0 before:top-0 before:size-full',
                        expansionState === 'home'
                            ? formerExpansionState === 'category'
                                ? 'before:animate-clip-shape-right-category-reversed peer-hover-active:translate-x-[--anim-inner-margin]'
                                : 'before:animate-clip-shape-right-home peer-hover-active:translate-x-[--anim-inner-margin]'
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
