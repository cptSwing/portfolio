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

const themeBgBase = resolveConfig(tailwindConfig).theme.colors.theme.bg.base;
const testDbTyped = testDb as DataBase;
const categoriesArray = Object.values(testDbTyped);

const Nav = () => {
    const { catId, postId } = useParams();

    return (
        <nav
            className={classNames(
                'mx-auto grid h-full transition-[width,grid-template-columns,column-gap] duration-500',
                catId ? 'nav-checked-width gap-x-px' : 'nav-unchecked-width gap-x-1',
                postId ? 'absolute left-0 right-0 -z-10' : 'z-0 block',
            )}
            style={{
                gridTemplateColumns: categoriesArray.map(({ id }) => (id.toString() === catId ? '15fr' : '1fr')).join(' '),
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
                return { paddingRight: 0 };
            } else if (id > openedIndex!) {
                return { paddingLeft: 0 };
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
                    docStyle.setProperty('--bg-color', themeBgBase);
                }
            }
        } else {
            docStyle.setProperty('--bg-color', themeBgBase);
        }
    }, [bgColorSwitch, catId, isThisCategoryOpen, categoryBackgroundColor]);

    return (
        <div
            ref={refCallback}
            className={classNames(
                'group/category color-red-500 pointer-events-auto relative flex h-full transform-gpu cursor-pointer items-center justify-between gap-x-4 overflow-hidden p-6 transition-[background-color,margin,transform] duration-[50ms,500ms,500ms]',
                '[--outline-width:8px]',
                isThisCategoryOpen
                    ? 'bg-theme-primary-300'
                    : catId
                      ? 'scale-y-[.99] bg-theme-primary-600 hover:bg-theme-primary-500'
                      : 'bg-theme-primary-600 hover:bg-theme-primary-200',
            )}
            onClick={() => {
                navigate(catId === id.toString() ? '/' : `/${id}`);
            }}
            style={{
                ...paddingStyle_Memo,
            }}
        >
            <div className='relative flex h-full flex-col items-start justify-start'>
                <div className={classNames('transition-[flex]', isThisCategoryOpen ? 'flex-1' : 'flex-none')} />
                <div
                    className={classNames(
                        'relative m-auto outline-[length:--outline-width] outline-theme-primary-300 transition-[box-shadow,outline-width]',
                        'before:absolute before:-z-10 before:shadow-theme-primary-950 before:outline-[length:--outline-width] before:outline-theme-primary-300 before:transition-[width,height] before:delay-300',
                        'after:absolute after:-left-[--outline-width] after:-top-[--outline-width] after:z-10 after:shadow-theme-primary-100 after:transition-[width,height]',
                        isThisCategoryOpen
                            ? // Cast shadow with slightly wider element so there is no visible break between this and sibling element's shadows
                              'outline before:h-full before:w-[calc(100%+(4*var(--outline-width)))] before:shadow-lg before:outline after:h-full after:w-[calc(100%+(2*var(--outline-width)))] after:shadow-top-rim-lg'
                            : 'before:size-0 after:size-0',
                    )}
                >
                    {/* Cover siblings box-shadow: */}
                    {isThisCategoryOpen && (
                        <div className='absolute z-10 size-full bg-theme-primary-300 outline outline-[length:--outline-width] outline-theme-primary-300' />
                    )}
                    <h1
                        className={classNames(
                            'writing-mode-vert-lr relative z-20 rotate-180 transform-gpu select-none whitespace-nowrap font-protest-riot text-5xl leading-none transition-[transform,color] duration-300',
                            isThisCategoryOpen
                                ? 'text-theme-secondary-400'
                                : catId
                                  ? 'scale-90 text-theme-secondary-700 drop-shadow-lg group-hover/category:text-theme-secondary-400 group-hover/category:!duration-75'
                                  : 'text-theme-secondary-100 drop-shadow-lg group-hover/category:text-theme-secondary-400 group-hover/category:!drop-shadow-none group-hover/category:!duration-75',
                        )}
                    >
                        {categoryTitle}
                    </h1>
                </div>
            </div>

            {/* Testimonials etc: */}
            <div
                className={classNames(
                    '[--scrollbar-width:6px]',
                    'relative mr-6 flex h-full min-w-96 basis-1/2 items-end border-theme-neutral-50 bg-theme-primary-300 shadow-theme-primary-950 outline-[length:--outline-width] outline-theme-primary-300 transition-[height,border-color] duration-500',
                    'after:absolute after:-left-[calc(var(--outline-width)+var(--scrollbar-width))] after:-top-[--outline-width] after:z-50 after:size-0 after:shadow-theme-primary-100 after:transition-[width,height]',
                    isThisCategoryOpen
                        ? 'border-l-[length:--scrollbar-width] shadow-lg outline after:!h-full after:!w-[calc(100%+(2*var(--outline-width)+var(--scrollbar-width)))] after:shadow-top-rim-lg'
                        : catId
                          ? 'h-0 clip-inset-y-1/2'
                          : 'border-l-4 border-theme-secondary-600/0 clip-inset-y-1/2 group-hover/category:border-theme-secondary-600 group-hover/category:!duration-100 group-hover/category:clip-inset-y-2/5',
                )}
            >
                <div
                    className={classNames(
                        'z-10 select-none text-pretty px-4 font-besley text-4xl italic text-theme-accent-400 transition-transform duration-300 *:overflow-x-clip',
                        isThisCategoryOpen ? 'translate-x-0 delay-500 duration-300' : '-translate-x-[200%] delay-0 duration-0',
                    )}
                >
                    <Markdown className='mrkdwn'>{categoryBlurb}</Markdown>
                </div>

                {/* Background image */}
                {/* <div className='absolute size-full opacity-15 mask-edges-16'>
                    <div className='h-full bg-cover' style={{ backgroundImage: `url('${categoryCardBackgroundImage}')` }} />
                </div> */}
            </div>

            {isThisCategoryOpen && <PostCards posts={posts} />}

            <div className='absolute left-0 -z-10 aspect-square h-full fill-theme-accent-200 stroke-theme-accent-400 object-cover text-2xl opacity-30 mask-edges-4'>
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
