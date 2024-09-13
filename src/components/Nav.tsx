import { useZustand } from '../lib/zustand';
import { DataBase, Post, MENUTARGET, menuTargetArray } from '../types/types';
import classNames from '../lib/classNames';
import { CSSProperties, FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntersectionObserver } from '@uidotdev/usehooks';
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
                    'grid gap-x-px transition-[width,grid-template-columns] duration-1000',
                    categoryOpened ? 'nav-checked-width' : 'nav-unchecked-width',
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
                    <CategoryCard key={menuTarget + idx} cardCategory={menuTarget} cardData={testDbTyped[menuTarget]} categoryIndex={idx} />
                ))}
            </div>
        </nav>
    );
};

export default Nav;

const CategoryCard: FC<{
    cardCategory: MENUTARGET;
    cardData: DataBase[MENUTARGET];
    categoryIndex: number;
}> = ({ cardCategory, cardData, categoryIndex }) => {
    const { posts, categoryCardBackgroundImage, categoryBackgroundColor } = cardData;
    const categoryOpened = useZustand((state) => state.nav.categoryOpened);

    // WARN needed?
    const activePost = useZustand((state) => state.nav.activePost);

    const [divMounted, setDivMounted] = useState(false);

    const refCb = useCallback((elem: HTMLDivElement | null) => {
        let timer: number;
        if (elem) {
            timer = setTimeout(() => {
                /* Mount sequentially for staggered dropdown */
                setDivMounted(true);
                clearTimeout(timer);
            }, 500 * categoryIndex);
        }
    }, []);

    const thisCategoryOpen = useMemo(() => categoryOpened === cardCategory, [categoryOpened, cardCategory]);

    /* Change background color, possibly later also parts of header (and turn into a hook then?) */
    useEffect(() => {
        const docStyle = document.body.style;

        if (categoryOpened) {
            if (thisCategoryOpen) {
                if (categoryBackgroundColor) {
                    docStyle.setProperty('--bg-color', categoryBackgroundColor);
                } else {
                    docStyle.setProperty('--bg-color', paletteUtilityBg);
                }
            }
        } else {
            docStyle.setProperty('--bg-color', paletteUtilityBg);
        }
    }, [thisCategoryOpen, categoryBackgroundColor]);

    /**
     * Switches between stages 'leave' (default), 'from', and 'enter' (final stage, after that loops back to 'leave').
     * shouldMount is false at 'leave', true at enter
     * changing the element's key prop resets to 'from' after the 'leave' stage. This can be used as an initial point onMount, while the key should be left alone afterwards I guess?
     */
    const { stage, shouldMount } = useTransition(thisCategoryOpen, 500);

    return (
        <div
            key={`${shouldMount}`}
            ref={refCb}
            // style={{ zIndex: -1 * categoryIndex }}
            /* NOTE Fixed Widths (opened) of Category Card here! */
            className={classNames(
                'after:nav-card-corners pointer-events-auto relative cursor-pointer overflow-hidden shadow-md transition-[width,height] delay-75 duration-500 after:z-20 after:transition-[--corner-inset] after:duration-1000 hover:shadow-md',
                divMounted ? 'h-156' : 'h-24',
                stage === 'from' && 'border-8 border-green-500',
                stage === 'enter' && 'border border-yellow-500 !shadow-lg',
                stage === 'leave' && 'border border-red-500 !delay-0',

                thisCategoryOpen ? 'after:w-auto' : categoryOpened ? 'after:!left-[calc(var(--corner-inset)*-1)] after:w-full' : 'after:w-auto',
            )}
            onClick={() => store_categoryOpened(thisCategoryOpen ? null : cardCategory)}
        >
            <div
                className={classNames(
                    'group/category pointer-events-auto absolute left-0 top-0 flex size-full items-end justify-between gap-x-4 bg-palette-neutral-400 p-6 transition-[padding] duration-1000',
                    thisCategoryOpen ? 'p-6' : categoryOpened ? 'pl-0' : 'p-6',
                )}
            >
                <h1
                    className={classNames(
                        'select-none overflow-hidden text-clip whitespace-nowrap font-protest-riot text-5xl transition-[opacity,transform] group-hover/category:text-palette-primary-500',
                        'writing-mode-vert-lr rotate-180',
                        thisCategoryOpen ? '-translate-y-full text-palette-primary-500' : 'translate-y-0 text-palette-primary-900',
                    )}
                >
                    {cardCategory}
                </h1>

                {shouldMount && (
                    <>
                        {/* Testimonials etc: */}
                        <div className='h-full flex-1 overflow-hidden border border-green-100/20'>
                            <div className='size-full bg-cover mask-edges-30' style={{ backgroundImage: `url('${categoryCardBackgroundImage}')` }} />
                        </div>

                        <PostCards cardCategory={cardCategory} posts={posts} />
                    </>
                )}
            </div>
        </div>
    );
};

const store_activePost = useZustand.getState().methods.store_activePost;

const PostCards: FC<{
    cardCategory: MENUTARGET;
    posts: Post[];
}> = ({ cardCategory, posts }) => {
    return (
        <div id={`${cardCategory}-post-card-container`} className='scroll-gutter h-full w-1/2 -scale-x-100 overflow-y-auto overflow-x-hidden scrollbar-thin'>
            <div className='pointer-events-none flex -scale-x-100 flex-col space-y-3 pl-2'>
                {posts.map((post, idx) => (
                    <SinglePostCard key={post.title + idx} cardCategory={cardCategory} post={post} delay={100 * idx} />
                ))}
            </div>
        </div>
    );
};

const SinglePostCard: FC<{
    cardCategory: MENUTARGET;
    post: Post;
    delay: number;
}> = ({ cardCategory, post, delay }) => {
    const { title, titleCardBg, subTitle, date } = post;

    const { year } = parseDateString(date);

    const [intersectionRefCb, entry] = useIntersectionObserver({
        threshold: 0,
        rootMargin: '0px',
    });

    const hasRenderedFullyOnce = useRef(false);
    // const [hasMounted, setHasMounted] = useState(false);

    const cardRefCb = useCallback(
        (elem: HTMLElement | null) => {
            intersectionRefCb(elem);
            if (entry) {
                hasRenderedFullyOnce.current = true;
            }
        },
        [intersectionRefCb, entry],
    );

    // const { stage, shouldMount } = useTransition(hasMounted, 500);

    return (
        <div
            // key={`${shouldMount}`}
            id={`${cardCategory}-${title}-card`}
            ref={cardRefCb}
            style={!hasRenderedFullyOnce.current ? { transitionDelay: `${delay}ms` } : undefined}
            // style={{ transitionDelay: stage === 'leave' ? `${delay}ms` : '0' }}
            /* NOTE Post Card width & height set here: */
            className={classNames(
                'group/this pointer-events-auto relative w-full min-w-116 translate-x-[80%] cursor-pointer overflow-hidden border-4 border-palette-primary-200 opacity-25 shadow transition-[transform,opacity,background-color] duration-500',
                'before:absolute before:size-full before:outline before:outline-2 before:-outline-offset-8 before:outline-transparent before:transition-[outline-color,outline-offset,outline-width] before:delay-100 before:duration-100 hover:before:outline-palette-neutral-50',
                'hover:border-palette-accent-200',
                'after:absolute after:bottom-2 after:left-1/2 after:w-[calc(100%-theme(spacing.4))] after:-translate-x-1/2 after:truncate after:bg-transparent after:px-2 after:text-center after:text-sm after:text-palette-primary-900 after:transition-[background-color,opacity,color] after:duration-100 after:content-[attr(data-content-after)] hover:after:bg-palette-neutral-50 hover:after:text-palette-accent-100',
                entry?.isIntersecting ? '!translate-x-0 !opacity-100' : '',
                titleCardBg ? 'h-52' : 'h-24',
            )}
            data-content-after={subTitle ?? 'lol no subtitle here'}
            onClick={() => store_activePost(post)}
        >
            <div className='relative mx-auto mt-2 w-fit max-w-[calc(100%-(8px*2))] px-1 text-center text-palette-neutral-50 before:absolute before:-z-30 before:size-full before:-translate-x-1/2 before:bg-palette-neutral-500/75 before:transition-[background-color] before:delay-100 before:duration-100 group-hover/this:text-palette-accent-500 group-hover/this:before:bg-palette-neutral-50'>
                <h3>{title}</h3>
            </div>

            <div className='absolute bottom-0 right-0 z-10 h-full w-1/5'>
                <div className='absolute bottom-0 right-0 origin-bottom translate-x-1/2 translate-y-0 -rotate-45 transform-gpu bg-red-950 px-[100%] pb-[20%] pt-px text-center leading-none duration-500 group-hover/this:translate-x-[200%] group-hover/this:translate-y-[200%]'>
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
