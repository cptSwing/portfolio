import Titles from '../components/Titles';
import { MutableRefObject, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Category from '../components/Category';
import classNames from '../lib/classNames';
import useOutsideClick from '../hooks/useOutsideClick';
import DisplayPost from '../components/DisplayPost';

const Main = () => {
    const { catId, postId } = useParams();
    const navigate = useNavigate();

    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (catId) {
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
            key='content-wrapper'
            ref={ref}
            className={classNames(
                '[--category-padding:theme(spacing.4)] [--nav-category-common-color-1:theme(colors.gray.700)] [--nav-divider-width:theme(spacing.1)] [--nav-gap-x:theme(spacing.2)]',
                'mx-auto h-3/4 w-2/3',
            )}
        >
            <div
                className={classNames(
                    'grid size-full items-start justify-center drop-shadow-xl transition-[grid-template-columns] duration-500',
                    isExpanded ? 'grid-cols-[auto_1fr_auto] *:min-h-full' : 'grid-cols-[auto_0fr_auto] *:min-h-0',
                )}
            >
                <Titles />
                <Category />
            </div>

            {/* Has position:fixed and needs to break out of sibling context (created by 'drop-shadow') */}
            <DisplayPost />

            {/* Blur test */}
            {/* <div className='fixed left-1/3 top-1/3 h-32 w-96 text-white'>
                <div
                    className={classNames(
                        'absolute size-full',
                        'origin-bottom-left skew-y-12',
                        '[clip-path:polygon(-50%_0,-50%_100%,0_100%,0_0,100%_0,100%_100%,100%_0)]',
                    )}
                >
                    <div
                        className={classNames(
                            'size-full scale-x-[--debug-motion-scale] scale-y-[0.01] blur-lg',
                            'after:absolute after:size-full after:scale-x-[calc(1/var(--debug-motion-scale))] after:scale-y-[100] after:bg-cover after:bg-center after:[background-image:url("/images/a100/a100_featured_image.jpg")]',
                        )}
                        style={{ '--debug-motion-scale': 3 } as CSSProperties}
                    ></div>
                </div>

                <img className='absolute size-full translate-y-full object-cover object-center opacity-60' src='images/a100/a100_featured_image.jpg' />
            </div> */}
        </div>
    );
};

export default Main;
