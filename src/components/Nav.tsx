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
        <nav id='nav-cards-wrapper' className={classNames('min-h-168 flex flex-col items-center', activePost ? 'justify-between' : 'justify-center')}>
            {/* Top Bar: */}
            <div
                className={classNames(
                    'h-1 transition-[width,background-color,margin] duration-500',
                    categoryOpened ? 'mb-4' : 'mb-2',
                    activePost ? 'bg-theme-primary-500 w-screen' : 'bg-theme-secondary-400 w-full',
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
                    activePost ? 'bg-theme-primary-500 w-screen' : 'bg-theme-secondary-400 w-full',
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
                'group/category pointer-events-auto relative flex w-full cursor-pointer items-end justify-between gap-x-4 overflow-hidden p-6 transition-[margin,height] duration-500',
                isThisCategoryOpen ? 'bg-theme-primary-200 z-50 -my-2 h-160' : 'bg-theme-primary-400 hover:bg-theme-primary-300 h-156',
            )}
            onClick={() => store_categoryOpened(isThisCategoryOpen ? null : cardCategory)}
            style={{ ...paddingStyle_Memo, display: 'none', opacity: 0 }}
        >
            <h1
                className={classNames(
                    'writing-mode-vert-lr rotate-180 select-none whitespace-nowrap font-protest-riot text-5xl drop-shadow-lg transition-[transform,color] duration-300',
                    isThisCategoryOpen
                        ? 'text-theme-accent-400 -translate-y-full'
                        : 'text-theme-accent-600 group-hover/category:text-theme-accent-500 translate-y-0',
                )}
            >
                {cardCategory}
            </h1>

            {isThisCategoryOpen && (
                <>
                    {/* Testimonials etc: */}
                    <div className='h-full flex-1 overflow-hidden border border-green-100/20'>
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
                        className='bg-theme-primary-500 text-theme-accent-600 hover:text-theme-accent-800 hover:bg-theme-primary-200 border-theme-primary-500 cursor-pointer border-4 border-b-0 px-2 text-sm uppercase leading-none transition-colors duration-200 first:rounded-tl last:rounded-tr'
                        onClick={() => setLightboxTo(0)}
                    >
                        Gallery
                    </button>
                )}

                {codeLink && (
                    <button
                        type='button'
                        className='bg-theme-primary-500 text-theme-accent-600 hover:text-theme-accent-800 hover:bg-theme-primary-200 border-theme-primary-500 group cursor-pointer border-4 border-b-0 px-2 text-sm uppercase leading-none transition-colors duration-200 first:rounded-tl last:rounded-tr'
                    >
                        <a className='text-[inherit]' href={codeLink.href} target='_blank' rel='noreferrer'>
                            {codeLink.alt}
                            <span className='absolute right-0 z-50 mt-2 hidden whitespace-nowrap text-right text-sm group-hover:block'>
                                Link goes to {codeLink.alt} <br /> bla bla explanatory <br /> new window/tab
                            </span>
                        </a>
                    </button>
                )}

                {/* TODO fade out instead of instantly closing */}
                <button
                    type='button'
                    className='bg-theme-primary-500 text-theme-accent-600 hover:text-theme-accent-800 hover:bg-theme-primary-200 border-theme-primary-500 cursor-pointer border-4 border-b-0 px-2 text-sm uppercase leading-none transition-colors duration-200 first:rounded-tl last:rounded-tr'
                    onClick={() => store_activePost(null)}
                >
                    X
                </button>
            </div>
        </div>
    );
};
