import { useZustand } from '../lib/zustand';
import { DataBase, Post, MENUTARGET, Post_Image, menuTargetArray } from '../types/types';
import classNames from '../lib/classNames';
import { FC, Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntersectionObserver, useIsFirstRender } from '@uidotdev/usehooks';
import testDb from '../queries/testDb.json';
import { CSSTransition } from 'react-transition-group';
import { label } from 'yet-another-react-lightbox';
import { useClassListOnMount } from '../hooks/useClassListOnMount';

const testDbTyped = testDb as DataBase;

const Nav = () => {
    const activePost = useZustand((state) => state.nav.activePost);

    return (
        // Fixed Height Cards Wrapper here!

        <nav id='nav-cards-wrapper' className='flex flex-col items-center justify-start'>
            {/* Top Bar: */}
            <div
                className={classNames(
                    'relative mb-4 flex h-0.5 justify-center bg-palette-primary-300 transition-[width] duration-300',
                    activePost ? 'w-screen' : 'w-full',
                )}
            />

            {/* Category Cards: */}
            <div className='group flex size-full flex-row items-start justify-center space-x-4'>
                {menuTargetArray.map((menuTarget, idx, arr) => (
                    <CategoryCard key={menuTarget + idx} category={menuTarget} cardData={testDbTyped[menuTarget]} numCategories={arr.length} />
                ))}
            </div>
        </nav>
    );
};

export default Nav;

const store_isOpened = useZustand.getState().methods.store_isOpened;
const durationMs = 2000;

const CategoryCard: FC<{
    category: MENUTARGET;
    cardData: DataBase[MENUTARGET];
    numCategories: number;
}> = ({ category, cardData }) => {
    const { posts, headerCardBg } = cardData;
    const isOpened = useZustand((state) => state.nav.isOpened);
    const activePost = useZustand((state) => state.nav.activePost);

    const isThisCategoryChecked = useMemo(() => isOpened === category, [isOpened, category]);

    useIsFirstRender();

    const labelRef = useRef<HTMLLabelElement | null>(null);

    useClassListOnMount({
        elementRef: labelRef,
        classes: { remove: ['h-0'], add: ['h-156', 'transition-[height]', 'duration-1000'], removeAfter: ['transition-[height]', 'duration-1000'] },
    });

    return (
        <CSSTransition
            nodeRef={labelRef}
            in={isThisCategoryChecked}
            classNames={{
                enter: 'w-24',
                enterActive: 'w-152 transition-[width,transform] duration-500 -translate-y-0.5',
                enterDone: 'w-152 -translate-y-0.5',
                exit: 'w-152',
                exitActive: 'w-24 transition-[width] duration-300',
                exitDone: 'w-24',
            }}
            timeout={{
                enter: 500,
                exit: 300,
            }}
        >
            <label
                ref={labelRef}
                // Fixed Width of labels here!
                className={classNames(
                    'pointer-events-none relative h-0',
                    // 'transition-[width,transform] duration-500',
                    'after:nav-card-corners after:z-20 after:transition-transform',
                    // isThisCategoryChecked ? 'w-152 ' : 'w-24 after:hover:-translate-y-px',
                )}
            >
                {/* Hidden checkbox input: */}
                <input
                    type='checkbox'
                    name='nav-card-input'
                    value={category}
                    className='peer hidden'
                    checked={isThisCategoryChecked}
                    onChange={({ currentTarget }) => {
                        const typedValue = currentTarget.value as MENUTARGET;
                        store_isOpened(isOpened === typedValue ? (activePost ? typedValue : null) : typedValue);
                    }}
                />
                <div
                    className={classNames(
                        'group/category group pointer-events-auto relative flex h-full cursor-pointer items-end justify-center bg-gradient-to-r from-palette-neutral-200/50 to-palette-neutral-200/50 p-6 shadow transition-[background-image,transform] duration-75',
                        'hover:-translate-y-px hover:shadow-md',
                        'peer-checked:-translate-y-0.5 peer-checked:justify-between peer-checked:from-palette-neutral-100 peer-checked:to-palette-neutral-200 peer-checked:shadow-lg',
                    )}
                >
                    <div
                        className={classNames(
                            'writing-mode-vert-lr -ml-2 mb-0 rotate-180 select-none whitespace-nowrap text-5xl text-inherit text-palette-primary-100 transition-[margin-bottom,color] delay-[400ms] duration-300 group-hover/category:text-palette-primary-300 group-hover/category:delay-0 peer-checked:group-[]:mb-[25%] peer-checked:group-[]:mr-6 peer-checked:group-[]:text-palette-primary-500',
                        )}
                    >
                        {category}
                    </div>
                    {isThisCategoryChecked && <PostCardContainer category={category} posts={posts} />}
                </div>
                <div
                    className='absolute bottom-0 left-0 -z-10 size-full bg-cover mask-edges-[30_10_0.2] peer-checked:mask-edges-40'
                    style={{ backgroundImage: `url('${headerCardBg}')` }}
                />
            </label>
        </CSSTransition>
    );
};

const store_activePost = useZustand.getState().methods.store_activePost;

const PostCardContainer: FC<{
    category: MENUTARGET;
    posts: Post[];
}> = ({ category, posts }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
        return () => setShow(false);
    }, []);

    return (
        <div id={`${category}-post-card-container`} className='relative z-10 size-full overflow-hidden'>
            <div
                className={classNames(
                    'absolute size-full transition-[right,opacity] delay-300 duration-75',
                    show ? 'right-0 opacity-100' : '-right-full opacity-0',
                )}
            >
                <div className='scroll-gutter h-full -scale-x-100 overflow-y-auto scrollbar-thin'>
                    {/* Move scrollbar to left side: https://stackoverflow.com/a/45824265 */}
                    <div className='pointer-events-none flex -scale-x-100 flex-col space-y-3 pl-3'>
                        {posts.map((post, idx) => (
                            <PostCard key={post.title + idx} category={category} post={post} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PostCard: FC<{
    category: MENUTARGET;
    post: Post;
}> = ({ category, post }) => {
    const { title, titleCardBg, subTitle } = post;
    const [cardRef, entry] = useIntersectionObserver({
        threshold: 0,
        rootMargin: '0px',
    });

    return (
        <div
            id={`${category}-${title.replace(' ', '_')}-card`}
            className={classNames(
                'relative cursor-pointer overflow-clip shadow transition-[transform,opacity] duration-300',
                entry?.isIntersecting ? 'translate-x-0 opacity-100' : 'translate-x-[80%] opacity-25',
            )}
            ref={cardRef}
        >
            <div
                //  Fixed Height of Post Cards here!
                className={classNames(
                    'group/card pointer-events-auto relative h-40 border-4 border-palette-neutral-50 bg-palette-neutral-300/20 p-1 outline outline-8 -outline-offset-2 outline-transparent transition-[background-color,border-color,outline-color,outline-offset,outline-width]',
                    'hover:bg-transparent hover:outline-4 hover:-outline-offset-8 hover:outline-palette-neutral-50/75',
                    'after:absolute after:bottom-0 after:truncate after:text-xs after:opacity-0 after:transition-opacity after:delay-300 after:duration-200 hover:after:opacity-100 hover:after:content-[attr(data-after-content)]',
                )}
                data-after-content={subTitle}
                onClick={() => store_activePost(post)}
            >
                <div className='absolute right-0 top-0 mr-1 mt-1 px-1 text-palette-neutral-50 before:absolute before:right-0 before:top-0 before:-z-30 before:h-full before:w-full before:bg-palette-neutral-500/75 group-hover/card:text-palette-primary-600 group-hover/card:before:bg-palette-neutral-100/75'>
                    {title}
                </div>
                <div
                    className='fixed bottom-0 left-0 right-0 top-0 -z-50 h-full w-auto scale-105 transform-gpu bg-cover transition-transform group-hover/card:!scale-100'
                    style={{ backgroundImage: `url('${titleCardBg}')` }}
                />
            </div>
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
