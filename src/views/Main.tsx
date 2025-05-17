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

    const [expansionState, setExpansionState] = useState<'nav' | 'category' | 'post'>('nav');

    useLayoutEffect(() => {
        if (catId) {
            if (postId) {
                setExpansionState('post');
            } else {
                setExpansionState('category');
            }
        } else {
            setExpansionState('nav');
        }
    }, [catId, postId]);

    /* Contract <Category> when click outside */
    const ref = useOutsideClick(() => {
        if (!postId) {
            // should not trigger when post is displayed
            // navigate('/');
            // setExpansionState('nav');
        }
    }) as MutableRefObject<HTMLDivElement | null>;

    return (
        <div
            style={
                {
                    '--clip-shape-angle-rad': `${expansionState === 'nav' ? clipShapeAngleRad * -1 : expansionState === 'category' ? clipShapeAngleRad / 2 : /* === 'post' */ (clipShapeAngleRad / 4) * -1}rad`,

                    '--clip-shape-tan': clipShapeTan,
                    '--clip-shape-tan-nav': 'calc(var(--clip-shape-tan) * 100vh)',
                    '--clip-shape-tan-category': 'calc(var(--clip-shape-tan-nav) / 2)',
                    '--clip-shape-tan-post': 'calc(var(--clip-shape-tan-category) / 2)',

                    '--clip-shape-width-nav-inner-space': '1rem',
                    '--clip-shape-width-nav-left': '50vw',
                    '--clip-shape-width-nav-right': 'calc(var(--clip-shape-width-nav-left) + var(--clip-shape-width-nav-inner-space))',

                    '--clip-shape-width-category-left': '20vw',
                    '--clip-shape-width-category-right': 'calc(100% - var(--clip-shape-width-category-left))',

                    '--clip-shape-width-post-left': '10vw',
                    '--clip-shape-width-post-right': '90vw',

                    '--clip-shape-animation-duration': '600ms',
                    '--clip-shape-animation-delay-stagger': '500ms',

                    '--clip-shape-flipper-inset': expansionState === 'nav' ? '100%' : expansionState === 'category' ? '0%' : /* === 'post' */ '100%',
                    '--clip-shape-post-inset': expansionState === 'nav' ? '100%' : expansionState === 'category' ? '100%' : /* === 'post' */ '0%',
                } as CSSProperties
            }
            className='size-full [--nav-category-common-color-1:theme(colors.gray.700)]'
        >
            <div
                id='clip-shape-left'
                className={classNames(
                    'pointer-events-none absolute left-0 top-0 z-20 flex size-full flex-row items-center justify-end drop-shadow-omni-lg transition-[padding]',
                    'before:absolute before:left-0 before:top-0 before:size-full before:bg-red-800 before:transition-[clip-shape] before:duration-[--clip-shape-animation-duration] after:[clip-path:polygon(0_0,calc(var(--clip-shape-width-nav-left)+var(--clip-shape-tan-nav)/2)_0,calc(var(--clip-shape-width-nav-left)-calc(var(--clip-shape-tan-nav)/2))_100%,0_100%)]',
                    expansionState === 'nav'
                        ? 'before:animate-clip-shape-left-nav pr-[calc(100vw-var(--clip-shape-width-nav-right)+var(--clip-shape-width-nav-inner-space))]'
                        : expansionState === 'category'
                          ? 'before:animate-clip-shape-left-category pr-[calc(100vw-var(--clip-shape-width-category-left))]'
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
                        expansionState === 'nav'
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
                        expansionState === 'nav'
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
                    expansionState === 'nav'
                        ? 'before:animate-clip-shape-right-nav'
                        : expansionState === 'category'
                          ? 'before:animate-clip-shape-right-category'
                          : // === 'post'
                            'before:animate-clip-shape-right-post',
                )}
            ></div>
        </div>
    );
};

export default Main;
