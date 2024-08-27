import { useZustand } from '../lib/zustand';
import { DataBase, Post, MENUTARGET, Post_Image, menuTargetArray } from '../types/types';
import classNames from '../lib/classNames';
import { FC, useEffect, useMemo, useState } from 'react';
import { useIntersectionObserver } from '@uidotdev/usehooks';

import testDb from '../queries/testDb.json';
const testDbTyped = testDb as DataBase;

const Nav = () => {
    const activePost = useZustand((state) => state.nav.activePost);

    return (
        // Fixed Height Cards Wrapper here!
        <nav id='nav-cards-wrapper' className='h-160 flex flex-col items-center justify-start'>
            <div
                className={classNames(
                    'relative mb-4 flex h-0.5 justify-center bg-gray-700/50 transition-[width] duration-500',
                    activePost ? 'w-screen' : 'w-full',
                )}
            />
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

const CategoryCard: FC<{
    category: MENUTARGET;
    cardData: DataBase[MENUTARGET];
    numCategories: number;
}> = ({ category, cardData }) => {
    const { posts, headerCardBg } = cardData;
    const isOpened = useZustand((state) => state.nav.isOpened);
    const activePost = useZustand((state) => state.nav.activePost);

    const isThisCategoryChecked = useMemo(() => isOpened === category, [isOpened, category]);

    return (
        <label
            // Fixed Width of labels here!
            className={classNames(
                'after:nav-card-corners after:z-20',
                'pointer-events-auto relative flex h-full cursor-pointer items-end bg-gradient-to-r p-6 shadow-md transition-[width] duration-700',
                'text-gray-400 hover:from-gray-300 hover:to-gray-300 hover:text-white',
                isThisCategoryChecked
                    ? 'w-152 justify-between from-gray-300 to-gray-300 after:[--corner-outline-color:theme(colors.palette.test)]'
                    : 'w-24 justify-center from-gray-300/75 to-gray-300/25',
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
                    'writing-mode-vert-lr -ml-2 mb-0 rotate-180 select-none whitespace-nowrap text-5xl text-inherit transition-[margin,color] delay-150 duration-300 peer-checked:mb-[10%] peer-checked:mr-6 peer-checked:text-purple-500',
                )}
            >
                {category}
            </div>
            {isThisCategoryChecked && <PostCardContainer category={category} posts={posts} />}

            <div
                className='absolute bottom-0 left-0 h-3/4 w-4/5 bg-cover opacity-10 [mask-composite:intersect] [mask-image:linear-gradient(to_right,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_30%_60%,rgba(0,0,0,0)_100%),_linear-gradient(to_top,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_20%_80%,rgba(0,0,0,0)_100%)]'
                style={{ backgroundImage: `url('${headerCardBg}')` }}
            />
        </label>
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
                'relative cursor-pointer shadow transition-[transform,opacity] duration-300',
                entry?.isIntersecting ? 'translate-x-0 opacity-100' : 'translate-x-[80%] opacity-25',
            )}
            ref={cardRef}
        >
            <div
                //  Fixed Height of Post Cards here!
                className={
                    'pointer-events-auto h-40 bg-gray-400/50 p-1 transition-[outline-color,background-color,outline-offset] duration-100 hover:bg-transparent *:hover:bg-contain *:hover:bg-repeat-round' +
                    // ' outline outline-1 -outline-offset-4 outline-gray-300/75 hover:outline-2 hover:-outline-offset-8 hover:outline-gray-300' +
                    ' after:absolute after:bottom-0 after:truncate after:text-xs after:opacity-0 after:transition-opacity after:delay-300 after:duration-200 hover:after:opacity-100 hover:after:content-[attr(data-after-content)]'
                }
                data-after-content={subTitle}
                onClick={() => store_activePost(post)}
            >
                <div className='text-center text-white'>{title}</div>
                <div
                    className='absolute bottom-0 left-0 right-0 top-0 -z-10 size-full bg-cover bg-center bg-no-repeat'
                    style={{ backgroundImage: `url('${titleCardBg}')` }}
                />
            </div>
        </div>
    );
};

/** Used in Content.tsx */
export const MenuOpenedPost: FC<{
    images: Post_Image[] | undefined;
    codeLink: string | undefined;
    setLightbox: React.Dispatch<React.SetStateAction<boolean>>;
    setSlide: React.Dispatch<React.SetStateAction<number>>;
}> = ({ images, codeLink, setLightbox, setSlide }) => {
    return (
        <div className='absolute w-full -translate-y-full pb-[2px] leading-none'>
            <div className='nav-checked-width mx-auto flex h-8 justify-end space-x-1'>
                {images && (
                    <button
                        type='button'
                        className='cursor-pointer border border-b-0 border-gray-300 bg-gray-300 p-1 shadow hover:bg-purple-300'
                        onClick={() => {
                            setSlide(0);
                            setLightbox(true);
                        }}
                    >
                        Gallery
                    </button>
                )}

                {codeLink && (
                    <a
                        className='group block cursor-pointer border border-b-0 bg-gray-300 p-1 shadow hover:bg-purple-300'
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
                    className='flex aspect-square w-fit cursor-pointer items-center justify-center border border-b-0 border-gray-300 bg-gray-300 shadow hover:bg-purple-300'
                    onClick={() => store_activePost(null)}
                >
                    X
                </div>
            </div>
        </div>
    );
};
