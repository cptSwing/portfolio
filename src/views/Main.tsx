import Titles from '../components/Titles';
import { CSSProperties, MutableRefObject, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Category from '../components/Category';
import classNames from '../lib/classNames';
import useOutsideClick from '../hooks/useOutsideClick';
import DisplayPost from '../components/DisplayPost';
import roundNumToDecimal from '../lib/roundNumToDecimal';

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
            navigate('/');
            setExpansionState('nav');
        }
    }) as MutableRefObject<HTMLDivElement | null>;

    return (
        <div
            style={
                {
                    '--clip-shape-angle-rad': `${expansionState === 'nav' ? clipShapeAngleRad * -1 : expansionState === 'category' ? clipShapeAngleRad / 2 : (clipShapeAngleRad / 4) * -1}rad`,
                    '--clip-shape-tan-main-contracted': `${clipShapeTan * 100}vh`,
                    '--clip-shape-tan-main-expanded': 'calc(var(--clip-shape-tan-main-contracted) / 2)',
                    '--clip-shape-tan-post': 'calc(var(--clip-shape-tan-main-expanded) / 2)',
                    '--clip-shape-width-nav-contracted': '25vw',
                    '--clip-shape-width-nav-expanded': '60vw',
                    '--clip-shape-width-nav-post': '10vw',
                    '--clip-shape-width-main-contracted': 'calc(var(--clip-shape-width-nav-expanded) + 1rem)',
                    '--clip-shape-width-main-expanded': '75vw',
                    '--clip-shape-width-main-post': '90vw',
                    '--clip-shape-animation-duration': '700ms',
                    '--clip-shape-animation-delay-stagger': '300ms',
                } as CSSProperties
            }
            className='size-full [--nav-category-common-color-1:theme(colors.gray.700)]'
        >
            <div
                className={classNames(
                    'absolute left-0 z-10 flex size-full flex-row items-center justify-end bg-red-800 drop-shadow-2xl transition-[padding] duration-[--clip-shape-animation-duration]',
                    expansionState === 'nav'
                        ? 'animate-clip-shape-nav-expand pr-[calc(100vw-var(--clip-shape-width-nav-expanded)+var(--clip-shape-tan-main-contracted)/2-1px)]'
                        : expansionState === 'category'
                          ? 'animate-clip-shape-nav-contract pr-[calc(100vw-var(--clip-shape-width-nav-contracted)+var(--clip-shape-tan-main-expanded)/2-1px)]'
                          : 'animate-clip-shape-nav-post pr-[calc(100vw-var(--clip-shape-width-nav-post)+var(--clip-shape-tan-post)/2-1px)]',
                )}
            >
                <Titles />
            </div>

            <div
                id='layer-below-clip-shape-main'
                ref={ref}
                className={classNames(
                    'absolute z-0 size-full bg-green-800 delay-200 duration-500',
                    expansionState === 'nav'
                        ? 'animate-clip-shape-main-contract [--clip-shape-flipper-inset:100%] [--clip-shape-post-inset:100%]'
                        : expansionState === 'category'
                          ? 'animate-clip-shape-main-expand [--clip-shape-flipper-inset:0%] [--clip-shape-post-inset:100%]'
                          : 'animate-clip-shape-main-post [--clip-shape-flipper-inset:100%] [--clip-shape-post-inset:0%]',
                )}
            >
                <div className='flex size-full items-center justify-center overflow-hidden bg-yellow-800 pl-[calc(var(--clip-shape-width-nav-contracted)-var(--clip-shape-main-padding))] pr-[calc(100vw-var(--clip-shape-width-main-expanded)-var(--clip-shape-main-padding))] transition-[clip-path] delay-[--clip-shape-animation-delay-stagger] duration-[--clip-shape-animation-duration] clip-inset-b-[--clip-shape-flipper-inset] [--clip-shape-main-padding:theme(spacing.8)]'>
                    <Category />
                </div>

                <div className='absolute left-0 top-0 size-full transition-[clip-path] delay-[--clip-shape-animation-delay-stagger] duration-[--clip-shape-animation-duration] clip-inset-t-[--clip-shape-post-inset]'>
                    <DisplayPost />
                </div>
            </div>
        </div>
    );
};

export default Main;
