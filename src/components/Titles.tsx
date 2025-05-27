import { DataBase } from '../types/types';
import { FC, useMemo, useState } from 'react';
import testDb from '../queries/testDb.json';
import { MENU_CATEGORY } from '../types/enums.ts';
import { Link, useParams } from 'react-router-dom';
import useAnimationOnMount from '../hooks/useAnimationOnMount.ts';
import { bars_totalDuration } from '../lib/animationValues.ts';
import Settings from './Settings.tsx';
import classNames from '../lib/classNames.ts';
import { createPortal } from 'react-dom';

const testDbTyped = testDb as DataBase;
const categoriesArray = Object.values(testDbTyped);

const Titles = () => {
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    return (
        <header className='pointer-events-auto -mr-0.5 flex origin-right skew-x-[--clip-shape-skew-angle] flex-col items-end justify-center transition-transform duration-500 [--nav-title-animation-duration:300ms]'>
            {/* Code, 3D, Log */}
            {categoriesArray.map((cardData) => (
                <CategoryTitle key={cardData.categoryTitle} cardData={cardData} />
            ))}

            {/* Hamburger Menu */}
            <div
                className={classNames(
                    'absolute right-0 top-[calc(100%+theme(spacing.2))] flex aspect-square w-1/4 cursor-pointer flex-col items-center justify-around p-2',
                    'before:bg-theme-primary-lighter before:absolute before:-z-10 before:h-full before:w-0 before:transition-[width] before:duration-500',
                    'hover-active:before:w-full',
                )}
                onClick={() => setMenuIsOpen((prev) => !prev)}
            >
                <div className='h-0.5 w-full bg-[--nav-text]' />
                <div className='h-0.5 w-full bg-[--nav-text]' />
                <div className='h-0.5 w-full bg-[--nav-text]' />
            </div>

            {menuIsOpen &&
                createPortal(
                    <div className='absolute left-2/3 top-0'>
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
    cardData: DataBase[MENU_CATEGORY];
}> = ({ cardData }) => {
    const { id, categoryTitle } = cardData;

    const { catId } = useParams();
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

    const isThisCategoryOpen_Memo = useMemo(() => (catId ? parseInt(catId) === id : false), [catId, id]);

    return (
        <Link
            ref={refCallback}
            to={`/${id}`}
            className={classNames(
                'group/link relative z-0 flex w-full cursor-pointer items-center justify-end no-underline',
                'before:bg-theme-primary-darker before:absolute before:-z-10 before:block before:h-full before:rounded-bl-2xl before:drop-shadow-md before:transition-[width] before:duration-[--nav-title-animation-duration]',
                'after:absolute after:right-0 after:h-full after:bg-white after:opacity-10 after:blur-sm after:clip-inset-0 after:clip-inset-l-[-200%] after:clip-inset-r-[calc(theme(spacing[0.5])*-1)]',
                isThisCategoryOpen_Memo ? 'before:w-full after:w-1' : 'before:w-0 after:w-0 hover-active:before:w-full hover-active:after:w-1',
            )}
        >
            {/* Text-Effects */}
            <span
                className={classNames(
                    'skew-x-[calc(var(--clip-shape-skew-angle)*-1)] bg-gradient-to-l via-50% bg-clip-text py-2 pl-10 pr-4 text-5xl font-bold !text-transparent transition-[background-position,transform] duration-[--nav-title-animation-duration] [background-size:200%_200%]',
                    'group-hover-active/link:from-theme-primary-darker group-hover-active/link:via-theme-secondary-lighter group-hover-active/link:to-theme-secondary-lighter group-hover-active/link:[background-position:0%_0%]',
                    isThisCategoryOpen_Memo
                        ? 'from-theme-primary-darker via-theme-secondary-lighter to-theme-secondary-lighter [background-position:0%_0%]'
                        : 'from-theme-primary-darker via-theme-primary-darker to-theme-secondary-lighter [background-position:100%_100%]',
                )}
            >
                {categoryTitle}
            </span>
        </Link>
    );
};
