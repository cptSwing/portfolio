import { DataBase, Post } from '../types/types';
import classNames from '../lib/classNames';
import { FC, useEffect, useMemo, useState } from 'react';
import testDb from '../queries/testDb.json';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.ts';
import { PostCards } from './PostCards.tsx';
import { useDebugButton } from '../hooks/useDebugButton.ts';
import { MENU_CATEGORY } from '../types/enums.ts';
import Markdown from 'react-markdown';
import { CodeBracketSquareIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useNavigate, useParams } from 'react-router-dom';
import useAnimationOnMount from '../hooks/useAnimationOnMount.ts';
import GetBackgroundSvg from './GetBackgroundSvg.tsx';

const themeBgDarker = resolveConfig(tailwindConfig).theme.colors.theme.bg.darker;
const testDbTyped = testDb as DataBase;
const categoriesArray = Object.values(testDbTyped);

const Nav = () => {
    const { catId, postId } = useParams();

    return (
        <nav
            className={classNames(
                'mx-auto grid transition-[width,height,grid-template-rows,row-gap] duration-500',
                catId ? 'h-[80dvh] w-[--checked-width] gap-y-px' : 'h-[50dvh] w-[--unchecked-width] gap-y-1',
                postId ? 'absolute left-0 right-0 -z-10' : 'z-0 block',
            )}
            style={{
                gridTemplateRows: categoriesArray.map(({ id }) => (id.toString() === catId ? '14fr' : '1fr')).join(' '),
            }}
        >
            {categoriesArray.map((cardData) => (
                <CategoryCard key={cardData.categoryTitle} cardData={cardData} />
            ))}
        </nav>
    );
};

export default Nav;

const CategoryCard: FC<{
    cardData: DataBase[MENU_CATEGORY];
}> = ({ cardData }) => {
    const { id, categoryTitle, posts, categoryBackgroundColor, categoryBlurb } = cardData;

    const BackgroundSvg = GetBackgroundSvg(categoryTitle);

    const navigate = useNavigate();
    const { catId } = useParams();
    const isIndexEven = id % 2 === 0;

    const [refCallback] = useAnimationOnMount({
        animationProps: {
            animationName: isIndexEven ? 'streak-down' : 'streak-up',
            animationDuration: 300,
            animationDelay: 100 * id,
            animationFillMode: 'backwards',
        },
        startDelay: 400,
        hiddenAtStart: true,
    });

    const isThisCategoryOpen = useMemo(() => (catId ? parseInt(catId) === id : false), [catId, id]);

    const paddingStyle_Memo = useMemo(() => {
        if (catId && !isThisCategoryOpen) {
            const openedIndex = catId ? parseInt(catId) : null;
            if (id < openedIndex!) {
                return { '--tw-translate-y': '0.5rem' } as unknown as CSSTransition;
            } else if (id > openedIndex!) {
                return { '--tw-translate-y': '-1.5rem' } as unknown as CSSTransition;
            }
        }
    }, [isThisCategoryOpen, catId, id]);

    const [bgColorSwitch, setBgColorSwitch] = useState(false);
    useDebugButton(`Toggle Category BG Color Switch ${categoryTitle}`, () => setBgColorSwitch((state) => !state), !!categoryBackgroundColor);

    /* Change background color, possibly later also parts of header (and turn into a hook then?) */
    useEffect(() => {
        const docStyle = document.body.style;

        if (catId && bgColorSwitch) {
            if (isThisCategoryOpen) {
                if (categoryBackgroundColor) {
                    docStyle.setProperty('--bg-color', categoryBackgroundColor);
                } else {
                    docStyle.setProperty('--bg-color', themeBgDarker);
                }
            }
        } else {
            docStyle.setProperty('--bg-color', themeBgDarker);
        }
    }, [bgColorSwitch, catId, isThisCategoryOpen, categoryBackgroundColor]);

    return (
        <div
            ref={refCallback}
            className={classNames(
                'group/category color-red-500 pointer-events-auto relative flex size-full transform-gpu cursor-pointer flex-col items-center justify-center overflow-y-hidden transition-[background-color,margin,width,transform] duration-[50ms,500ms,500ms]',
                '[--color-active-bg:theme(colors.theme.primary.100)] [--color-inactive-bg:theme(colors.theme.primary.600)] [--color-main:theme(colors.theme.primary.300)] [--open-offset:theme(spacing.1)]',
                isThisCategoryOpen
                    ? '-ml-[--open-offset] !w-[calc(var(--checked-width)+(2*var(--open-offset)))] rounded-sm bg-[--color-active-bg] p-4'
                    : catId
                      ? 'w-[--checked-width] bg-[--color-inactive-bg] hover:bg-[--color-main]'
                      : 'w-[--unchecked-width] bg-[--color-main] hover:bg-[--color-active-bg]',
            )}
            onClick={() => {
                navigate(catId === id.toString() ? '/' : `/${id}`);
            }}
        >
            <div
                className={classNames(
                    '[--category-padding:theme(spacing.2)]',
                    'relative flex flex-col items-start justify-start overflow-hidden shadow-theme-primary-950',
                    isThisCategoryOpen ? 'size-full drop-shadow-lg' : '',
                )}
            >
                {/* Tab: */}
                <div
                    className={classNames(
                        'px-[calc(var(--category-padding)*2)] py-[--category-padding] transition-[margin-left,transform]',
                        isThisCategoryOpen
                            ? 'ml-0 translate-x-0 bg-[--color-main]'
                            : catId
                              ? 'ml-[50%] -translate-x-1/2'
                              : 'group-hover/category:bg-[--color-main] group-hover/category:drop-shadow-lg',
                    )}
                    style={{
                        ...paddingStyle_Memo,
                    }}
                >
                    <h1
                        className={classNames(
                            'relative z-20 m-auto transform-gpu select-none whitespace-nowrap font-protest-strike text-5xl leading-none transition-[transform,color] duration-300',
                            isThisCategoryOpen
                                ? 'text-theme-secondary-400'
                                : catId
                                  ? 'scale-90 text-theme-secondary-700 drop-shadow-lg group-hover/category:text-theme-secondary-400 group-hover/category:!duration-75'
                                  : 'text-theme-secondary-100 drop-shadow-lg group-hover/category:text-theme-secondary-400 group-hover/category:underline group-hover/category:!drop-shadow-none group-hover/category:!duration-75',
                        )}
                    >
                        {categoryTitle}
                    </h1>
                </div>

                {/* Testimonials &  etc: */}
                {isThisCategoryOpen && (
                    <div className='-mt-[--category-padding] flex size-full items-start justify-between overflow-hidden bg-[--color-main] px-[calc(var(--category-padding)*2)] py-[--category-padding]'>
                        <div
                            className={classNames(
                                '[--scrollbar-width:6px]',
                                'relative flex min-w-[25%] basis-1/4 items-end border-theme-neutral-50 bg-[--color-main] pt-[--category-padding] transition-[height,border-color] duration-500',
                                isThisCategoryOpen
                                    ? 'bg-[--color-main]'
                                    : catId
                                      ? 'h-0 clip-inset-y-1/2'
                                      : 'border-l-4 border-theme-secondary-600/0 clip-inset-y-1/2 group-hover/category:border-theme-secondary-600 group-hover/category:!duration-100 group-hover/category:clip-inset-y-2/5',
                            )}
                        >
                            <div
                                className={classNames(
                                    'relative z-10 select-none text-pretty font-besley text-xl text-theme-accent-400 transition-transform duration-300',
                                    isThisCategoryOpen ? 'translate-x-0 delay-500 duration-300' : '-translate-x-[200%] delay-0 duration-0',
                                )}
                            >
                                <Markdown className='mrkdwn'>{categoryBlurb}</Markdown>
                            </div>
                        </div>

                        <div className='h-full flex-1 overflow-x-hidden'>
                            <PostCards posts={posts} />
                        </div>
                    </div>
                )}
            </div>

            {/* Background Svg: */}
            <div
                className={classNames(
                    'absolute left-0 top-0 -z-10 aspect-square w-full fill-theme-accent-200 stroke-theme-accent-400 object-cover text-2xl mask-edges-12',
                    isThisCategoryOpen ? 'opacity-20' : 'opacity-10 group-hover/category:opacity-15',
                )}
            >
                <BackgroundSvg />
            </div>
        </div>
    );
};

/** Used in Content.tsx */
export const MenuOpenedPost: FC<{
    hasImages: boolean;
    codeLink: Post['codeLink'];
    setLightboxTo: React.Dispatch<React.SetStateAction<number | null>>;
    classNames?: string;
}> = ({ hasImages, codeLink, setLightboxTo, classNames }) => {
    const navigate = useNavigate();

    return (
        <div className={`pointer-events-auto ml-auto flex h-6 justify-end space-x-1 ${classNames}`}>
            {hasImages && (
                <button
                    type='button'
                    className='cursor-pointer bg-theme-primary-500 px-2 py-0.5 text-sm uppercase transition-colors duration-75 before:absolute before:-top-full before:right-0 before:-z-10 before:translate-y-full before:pt-1 before:leading-none before:text-theme-secondary-50 before:transition-transform before:duration-100 first:rounded-tl last:rounded-tr hover:bg-theme-primary-200 hover:before:translate-y-0 hover:before:content-["Gallery"]'
                    onClick={() => setLightboxTo(0)}
                >
                    <PhotoIcon className='aspect-square h-full stroke-theme-accent-600 hover:stroke-theme-accent-800' />
                </button>
            )}

            {codeLink && (
                <a
                    className='group inline-block cursor-pointer bg-theme-primary-500 px-2 py-0.5 transition-colors duration-75 before:absolute before:-top-full before:right-0 before:-z-10 before:translate-y-full before:pt-1 before:text-sm before:uppercase before:leading-none before:text-theme-secondary-50 before:transition-transform before:duration-100 after:content-none first:rounded-tl last:rounded-tr hover:bg-theme-primary-200 hover:no-underline hover:before:translate-y-0 hover:before:content-["View_Code"]'
                    href={codeLink.href}
                    target='_blank'
                    rel='noreferrer'
                >
                    <CodeBracketSquareIcon className='aspect-square h-full stroke-theme-accent-600 hover:stroke-theme-accent-800' />
                    <span className='absolute right-4 top-full z-50 mt-2 -translate-y-full cursor-default whitespace-nowrap text-right text-sm leading-tight text-theme-primary-50 transition-[transform,clip-path] delay-200 duration-500 clip-inset-t-full group-hover:translate-y-0 group-hover:clip-inset-t-0'>
                        {codeLink.alt}
                    </span>
                </a>
            )}

            {/* TODO fade out instead of instantly closing */}
            <button
                type='button'
                className='cursor-pointer bg-theme-primary-500 p-0.5 text-sm uppercase transition-colors duration-75 before:absolute before:-top-full before:right-0 before:-z-10 before:translate-y-full before:pt-1 before:leading-none before:text-theme-secondary-50 before:transition-transform before:duration-100 first:rounded-tl last:rounded-tr hover:bg-theme-primary-200 hover:before:translate-y-0 hover:before:content-["Close"]'
                onClick={() => {
                    navigate(-1);
                }}
            >
                <XMarkIcon className='aspect-square h-full stroke-theme-accent-600 hover:stroke-theme-accent-800' />
            </button>
        </div>
    );
};
