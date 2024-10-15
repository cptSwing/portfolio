import { useIntersectionObserver } from '@uidotdev/usehooks';
import { CSSProperties, FC, useCallback } from 'react';
import classNames from '../lib/classNames';
import parseDateString from '../lib/parseDateString';
import { Post } from '../types/types';
import Markdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import useAnimationOnMount from '../hooks/useAnimationOnMount';

export const PostCards: FC<{
    posts: Post[];
}> = ({ posts }) => {
    return (
        <div className='h-full basis-1/2 overflow-hidden bg-theme-primary-300 shadow-lg shadow-theme-primary-950 outline outline-[length:--outline-width] outline-theme-primary-300'>
            <div className='scroll-gutter h-full -scale-x-100 overflow-y-scroll scrollbar-thin'>
                <div
                    className='pointer-events-none flex -scale-x-100 flex-col gap-y-6 pb-2 pl-4 pr-2 pt-3'
                    onClick={(e) => {
                        /* Needed for children's navigate() calls in an onClick to work: */
                        e.stopPropagation();
                    }}
                >
                    {posts.map((post, idx) => (
                        <SinglePostCard key={post.title + idx} post={post} index={idx} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export const SinglePostCard: FC<{
    post: Post;
    index: number;
}> = ({ post, index }) => {
    const { id, title, titleCardBg, subTitle, date } = post;
    const { year } = parseDateString(date);
    const navigate = useNavigate();

    const [intersectionRefCb, entry] = useIntersectionObserver({
        threshold: 0,
    });

    const animDurationMs = 200,
        animDelayMs = 100;
    const [mountAnimRefCallback] = useAnimationOnMount({
        animationProps: {
            animationName: 'enter-from-right',
            animationDuration: animDurationMs,
            animationDelay: animDelayMs * index,
            animationFillMode: 'backwards',
        },
        startDelay: 500,
        hiddenAtStart: true,
    });

    const refCbWrapper = useCallback(
        (elem: HTMLDivElement | null) => {
            mountAnimRefCallback(elem);
            intersectionRefCb(elem);
        },
        [mountAnimRefCallback, intersectionRefCb],
    );

    return (
        <div
            ref={refCbWrapper}
            // style={entry?.isIntersecting ? ({ '--tw-translate-x': 0 } as CSSProperties) : undefined}
            style={
                {
                    '--card-hover-duration': `${animDurationMs}ms`,
                    '--card-hover-delay': `${animDelayMs}`,
                    '--tw-translate-x': entry?.isIntersecting ? 0 : '100%',
                } as CSSProperties
            }
            /* NOTE Post Card width & height set here: */
            className={classNames(
                'group/this pointer-events-auto relative translate-x-full transform-gpu cursor-pointer outline outline-[length:--card-outline-width] outline-offset-0 outline-[--card-outline-color] drop-shadow-lg transition-[transform,outline-color,outline-offset,outline-width] delay-[--card-hover-delay] duration-[--card-hover-duration]',
                '[--card-outline-color:theme(colors.theme.neutral.50)] [--card-outline-width:6px] hover:-outline-offset-[calc(2px+var(--card-outline-width))]',
                titleCardBg ? 'h-52' : 'h-24',
            )}
            onClick={() => navigate(id.toString())}
        >
            {/* Title: */}
            <div className='relative z-10 mx-auto -mt-3 w-fit px-4 pb-1 text-center leading-none text-[--card-outline-color] shadow transition-colors delay-[--card-hover-delay] duration-[--card-hover-duration] before:absolute before:-z-30 before:size-full before:-translate-x-1/2 before:bg-theme-secondary-400 before:transition-[background-color] before:delay-[--card-hover-delay] before:duration-[--card-hover-duration] group-hover/this:text-theme-secondary-400 group-hover/this:before:bg-[--card-outline-color]'>
                <h3>{title}</h3>
            </div>

            <div className='absolute top-0 size-full overflow-hidden'>
                {/* Subtitle: */}
                {subTitle && (
                    <div className='absolute bottom-[--card-outline-width] mx-auto h-fit w-full transform-gpu truncate bg-transparent px-2 text-center text-sm text-neutral-50 transition-[background-color,opacity,color] delay-[--card-hover-delay] duration-[--card-hover-duration] clip-inset-x-[--card-outline-width] group-hover/this:bg-[--card-outline-color] group-hover/this:text-theme-neutral-500 hover:delay-[calc(75ms+var(--card-hover-delay))]'>
                        <Markdown>{subTitle}</Markdown>
                    </div>
                )}

                {/* Year Ribbon: */}
                <div className='absolute bottom-0 right-0 z-0 h-full w-1/5'>
                    <div className='absolute bottom-0 right-0 origin-bottom translate-x-1/2 translate-y-0 -rotate-45 transform-gpu bg-[--card-outline-color] px-[100%] pb-3 pt-px text-center text-sm font-semibold text-theme-accent-700 transition-[transform,opacity] delay-[--card-hover-delay] duration-[--card-hover-duration] group-hover/this:translate-x-[200%] group-hover/this:translate-y-[200%] group-hover/this:opacity-50'>
                        {year}
                    </div>
                </div>

                {/* Image: */}
                {titleCardBg && (
                    <div className='absolute -z-10 size-full transition-[clip-path] delay-[--card-hover-delay] duration-[--card-hover-duration] clip-inset-0 group-hover/this:clip-inset-[--card-outline-width]'>
                        <div
                            className='h-full w-auto scale-110 transform-gpu bg-cover grayscale-[85%] transition-[transform,filter] delay-[--card-hover-delay] duration-[--card-hover-duration] group-hover/this:scale-125 group-hover/this:grayscale-0 group-hover/this:delay-0 group-hover/this:duration-[2000ms,var(--card-hover-duration)]'
                            style={{ backgroundImage: `url('${titleCardBg}')` }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
