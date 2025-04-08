import { DataBase, Post } from '../types/types';
import { FC, useMemo } from 'react';
import testDb from '../queries/testDb.json';
import { MENU_CATEGORY } from '../types/enums.ts';
import { CodeBracketSquareIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useNavigate, useParams } from 'react-router-dom';
import useAnimationOnMount from '../hooks/useAnimationOnMount.ts';
import GetBackgroundSvg from './GetBackgroundSvg.tsx';
import { useBreakpoint } from '../hooks/useBreakPoint.ts';
import { bars_totalDuration } from '../lib/animationValues.ts';

const testDbTyped = testDb as DataBase;
const categoriesArray = Object.values(testDbTyped);

const Nav = () => {
    return (
        <nav className='relative flex flex-row items-center justify-center gap-x-2'>
            <div className='flex flex-col items-end justify-start gap-y-2'>
                {categoriesArray.map((cardData) => (
                    <CategoryCard key={cardData.categoryTitle} cardData={cardData} />
                ))}

                <div className='mt-8 cursor-pointer select-none leading-[0.7]'>about</div>
            </div>

            <div className='w-1 self-stretch bg-white' />
        </nav>
    );
};

export default Nav;

const CategoryCard: FC<{
    cardData: DataBase[MENU_CATEGORY];
}> = ({ cardData }) => {
    const { id, categoryTitle, posts, categoryBlurb } = cardData;

    const [BackgroundSvg] = useMemo(() => GetBackgroundSvg(categoryTitle), [categoryTitle]);

    const navigate = useNavigate();
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

    const _isThisCategoryOpen = useMemo(() => (catId ? parseInt(catId) === id : false), [catId, id]);

    const isDesktop = useBreakpoint('sm');

    return (
        <div
            ref={refCallback}
            className='cursor-pointer select-none text-4xl font-bold leading-none'
            onClick={() => {
                if (catId === id.toString()) {
                    navigate('/');
                } else if (!isDesktop) {
                    setTimeout(() => navigate(`/${id}`), 200);
                } else {
                    navigate(`/${id}`);
                }
            }}
        >
            {categoryTitle}
        </div>
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
