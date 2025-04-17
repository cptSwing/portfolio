import { DataBase, Post } from '../types/types';
import { FC, useEffect, useMemo, useState } from 'react';
import testDb from '../queries/testDb.json';
import { MENU_CATEGORY } from '../types/enums.ts';
import { CodeBracketSquareIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useAnimationOnMount from '../hooks/useAnimationOnMount.ts';
import { bars_totalDuration } from '../lib/animationValues.ts';
import Settings from './Settings.tsx';
import classNames from '../lib/classNames.ts';
import themes from '../lib/themes';
import { useZustand } from '../lib/zustand.ts';
import { setCssProperties } from '../lib/cssProperties.ts';

const testDbTyped = testDb as DataBase;
const categoriesArray = Object.values(testDbTyped);

const Nav = () => {
    const themeIndex = useZustand((state) => state.values.themeIndex);
    useEffect(() => {
        setCssProperties(document.documentElement, themes[themeIndex]);
    }, [themeIndex]);

    const [menuIsOpen, setMenuIsOpen] = useState(false);

    return (
        <nav className='relative flex flex-row items-start justify-center gap-x-[--nav-gap-x]'>
            <div className='flex flex-col items-end justify-start'>
                {categoriesArray.map((cardData) => (
                    <CategoryTitle key={cardData.categoryTitle} cardData={cardData} />
                ))}

                <div
                    className={classNames(
                        'relative z-0 mt-8 flex aspect-square w-[calc(var(--nav-width)/4)] cursor-pointer flex-col items-center justify-around',
                        'before:absolute before:-right-[--nav-gap-x] before:z-10 before:h-full before:w-0 before:bg-[--nav-category-common-color-1] before:mix-blend-difference before:transition-[width] before:duration-500',
                        'hover-active:before:w-[calc(100%+var(--nav-gap-x)*2)]',
                    )}
                    onClick={() => setMenuIsOpen((prev) => !prev)}
                >
                    <div className='h-0.5 w-full bg-[--nav-text]' />
                    <div className='h-0.5 w-full bg-[--nav-text]' />
                    <div className='h-0.5 w-full bg-[--nav-text]' />
                </div>
            </div>

            <div className='-mr-1 w-[--nav-divider-width] self-stretch bg-[--nav-category-common-color-1]' />

            {menuIsOpen && (
                <div className='absolute left-[calc(100%+var(--nav-gap-x))] w-full'>
                    <div>about yadda yadda</div>

                    <Settings />
                </div>
            )}
        </nav>
    );
};

export default Nav;

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
                'relative z-0 flex cursor-pointer select-none items-center justify-end py-2 text-5xl font-bold !text-[--nav-text] no-underline',
                'before:absolute before:-right-[--nav-gap-x] before:z-10 before:h-full before:w-0 before:bg-[--nav-category-common-color-1] before:mix-blend-difference before:transition-[width] before:duration-500',
                'hover-active:before:w-[--nav-width]',
                isThisCategoryOpen_Memo ? 'before:w-[--nav-width]' : '',
            )}
        >
            {categoryTitle}
        </Link>
    );
};

/** Used in Content.tsx */
export const MenuOpenedPost: FC<{
    hasImages: boolean;
    codeLink: Post['codeLink'];
    setLightboxTo: React.Dispatch<React.SetStateAction<number | null>>;
}> = ({ hasImages, codeLink, setLightboxTo }) => {
    const navigate = useNavigate();

    const [codeRefCb] = useAnimationOnMount({
        animationProps: {
            animationName: 'outer-ring',
            animationDuration: 850,
            animationDelay: 0,
            animationFillMode: 'forwards',
            animationIterationCount: 3,
        },
        startDelay: 0,
        hiddenAtStart: false,
    });

    return (
        <div className='pointer-events-auto mb-2 ml-auto flex h-8 items-center justify-end rounded-tl bg-transparent sm:mb-0 sm:h-6 sm:rounded-tl-sm sm:rounded-tr-sm sm:bg-[--color-bars-post]'>
            {hasImages && (
                <button
                    type='button'
                    className='h-full cursor-pointer px-1.5 py-0.5 text-sm uppercase transition-colors duration-75 before:absolute before:-top-full before:right-0 before:-z-10 before:hidden before:translate-y-full before:pt-2 before:leading-none before:text-[--theme-secondary-50] before:transition-transform before:duration-100 hover:before:translate-y-0 hover:before:content-["Gallery"] active:before:translate-y-0 active:before:transition-none active:before:content-["Gallery"] sm:px-1 sm:pb-0 sm:before:block sm:before:pt-2'
                    onClick={() => setLightboxTo(0)}
                >
                    <PhotoIcon className='aspect-square h-full stroke-[--color-bars-no-post] hover:stroke-[--theme-accent-800] active:stroke-[--theme-accent-800]' />
                </button>
            )}

            {codeLink && (
                <>
                    <div className='h-3/5 w-0.5 bg-[--theme-primary-600] sm:-mb-0.5' />
                    <a
                        className='group inline-block h-full cursor-pointer px-1.5 py-0.5 transition-colors duration-75 before:absolute before:-top-full before:right-0 before:-z-10 before:hidden before:translate-y-full before:text-nowrap before:pt-2 before:text-sm before:uppercase before:leading-none before:text-[--theme-secondary-50] before:transition-transform before:duration-100 after:content-none hover:before:translate-y-0 hover:before:content-["View_Code"] sm:px-1 sm:pb-0 sm:before:block sm:before:pt-2'
                        href={codeLink.href}
                        target='_blank'
                        rel='noreferrer'
                    >
                        <CodeBracketSquareIcon
                            key={codeLink.href}
                            // @ts-expect-error ...
                            ref={codeRefCb}
                            className='aspect-square h-full stroke-[--color-bars-no-post] hover:stroke-[--theme-accent-800] active:stroke-[--theme-accent-800]'
                        />
                    </a>
                </>
            )}

            {/* TODO fade out instead of instantly closing */}
            {(hasImages || codeLink) && <div className='h-3/5 w-0.5 bg-[--theme-primary-600] sm:-mb-0.5' />}
            <button
                type='button'
                className='h-full cursor-pointer px-1 py-0.5 text-sm uppercase transition-colors duration-75 before:absolute before:-top-full before:right-0 before:-z-10 before:hidden before:translate-y-full before:pt-2 before:leading-none before:text-[--theme-secondary-50] before:transition-transform before:duration-100 hover:before:translate-y-0 hover:before:content-["Close"] sm:px-0.5 sm:pb-0 sm:before:block sm:before:pt-2'
                onClick={() => {
                    navigate('../');
                }}
            >
                <XMarkIcon className='aspect-square h-full stroke-[--color-bars-no-post] hover:stroke-[--theme-accent-800] active:stroke-[--theme-accent-800]' />
            </button>
        </div>
    );
};
