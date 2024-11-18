import { FC, useCallback, useEffect, useRef, useState } from 'react';
import classNames from '../lib/classNames';
import parseDateString from '../lib/parseDateString';
import { Post } from '../types/types';
import Markdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import useAnimationOnMount from '../hooks/useAnimationOnMount';
import convertRemToPixels from '../lib/convertRemToPixels';
import useScrollPosition from '../hooks/useScrollPosition';
import { useScroll } from 'react-use';

export const PostCards: FC<{
    posts: Post[];
    postCardsParentHeight: number;
}> = ({ posts, postCardsParentHeight }) => {
    const parentRef = useRef<HTMLDivElement | null>(null);
    const { y: scrollY } = useScroll(parentRef);
    const [heightValues, setHeightValues] = useState({ parentHeight: 0, postCardsParentHeight });

    useEffect(() => {
        setHeightValues((state) => ({ ...state, postCardsParentHeight }));
    }, [postCardsParentHeight]);

    const ref_Cb = useCallback(
        (elem: HTMLDivElement | null) => {
            if (elem) {
                setHeightValues({
                    postCardsParentHeight,
                    parentHeight: convertRemToPixels(getComputedStyle(elem).getPropertyValue('--card-height')) * posts.length,
                });
                parentRef.current = elem;
            }
        },
        [posts.length, postCardsParentHeight],
    );

    return (
        <div
            ref={ref_Cb}
            className={
                // 'relative' +
                '[--card-height-no-image:theme(spacing.24)] [--card-height:theme(spacing.44)] [--card-outline-width:6px] [--card-width:calc(100%-(var(--text-width)-(var(--card-outline-width)*2)))] sm:[--card-height:theme(spacing.52)]' +
                ' scroll-gutter mt-2 size-full overflow-x-hidden overflow-y-scroll pb-3 pl-2 pr-4 pt-3 scrollbar-thin [--scrollbar-thumb:--color-secondary-active-cat] sm:mt-0 sm:p-2 sm:pr-4 sm:pt-4'
            }
        >
            {/* Wrapping div for scrolling */}
            <div
                style={{ height: `${heightValues.parentHeight}px` }}
                className='pointer-events-none sm:ml-auto sm:mr-0 sm:w-[--card-width]'
                onClick={(e) => {
                    /* Needed for children's navigate() calls in an onClick to work: */
                    e.stopPropagation();
                }}
            >
                {posts.map((post, idx) => (
                    <SinglePostCard key={post.title + idx} post={post} index={idx} heightValues={heightValues} parentScroll={scrollY} />
                ))}
            </div>
        </div>
    );
};

export const SinglePostCard: FC<{
    post: Post;
    index: number;
    heightValues: {
        parentHeight: number;
        postCardsParentHeight: number;
    };
    parentScroll: number;
}> = ({ post, index, heightValues, parentScroll }) => {
    const { id, title, titleCardBg, subTitle, date } = post;
    const { parentHeight, postCardsParentHeight } = heightValues;
    const { year } = parseDateString(date);
    const navigate = useNavigate();

    const thisRef = useRef<HTMLDivElement | null>(null);

    const [cardHeight, setCardHeight] = useState(0);

    const style = useScrollPosition(index, cardHeight, parentHeight, postCardsParentHeight, parentScroll);

    const animDurationMs = 200,
        animDelayMs = 100;
    const [mountAnimRefCallback, animHasEnded] = useAnimationOnMount({
        animationProps: {
            animationName: 'enter-from-left',
            animationDuration: animDurationMs,
            animationDelay: animDelayMs * index,
            animationFillMode: 'backwards',
            animationIterationCount: 1,
        },
        startDelay: animDelayMs * index,
        hiddenAtStart: false,
    });

    const refCbWrapper = useCallback(
        (elem: HTMLDivElement | null) => {
            // mountAnimRefCallback(elem);
            if (elem) {
                setCardHeight(elem.getBoundingClientRect().height);
                thisRef.current = elem;
            }
        },
        [mountAnimRefCallback],
    );

    return (
        <div
            ref={refCbWrapper}
            style={style}
            className={classNames('absolute w-[--card-width] transition-[left]', titleCardBg ? 'h-[--card-height]' : 'h-[--card-height-no-image]')}
        >
            <div
                /* NOTE Post Card height set here: */
                className={classNames(
                    '[--card-hover-delay:50ms] [--card-hover-duration:100ms] [--card-text-color:--theme-primary-50]',
                    'group/this pointer-events-auto relative ml-auto mr-0 h-full origin-left transform-gpu cursor-pointer outline outline-[length:--card-outline-width] outline-offset-0 outline-[--color-secondary-inactive-cat] drop-shadow-lg transition-[transform,outline-color,outline-offset,outline-width] delay-[--card-hover-delay] duration-[--card-hover-duration]',
                    'hover:-outline-offset-[--card-outline-width] active:-outline-offset-[--card-outline-width]',
                )}
                onClick={() => navigate(id.toString())}
            >
                {/* Title: */}
                <div className='relative z-10 mx-auto -mt-3 w-fit select-none px-2 pb-1 text-center leading-none text-[--card-text-color] shadow transition-colors delay-[--card-hover-delay] duration-[--card-hover-duration] before:absolute before:-z-30 before:size-full before:-translate-x-1/2 before:bg-[--color-secondary-active-cat] before:transition-[background-color] before:delay-[--card-hover-delay] before:duration-[--card-hover-duration] sm:px-4'>
                    <h3>{title}</h3>
                </div>

                <div className='absolute top-0 size-full overflow-hidden'>
                    {/* Subtitle: */}
                    {subTitle && (
                        <div className='absolute bottom-0 left-1/2 z-10 mx-auto h-fit -translate-x-1/2 transform-gpu select-none truncate bg-[--color-secondary-inactive-cat] px-2 text-center text-xs text-[--card-text-color] opacity-90 transition-[background-color,opacity,color] delay-[--card-hover-delay] duration-[--card-hover-duration] group-hover/this:text-[--card-text-color] group-active/this:text-[--card-text-color] hover:delay-[calc(75ms+var(--card-hover-delay))] active:delay-[calc(75ms+var(--card-hover-delay))] sm:bottom-[--card-outline-width] sm:left-0 sm:w-full sm:translate-x-0 sm:bg-transparent sm:text-sm sm:text-[--color-text-testimonial] sm:opacity-100 sm:clip-inset-x-[--card-outline-width] sm:group-hover/this:bg-[--color-secondary-inactive-cat]'>
                            <Markdown>{subTitle}</Markdown>
                        </div>
                    )}

                    {/* Year Ribbon: */}
                    <div className='absolute bottom-0 right-0 z-0 h-full w-1/5'>
                        <div className='absolute bottom-0 right-0 origin-bottom translate-x-1/2 translate-y-0 -rotate-45 transform-gpu bg-[--color-secondary-inactive-cat] px-[100%] pb-3 pt-px text-center text-sm font-semibold text-[color:var(--color-text-testimonial)] transition-[transform,opacity] delay-[--card-hover-delay] duration-[--card-hover-duration] group-hover/this:translate-x-[200%] group-hover/this:translate-y-[200%] group-hover/this:opacity-50 group-active/this:translate-x-[200%] group-active/this:translate-y-[200%] group-active/this:opacity-50'>
                            {year}
                        </div>
                    </div>

                    {/* Image: */}
                    {titleCardBg && (
                        <div className='absolute -z-10 size-full transition-[clip-path] delay-[--card-hover-delay] duration-[--card-hover-duration] clip-inset-0 group-hover/this:clip-inset-[--card-outline-width] group-active/this:clip-inset-[--card-outline-width]'>
                            <div
                                className='h-full w-auto scale-105 transform-gpu bg-cover grayscale-[75%] transition-[filter] delay-[--card-hover-delay] duration-[--card-hover-duration] group-hover/this:grayscale-0 group-hover/this:delay-0 group-hover/this:duration-[--card-hover-duration] group-active/this:grayscale-0 group-active/this:delay-0 group-active/this:duration-[--card-hover-duration]'
                                style={{ backgroundImage: `url('${titleCardBg}')` }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
