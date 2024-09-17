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
    const delay_Memo = useMemo(() => 400 * (index + 1), [index]);

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
                'group/this pointer-events-auto relative w-full min-w-116 translate-x-full cursor-pointer transition-[transform,background-color]',
                'before:absolute before:size-full before:outline before:outline-4 before:outline-offset-0 before:outline-palette-neutral-50 before:transition-[outline-color,outline-offset,outline-width] hover:before:-outline-offset-8',
                'after:absolute after:bottom-1 after:left-1/2 after:w-[calc(100%-theme(spacing.3))] after:-translate-x-1/2 after:truncate after:bg-transparent after:px-2 after:text-center after:text-sm after:text-neutral-50 after:transition-[background-color,opacity,color] after:content-[attr(data-content-after)] hover:after:bg-palette-neutral-50 hover:after:text-palette-neutral-500',
                titleCardBg ? 'h-52' : 'h-24',
            )}
            data-content-after={subTitle ?? 'lol no subtitle here'}
            onClick={() => store_activePost(post)}
        >
            <div className='relative z-10 mx-auto -mt-3 w-fit px-4 pb-1 text-center leading-none text-palette-neutral-50 before:absolute before:-z-30 before:size-full before:-translate-x-1/2 before:bg-palette-neutral-500 before:transition-[background-color] group-hover/this:text-palette-accent-500 group-hover/this:before:bg-palette-neutral-50'>
                <h3>{title}</h3>
            </div>

            <div className='absolute bottom-0 top-0 size-full overflow-hidden'>
                <div className='absolute bottom-0 right-0 -z-10 h-full w-1/5'>
                    <div className='absolute bottom-0 right-0 origin-bottom translate-x-1/2 translate-y-0 -rotate-45 transform-gpu bg-palette-accent-900 px-[100%] pb-[20%] pt-px text-center leading-none group-hover/this:translate-x-[200%] group-hover/this:translate-y-[200%]'>
                        {year}
                    </div>
                </div>

                {titleCardBg && (
                    <div
                        className='absolute bottom-0 left-0 right-0 top-0 -z-50 h-full w-auto origin-top-left scale-100 transform-gpu bg-cover transition-transform delay-[3000ms] duration-700 group-hover/this:!scale-110 group-hover/this:delay-0 group-hover/this:duration-[3000ms]'
                        style={{ backgroundImage: `url('${titleCardBg}')` }}
                    />
                )}
            </div>
        </div>
    );
};
