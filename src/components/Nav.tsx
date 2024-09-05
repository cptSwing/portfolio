import { useZustand } from '../lib/zustand';
import { DataBase, Post, MENUTARGET, menuTargetArray } from '../types/types';
import classNames from '../lib/classNames';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import testDb from '../queries/testDb.json';
import { Transition } from 'react-transition-group';
import { useClassListOnMount } from '../hooks/useClassListOnMount';

const testDbTyped = testDb as DataBase;

const Nav = () => {
    const activePost = useZustand((state) => state.nav.activePost);

    return (
        <nav id='nav-cards-wrapper' className='flex flex-col items-center justify-start'>
            {/* Top Bar: */}
            <div
                className={classNames(
                    'relative mb-4 flex h-0.5 justify-center bg-palette-primary-300 transition-[width] duration-300',
                    activePost ? 'w-screen' : 'w-full',
                )}
            />

            {/* Category Cards: */}
            <div className='flex w-full flex-row items-start justify-center space-x-4'>
                {menuTargetArray.map((menuTarget, idx, arr) => (
                    <CategoryCard key={menuTarget + idx} cardCategory={menuTarget} cardData={testDbTyped[menuTarget]} numCategories={arr.length} />
                ))}
            </div>
        </nav>
    );
};

export default Nav;

const store_categoryOpened = useZustand.getState().methods.store_categoryOpened;

const CategoryCard: FC<{
    cardCategory: MENUTARGET;
    cardData: DataBase[MENUTARGET];
    numCategories: number;
}> = ({ cardCategory, cardData }) => {
    const { posts, headerCardBg } = cardData;
    const categoryOpened = useZustand((state) => state.nav.categoryOpened);
    const activePost = useZustand((state) => state.nav.activePost);

    const categoryCardRef = useRef<HTMLDivElement | null>(null);
    const [componentEntered, setComponentEntered] = useState(false);

    const hasRunOnce = useClassListOnMount({
        elementRef: categoryCardRef,
        /* NOTE Fixed Heights of Category Card here! */
        removeBefore: 'h-24',
        add: 'h-156 !transition-[height] !duration-700',
        removeAfter: '!transition-[height] !duration-700',
    });

    const thisCategoryOpened = useMemo(() => hasRunOnce && categoryOpened === cardCategory, [hasRunOnce, categoryOpened, cardCategory]);

    return (
        <Transition
            nodeRef={categoryCardRef}
            in={thisCategoryOpened}
            timeout={{ enter: 300, exit: 150 }}
            onEntered={() => {
                setComponentEntered(true);
            }}
            onExited={() => {
                setComponentEntered(false);
            }}
        >
            <div
                ref={categoryCardRef}
                /* NOTE Fixed Widths (opened/closed) of Category Card here! */
                className={classNames(
                    'after:nav-card-corners pointer-events-none relative cursor-pointer transition-[width,transform] duration-[400ms] after:z-20 hover:-translate-y-0.5 hover:shadow-md',
                    hasRunOnce ? 'h-156' : 'h-24',
                    thisCategoryOpened ? 'w-152 -translate-y-0.5 shadow-md' : 'w-24 shadow',
                )}
                onClick={() => store_categoryOpened(categoryOpened === cardCategory ? (activePost ? cardCategory : null) : cardCategory)}
            >
                <div className={classNames('group/category pointer-events-auto relative flex h-full items-end justify-between bg-palette-neutral-200/50 p-6')}>
                    <div
                        className={classNames(
                            'writing-mode-vert-lr font-protest-riot -ml-1 rotate-180 select-none whitespace-nowrap text-5xl text-inherit transition-[opacity,margin-bottom] duration-300 group-hover/category:text-palette-primary-300',
                            hasRunOnce ? 'opacity-100' : 'opacity-0',
                            componentEntered ? 'mb-[25%] text-palette-primary-300' : 'mb-0 text-palette-primary-100',
                        )}
                    >
                        <h1>{cardCategory}</h1>
                    </div>

                    {componentEntered && <PostCardContainer cardCategory={cardCategory} posts={posts} />}
                </div>

                <div
                    className='absolute bottom-0 left-0 -z-10 size-full bg-cover mask-edges-[30_10_0.2] peer-checked:mask-edges-40'
                    style={{ backgroundImage: `url('${headerCardBg}')` }}
                />
            </div>
        </Transition>
    );
};

const store_activePost = useZustand.getState().methods.store_activePost;

const PostCardContainer: FC<{
    cardCategory: MENUTARGET;
    posts: Post[];
}> = ({ cardCategory, posts }) => {
    return (
        <div id={`${cardCategory}-post-card-container`} className='scroll-gutter ml-3 h-full -scale-x-100 overflow-y-auto overflow-x-hidden scrollbar-thin'>
            {/* Move scrollbar to left side: https://stackoverflow.com/a/45824265 */}
            <div className='pointer-events-none flex -scale-x-100 flex-col space-y-3 pl-3'>
                {posts.map((post, idx) => (
                    <PostCard key={post.title + idx} cardCategory={cardCategory} post={post} delay={100 * idx} />
                ))}
            </div>
        </div>
    );
};

const PostCard: FC<{
    cardCategory: MENUTARGET;
    post: Post;
    delay: number;
}> = ({ cardCategory, post, delay }) => {
    const { title, titleCardBg, subTitle } = post;

    const [intersectionRefCb, entry] = useIntersectionObserver({
        threshold: 0,
        rootMargin: '0px',
    });

    const hasRenderedFullyOnce = useRef(false);

    const cardRefCb = useCallback(
        (elem: HTMLElement | null) => {
            intersectionRefCb(elem);
            if (entry) {
                hasRenderedFullyOnce.current = true;
            }
        },
        [intersectionRefCb, entry],
    );

    return (
        <div
            id={`${cardCategory}-${title}-card`}
            style={!hasRenderedFullyOnce.current ? { transitionDelay: `${delay}ms` } : undefined}
            /* NOTE Post Card width & height set here: */
            className={classNames(
                'group/this pointer-events-auto relative w-116 translate-x-[80%] cursor-pointer overflow-hidden border-4 border-palette-neutral-50 opacity-25 shadow transition-[transform,opacity,background-color] duration-500',
                'before:absolute before:size-full before:outline before:outline-2 before:-outline-offset-8 before:outline-transparent before:transition-[outline-color,outline-offset,outline-width] before:delay-100 before:duration-100 hover:before:outline-palette-neutral-50',
                'hover:border-palette-primary-200',
                'after:absolute after:bottom-2 after:left-1/2 after:w-[calc(100%-theme(spacing.4))] after:-translate-x-1/2 after:truncate after:bg-transparent after:px-2 after:text-center after:text-sm after:text-palette-primary-900 after:transition-[background-color,opacity,color] after:duration-100 after:content-[attr(data-content-after)] hover:after:bg-palette-neutral-50 hover:after:text-palette-accent-100',
                entry?.isIntersecting ? '!translate-x-0 !opacity-100' : '',
                titleCardBg ? 'h-52' : 'h-24',
            )}
            ref={cardRefCb}
            data-content-after={subTitle ?? 'lol no subtitle here'}
            onClick={() => store_activePost(post)}
        >
            <div className='relative mx-auto mt-2 w-fit max-w-[calc(100%-(8px*2))] px-1 text-center text-palette-neutral-50 before:absolute before:left-1/2 before:-z-30 before:size-full before:-translate-x-1/2 before:bg-palette-neutral-500/75 before:transition-[background-color] before:delay-100 before:duration-100 group-hover/this:font-semibold group-hover/this:text-palette-accent-500 group-hover/this:before:bg-palette-neutral-50'>
                <h3>{title}</h3>
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
    codeLink: string | undefined;
    setLightboxTo: React.Dispatch<React.SetStateAction<number | null>>;
}> = ({ hasImages, codeLink, setLightboxTo }) => {
    return (
        <div className='absolute w-full -translate-y-full pb-[2px] leading-none'>
            <div className='nav-checked-width mx-auto flex h-8 justify-end space-x-1'>
                {hasImages && (
                    <button
                        type='button'
                        className='cursor-pointer border-2 border-b-0 border-palette-primary-300 bg-palette-neutral-200 p-1 shadow hover:bg-palette-primary-100/50'
                        onClick={() => setLightboxTo(0)}
                    >
                        Gallery
                    </button>
                )}

                {codeLink && (
                    <a
                        className='group block cursor-pointer border-2 border-b-0 bg-palette-neutral-200 p-1 shadow hover:bg-palette-primary-100/50'
                        href={codeLink}
                        target='_blank'
                        rel='noreferrer'
                    >
                        Code lbr rbr
                        <span className='absolute right-0 z-50 mt-2 hidden whitespace-nowrap text-right text-sm group-hover:block'>
                            Link goes to {codeLink} <br /> bla bla explanatory <br /> new window/tab
                        </span>
                    </a>
                )}

                {/* TODO fade out instead of instantly closing */}
                <div
                    className='flex aspect-square w-fit cursor-pointer items-center justify-center border-2 border-b-0 border-palette-primary-300 bg-palette-neutral-200 shadow hover:bg-palette-primary-100/50'
                    onClick={() => store_activePost(null)}
                >
                    X
                </div>
            </div>
        </div>
    );
};
