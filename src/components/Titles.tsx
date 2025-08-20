import { Category } from '../types/types';
import { FC, useMemo, useState } from 'react';
import { database } from '../types/exportTyped';
import { Link, useParams } from 'react-router-dom';
import useAnimationOnMount from '../hooks/useAnimationOnMount.ts';
import { bars_totalDuration } from '../lib/animationValues.ts';
import Settings from './Settings.tsx';
import { classNames } from 'cpts-javascript-utilities';
import { createPortal } from 'react-dom';

const categories = Object.values(database);

const Titles = () => {
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    return (
        <header className="pointer-events-auto transition-transform duration-500 [--nav-title-animation-duration:300ms]">
            {/* Code, 3D, Log */}
            {categories.map((cardData) => (
                <CategoryTitle key={cardData.title} cardData={cardData} />
            ))}

            {/* Hamburger Menu */}
            <button
                className={classNames(
                    'absolute right-0 top-[calc(100%+theme(spacing.2))] flex aspect-square cursor-pointer flex-col items-center justify-around p-2',
                    'before:absolute before:-z-10 before:h-full before:w-0 before:bg-theme-secondary-lighter before:transition-[width] before:duration-500',
                    'hover-active:before:w-full',
                )}
                onClick={() => setMenuIsOpen((prev) => !prev)}
            >
                <div className="h-0.5 w-full bg-theme-primary-darker" />
                <div className="h-0.5 w-full bg-theme-primary-darker" />
                <div className="h-0.5 w-full bg-theme-primary-darker" />
            </button>

            {menuIsOpen &&
                createPortal(
                    <div className="absolute left-2/3 top-0">
                        <div>about yadda yadda</div>

                        <Settings />
                    </div>,
                    document.getElementById('clip-shape-main')!,
                )}
        </header>
    );
};

export default Titles;

const CategoryTitle: FC<{
    cardData: Category;
}> = ({ cardData }) => {
    const { id, title } = cardData;

    const { param_categoryId } = useParams();
    const isIndexEven = id % 2 === 0;

    const [refCallback] = useAnimationOnMount({
        animationProps: {
            animationName: isIndexEven ? 'streak-to-right' : 'streak-to-left',
            animationDuration: 300,
            animationDelay: 100 * id,
            animationFillMode: 'backwards',
            animationIterationCount: 1,
        },
        startDelay: bars_totalDuration / 2,
        displayAtStart: false,
    });

    const isThisCategoryOpen_Memo = useMemo(() => (param_categoryId ? parseInt(param_categoryId) === id : false), [param_categoryId, id]);

    return (
        <Link
            ref={refCallback}
            to={`/${id}`}
            className={classNames(
                'group/link relative z-0 flex h-[14.286%] cursor-pointer items-center justify-center no-underline',
                'before:absolute before:-z-10 before:block before:h-full before:rounded-bl-2xl before:bg-theme-primary-darker before:drop-shadow-md before:transition-[width] before:duration-[--nav-title-animation-duration]',
                'after:absolute after:right-0 after:h-full after:bg-white after:opacity-10 after:blur-sm after:clip-inset-0 after:clip-inset-l-[-200%] after:clip-inset-r-[calc(theme(spacing[0.5])*-1)]',
                isThisCategoryOpen_Memo ? 'before:w-full after:w-1' : 'before:w-0 after:w-0 hover-active:before:w-full hover-active:after:w-1',
            )}
        >
            {/* Text-Effects */}
            <span
                className={classNames(
                    'bg-gradient-to-l via-50% bg-clip-text px-2 py-2 text-5xl font-bold !text-transparent transition-[background-position,transform] duration-[--nav-title-animation-duration] [background-size:200%_200%]',
                    'group-hover-active/link:from-theme-primary-darker group-hover-active/link:via-theme-secondary-lighter group-hover-active/link:to-theme-secondary-lighter group-hover-active/link:[background-position:0%_0%]',
                    isThisCategoryOpen_Memo
                        ? 'from-theme-primary-darker via-theme-secondary-lighter to-theme-secondary-lighter [background-position:0%_0%]'
                        : 'from-theme-primary-darker via-theme-primary-darker to-theme-secondary-lighter [background-position:100%_100%]',
                )}
            >
                {title}
            </span>
        </Link>
    );
};
