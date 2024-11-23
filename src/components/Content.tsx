import classNames from '../lib/classNames';
import { DataBase, Post, Post_ShowCase, Post_ShowCase_Image, Post_ShowCase_Youtube } from '../types/types';
import { CSSProperties, FC, useCallback, useMemo, useState } from 'react';
import { MenuOpenedPost } from './Nav';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import Lightbox, { SlideImage } from 'yet-another-react-lightbox';
import { Captions } from 'yet-another-react-lightbox/plugins';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import parseDateString from '../lib/parseDateString';
import { ToolsUrls } from '../types/enums';
import { useNavigate, useParams } from 'react-router-dom';
import testDb from '../queries/testDb.json';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const testDbTyped = testDb as DataBase;

const Content = () => {
    const { catId, postId } = useParams();
    const navigate = useNavigate();

    const activeData_Memo = useMemo(() => {
        const activeCat = Object.values(testDbTyped).find((category) => category.id.toString() === catId);
        let activePost: Post | undefined = undefined;
        const allPostIds = activeCat!.posts.map((post) => {
            if (post.id.toString() === postId) {
                activePost = post;
            }

            return post.id;
        });

        return [activePost, allPostIds] as [Post | undefined, number[]];
    }, [catId, postId]);

    const [activePost_Memo, postIds_Memo] = activeData_Memo;
    const { title, subTitle, toolsUsed, showCases, textBlocks, codeLink, date, id } = activePost_Memo ?? {};

    const filteredImages_Memo = useMemo(
        () =>
            showCases &&
            (showCases
                .map((showCase, idx) => {
                    if ('imgUrl' in showCase) {
                        return {
                            src: `${showCase.imgUrl}`,
                            title: showCase.caption,
                            scIndx: idx,
                        };
                    }
                })
                .filter(Boolean) as (SlideImage & { scIndx: number })[]),
        [showCases],
    );

    const date_Memo = useMemo(() => parseDateString(date ?? ''), [date]);
    const { year, month, day } = date_Memo;

    const [lightboxTo, setLightboxTo] = useState<number | null>(null);

    /* NOTE Lightbox uses SlideImage Type (see above), so we need to jump through some hoops to pick correct SlideImage index from Post_ShowCase index */
    const setLightBoxSlide_Cb = useCallback(
        (showCaseIndex: number) => filteredImages_Memo && setLightboxTo(filteredImages_Memo.findIndex((slide) => slide.scIndx === showCaseIndex)),
        [filteredImages_Memo],
    );

    return (
        <main className='z-0 size-full'>
            <div className='relative mx-auto flex h-full w-[--post-width] min-w-[--post-width] flex-col bg-[--theme-bg-lighter]'>
                {/* Floating Title: */}
                <div className='pointer-events-none absolute bottom-[calc(100%+var(--bar-height))] z-10 mx-auto flex w-full items-end justify-center text-center'>
                    <h2 className='absolute translate-y-[calc(50%+(var(--bar-height)/2))] transform-gpu select-none px-3.5 text-[--theme-primary-50] drop-shadow-sm before:absolute before:left-0 before:-z-10 before:h-full before:w-full before:bg-[--color-secondary-active-cat] before:clip-inset-b-[5%] before:clip-inset-t-[0.65rem] sm:translate-y-1/3 sm:px-8 sm:drop-shadow-lg sm:before:w-full sm:before:clip-inset-b-[0%] sm:before:clip-inset-t-[30%]'>
                        {title}
                    </h2>
                    <MenuOpenedPost hasImages={showCases ? true : false} codeLink={codeLink} setLightboxTo={setLightboxTo} />
                    <div
                        className='group/left pointer-events-auto fixed top-[calc(var(--content-height)+var(--header-height))] -translate-x-full translate-y-1/2 cursor-pointer active:-translate-x-[105%] sm:bottom-1/2 sm:left-[calc((100%-var(--post-width))/2)] sm:right-auto sm:top-1/2 sm:translate-y-0'
                        onClick={() => {
                            if (typeof id === 'number') {
                                const currentIndex = postIds_Memo.findIndex((val) => val === id);
                                const previousInArray = postIds_Memo[currentIndex - 1 >= 0 ? currentIndex - 1 : postIds_Memo.length - 1];
                                navigate(`../${previousInArray}`);
                            }
                        }}
                    >
                        <ChevronLeftIcon className='h-[--header-height] stroke-[--color-bars-no-post] opacity-50 group-hover/left:opacity-100 group-active/left:opacity-100 sm:h-16 sm:scale-x-75' />
                    </div>
                    <div
                        className='group/right pointer-events-auto fixed top-[calc(var(--content-height)+var(--header-height))] translate-x-full translate-y-1/2 cursor-pointer active:translate-x-[105%] sm:bottom-1/2 sm:left-auto sm:right-[calc((100%-var(--post-width))/2)] sm:top-1/2 sm:translate-y-0'
                        onClick={() => {
                            if (typeof id === 'number') {
                                const currentIndex = postIds_Memo.findIndex((val) => val === id);
                                const nextInArray = postIds_Memo[currentIndex + 1 < postIds_Memo.length ? currentIndex + 1 : 0];
                                navigate(`../${nextInArray}`);
                            }
                        }}
                    >
                        <ChevronRightIcon className='h-[--header-height] stroke-[--color-bars-no-post] opacity-50 group-hover/right:opacity-100 group-active/right:opacity-100 sm:h-16 sm:scale-x-75' />
                    </div>
                </div>

                {textBlocks ? (
                    <div
                        className='scroll-gutter-both relative flex flex-col overflow-y-auto px-4 py-6 scrollbar-thin [--image-outline-width:theme(outlineWidth[2])] [--image-transition-duration:theme(transitionDuration.500)] [--scrollbar-thumb:--color-bars-post] sm:px-6 sm:py-6 xl:px-16 xl:py-12'
                        // onBlur={() => store_activePost(null)} // TODO
                    >
                        {/* (Sub-)Header, date, "Built with" */}
                        <div className='flex w-full items-start justify-between pb-2 pt-8 sm:py-8'>
                            <h4 className='leading-none'>{subTitle}</h4>
                            <div className='relative mt-1 flex flex-col items-end justify-start'>
                                <h5 className='headline-bg -mr-0.5 w-fit text-[--bg-color] no-underline'>
                                    {day && `${day}.`}
                                    {month && `${month}.`}
                                    {year && `${year}`}
                                </h5>
                                <ToolsUsed tools={toolsUsed} />
                            </div>
                        </div>

                        <div className='flex flex-col gap-y-8 sm:gap-y-16'>
                            {/* Text/Image Blocks */}
                            {textBlocks?.map(({ text, useShowCaseIndex }, idx) => {
                                const isBlockIndexEven = idx % 2 === 0;
                                const showCase = showCases && typeof useShowCaseIndex === 'number' ? showCases[useShowCaseIndex] : undefined;

                                return (
                                    <div
                                        key={`${idx}-${isBlockIndexEven}`}
                                        className='flex h-fit flex-col items-stretch justify-start sm:flex-row sm:items-start sm:justify-between'
                                    >
                                        {showCase && (
                                            <div
                                                className={classNames(
                                                    'group relative max-h-48 min-h-[--min-height] w-full cursor-pointer overflow-hidden drop-shadow-md [--min-height:theme(spacing.48)] sm:max-h-64 sm:w-auto sm:basis-2/5 sm:[--min-height:theme(spacing.56)]',
                                                    isBlockIndexEven
                                                        ? idx === 0
                                                            ? 'mt-4 sm:order-2 sm:ml-12 sm:mt-4'
                                                            : 'mt-4 sm:order-2 sm:ml-12 sm:mt-0'
                                                        : 'mb-4 sm:order-1 sm:mb-0 sm:mr-12',
                                                )}
                                                onClick={() => (showCase as Post_ShowCase_Image).imgUrl && setLightBoxSlide_Cb(useShowCaseIndex!)}
                                            >
                                                {(showCase as Post_ShowCase_Youtube).youtubeUrl ? (
                                                    <iframe
                                                        src={(showCase as Post_ShowCase_Youtube).youtubeUrl.replace(
                                                            'https://www.youtube.com/watch?v=',
                                                            'https://www.youtube.com/embed/',
                                                        )}
                                                        title='YouTube video player'
                                                        referrerPolicy='strict-origin-when-cross-origin'
                                                        allowFullScreen
                                                        className='size-full min-h-[--min-height]'
                                                    />
                                                ) : (
                                                    <img src={(showCase as Post_ShowCase_Image).imgUrl} className='size-full object-cover' />
                                                )}
                                                {showCase.caption && (
                                                    <div className='absolute bottom-0 max-h-full w-full bg-neutral-500/60 px-4 text-center text-sm text-neutral-50 transition-[background-color,max-height,padding] mask-edges-x-2/5 group-hover:bg-neutral-500 group-hover:py-2 sm:max-h-0 sm:pb-0 sm:pt-2 sm:group-hover:max-h-full'>
                                                        {showCase.caption}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div
                                            className={classNames(
                                                '-mt-1 text-pretty text-justify leading-tight sm:leading-normal',
                                                showCase ? 'flex-1' : 'mr-auto sm:basis-4/5',
                                                isBlockIndexEven ? 'order-1' : 'order-2',
                                                idx === 0
                                                    ? 'first-letter:-ml-0.5 first-letter:align-text-bottom first-letter:text-[2rem] first-letter:leading-[2rem] first-letter:text-[--theme-secondary-400]'
                                                    : '',
                                            )}
                                        >
                                            <Markdown className='mrkdwn' remarkPlugins={[remarkBreaks]}>
                                                {text}
                                            </Markdown>
                                        </div>

                                        <br />
                                    </div>
                                );
                            })}
                        </div>

                        {showCases && <RemainingImages showCases={showCases} textBlocks={textBlocks} setLightBoxSlide={setLightBoxSlide_Cb} />}

                        <Lightbox
                            open={Number.isInteger(lightboxTo)}
                            index={lightboxTo ?? 0}
                            close={() => setLightboxTo(null)}
                            slides={filteredImages_Memo}
                            plugins={[Captions]}
                        />
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </main>
    );
};

export default Content;

const ToolsUsed: FC<{ tools: Post['toolsUsed'] }> = ({ tools }) => {
    const toolsSorted_Memo = useMemo(() => {
        if (tools) {
            return [...tools];
            // return [...tools].sort((a, b) => a.length - b.length);
        } else return null;
    }, [tools]);

    return toolsSorted_Memo ? (
        <div className='absolute right-0 mt-8'>
            <div
                className={
                    'group/menu ml-auto flex max-w-[50%] cursor-pointer flex-col items-end justify-start overflow-hidden transition-[max-width] delay-[calc(2*var(--tools-transition-delay))] duration-[--tools-transition-duration] hover:max-w-full hover:delay-0' +
                    ' ' +
                    '[--tools-transition-delay:300ms] [--tools-transition-duration:400ms]'
                }
            >
                <div className='border-b-theme-primary-50 text-theme-primary-50 mb-1.5 w-full max-w-12 text-nowrap border-b pb-px text-right text-xs lowercase italic leading-none transition-[max-width] delay-[calc(2*var(--tools-transition-delay))] duration-[--tools-transition-duration] group-hover/menu:max-w-full group-hover/menu:delay-0'>
                    Built with:
                </div>
                <div
                    className='relative z-10 grid select-none grid-rows-[1fr_repeat(var(--tools-count),0.5fr)] gap-y-px transition-[border-right-color,grid-template-rows,row-gap,] delay-[var(--tools-transition-delay),0ms] duration-[--tools-transition-duration] mask-edges-r-[0.25rem_0.25] group-hover/menu:grid-rows-[1fr_repeat(var(--tools-count),1fr)] group-hover/menu:gap-y-0.5 group-hover/menu:border-r-transparent group-hover/menu:delay-[var(--tools-transition-delay),calc(2*var(--tools-transition-delay))] group-hover/menu:mask-edges-r-0'
                    /* Using length -1 in variable --tools-count in order to have last element at full size, for 'stacked' look */
                    style={{ '--tools-count': toolsSorted_Memo.length - 1 } as CSSProperties}
                >
                    {toolsSorted_Memo.map((tool, idx) => {
                        return (
                            <a
                                key={tool + idx}
                                className='group/link [--border-color:--theme-secondary-50)] [--link-all-text-color:--theme-primary-50)] inline-block translate-x-[--tools-translate-x] transform-gpu overflow-hidden whitespace-nowrap rounded-sm border border-[--border-color] border-t-transparent px-2 py-1 text-center text-2xs leading-none text-[--link-all-text-color] transition-[transform,border-top-color,clip-path] delay-[var(--tools-transition-delay),0ms] duration-[--tools-transition-duration] clip-inset-0 clip-inset-t-px first:border-t-[--border-color] first:clip-inset-0 visited:text-[--link-all-text-color] group-hover/menu:translate-x-0 group-hover/menu:border-t-[--border-color] group-hover/menu:delay-[var(--tools-transition-delay),calc(2*var(--tools-transition-delay))] hover:bg-[--theme-secondary-500] hover:no-underline'
                                href={ToolsUrls[tool]}
                                style={{ '--tools-translate-x': `${idx + 1 * 4}px` } as CSSProperties}
                            >
                                {/* Clip contained text for stacked look: */}
                                <div className='-translate-y-full transform-gpu transition-transform duration-[--tools-transition-duration] group-first/link:translate-y-0 group-hover/menu:translate-y-0 group-hover/menu:delay-[calc(2*var(--tools-transition-delay))]'>
                                    {/* Need different transition delays per transform axis, so another child element: */}
                                    <div className='translate-x-2/3 transform-gpu transition-[transform,clip-path] delay-[calc(2*var(--tools-transition-delay))] duration-[--tools-transition-duration] group-hover/menu:translate-x-0 group-hover/menu:delay-0'>
                                        {tool}
                                    </div>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>
        </div>
    ) : null;
};

const RemainingImages: FC<{
    showCases: Post_ShowCase[];
    textBlocks: Post['textBlocks'];
    setLightBoxSlide: (showCaseIndex: number) => void;
}> = ({ showCases, textBlocks, setLightBoxSlide }) => {
    const remaining_Memo = useMemo(
        () =>
            showCases.map((showCase, idx) =>
                !textBlocks.find((textBlock) => idx === textBlock.useShowCaseIndex) ? ([showCase, idx] as [Post_ShowCase_Image, number]) : undefined,
            ),
        [showCases, textBlocks],
    );

    return (
        <div className='mt-10 grid grid-cols-2 gap-2 sm:mt-20 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 2xl:grid-cols-5'>
            {remaining_Memo.map((remain) => {
                const [imageShowCase, imageIndex] = remain || [];

                return imageShowCase && typeof imageIndex === 'number' ? (
                    <img
                        key={imageShowCase.imgUrl + imageIndex}
                        src={imageShowCase.imgUrl}
                        className='max-h-64 w-full cursor-pointer border border-transparent object-cover drop-shadow-sm hover:border-[--color-bars-no-post]'
                        onClick={() => setLightBoxSlide(imageIndex)}
                    />
                ) : null;
            })}
        </div>
    );
};
