import { useZustand } from '../lib/zustand';
import { DataBase, Post } from '../types/types';
import classNames from '../lib/classNames';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import testDb from '../queries/testDb.json';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.ts';
import { PostCards } from './PostCards.tsx';
import { useDebugButton } from '../hooks/useDebugButton.ts';
import { MENU_CATEGORY } from '../types/enums.ts';
import Markdown from 'react-markdown';
import { CodeBracketSquareIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';

const themeBgBase = resolveConfig(tailwindConfig).theme.colors.theme.bg.base;
const testDbTyped = testDb as DataBase;

const store_activeCategory = useZustand.getState().methods.store_activeCategory;

const MENU_CATEGORY_values = Object.values(MENU_CATEGORY);

const Nav = () => {
    const activeCategory = useZustand((state) => state.nav.activeCategory);
    const activePost = useZustand((state) => state.nav.activePost);

    const openedIndex = useMemo(() => {
        if (activeCategory) {
            const index = MENU_CATEGORY_values.indexOf(activeCategory);
            return index >= 0 ? index : null;
        } else {
            return null;
        }
    }, [activeCategory]);

    return (
        <nav
            className={classNames(
                'mx-auto grid h-full transition-[width,grid-template-columns,column-gap] duration-700',
                activeCategory ? 'nav-checked-width gap-x-px' : 'nav-unchecked-width gap-x-1',
                activePost ? 'absolute left-0 right-0 -z-10' : 'z-0 block',
            )}
            style={{
                gridTemplateColumns: MENU_CATEGORY_values.map((target) => (target === activeCategory ? '15fr' : '1fr')).join(' '),
            }}
        >
            {MENU_CATEGORY_values.map((MENU_CATEGORY, idx) => (
                <CategoryCard
                    key={MENU_CATEGORY + idx}
                    cardCategory={MENU_CATEGORY}
                    cardData={testDbTyped[MENU_CATEGORY]}
                    categoryIndex={idx}
                    openedIndex={openedIndex}
                />
            ))}
        </nav>
    );
};

export default Nav;

const CategoryCard: FC<{
    cardCategory: MENU_CATEGORY;
    openedIndex: number | null;
    cardData: DataBase[MENU_CATEGORY];
    categoryIndex: number;
}> = ({ cardCategory, openedIndex, cardData, categoryIndex }) => {
    const { posts, categoryCardBackgroundImage, categoryBackgroundColor, categoryBlurb } = cardData;
    const activeCategory = useZustand((state) => state.nav.activeCategory);

    const refCb = useCallback(
        (elem: HTMLDivElement | null) => {
            if (elem) {
                setTimeout(() => {
                    /* Mount sequentially for staggered dropdown */
                    elem.style.removeProperty('display');
                    elem.style.setProperty('animation', '2s 1s forwards streak-down');
                    elem.addEventListener('animationend', () => {
                        elem.style.removeProperty('animation');
                        elem.style.removeProperty('opacity');
                    });
                }, 500 * categoryIndex);
            }
        },
        [categoryIndex],
    );

    const isThisCategoryOpen = useMemo(() => activeCategory === cardCategory, [activeCategory, cardCategory]);
    const paddingStyle_Memo = useMemo(() => {
        if (activeCategory && !isThisCategoryOpen) {
            if (categoryIndex < openedIndex!) {
                return { paddingRight: 0 };
            } else if (categoryIndex > openedIndex!) {
                return { paddingLeft: 0 };
            }
        }
    }, [isThisCategoryOpen, openedIndex, activeCategory, categoryIndex]);

    const [bgColorSwitch, setBgColorSwitch] = useState(false);
    useDebugButton(`Toggle Category BG Color Switch ${cardCategory}`, () => setBgColorSwitch((state) => !state), !!categoryBackgroundColor);

    /* Change background color, possibly later also parts of header (and turn into a hook then?) */
    useEffect(() => {
        const docStyle = document.body.style;

        if (activeCategory && bgColorSwitch) {
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
    }, [bgColorSwitch, activeCategory, isThisCategoryOpen, categoryBackgroundColor]);

    return (
        <div
            ref={refCb}
            /* NOTE Fixed Widths (opened) of Category Card here! */
            className={classNames(
                'group/category pointer-events-auto relative flex transform-gpu cursor-pointer items-end justify-between gap-x-4 overflow-hidden p-6 transition-[background-color,margin,transform] duration-[50ms,500ms,500ms]',
                isThisCategoryOpen
                    ? '!scale-y-100 bg-theme-primary-300'
                    : activeCategory
                      ? 'scale-y-[.99] bg-theme-primary-600 hover:bg-theme-primary-500'
                      : 'scale-y-100 bg-theme-primary-600 hover:bg-theme-primary-200',
            )}
            onClick={() => store_activeCategory(isThisCategoryOpen ? null : cardCategory)}
            style={{
                ...paddingStyle_Memo,
                // Both removed after initial mount:
                display: 'none',
                opacity: 0,
            }}
        >
            <h1
                className={classNames(
                    'writing-mode-vert-lr mx-auto -mb-1 rotate-180 transform-gpu select-none whitespace-nowrap font-protest-riot text-5xl leading-none drop-shadow-lg transition-[transform,color] duration-300',
                    isThisCategoryOpen
                        ? 'text-theme-secondary-400'
                        : activeCategory
                          ? 'translate-y-0 scale-90 text-theme-secondary-700 group-hover/category:text-theme-secondary-400 group-hover/category:!duration-0'
                          : 'translate-y-0 text-theme-secondary-100 group-hover/category:text-theme-secondary-400 group-hover/category:!duration-0',
                )}
            >
                {cardCategory}
            </h1>

            {/* Testimonials etc: */}
            <div
                className={classNames(
                    'relative -my-2 flex basis-1/2 items-end overflow-hidden border-l-[6px] border-theme-neutral-50 transition-[height] duration-300',
                    isThisCategoryOpen ? 'h-full' : activeCategory ? 'h-0' : 'h-0 group-hover/category:!h-1/4',
                )}
            >
                <div
                    className={classNames(
                        'z-10 select-none text-pretty px-4 font-besley text-4xl italic text-theme-accent-400 transition-transform duration-300',
                        isThisCategoryOpen ? 'translate-x-0 delay-500 duration-300' : '-translate-x-[200%] delay-0 duration-0',
                    )}
                >
                    <Markdown className='mrkdwn'>{categoryBlurb}</Markdown>
                </div>
                <div className='absolute opacity-10 mask-edges-24'>
                    <div className='bg-cover' style={{ backgroundImage: `url('${categoryCardBackgroundImage}')` }} />
                </div>
            </div>

            {isThisCategoryOpen && <PostCards posts={posts} />}
        </div>
    );
};

const store_activePost = useZustand.getState().methods.store_activePost;

/** Used in Content.tsx */
export const MenuOpenedPost: FC<{
    hasImages: boolean;
    codeLink: Post['codeLink'];
    setLightboxTo: React.Dispatch<React.SetStateAction<number | null>>;
    classNames?: string;
}> = ({ hasImages, codeLink, setLightboxTo, classNames }) => {
    return (
        <div className={`pointer-events-auto absolute flex h-6 justify-end space-x-1 ${classNames}`}>
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
                onClick={() => store_activePost(null)}
            >
                <XMarkIcon className='aspect-square h-full stroke-theme-accent-600 hover:stroke-theme-accent-800' />
            </button>
        </div>
    );
};
