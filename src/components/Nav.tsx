import { useZustand } from '../lib/zustand';
import { DataBase, Post, MENUTARGET, menuTargetArray } from '../types/types';
import classNames from '../lib/classNames';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import testDb from '../queries/testDb.json';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.ts';
import { PostCards } from './PostCards.tsx';
import { useDebugButton } from '../hooks/useDebugButton.ts';

const themeBgBase = resolveConfig(tailwindConfig).theme.colors.theme.bg.base;
const testDbTyped = testDb as DataBase;

const store_categoryOpened = useZustand.getState().methods.store_categoryOpened;

const Nav = () => {
    const activePost = useZustand((state) => state.nav.activePost);
    const categoryOpened = useZustand((state) => state.nav.categoryOpened);
    const openedIndex = useMemo(() => {
        if (categoryOpened) {
            const index = menuTargetArray.indexOf(categoryOpened);
            return index >= 0 ? index : null;
        } else {
            return null;
        }
    }, [categoryOpened]);

    return (
        <nav id='nav-cards-wrapper' className={classNames('flex min-h-168 flex-col items-center', activePost ? 'justify-between' : 'justify-center')}>
            {/* Top Bar: */}
            <div
                className={classNames(
                    'h-1 transition-[width,background-color,margin] duration-500',
                    categoryOpened ? 'mb-4' : 'mb-2',
                    activePost ? 'w-screen bg-theme-primary-500' : 'w-full bg-theme-secondary-400',
                )}
            />

            {/* Category Cards: */}
            <div
                className={classNames(
                    'grid transition-[width,grid-template-columns,column-gap] duration-700',
                    categoryOpened ? 'nav-checked-width gap-x-0.5' : 'nav-unchecked-width gap-x-1',
                )}
                style={{
                    gridTemplateColumns: menuTargetArray.map((target) => (target === categoryOpened ? '15fr' : '1fr')).join(' '),
                }}
            >
                {menuTargetArray.map((menuTarget, idx) => (
                    <CategoryCard
                        key={menuTarget + idx}
                        cardCategory={menuTarget}
                        cardData={testDbTyped[menuTarget]}
                        categoryIndex={idx}
                        openedIndex={openedIndex}
                    />
                ))}
            </div>

            {/* Top Bar: */}
            <div
                className={classNames(
                    'h-1 transition-[width,background-color,margin] duration-500',
                    categoryOpened ? 'mt-4' : 'mt-2',
                    activePost ? 'w-screen bg-theme-primary-500' : 'w-full bg-theme-secondary-400',
                )}
            />
        </nav>
    );
};

export default Nav;

const CategoryCard: FC<{
    cardCategory: MENUTARGET;
    openedIndex: number | null;
    cardData: DataBase[MENUTARGET];
    categoryIndex: number;
}> = ({ cardCategory, openedIndex, cardData, categoryIndex }) => {
    const { posts, categoryCardBackgroundImage, categoryBackgroundColor } = cardData;
    const categoryOpened = useZustand((state) => state.nav.categoryOpened);

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

    const isThisCategoryOpen = useMemo(() => categoryOpened === cardCategory, [categoryOpened, cardCategory]);
    const paddingStyle_Memo = useMemo(() => {
        if (categoryOpened && !isThisCategoryOpen) {
            if (categoryIndex < openedIndex!) {
                return { paddingRight: 0 };
            } else if (categoryIndex > openedIndex!) {
                return { paddingLeft: 0 };
            }
        }
    }, [isThisCategoryOpen, openedIndex, categoryOpened, categoryIndex]);

    const [bgColorSwitch, setBgColorSwitch] = useState(false);
    useDebugButton(`Toggle Category BG Color Switch ${cardCategory}`, () => setBgColorSwitch((state) => !state), !!categoryBackgroundColor);

    /* Change background color, possibly later also parts of header (and turn into a hook then?) */
    useEffect(() => {
        const docStyle = document.body.style;

        if (categoryOpened && bgColorSwitch) {
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
    }, [bgColorSwitch, categoryOpened, isThisCategoryOpen, categoryBackgroundColor]);

    return (
        <div
            ref={refCb}
            /* NOTE Fixed Widths (opened) of Category Card here! */
            className={classNames(
                'group/category pointer-events-auto relative flex h-156 w-full cursor-pointer items-end justify-between gap-x-4 overflow-hidden p-6 transition-[background-color,margin,height] duration-[50ms,500ms,500ms]',
                isThisCategoryOpen
                    ? '-my-2 h-160 bg-theme-primary-300'
                    : categoryOpened
                      ? 'bg-theme-primary-600 hover:bg-theme-primary-500'
                      : 'bg-theme-primary-600 hover:bg-theme-primary-200',
            )}
            onClick={() => store_categoryOpened(isThisCategoryOpen ? null : cardCategory)}
            style={{
                ...paddingStyle_Memo,
                // Both removed after initial mount:
                display: 'none',
                opacity: 0,
            }}
        >
            <h1
                className={classNames(
                    'writing-mode-vert-lr mx-auto rotate-180 select-none whitespace-nowrap font-protest-riot text-5xl leading-none drop-shadow-lg transition-[transform,color] duration-300',
                    isThisCategoryOpen
                        ? 'text-theme-secondary-400'
                        : categoryOpened
                          ? 'translate-y-0 text-theme-secondary-700 group-hover/category:text-theme-secondary-400 group-hover/category:!duration-0'
                          : 'translate-y-0 text-theme-secondary-100 group-hover/category:text-theme-secondary-400 group-hover/category:!duration-0',
                )}
            >
                {cardCategory}
            </h1>

            {isThisCategoryOpen && (
                <>
                    {/* Testimonials etc: */}
                    <div className='h-full flex-1 overflow-hidden border-l-[6px] border-theme-neutral-50'>
                        <div className='size-full bg-cover mask-edges-30' style={{ backgroundImage: `url('${categoryCardBackgroundImage}')` }} />
                    </div>

                    <PostCards posts={posts} />
                </>
            )}
        </div>
    );
};

const store_activePost = useZustand.getState().methods.store_activePost;

/** Used in Content.tsx */
export const MenuOpenedPost: FC<{
    hasImages: boolean;
    codeLink: Post['codeLink'];
    setLightboxTo: React.Dispatch<React.SetStateAction<number | null>>;
}> = ({ hasImages, codeLink, setLightboxTo }) => {
    return (
        <div className='absolute w-full -translate-y-full pb-0.5'>
            <div className='nav-checked-width mx-auto flex h-6 justify-end space-x-1'>
                {hasImages && (
                    <button
                        type='button'
                        className='cursor-pointer border-4 border-b-0 border-theme-primary-500 bg-theme-primary-500 px-2 text-sm uppercase leading-none text-theme-accent-600 transition-colors duration-200 first:rounded-tl last:rounded-tr hover:bg-theme-primary-200 hover:text-theme-accent-800'
                        onClick={() => setLightboxTo(0)}
                    >
                        Gallery
                    </button>
                )}

                {codeLink && (
                    <button
                        type='button'
                        className='group cursor-pointer border-4 border-b-0 border-theme-primary-500 bg-theme-primary-500 px-2 text-sm uppercase leading-none text-theme-accent-600 transition-colors duration-200 first:rounded-tl last:rounded-tr hover:bg-theme-primary-200 hover:text-theme-accent-800'
                    >
                        <a
                            className='text-[inherit] before:content-none after:content-none hover:no-underline'
                            href={codeLink.href}
                            target='_blank'
                            rel='noreferrer'
                        >
                            View Code
                            <span className='absolute right-0 z-50 mt-2 hidden whitespace-nowrap text-right text-sm group-hover:block'>
                                Link goes to {codeLink.alt} <br /> bla bla explanatory <br /> new window/tab
                            </span>
                        </a>
                    </button>
                )}

                {/* TODO fade out instead of instantly closing */}
                <button
                    type='button'
                    className='cursor-pointer border-4 border-b-0 border-theme-primary-500 bg-theme-primary-500 px-2 text-sm uppercase leading-none text-theme-accent-600 transition-colors duration-200 first:rounded-tl last:rounded-tr hover:bg-theme-primary-200 hover:text-theme-accent-800'
                    onClick={() => store_activePost(null)}
                >
                    X
                </button>
            </div>
        </div>
    );
};
