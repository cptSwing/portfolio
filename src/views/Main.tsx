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
                <div className={classNames('absolute blur-lg', 'scale-x-[4] scale-y-[0.001]')}>
                    <div
                        className={classNames(
                            'text-7xl',
                            'scale-x-[calc(1/4)] scale-y-[1000]',
                            'clip-inset-l-1/4', // works sorta, 1/3 will cut off part of the (l-) content though
                        )}
                    >
                        LOLOLOL
                    </div>
                </div>

                <div className='absolute text-7xl outline-dashed outline-2 outline-blue-300'>LOLOLOL</div>
            </div> */}
        </div>
    );
};

export default Main;
