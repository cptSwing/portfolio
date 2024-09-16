import { useZustand } from '../lib/zustand';
import { DataBase, Post, MENUTARGET, menuTargetArray } from '../types/types';
import classNames from '../lib/classNames';
import { CSSProperties, FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntersectionObserver, useIsFirstRender } from '@uidotdev/usehooks';
import testDb from '../queries/testDb.json';
import { useTransition } from 'transition-hook';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.ts';
import parseDateString from '../lib/parseDateString.ts';

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
                    gridTemplateColumns: `${menuTargetArray
                        .map((target) => {
                            if (categoryOpened) {
                                return target === categoryOpened ? '15fr' : '1fr';
                            } else return '1fr';
                        })
                        .join(' ')}`,
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

    /* Change background color, possibly later also parts of header (and turn into a hook then?) */
    useEffect(() => {
        const docStyle = document.body.style;

        if (categoryOpened) {
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
    }, [categoryOpened, isThisCategoryOpen, categoryBackgroundColor]);

    return (
        <div
            ref={refCb}
            /* NOTE Fixed Widths (opened) of Category Card here! */
            className={classNames(
                'group/category pointer-events-auto relative cursor-pointer overflow-hidden shadow-md delay-200 duration-1000 [transition:height_1s,transform_50ms] after:z-20 hover:scale-y-[1.01] hover:shadow-md hover:transition-transform hover:!delay-0 hover:duration-100',
                divMounted ? 'h-156' : 'h-24',
                isThisCategoryOpen ? 'after:nav-card-corners z-50 scale-y-[1.01]' : 'scale-y-100',
            )}
            onClick={() => store_categoryOpened(isThisCategoryOpen ? null : cardCategory)}
        >
            <div
                className={classNames('pointer-events-auto flex size-full items-end justify-between gap-x-4 bg-palette-neutral-400 p-6')}
                style={(() => {
                    if (categoryOpened && !isThisCategoryOpen) {
                        if (categoryIndex < openedIndex!) {
                            return { paddingRight: 0 };
                        } else if (categoryIndex > openedIndex!) {
                            return { paddingLeft: 0 };
                        }
                    }
                })()}
            >
                <h1
                    className={classNames(
                        'select-none whitespace-nowrap font-protest-riot text-5xl transition-[opacity,transform] duration-300 group-hover/category:text-palette-primary-500',
                        'writing-mode-vert-lr rotate-180',
                        isThisCategoryOpen ? '-translate-y-full text-palette-primary-500' : 'translate-y-0 text-palette-primary-900',
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
        </div>
    );
};

const store_activePost = useZustand.getState().methods.store_activePost;

const PostCards: FC<{
    posts: Post[];
}> = ({ posts }) => {
    return (
        <div className='scroll-gutter h-full w-1/2 -scale-x-100 overflow-y-auto overflow-x-hidden scrollbar-thin'>
            <div className='pointer-events-none flex -scale-x-100 flex-col space-y-3 pl-2'>
                {posts.map((post, idx) => (
                    <SinglePostCard key={post.title + idx} post={post} delay={100 * idx} />
                ))}
            </div>
        </div>
    );
};

const SinglePostCard: FC<{
    post: Post;
    delay: number;
}> = ({ post, delay }) => {
    const { title, titleCardBg, subTitle, date } = post;
    const { year } = parseDateString(date);

    const [intersectionRefCb, entry] = useIntersectionObserver({
        threshold: 0,
        rootMargin: '0px',
    });

    const isFirstRender = useIsFirstRender();

    useEffect(() => {
        console.log('%c[Nav]', 'color: #b75afb', `isFirstRender, delay :`, isFirstRender, delay);
    }, [isFirstRender, delay]);

    return (
        <div
            // ref={cardRefCb}
            ref={intersectionRefCb}
            style={{ transitionDelay: isFirstRender ? `${delay}ms` : '' }}
            /* NOTE Post Card width & height set here: */
            className={classNames(
                'group/this pointer-events-auto relative w-full min-w-116 cursor-pointer overflow-hidden border-4 border-palette-primary-200 shadow transition-[transform,opacity,background-color]',
                'before:absolute before:size-full before:outline before:outline-2 before:-outline-offset-8 before:outline-transparent before:transition-[outline-color,outline-offset,outline-width] hover:before:outline-palette-neutral-50',
                'hover:border-palette-accent-200',
                'after:absolute after:bottom-2 after:left-1/2 after:w-[calc(100%-theme(spacing.4))] after:-translate-x-1/2 after:truncate after:bg-transparent after:px-2 after:text-center after:text-sm after:text-palette-primary-900 after:transition-[background-color,opacity,color] after:content-[attr(data-content-after)] hover:after:bg-palette-neutral-50 hover:after:text-palette-accent-100',
                // hasMounted ? 'block' : 'hidden',
                entry?.isIntersecting ? 'translate-x-0 opacity-100' : 'translate-x-[80%] opacity-25',
                titleCardBg ? 'h-52' : 'h-24',
            )}
            data-content-after={subTitle ?? 'lol no subtitle here'}
            onClick={() => store_activePost(post)}
        >
            <div className='relative mx-auto mt-2 w-fit max-w-[calc(100%-(8px*2))] px-1 text-center text-palette-neutral-50 before:absolute before:-z-30 before:size-full before:-translate-x-1/2 before:bg-palette-neutral-500/75 before:transition-[background-color] group-hover/this:text-palette-accent-500 group-hover/this:before:bg-palette-neutral-50'>
                <h3>{title}</h3>
            </div>

            <div className='absolute bottom-0 right-0 z-10 h-full w-1/5'>
                <div className='absolute bottom-0 right-0 origin-bottom translate-x-1/2 translate-y-0 -rotate-45 transform-gpu bg-red-950 px-[100%] pb-[20%] pt-px text-center leading-none group-hover/this:translate-x-[200%] group-hover/this:translate-y-[200%]'>
                    {year}
                </div>
            </div>
            {titleCardBg && (
                <div
                    className='fixed bottom-0 left-0 right-0 top-0 -z-50 h-full w-auto scale-100 transform-gpu bg-cover transition-transform delay-[3000ms] duration-700 group-hover/this:!scale-110 group-hover/this:delay-0 group-hover/this:duration-[3000ms]'
                    style={{ backgroundImage: `url('${titleCardBg}')` }}
                />
            )}
        </div>
    );
};

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
