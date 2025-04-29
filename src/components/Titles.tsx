import { DataBase, Post } from '../types/types';
import { FC, useEffect, useMemo, useState } from 'react';
import testDb from '../queries/testDb.json';
import { MENU_CATEGORY } from '../types/enums.ts';
import { CodeBracketSquareIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { Link, useParams } from 'react-router-dom';
import useAnimationOnMount from '../hooks/useAnimationOnMount.ts';
import { bars_totalDuration } from '../lib/animationValues.ts';
import Settings from './Settings.tsx';
import classNames from '../lib/classNames.ts';
import themes from '../lib/themes';
import { useZustand } from '../lib/zustand.ts';
import { setCssProperties } from '../lib/cssProperties.ts';

const testDbTyped = testDb as DataBase;
const categoriesArray = Object.values(testDbTyped);

const Titles = () => {
    const themeIndex = useZustand((state) => state.values.themeIndex);
    useEffect(() => {
        setCssProperties(document.documentElement, themes[themeIndex]);
    }, [themeIndex]);

    const [menuIsOpen, setMenuIsOpen] = useState(false);

    return (
        <header className='relative flex flex-row items-start justify-center transition-[min-height] duration-500'>
            <div className='mr-[--nav-gap-x] flex flex-col items-end justify-start'>
                {/* Code, 3D, Log */}
                {categoriesArray.map((cardData) => (
                    <CategoryTitle key={cardData.categoryTitle} cardData={cardData} />
                ))}

                {/* Hamburger Menu */}
                <div
                    className={classNames(
                        'relative z-0 mt-8 flex aspect-square w-1/4 cursor-pointer flex-col items-center justify-around',
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

            <div className='w-[--nav-divider-width] self-stretch bg-[--nav-category-common-color-1]' />

            {menuIsOpen && (
                <div className='absolute left-[calc(100%+var(--nav-gap-x))] w-full'>
                    <div>about yadda yadda</div>

                    <Settings />
                </div>
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
            data-after-text={categoryTitle}
            className={classNames(
                '[--nav-title-animation-duration:300ms] [--nav-title-before-width:calc(100%+var(--nav-gap-x))] [--nav-title-padding-left:theme(spacing.4)]',
                'group/link relative z-0 flex w-full cursor-pointer items-center justify-end py-2 pl-[--nav-title-padding-left] no-underline',
                'before:absolute before:-right-[--nav-gap-x] before:-z-10 before:block before:h-full before:w-0 before:rounded-bl-2xl before:bg-[--nav-category-common-color-1] before:transition-[width,filter] before:duration-[--nav-title-animation-duration]',
                'hover:text-red-500',
                isThisCategoryOpen_Memo
                    ? 'before:w-[--nav-title-before-width] before:brightness-100 hover-active:before:w-[--nav-title-before-width]'
                    : 'before:brightness-75 hover-active:before:w-[calc(var(--nav-title-before-width)-(var(--nav-title-padding-left)/2))]',
            )}
        >
            {/* Text-Effects */}
            <span
                className={classNames(
                    'bg-gradient-to-r from-[--nav-text] via-[--nav-text] to-red-500 bg-clip-text text-5xl font-bold !text-transparent transition-[background-position] duration-[--nav-title-animation-duration] [background-position:0%_0%] [background-size:200%_200%]',
                    'group-hover-active/link:from-[--nav-text] group-hover-active/link:via-red-500 group-hover-active/link:to-red-500 group-hover-active/link:[background-position:100%_100%]',
                    isThisCategoryOpen_Memo ? 'from-[--nav-text] via-red-500 to-red-500 [background-position:100%_100%]' : '',
                )}
            >
                {categoryTitle}
            </span>
        </Link>
    );
};

/** Used in Content.tsx */
export const MenuOpenedPost: FC<{
    hasImages: boolean;
    codeLink: Post['codeLink'];
    setLightboxTo: React.Dispatch<React.SetStateAction<number | null>>;
}> = ({ hasImages, codeLink, setLightboxTo }) => {
    const { catId } = useParams();

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
            <Link
                to={`/${catId}`}
                className='h-full cursor-pointer px-1 py-0.5 text-sm uppercase transition-colors duration-75 before:absolute before:-top-full before:right-0 before:-z-10 before:hidden before:translate-y-full before:pt-2 before:leading-none before:text-[--theme-secondary-50] before:transition-transform before:duration-100 hover:before:translate-y-0 hover:before:content-["Close"] sm:px-0.5 sm:pb-0 sm:before:block sm:before:pt-2'
            >
                <XMarkIcon className='aspect-square h-full stroke-[--color-bars-no-post] hover:stroke-[--theme-accent-800] active:stroke-[--theme-accent-800]' />
            </Link>
        </div>
    );
};
