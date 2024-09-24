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
                'group/this pointer-events-auto relative w-full min-w-116 translate-x-full transform-gpu cursor-pointer outline outline-[length:--card-outline-width] outline-offset-0 outline-[--card-outline-color] drop-shadow-lg transition-[transform,outline-color,outline-offset,outline-width] [--card-hover-duration:200ms] [--card-outline-color:theme(colors.theme.neutral.50)] [--card-outline-width:6px] hover:-outline-offset-[calc(2*var(--card-outline-width))]',
                titleCardBg ? 'h-52' : 'h-24',
            )}
            onClick={() => store_activePost(post)}
        >
            {/* Title: */}
            <div className='relative z-10 mx-auto -mt-3 w-fit px-4 pb-1 text-center leading-none text-[--card-outline-color] shadow transition-colors duration-[--card-hover-duration] before:absolute before:-z-30 before:size-full before:-translate-x-1/2 before:bg-theme-secondary-400 before:transition-[background-color] before:duration-[--card-hover-duration] group-hover/this:text-theme-secondary-400 group-hover/this:before:bg-[--card-outline-color]'>
                <h3>{title}</h3>
            </div>

            <div className='absolute bottom-0 top-0 size-full overflow-hidden'>
                {/* Subtitle: */}
                <div className='clip-inset-x-[--card-outline-width] absolute bottom-[--card-outline-width] mx-auto h-fit w-full transform-gpu truncate bg-transparent px-2 text-center text-sm text-neutral-50 transition-[background-color,opacity,color] duration-[--card-hover-duration] group-hover/this:bg-[--card-outline-color] group-hover/this:text-theme-neutral-500'>
                    {subTitle ?? 'lol no subtitle here'}
                </div>

                {/* Year Ribbon: */}
                <div className='absolute bottom-0 right-0 -z-10 h-full w-1/5'>
                    <div className='absolute bottom-0 right-0 origin-bottom translate-x-1/2 translate-y-0 -rotate-45 transform-gpu bg-[--card-outline-color] px-[100%] pb-3 pt-px text-center text-sm font-semibold text-theme-accent-700 transition-[transform,opacity] duration-[--card-hover-duration] group-hover/this:translate-x-[200%] group-hover/this:translate-y-[200%] group-hover/this:opacity-50'>
                        {year}
                    </div>
                </div>

                {/* Image: */}
                {titleCardBg && (
                    <div
                        className='absolute bottom-0 left-0 right-0 top-0 -z-50 h-full w-auto scale-110 transform-gpu bg-cover grayscale-[75%] transition-[transform,filter] duration-[--card-hover-duration] group-hover/this:scale-125 group-hover/this:grayscale-0 group-hover/this:delay-0 group-hover/this:duration-[2000ms,var(--card-hover-duration)]'
                        style={{ backgroundImage: `url('${titleCardBg}')` }}
                    />
                )}
            </div>
        </div>
    );
};
