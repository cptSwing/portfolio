import { useZustand } from '../lib/zustand';
import { DataBase, Post, MENUTARGET, menuTargetArray } from '../types/types';
import classNames from '../lib/classNames';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import testDb from '../queries/testDb.json';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.ts';
import { PostCards } from './PostCards.tsx';
import { useDebugButton } from '../hooks/useDebugButton.ts';

const paletteUtilityBg = resolveConfig(tailwindConfig).theme.colors.palette.utility.bg;
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
        <nav id='nav-cards-wrapper' className='flex flex-col items-center justify-start'>
            {/* Top Bar: */}
            <div
                className={classNames(
                    'relative mb-4 flex h-0.5 justify-center transition-[width,background-color] duration-300',
                    activePost ? 'w-screen bg-palette-primary-50' : 'w-full bg-palette-primary-300',
                )}
            />

            {/* Category Cards: */}
            <div
                className={classNames(
                    'grid transition-[width,grid-template-columns,column-gap] duration-1000',
                    categoryOpened ? 'nav-checked-width gap-x-px' : 'nav-unchecked-width gap-x-1',
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

    const [divMounted, setDivMounted] = useState(false);

    const refCb = useCallback(
        (elem: HTMLDivElement | null) => {
            if (elem) {
                setTimeout(() => {
                    /* Mount sequentially for staggered dropdown */
                    setDivMounted(true);
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
                    docStyle.setProperty('--bg-color', paletteUtilityBg);
                }
            }
        } else {
            docStyle.setProperty('--bg-color', paletteUtilityBg);
        }
    }, [bgColorSwitch, categoryOpened, isThisCategoryOpen, categoryBackgroundColor]);

    return (
        <div
            ref={refCb}
            /* NOTE Fixed Widths (opened) of Category Card here! */
            className={classNames(
                'group/category pointer-events-auto relative flex size-full cursor-pointer items-end justify-between gap-x-4 overflow-hidden p-6 delay-200 duration-1000 [transition:height_750ms,transform_50ms] after:z-20 hover:scale-y-[1.01] hover:transition-transform hover:!delay-0 hover:duration-100',
                divMounted ? 'h-156' : 'h-24',
                isThisCategoryOpen
                    ? 'after:nav-card-corners z-50 scale-y-[1.01] bg-palette-primary-300'
                    : 'scale-y-100 bg-palette-primary-400 saturate-50 hover:bg-palette-primary-300 hover:saturate-100',
                // 'bg-palette-neutral-400',
            )}
            onClick={() => store_categoryOpened(isThisCategoryOpen ? null : cardCategory)}
            style={paddingStyle_Memo}
        >
            <h1
                className={classNames(
                    'select-none whitespace-nowrap font-protest-riot text-5xl drop-shadow-md transition-[opacity,transform] duration-300 group-hover/category:text-palette-neutral-400',
                    'writing-mode-vert-lr rotate-180',
                    isThisCategoryOpen ? '-translate-y-full text-palette-neutral-400' : 'translate-y-0 text-palette-accent-700',
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
        <div className='absolute w-full -translate-y-full pb-[2px] leading-none'>
            <div className='nav-checked-width mx-auto flex h-6 justify-end space-x-1 text-palette-primary-600'>
                {hasImages && (
                    <button
                        type='button'
                        className='cursor-pointer bg-palette-primary-50 px-2 py-1 hover:bg-palette-primary-50/50'
                        onClick={() => setLightboxTo(0)}
                    >
                        Gallery
                    </button>
                )}

                {codeLink && (
                    <button type='button' className='group block cursor-pointer bg-palette-primary-50 px-2 py-1 hover:bg-palette-primary-50/50'>
                        <a className='' href={codeLink.href} target='_blank' rel='noreferrer'>
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
                    className='aspect-square w-fit cursor-pointer bg-palette-primary-50 hover:bg-palette-primary-100/50'
                    onClick={() => store_activePost(null)}
                >
                    X
                </button>
            </div>
        </div>
    );
};
