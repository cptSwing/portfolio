import { DataBase, Post } from '../types/types';
import classNames from '../lib/classNames';
import { FC, useMemo } from 'react';
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

const testDbTyped = testDb as DataBase;
const categoriesArray = Object.values(testDbTyped);

const Nav = () => {
    const { catId, postId } = useParams();

    return (
        <nav
            className={classNames(
                'mx-auto grid transition-[width,height,grid-template-rows,row-gap] duration-500 clip-inset-x-[-5%] clip-inset-y-0',
                catId
                    ? 'h-[calc(96vh-var(--header-height)-var(--bar-height))] min-h-96 w-[--checked-width] gap-y-px sm:h-[80vh]'
                    : 'h-[50vh] min-h-96 w-[--unchecked-width] gap-y-1',
                postId ? 'absolute left-0 right-0 -z-10' : 'z-0 block',
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
        },
        startDelay: 400,
        hiddenAtStart: true,
    });

    const isThisCategoryOpen = useMemo(() => (catId ? parseInt(catId) === id : false), [catId, id]);

    const isDesktop = useBreakpoint('sm');
    const paddingStyle_Memo = useMemo(() => {
        if (catId && !isThisCategoryOpen) {
            const openedIndex = catId ? parseInt(catId) : null;
            if (id < openedIndex!) {
                return { '--tw-translate-y': isDesktop ? '0.75rem' : '1rem' } as unknown as CSSTransition;
            } else if (id > openedIndex!) {
                return { '--tw-translate-y': isDesktop ? '-2rem' : '-1.25rem' } as unknown as CSSTransition;
            }
        }
    }, [isThisCategoryOpen, catId, id, isDesktop]);

    return (
        <div
            ref={refCallback}
            className={classNames(
                'group/category color-red-500 pointer-events-auto relative flex size-full transform-gpu cursor-pointer flex-col items-center justify-center overflow-y-hidden transition-[background-color,margin,width,transform] duration-[50ms,500ms,500ms]',
                '[--open-offset:theme(spacing.1)]',
                isThisCategoryOpen
                    ? '-ml-[--open-offset] !w-[calc(var(--checked-width)+(2*var(--open-offset)))] bg-[--color-primary-active-cat-bg] p-2 sm:p-4'
                    : catId
                      ? 'w-[--checked-width] bg-[--color-primary-inactive-cat-bg] hover:bg-[--color-primary-active-cat-bg]'
                      : 'w-[--unchecked-width] bg-[--color-primary-active-cat-bg] hover:bg-[--color-primary-active-cat-bg]',
            )}
            onClick={() => {
                navigate(catId === id.toString() ? '/' : `/${id}`);
            }}
        >
            <div
                className={classNames(
                    '[--category-padding:theme(spacing.[1.5])] sm:[--category-padding:theme(spacing.2)]',
                    'shadow-theme-primary-950 relative flex flex-col items-start justify-start overflow-hidden',
                    isThisCategoryOpen ? 'size-full drop-shadow-lg' : '',
                )}
            >
                {/* Tab: */}
                <div
                    className={classNames(
                        '[--tab-anim-delay:200ms]',
                        'px-[calc(var(--category-padding)*2)] py-[--category-padding] transition-[filter,background-color,margin-left,transform]',
                        isThisCategoryOpen
                            ? 'ml-0 translate-x-0 bg-[--color-primary-content-bg]'
                            : catId
                              ? 'ml-[50%] -translate-x-1/2'
                              : 'bg-transparent group-hover/category:drop-shadow-lg group-hover/category:delay-[var(--tab-anim-delay),var(--tab-anim-delay),0ms] group-hover/category:duration-[var(--tab-anim-delay),150ms] group-active/category:drop-shadow-lg group-active/category:delay-[var(--tab-anim-delay),var(--tab-anim-delay),0ms] group-active/category:duration-[var(--tab-anim-delay),150ms]' +
                                ' before:absolute before:left-1/2 before:top-0 before:-z-10 before:size-full before:-translate-x-1/2 before:bg-[--theme-accent-800] before:opacity-0 before:transition-[clip-path] before:clip-inset-t-[calc(100%-theme(spacing.1))] before:clip-inset-x-px group-hover/category:before:opacity-50 group-hover/category:before:clip-inset-px group-active/category:before:opacity-50 group-active/category:before:clip-inset-px' +
                                ' after:absolute after:left-0 after:top-0 after:size-full after:drop-shadow-lg after:transition-[clip-path] after:duration-[--tab-anim-delay] after:clip-inset-t-[110%] group-hover/category:after:bg-[--color-primary-content-bg] group-hover/category:after:clip-inset-t-[-10%] group-active/category:after:bg-[--color-primary-content-bg] group-active/category:after:clip-inset-t-[-10%]',
                    )}
                    style={{
                        ...paddingStyle_Memo,
                    }}
                >
                    <h1
                        className={classNames(
                            'text-stroke-outer relative z-20 m-auto transform-gpu select-none whitespace-nowrap font-protest-strike text-4xl leading-none transition-[transform,color] duration-[--tab-anim-delay] before:size-full before:transition-[-webkit-text-stroke-color] before:duration-[--tab-anim-delay] before:content-[attr(data-title)] before:[-webkit-text-stroke-color:--theme-secondary-900] before:[-webkit-text-stroke-width:5px] sm:text-5xl sm:before:[-webkit-text-stroke-width:6px]',
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

                {/* Testimonials &  etc: */}
                {isThisCategoryOpen && (
                    <div className='-mt-[--category-padding] flex size-full flex-col items-center justify-start overflow-hidden bg-[--color-primary-content-bg] px-[calc(var(--category-padding)*2)] py-[--category-padding] [--color-text-testimonial:--theme-accent-400] sm:flex-row sm:items-start sm:justify-between'>
                        <div
                            className={classNames(
                                'relative flex min-w-[25%] items-end self-start bg-[--color-primary-content-bg] pt-[--category-padding] transition-[height] duration-500 sm:basis-1/4 sm:self-end lg:basis-1/3 2xl:basis-2/5',
                                isThisCategoryOpen
                                    ? 'bg-[--color-primary-content-bg]'
                                    : catId
                                      ? 'h-0 clip-inset-y-1/2'
                                      : 'clip-inset-y-1/2 group-hover/category:!duration-100 group-hover/category:clip-inset-y-2/5',
                            )}
                        >
                            <div
                                className={classNames(
                                    'relative z-10 select-none text-pretty font-besley text-base text-[--color-text-testimonial] transition-transform duration-300 sm:text-2xl',
                                    isThisCategoryOpen ? 'translate-x-0 delay-500 duration-300' : '-translate-x-[200%] delay-0 duration-0',
                                )}
                            >
                                <Markdown className='mrkdwn' remarkPlugins={[remarkBreaks]}>
                                    {categoryBlurb}
                                </Markdown>
                            </div>
                        </div>

                        <div className='mt-2 h-full w-full flex-1 overflow-x-hidden sm:mt-0 sm:w-auto'>
                            <PostCards posts={posts} />
                        </div>
                    </div>
                )}
            </div>

            {/* Background Svg: */}
            <div
                className={classNames(
                    '[--clip-final:theme(spacing.2)] [--outside-clip-x:35%] [--outside-clip-y:25%] [--reveal-duration:200ms]',
                    'absolute -z-10 size-full object-cover',
                    'clip-inset-x-[--outside-clip-x] clip-inset-y-[--outside-clip-y]',
                    'after:transition-[right,left,top,bottom] after:duration-0 after:[--corner-inset-x:--outside-clip-x] after:[--corner-inset-y:--outside-clip-y] after:[--corner-outline-color:--theme-secondary-400]',
                    isThisCategoryOpen
                        ? 'after:nav-card-corners !clip-inset-[--clip-final] after:![--corner-inset-x:--clip-final] after:![--corner-inset-y:--clip-final] after:![--corner-outline-color:--theme-accent-200]'
                        : catId
                          ? '*:hidden'
                          : 'after:nav-card-corners [--second-anim-duration:calc(var(--reveal-duration)/4)] group-hover/category:animate-[calc(var(--reveal-duration)+var(--second-anim-duration))_linear_both_expand-corners] after:group-hover/category:delay-[var(--reveal-duration),var(--reveal-duration),0s,0s] after:group-hover/category:duration-[var(--second-anim-duration),var(--second-anim-duration),var(--reveal-duration),var(--reveal-duration)] after:group-hover/category:ease-linear after:group-hover/category:[--corner-inset-x:--clip-final] after:group-hover/category:[--corner-inset-y:--clip-final] after:group-hover/category:[--corner-outline-color:--theme-accent-200] group-active/category:animate-[calc(var(--reveal-duration)+var(--second-anim-duration))_linear_both_expand-corners] after:group-active/category:delay-[var(--reveal-duration),var(--reveal-duration),0s,0s] after:group-active/category:duration-[--reveal-duration] after:group-active/category:[--corner-inset-x:--clip-final] after:group-active/category:[--corner-inset-y:--clip-final] after:group-active/category:[--corner-outline-color:--theme-accent-200]',
                )}
            >
                <BackgroundSvg
                    className={classNames(
                        'fill-[--color-primary-content-bg] stroke-[--color-primary-content-bg] opacity-50 transition-opacity duration-[--reveal-duration] [--opacity-final:0.9]',
                        isThisCategoryOpen ? 'opacity-[--opacity-final]' : 'group-hover/category:opacity-[--opacity-final]',
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
    classNames?: string;
}> = ({ hasImages, codeLink, setLightboxTo, classNames }) => {
    const navigate = useNavigate();

    return (
        <div className={`pointer-events-auto ml-auto flex h-8 items-center justify-end rounded-tl bg-[--color-bars-post] sm:h-6 sm:rounded-tr ${classNames}`}>
            {hasImages && (
                <button
                    type='button'
                    className='h-full cursor-pointer px-2 py-0.5 text-sm uppercase transition-colors duration-75 before:absolute before:-top-full before:right-0 before:-z-10 before:translate-y-full before:pt-2 before:leading-none before:text-[--theme-secondary-50] before:transition-transform before:duration-100 first:rounded-tl hover:before:translate-y-0 hover:before:content-["Gallery"] active:before:translate-y-0 active:before:content-["Gallery"] sm:last:rounded-tr'
                    onClick={() => setLightboxTo(0)}
                >
                    <PhotoIcon className='aspect-square h-full stroke-[--color-bars-no-post] hover:stroke-[--theme-accent-800] active:stroke-[--theme-accent-800]' />
                </button>
            )}

            {codeLink && (
                <>
                    <div className='h-3/5 w-0.5 bg-[--theme-primary-600]' />
                    <a
                        className='group inline-block h-full cursor-pointer px-2 py-0.5 transition-colors duration-75 before:absolute before:-top-full before:right-0 before:-z-10 before:translate-y-full before:pt-2 before:text-sm before:uppercase before:leading-none before:text-[--theme-secondary-50] before:transition-transform before:duration-100 after:content-none first:rounded-tl hover:before:translate-y-0 hover:before:content-["View_Code"] sm:last:rounded-tr'
                        href={codeLink.href}
                        target='_blank'
                        rel='noreferrer'
                    >
                        <CodeBracketSquareIcon className='aspect-square h-full stroke-[--color-bars-no-post] hover:stroke-[--theme-accent-800] active:stroke-[--theme-accent-800]' />
                        <span className='text-theme-primary-50 absolute right-4 top-full z-50 mt-2 -translate-y-full cursor-default whitespace-nowrap text-right text-sm leading-tight transition-[transform,clip-path] delay-200 duration-500 clip-inset-t-full group-hover:translate-y-0 group-hover:clip-inset-t-0'>
                            {codeLink.alt}
                        </span>
                    </a>
                </>
            )}

            {/* TODO fade out instead of instantly closing */}
            <div className='h-3/5 w-0.5 bg-[--theme-primary-600]' />
            <button
                type='button'
                className='h-full cursor-pointer px-1 py-0.5 text-sm uppercase transition-colors duration-75 before:absolute before:-top-full before:right-0 before:-z-10 before:translate-y-full before:pt-2 before:leading-none before:text-[--theme-secondary-50] before:transition-transform before:duration-100 first:rounded-tl hover:before:translate-y-0 hover:before:content-["Close"] sm:last:rounded-tr'
                onClick={() => {
                    navigate(-1);
                }}
            >
                <XMarkIcon className='aspect-square h-full stroke-red-600 hover:stroke-[--theme-accent-800]' />
            </button>
        </div>
    );
};
