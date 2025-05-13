import Titles from '../components/Titles';
import { CSSProperties, MutableRefObject, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Category from '../components/Category';
import classNames from '../lib/classNames';
import useOutsideClick from '../hooks/useOutsideClick';
import DisplayPost from '../components/DisplayPost';

const clipShapeAngleRad = 20 * (Math.PI / 180);
const clipShapeTan = Math.tan(clipShapeAngleRad);

const Main = () => {
    const { catId, postId } = useParams();
    const navigate = useNavigate();

    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (typeof catId === 'string') {
            setIsExpanded(true);
        }
    }, [catId]);

    /* Contract <Category> when click outside */
    const ref = useOutsideClick(() => {
        if (!postId) {
            // should not trigger when post is displayed
            navigate('/');
            setIsExpanded(false);
        }
    }) as MutableRefObject<HTMLDivElement | null>;

    return (
        <div
            style={
                {
                    '--clip-shape-skew-origin': isExpanded ? 'bottom right' : 'bottom right', // TODO unnecessary
                    '--clip-shape-angle-rad': `${isExpanded ? clipShapeAngleRad / 2 : clipShapeAngleRad * -1}rad`,
                    '--clip-shape-tan-vh': `${isExpanded ? clipShapeTan * 50 : clipShapeTan * 100}vh`,
                    '--clip-shape-width-main': isExpanded ? '20vw' : '60vw',
                    '--clip-shape-animation-duration': '700ms',
                } as CSSProperties
            }
            className='size-full [--clip-shape-width-main:70vw] [--nav-category-common-color-1:theme(colors.gray.700)]'
        >
            <div
                // key={isExpanded + ''}
                className={classNames(
                    'absolute left-0 z-10 flex size-full flex-row items-center justify-end bg-red-800 pr-[calc(100vw-var(--clip-shape-tan-vh))] drop-shadow-2xl transition-[min-height,padding] duration-700 [animation-duration:700ms] [animation-fill-mode:forwards]',
                    isExpanded
                        ? 'animate-clip-shape-main-contract min-h-full' /* [clip-path:polygon(0_0,calc(100%-var(--clip-shape-tan-vh))_0,100%_100%,0_100%)]' */
                        : 'animate-clip-shape-main-contract-reverse min-h-0',
                )}
            >
                <Titles />
            </div>

            <div
                ref={ref}
                className={classNames(
                    'z-0 size-full transition-[min-height,clip-path] delay-200 duration-500',
                    isExpanded
                        ? 'min-h-full [--clip-shape-flipper-inset:0%] [clip-path:polygon(0_0,calc(100%-(var(--clip-shape-width-main)/2)-var(--clip-shape-tan-vh))_0,calc(100%-var(--clip-shape-width-main)/2)_100%,0_100%)]'
                        : 'min-h-0 [--clip-shape-flipper-inset:100%] [clip-path:polygon(0_0,80%_0,calc(80%-var(--clip-shape-tan-vh))_100%,0%_100%)]',
                )}
            >
                <div className='flex h-full w-full items-center justify-center bg-yellow-800 pl-[--clip-shape-width-main] pr-[calc(var(--clip-shape-width-main)/2+var(--clip-shape-tan-vh)/2)] transition-[clip-path] duration-[--clip-shape-animation-duration] clip-inset-r-[--clip-shape-flipper-inset]'>
                    <Category />
                </div>
            </div>

            <DisplayPost />
        </div>
    );
};

export default Main;
