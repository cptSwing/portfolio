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
            ref={ref}
            className='mx-auto h-3/4 w-2/3 [--category-padding:theme(spacing.4)] [--nav-category-common-color-1:theme(colors.gray.700)] [--nav-divider-width:theme(spacing.1)] [--nav-gap-x:theme(spacing.2)]'
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
        </div>
    );
};

export default Main;
