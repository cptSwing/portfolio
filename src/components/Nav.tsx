import { DataBase, Post } from '../types/types';
import classNames from '../lib/classNames';
import { FC, useMemo, useRef } from 'react';
import testDb from '../queries/testDb.json';
import { PostCards } from './PostCards.tsx';
import { MENU_CATEGORY } from '../types/enums.ts';
import Markdown from 'react-markdown';
import { CodeBracketSquareIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useNavigate, useParams } from 'react-router-dom';
import useAnimationOnMount from '../hooks/useAnimationOnMount.ts';
import GetBackgroundSvg from './GetBackgroundSvg.tsx';
import { useBreakpoint } from '../hooks/useBreakPoint.ts';
import remarkBreaks from 'remark-breaks';
import { bars_totalDuration } from '../lib/animationValues.ts';
import { useMeasure } from 'react-use';

const testDbTyped = testDb as DataBase;
const categoriesArray = Object.values(testDbTyped);

const Nav = () => {
    const { catId, postId } = useParams();

    return (
        <nav
            className={classNames(
                'z-0 mx-auto grid size-full transition-[grid-template-rows,row-gap] duration-500',

                postId ? 'absolute left-0 right-0 -z-10' : catId ? 'gap-y-px' : 'gap-y-1',
            )}
            style={{
                gridTemplateRows: categoriesArray.map(({ id }) => (id.toString() === catId ? '14fr' : '1fr')).join(' '),
            }}
        >
            {categoriesArray.map((cardData) => (
                <CategoryCard key={cardData.categoryTitle} cardData={cardData} />
            ))}
        </nav>
    );
};

export default Nav;

const CategoryCard: FC<{
    cardData: DataBase[MENU_CATEGORY];
}> = ({ cardData }) => {
    const { id, categoryTitle, posts, categoryBlurb } = cardData;

    const [BackgroundSvg] = useMemo(() => GetBackgroundSvg(categoryTitle), [categoryTitle]);

    const navigate = useNavigate();
    const { catId } = useParams();
    const isIndexEven = id % 2 === 0;

    const [refCallback] = useAnimationOnMount({
        animationProps: {
            animationName: isIndexEven ? 'streak-to-right' : 'streak-to-left',
            animationDuration: 300,
            animationDelay: 100 * id,
            animationFillMode: 'backwards',
            animationIterationCount: 1,
        },
        startDelay: bars_totalDuration / 2,
        displayAtStart: false,
    });

    const isThisCategoryOpen = useMemo(() => (catId ? parseInt(catId) === id : false), [catId, id]);

    const isDesktop = useBreakpoint('sm');
    const paddingStyle_Memo = useMemo(() => {
        if (catId && !isThisCategoryOpen) {
            const openedIndex = catId ? parseInt(catId) : null;
            if (id < openedIndex!) {
                return { '--tw-translate-y': isDesktop ? '0.75rem' : '0.666rem' } as unknown as CSSTransition;
            } else if (id > openedIndex!) {
                return { '--tw-translate-y': isDesktop ? '-2rem' : '-1.5rem' } as unknown as CSSTransition;
            }
        }
    }, [isThisCategoryOpen, catId, id, isDesktop]);

    const [postCardsParentRef_Cb, { width: postCardsParentWidth, height: postCardsParentHeight }] = useMeasure<HTMLDivElement>();

    return (
        <div
            ref={refCallback}
            className={classNames(
                '[--tab-anim-delay:200ms]',
                'group/category color-red-500 pointer-events-auto relative flex size-full transform-gpu cursor-pointer flex-col items-center justify-center overflow-y-hidden transition-[background-color] duration-200',
                isThisCategoryOpen
                    ? 'bg-[--color-primary-active-cat-bg] p-2 sm:p-4'
                    : catId
                      ? 'bg-[--color-primary-inactive-cat-bg] hover:bg-[--color-primary-active-cat-bg]'
                      : 'bg-[--color-primary-active-cat-bg] hover:bg-[--color-primary-active-cat-bg]',
            )}
            onClick={() => {
                navigate(catId === id.toString() ? '/' : `/${id}`);
            }}
        >
            <div
                className={classNames(
                    '[--category-padding:theme(spacing.[1.5])] sm:[--category-padding:theme(spacing.2)]',
                    'shadow-theme-primary-950 relative flex flex-col items-start justify-start overflow-hidden',
                    // 'after:absolute after:bottom-0 after:h-[--category-padding] after:w-full after:bg-[--color-primary-content-bg]',
                    isThisCategoryOpen ? 'size-full drop-shadow-lg' : '',
                )}
            >
                {/* Tab: */}
                <div
                    className={classNames(
                        'relative px-[calc(var(--category-padding)*2)] py-[--category-padding] transition-[margin-left,transform] [--swipe-delay:75ms]',
                        isThisCategoryOpen
                            ? 'ml-0 translate-x-0 bg-[--color-primary-content-bg]'
                            : catId
                              ? 'ml-[50%] -translate-x-1/2'
                              : 'before:absolute before:bottom-0 before:left-0 before:h-0 before:w-full before:border-t-0 before:border-t-[--theme-accent-200] before:transition-[height,border-top-color,border-top-width] before:delay-[--swipe-delay] before:duration-[--swipe-delay] group-hover/category:before:h-full group-hover/category:before:border-t-[3px] group-hover/category:before:border-t-transparent group-hover/category:before:delay-[0s,calc(var(--tab-anim-delay)/2),0s] group-hover/category:before:duration-[var(--tab-anim-delay),calc(var(--tab-anim-delay)/2),var(--swipe-delay)] group-active/category:before:transition-none' +
                                ' after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0 after:w-full after:bg-[--color-primary-content-bg] after:drop-shadow-lg after:transition-[height] after:delay-[--swipe-delay] after:duration-100 group-hover/category:after:h-full group-hover/category:after:duration-[--tab-anim-delay] group-active/category:after:h-full group-active/category:after:transition-none',
                    )}
                    style={{
                        ...paddingStyle_Memo,
                    }}
                >
                    <h1
                        className={classNames(
                            'text-stroke-outer relative z-20 m-auto transform-gpu select-none whitespace-nowrap font-protest-strike text-4xl leading-none transition-[transform,color] duration-[--tab-anim-delay] before:size-full before:transition-[-webkit-text-stroke-color] before:duration-[--tab-anim-delay] before:content-[attr(data-title)] before:[-webkit-text-stroke-color:--theme-secondary-900] before:[-webkit-text-stroke-width:5px] sm:text-5xl sm:before:[-webkit-text-stroke-width:4px]',
                            isThisCategoryOpen
                                ? 'text-4xl text-[--color-secondary-active-cat] sm:text-5xl'
                                : catId
                                  ? 'scale-90 text-[--color-secondary-inactive-cat] group-hover/category:text-[--color-secondary-active-cat] group-hover/category:!duration-75 group-hover/category:before:[-webkit-text-stroke-color:--theme-secondary-900] group-active/category:text-[--color-secondary-active-cat] group-active/category:!duration-75 group-active/category:before:[-webkit-text-stroke-color:--theme-secondary-900]'
                                  : 'text-[--color-secondary-active-cat] group-hover/category:!duration-75 group-hover/category:before:[-webkit-text-stroke-color:--theme-secondary-800] group-active/category:!duration-75 group-active/category:before:[-webkit-text-stroke-color:--theme-secondary-800]',
                        )}
                        data-title={categoryTitle}
                    >
                        {categoryTitle}
                    </h1>
                </div>

                {/* Testimonials & PostCards etc: */}
                {isThisCategoryOpen && (
                    <div className='-mt-[--category-padding] flex size-full flex-col items-center justify-start overflow-y-hidden bg-[--color-primary-content-bg] px-[calc(var(--category-padding)*1)] py-[--category-padding] [--color-text-testimonial:--theme-accent-400] [--text-width:33.3333%] sm:flex-row sm:items-start sm:justify-between'>
                        <div
                            className={classNames(
                                'absolute flex items-end self-start bg-[--color-primary-content-bg] pt-[--category-padding] transition-[height] duration-500 sm:w-[--text-width]',
                                // 'min-w-[25%] sm:basis-1/3',
                                '',
                                isThisCategoryOpen
                                    ? 'bg-[--color-primary-content-bg]'
                                    : catId
                                      ? 'h-0 clip-inset-y-1/2'
                                      : 'clip-inset-y-1/2 group-hover/category:!duration-100 group-hover/category:clip-inset-y-2/5',
                            )}
                        >
                            <div
                                className={classNames(
                                    'relative z-10 select-none text-pretty bg-[--color-primary-content-bg] font-besley text-base text-[--color-text-testimonial] transition-transform duration-300 sm:text-2xl',
                                    isThisCategoryOpen ? 'translate-x-0 delay-500 duration-300' : '-translate-x-[200%] delay-0 duration-0',
                                )}
                            >
                                <Markdown className='mrkdwn' remarkPlugins={[remarkBreaks]}>
                                    {categoryBlurb}
                                </Markdown>
                            </div>
                        </div>

                        <div ref={postCardsParentRef_Cb} className='relative size-full'>
                            <PostCards posts={posts} postCardsParentWidth={postCardsParentWidth} postCardsParentHeight={postCardsParentHeight} />
                        </div>
                    </div>
                )}
            </div>

            {/* Background Svg: */}
            <div
                className={classNames(
                    '[--clip-final:theme(spacing.1)] [--outside-clip-x:25%] [--outside-clip-y:20%] [--second-anim-duration:calc(var(--tab-anim-delay)*2)] sm:[--clip-final:theme(spacing.2)] sm:[--outside-clip-x:35%] sm:[--outside-clip-y:25%]',
                    'absolute -z-10 size-full object-cover',
                    'after:transition-[right,left,top,bottom] after:[--corner-inset-x:--outside-clip-x] after:[--corner-inset-y:--outside-clip-y] after:[--corner-outline-color:--theme-secondary-400] after:[transition-timing-function:ease-in-out]',
                    isThisCategoryOpen
                        ? 'after:nav-card-corners clip-inset-[--clip-final] after:![--corner-inset-x:--clip-final] after:![--corner-inset-y:--clip-final] after:![--corner-outline-color:--theme-accent-200]'
                        : catId
                          ? '*:hidden'
                          : 'after:nav-card-corners animate-[calc((var(--tab-anim-delay)+var(--second-anim-duration))/2)_ease-in-out_0s_1_normal_forwards_running_shrink-corners] after:delay-[0s,0s,var(--tab-anim-delay),var(--tab-anim-delay)] after:duration-[var(--tab-anim-delay),var(--tab-anim-delay),calc(var(--tab-anim-delay)/2),calc(var(--tab-anim-delay)/2)] group-hover/category:animate-[calc(var(--tab-anim-delay)+var(--second-anim-duration))_ease-in-out_0s_1_normal_forwards_running_expand-corners] group-hover/category:after:delay-[var(--tab-anim-delay),var(--tab-anim-delay),0s,0s] group-hover/category:after:duration-[var(--second-anim-duration),var(--second-anim-duration),var(--tab-anim-delay),var(--tab-anim-delay)] group-hover/category:after:[--corner-inset-x:--clip-final] group-hover/category:after:[--corner-inset-y:--clip-final] group-hover/category:after:[--corner-outline-color:--theme-accent-200] group-active/category:animate-[calc(var(--tab-anim-delay)+var(--second-anim-duration))_ease-in-out_0s_1_normal_forwards_running_expand-corners] group-active/category:after:delay-[var(--tab-anim-delay),var(--tab-anim-delay),0s,0s] group-active/category:after:duration-[--tab-anim-delay] group-active/category:after:[--corner-inset-x:--clip-final] group-active/category:after:[--corner-inset-y:--clip-final] group-active/category:after:[--corner-outline-color:--theme-accent-200]',
                )}
            >
                <BackgroundSvg
                    className={classNames(
                        'fill-[--color-primary-content-bg] stroke-[--color-primary-content-bg] transition-opacity duration-[--tab-anim-delay]',
                        isThisCategoryOpen ? 'opacity-80' : 'opacity-100',
                    )}
                />
            </div>
        </div>
    );
};

/** Used in Content.tsx */
export const MenuOpenedPost: FC<{
    hasImages: boolean;
    codeLink: Post['codeLink'];
    setLightboxTo: React.Dispatch<React.SetStateAction<number | null>>;
}> = ({ hasImages, codeLink, setLightboxTo }) => {
    const navigate = useNavigate();

    const [codeRefCb] = useAnimationOnMount({
        animationProps: {
            animationName: 'outer-ring',
            animationDuration: 850,
            animationDelay: 0,
            animationFillMode: 'forwards',
            animationIterationCount: 3,
        },
        startDelay: 0,
        hiddenAtStart: false,
    });

    return (
        <div className='pointer-events-auto mb-2 ml-auto flex h-8 items-center justify-end rounded-tl bg-transparent sm:mb-0 sm:h-[1.25rem] sm:rounded-tl-sm sm:rounded-tr-sm sm:bg-[--color-bars-post]'>
            {hasImages && (
                <button
                    type='button'
                    className='h-full cursor-pointer px-2 py-0.5 text-sm uppercase transition-colors duration-75 before:absolute before:-top-full before:right-0 before:-z-10 before:hidden before:translate-y-full before:pt-2 before:leading-none before:text-[--theme-secondary-50] before:transition-transform before:duration-100 hover:before:translate-y-0 hover:before:content-["Gallery"] active:before:translate-y-0 active:before:transition-none active:before:content-["Gallery"] sm:px-1 sm:pb-px sm:before:block sm:before:pt-1'
                    onClick={() => setLightboxTo(0)}
                >
                    <PhotoIcon className='aspect-square h-full stroke-[--color-bars-no-post] hover:stroke-[--theme-accent-800] active:stroke-[--theme-accent-800]' />
                </button>
            )}

            {codeLink && (
                <>
                    <div className='h-3/5 w-0.5 bg-[--theme-primary-600]' />
                    <a
                        className='group inline-block h-full cursor-pointer px-2 py-0.5 transition-colors duration-75 before:absolute before:-top-full before:right-0 before:-z-10 before:hidden before:translate-y-full before:text-nowrap before:pt-2 before:text-sm before:uppercase before:leading-none before:text-[--theme-secondary-50] before:transition-transform before:duration-100 after:content-none hover:before:translate-y-0 hover:before:content-["View_Code"] sm:px-1 sm:pb-px sm:before:block sm:before:pt-1'
                        href={codeLink.href}
                        target='_blank'
                        rel='noreferrer'
                    >
                        <CodeBracketSquareIcon
                            key={codeLink.href}
                            // @ts-expect-error ...
                            ref={codeRefCb}
                            className='aspect-square h-full stroke-[--color-bars-no-post] hover:stroke-[--theme-accent-800] active:stroke-[--theme-accent-800]'
                        />
                        {/* <span className='text-theme-primary-50 absolute right-4 top-full z-50 mt-2 -translate-y-full cursor-default whitespace-nowrap text-right text-sm leading-tight transition-[transform,clip-path] delay-200 duration-500 clip-inset-t-full group-hover:translate-y-0 group-hover:clip-inset-t-0'>
                            {codeLink.alt}
                        </span> */}
                    </a>
                </>
            )}

            {/* TODO fade out instead of instantly closing */}
            <div className='h-3/5 w-0.5 bg-[--theme-primary-600]' />
            <button
                type='button'
                className='h-full cursor-pointer px-1 py-0.5 text-sm uppercase transition-colors duration-75 before:absolute before:-top-full before:right-0 before:-z-10 before:hidden before:translate-y-full before:pt-2 before:leading-none before:text-[--theme-secondary-50] before:transition-transform before:duration-100 hover:before:translate-y-0 hover:before:content-["Close"] sm:px-1 sm:pb-px sm:before:block sm:before:pt-1'
                onClick={() => {
                    navigate('../');
                }}
            >
                <XMarkIcon className='aspect-square h-full stroke-[--color-bars-no-post] hover:stroke-[--theme-accent-800] active:stroke-[--theme-accent-800]' />
            </button>
        </div>
    );
};
