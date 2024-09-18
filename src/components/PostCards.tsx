import { useIntersectionObserver } from '@uidotdev/usehooks';
import { CSSProperties, FC, useCallback, useMemo } from 'react';
import classNames from '../lib/classNames';
import parseDateString from '../lib/parseDateString';
import { useZustand } from '../lib/zustand';
import { Post } from '../types/types';

const store_activePost = useZustand.getState().methods.store_activePost;

export const PostCards: FC<{
    posts: Post[];
}> = ({ posts }) => {
    return (
        <div className='scroll-gutter h-full w-1/2 -scale-x-100 overflow-y-auto overflow-x-hidden scrollbar-thin'>
            <div className='pointer-events-none flex -scale-x-100 flex-col gap-y-6 pb-2 pl-4 pr-2 pt-3'>
                {posts.map((post, idx) => (
                    <SinglePostCard key={post.title + idx} post={post} index={idx} />
                ))}
            </div>
        </div>
    );
};

export const SinglePostCard: FC<{
    post: Post;
    index: number;
}> = ({ post, index }) => {
    const { title, titleCardBg, subTitle, date } = post;
    const { year } = parseDateString(date);
    const delay_Memo = useMemo(() => 500 * (index + 1), [index]);

    const [intersectionRefCb, entry] = useIntersectionObserver({
        threshold: 0,
    });

    const refCb = useCallback(
        (elem: HTMLDivElement | null) => {
            setTimeout(() => {
                intersectionRefCb(elem);
            }, delay_Memo);
        },
        [delay_Memo, intersectionRefCb],
    );

    return (
        <div
            ref={refCb}
            style={entry?.isIntersecting ? ({ '--tw-translate-x': 0 } as CSSProperties) : undefined}
            /* NOTE Post Card width & height set here: */
            className={classNames(
                'group/this outline-theme-neutral-50 pointer-events-auto relative w-full min-w-116 translate-x-full transform-gpu cursor-pointer outline outline-4 outline-offset-0 drop-shadow-lg transition-[transform,outline-color,outline-offset,outline-width] hover:-outline-offset-8',
                titleCardBg ? 'h-52' : 'h-24',
            )}
            onClick={() => store_activePost(post)}
        >
            <div className='group-hover/this:text-theme-secondary-500 text-theme-neutral-50 before:bg-theme-secondary-400 group-hover/this:before:bg-theme-neutral-50 relative z-10 mx-auto -mt-3 w-fit px-4 pb-1 text-center leading-none transition-[color] duration-200 before:absolute before:-z-30 before:size-full before:-translate-x-1/2 before:transition-[background-color] before:duration-200'>
                <h3>{title}</h3>
            </div>

            <div className='absolute bottom-0 top-0 size-full overflow-hidden'>
                <div className='group-hover/this:bg-theme-neutral-50 group-hover/this:text-theme-neutral-500 absolute bottom-1 left-1/2 h-fit w-[calc(100%-10px)] -translate-x-1/2 transform-gpu truncate bg-transparent px-2 text-center text-sm text-neutral-50 transition-[background-color,opacity,color]'>
                    {subTitle ?? 'lol no subtitle here'}
                </div>

                <div className='absolute bottom-0 right-0 -z-10 h-full w-1/5'>
                    <div className='text-theme-accent-700 bg-theme-neutral-100 absolute bottom-0 right-0 origin-bottom translate-x-1/2 translate-y-0 -rotate-45 transform-gpu px-[100%] pb-3 pt-px text-center text-sm font-semibold transition-[transform,opacity] group-hover/this:translate-x-[200%] group-hover/this:translate-y-[200%] group-hover/this:opacity-50'>
                        {year}
                    </div>
                </div>

                {titleCardBg && (
                    <div
                        className='absolute bottom-0 left-0 right-0 top-0 -z-50 h-full w-auto scale-110 transform-gpu bg-cover transition-transform duration-500 group-hover/this:scale-125 group-hover/this:delay-0 group-hover/this:duration-[2000ms]'
                        style={{ backgroundImage: `url('${titleCardBg}')` }}
                    />
                )}
            </div>
        </div>
    );
};
