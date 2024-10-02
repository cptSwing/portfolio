import { useZustand } from '../lib/zustand';
import classNames from '../lib/classNames';
import { Post, Post_ShowCase, Post_ShowCase_Image, Post_ShowCase_Youtube } from '../types/types';
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

const Content = () => {
    const activePost = useZustand((state) => state.nav.activePost);

    const [lightboxTo, setLightboxTo] = useState<number | null>(null);

    const { title, subTitle, toolsUsed, showCases, textBlocks, codeLink, date } = activePost ?? {};

    const filteredImages_Memo = useMemo(
        () =>
            showCases &&
            (showCases
                .map((showCase, idx) => {
                    if ('imgUrl' in showCase) {
                        return {
                            src: showCase.imgUrl,
                            title: showCase.caption,
                            scIndx: idx,
                        };
                    }
                })
                .filter(Boolean) as (SlideImage & { scIndx: number })[]),
        [showCases],
    );

    /* NOTE Lightbox uses SlideImage Type (see above), so we need to jump through some hoops to pick correct SlideImage index from Post_ShowCase index */
    const setLightBoxSlide_Cb = useCallback(
        (showCaseIndex: number) => filteredImages_Memo && setLightboxTo(filteredImages_Memo.findIndex((slide) => slide.scIndx === showCaseIndex)),
        [filteredImages_Memo],
    );

    const date_Memo = useMemo(() => parseDateString(date ?? ''), [date]);
    const { year, month, day } = date_Memo;

    return (
        <main className='size-full bg-theme-bg-base'>
            {/* Floating Title: */}
            <div
                className={classNames(
                    'nav-checked-width pointer-events-none fixed bottom-full left-0 right-0 z-20 mx-auto flex items-end justify-center transition-[top]',
                    activePost ? 'top-[calc(var(--header-height)-var(--top-bottom-bar-height))]' : 'top-0 delay-[--header-transition-duration] duration-0',
                )}
            >
                <h2 className='translate-y-1/2 px-8 text-theme-neutral-50 drop-shadow-md before:absolute before:left-0 before:-z-10 before:size-full before:bg-theme-secondary-400 before:clip-inset-t-[30%]'>
                    {title}
                </h2>
                <MenuOpenedPost
                    classNames={classNames('transition-[right] duration-[--header-transition-duration]', activePost ? 'right-0 ' : 'right-1/2 ')}
                    hasImages={showCases ? true : false}
                    codeLink={codeLink}
                    setLightboxTo={setLightboxTo}
                />
            </div>

            {activePost ? (
                <div className='nav-checked-width mx-auto flex h-full flex-col bg-[--bg-color] [--bg-color:theme(colors.theme.bg.lighter)]'>
                    <div
                        className='scroll-gutter-both relative flex flex-col overflow-y-auto p-12 scrollbar-thin scrollbar-thumb-theme-primary-400 [--image-outline-width:theme(outlineWidth[2])] [--image-transition-duration:theme(transitionDuration.500)]'
                        // onBlur={() => store_activePost(null)} // TODO
                    >
                        {/* (Sub-)Header, date, "Built with" */}
                        <div className='flex w-full items-start justify-between py-12'>
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

                        <div className='flex flex-col gap-y-16'>
                            {/* Text/Image Blocks */}
                            {textBlocks?.map(({ text, useShowCaseIndex }, idx) => {
                                const isBlockIndexEven = idx % 2 === 0;
                                const showCase = showCases && typeof useShowCaseIndex === 'number' ? showCases[useShowCaseIndex] : undefined;

                                return (
                                    <div key={`${idx}-${isBlockIndexEven}`} className='flex items-start justify-between'>
                                        {showCase && (
                                            <div
                                                className={classNames(
                                                    'group relative basis-2/3 cursor-pointer outline outline-[length:--image-outline-width] -outline-offset-[--image-outline-width] outline-neutral-600 transition-[outline-color] duration-[--image-transition-duration] hover:outline-theme-primary-400',
                                                    isBlockIndexEven ? 'order-2 ml-8' : 'order-1 mr-8',
                                                )}
                                                onClick={() => (showCase as Post_ShowCase_Image).imgUrl && setLightBoxSlide_Cb(useShowCaseIndex!)}
                                            >
                                                {(showCase as Post_ShowCase_Youtube).youtubeUrl ? (
                                                    <iframe
                                                        width='100%'
                                                        height='400'
                                                        src={(showCase as Post_ShowCase_Youtube).youtubeUrl.replace(
                                                            'https://www.youtube.com/watch?v=',
                                                            'https://www.youtube.com/embed/',
                                                        )}
                                                        title='YouTube video player'
                                                        referrerPolicy='strict-origin-when-cross-origin'
                                                        allowFullScreen
                                                    />
                                                ) : (
                                                    <img src={(showCase as Post_ShowCase_Image).imgUrl} className='w-full object-cover' />
                                                )}
                                                {showCase.caption && (
                                                    <div
                                                        className={classNames(
                                                            'absolute bottom-0 min-w-0 bg-theme-neutral-300/60 px-4 py-1 text-center text-sm text-theme-accent-700 transition-[background-color,min-width] duration-[--image-transition-duration] clip-inset-[--image-outline-width] clip-inset-t-0 group-hover:min-w-full group-hover:bg-theme-neutral-300',
                                                            isBlockIndexEven ? 'left-0 mask-edges-r-2/5' : 'right-0 mask-edges-l-2/5',
                                                        )}
                                                    >
                                                        {showCase.caption}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div
                                            className={classNames(
                                                '-mt-1 text-pretty text-justify leading-normal',
                                                showCase ? 'flex-1' : 'mr-auto basis-4/5',
                                                isBlockIndexEven ? 'order-1' : 'order-2',
                                                idx === 0
                                                    ? 'first-letter:-ml-0.5 first-letter:pr-px first-letter:align-text-bottom first-letter:text-[2rem] first-letter:italic first-letter:leading-[2rem] first-letter:text-theme-secondary-600 first-line:italic'
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

                        {showCases && <RemainingImages showCases={showCases} textBlocks={textBlocks!} setLightBoxSlide={setLightBoxSlide_Cb} />}
                    </div>

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
                <div className='mb-1.5 w-full max-w-12 text-nowrap border-b border-b-theme-primary-50 pb-px text-right text-xs lowercase italic leading-none text-theme-primary-50 transition-[max-width] delay-[calc(2*var(--tools-transition-delay))] duration-[--tools-transition-duration] group-hover/menu:max-w-full group-hover/menu:delay-0'>
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
                                className='group/link inline-block translate-x-[--tools-translate-x] transform-gpu overflow-hidden whitespace-nowrap rounded-sm border border-[--border-color] border-t-transparent px-2 py-1 text-center text-2xs leading-none text-[--link-all-text-color] transition-[transform,border-top-color,clip-path] delay-[var(--tools-transition-delay),0ms] duration-[--tools-transition-duration] clip-inset-0 clip-inset-t-px [--border-color:theme(colors.theme.secondary.50)] [--link-all-text-color:theme(colors.theme.primary.50)] first:border-t-[--border-color] first:clip-inset-0 visited:text-[--link-all-text-color] group-hover/menu:translate-x-0 group-hover/menu:border-t-[--border-color] group-hover/menu:delay-[var(--tools-transition-delay),calc(2*var(--tools-transition-delay))] hover:bg-theme-secondary-500/50 hover:no-underline'
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
        <div className='mt-14 grid grid-cols-4 gap-4'>
            {remaining_Memo.map((remain) => {
                const [imageShowCase, imageIndex] = remain || [];

                return imageShowCase && typeof imageIndex === 'number' ? (
                    <img
                        key={imageShowCase.imgUrl + imageIndex}
                        src={imageShowCase.imgUrl}
                        className='max-h-64 w-full cursor-pointer object-cover outline outline-[length:--image-outline-width] -outline-offset-[--image-outline-width] outline-neutral-600 transition-[outline-color] duration-[--image-transition-duration] hover:outline-theme-primary-400'
                        onClick={() => setLightBoxSlide(imageIndex)}
                    />
                ) : null;
            })}
        </div>
    );
};
