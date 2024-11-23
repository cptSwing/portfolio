import { FC, useCallback, useEffect, useRef, useState } from 'react';
import parseDateString from '../lib/parseDateString';
import { Post } from '../types/types';
import Markdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import convertRemToPixels from '../lib/convertRemToPixels';
import useScrollPosition from '../hooks/useScrollPosition';
import { useScroll } from 'react-use';

export const PostCards: FC<{
    posts: Post[];
    postCardsParentWidth: number;
    postCardsParentHeight: number;
}> = ({ posts, postCardsParentWidth, postCardsParentHeight }) => {
    const parentRef = useRef<HTMLDivElement | null>(null);
    const { y: scrollY } = useScroll(parentRef);
    const [dimensions, setDimensions] = useState({
        postCardsParentWidth,
        postCardsParentHeight,
        cardWidth: 0,
        cardHeight: 0,
        cardOutline: 0,
        spacingY: 0,
        paddingTop: 0,
        paddingRight: 0,
    });
    const [scrollWrapperHeight, setScrollWrapperHeight] = useState(0);

    const ref_Cb = useCallback(
        (elem: HTMLDivElement | null) => {
            if (elem) {
                const compStyle = getComputedStyle(elem);
                setDimensions({
                    postCardsParentWidth,
                    postCardsParentHeight,
                    cardWidth: convertRemToPixels(compStyle.getPropertyValue('--postcard-width')),
                    cardHeight: convertRemToPixels(compStyle.getPropertyValue('--card-height')),
                    cardOutline: convertRemToPixels(compStyle.getPropertyValue('--card-outline-width')),
                    spacingY: convertRemToPixels(compStyle.getPropertyValue('--spacing-y')),
                    paddingTop: convertRemToPixels(compStyle.getPropertyValue('--padding-top')),
                    paddingRight: convertRemToPixels(compStyle.getPropertyValue('--padding-right')),
                });
            }

            parentRef.current = elem;
        },
        [postCardsParentWidth, postCardsParentHeight],
    );

    useEffect(() => {
        setScrollWrapperHeight((dimensions.cardHeight + dimensions.spacingY + dimensions.cardOutline) * posts.length + dimensions.cardOutline);
    }, [dimensions.cardHeight, dimensions.cardOutline, dimensions.paddingRight, dimensions.spacingY, posts.length]);

    return (
        <div
            ref={ref_Cb}
            /* NOTE Post Card height set here: */
            className='scroll-gutter size-full overflow-x-hidden overflow-y-scroll scrollbar-thin [--padding-top:theme(spacing.4)] [--scrollbar-thumb:--color-secondary-active-cat] [--spacing-y:theme(spacing.3)] sm:[--padding-top:theme(spacing.4)]'
        >
            {/* Wrapping div for scrolling */}
            <div
                style={{ height: scrollWrapperHeight }}
                className='w-[--postcard-width] sm:ml-auto sm:mr-0'
                onClick={(e) => {
                    /* Needed for children's navigate() calls in an onClick to work: */
                    e.stopPropagation();
                }}
            >
                {posts.map((post, idx) => (
                    <SinglePostCard key={post.title + idx} post={post} index={idx} dimensions={dimensions} parentScroll={Math.round(scrollY)} />
                ))}
            </div>
        </div>
    );
};

export const SinglePostCard: FC<{
    post: Post;
    index: number;
    dimensions: {
        postCardsParentWidth: number;
        postCardsParentHeight: number;
        cardWidth: number;
        cardHeight: number;
        cardOutline: number;
        spacingY: number;
        paddingTop: number;
        paddingRight: number;
    };
    parentScroll: number;
}> = ({ post, index, dimensions, parentScroll }) => {
    const { id, title, titleCardBg, subTitle, date } = post;
    const { postCardsParentWidth, postCardsParentHeight, cardWidth, cardHeight, cardOutline, spacingY, paddingTop, paddingRight } = dimensions;
    const { year } = parseDateString(date);
    const navigate = useNavigate();

    const [timer, setTimer] = useState<number>();

    const style = useScrollPosition(
        index,
        cardWidth,
        cardHeight,
        cardOutline,
        spacingY,
        paddingTop,
        paddingRight,
        postCardsParentWidth,
        postCardsParentHeight,
        parentScroll,
    );

    return (
        <div style={style} className='absolute'>
            <div
                style={{ height: cardHeight, width: cardWidth }}
                className={
                    '[--card-hover-delay:50ms] [--card-hover-duration:100ms] [--card-text-color:--theme-primary-50]' +
                    ' ' +
                    'group/this pointer-events-auto relative ml-auto mr-0 h-full origin-left transform-gpu cursor-pointer outline outline-[length:--card-outline-width] outline-offset-0 outline-[--color-secondary-inactive-cat] drop-shadow-lg transition-[transform,outline-color,outline-offset,outline-width] delay-[--card-hover-delay] duration-[--card-hover-duration] hover:-outline-offset-[--card-outline-width] active:-outline-offset-[--card-outline-width]'
                }
                onClick={() => navigate(id.toString())}
                onScroll={({ currentTarget }) => {
                    console.log('%c[PostCards]', 'color: #dfc2be', `scroll :`);
                    clearTimeout(timer);
                    currentTarget.style.setProperty('pointer-events', 'none');

                    setTimer(
                        setTimeout(function () {
                            currentTarget.style.setProperty('pointer-events', 'auto');
                        }, 100),
                    );
                }}
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
