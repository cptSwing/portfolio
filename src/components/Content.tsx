import { useZustand } from '../lib/zustand';
import classNames from '../lib/classNames';
import { Post, Post_Image } from '../types/types';
import { CSSProperties, FC, useCallback, useMemo, useState } from 'react';
import { MenuOpenedPost } from './Nav';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import Lightbox from 'yet-another-react-lightbox';
import { Captions } from 'yet-another-react-lightbox/plugins';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import parseDateString from '../lib/parseDateString';
import { ToolsUrls } from '../types/enums';

const Content = () => {
    return (
        <>
            <main className={classNames('relative z-50 -mb-[2px] flex justify-center')}>
                <ContentWrapper_Test />
            </main>
        </>
    );
};

export default Content;

const ContentWrapper_Test = () => {
    const activePost = useZustand((state) => state.nav.activePost);
    const [topVal, setTopVal] = useState<number>(0);
    const [lightboxTo, setLightboxTo] = useState<number | null>(null);

    const contentRefCb = useCallback((node: HTMLElement | null) => {
        if (node) {
            setTopVal(node.getBoundingClientRect().top);
        }
    }, []);

    if (!activePost) {
        return null;
    }

    const { title, subTitle, toolsUsed, images, textBlocks, codeLink, date } = activePost;
    const { year, month, day } = parseDateString(date);

    return (
        <div
            ref={contentRefCb}
            className={classNames(
                'transform-[width,opacity] absolute bg-theme-bg-base drop-shadow-lg',
                activePost ? 'z-10 h-fit w-screen opacity-100' : '-z-10 h-0 w-full opacity-10',
            )}
        >
            <MenuOpenedPost hasImages={images ? true : false} codeLink={codeLink} setLightboxTo={setLightboxTo} />

            <div
                className='nav-checked-width relative mx-auto flex flex-col overflow-hidden bg-[--bg-color] scrollbar-thumb-theme-primary-400 [--bg-color:theme(colors.theme.bg.lighter)]'
                style={{ height: window.innerHeight - topVal - 2 }}
            >
                {/* Floating Title: */}
                <div className='fixed left-1/2 z-10 -translate-x-1/2 -translate-y-[60%]'>
                    <h2 className='px-8 leading-tight text-theme-neutral-50 shadow before:absolute before:bottom-0 before:left-0 before:-z-10 before:size-full before:bg-theme-secondary-400 before:clip-inset-t-1/3'>
                        {title}
                    </h2>
                </div>

                <div
                    className='relative flex flex-col overflow-y-auto px-14 py-8 scrollbar-thin [--image-outline-width:theme(outlineWidth[2])] [--image-transition-duration:theme(transitionDuration.500)]'
                    style={{ height: window.innerHeight - topVal - 2 }}
                    // onBlur={() => store_activePost(null)} // TODO
                >
                    {/* (Sub-)Header, date, "Built with" */}
                    <div className='relative mb-8 mt-12 w-full'>
                        <h4 className='absolute text-left italic leading-none'>{subTitle}</h4>
                        <div className='float-right flex flex-col items-end justify-start'>
                            <h5 className='headline-skewed-bg -mr-0.5 w-fit text-[--bg-color] no-underline'>
                                {day && `${day}.`}
                                {month && `${month}.`}
                                {year && `${year}`}
                            </h5>
                            <ToolsUsed tools={toolsUsed} />
                        </div>
                    </div>

                    <div className='flex flex-col gap-y-10'>
                        {/* Text/Image Blocks */}
                        {textBlocks?.map(({ text, imageIndex }, idx) => {
                            let imgUrl, caption;
                            if (images && typeof imageIndex === 'number') ({ imgUrl, caption } = images[imageIndex]);

                            const isIndexEven = idx % 2 === 0;

                            return (
                                <div key={`${idx}-${isIndexEven}`} className='flex items-start justify-between'>
                                    {imgUrl && (
                                        <div
                                            className={classNames(
                                                'group relative basis-3/4 cursor-pointer outline outline-[length:--image-outline-width] -outline-offset-[--image-outline-width] outline-neutral-600 transition-[outline-color] duration-[--image-transition-duration] hover:outline-theme-primary-400',
                                                isIndexEven ? 'order-2 ml-8' : 'order-1 mr-8',
                                            )}
                                            onClick={() => setLightboxTo(imageIndex!)}
                                        >
                                            <img src={imgUrl} className='w-full object-cover' />

                                            {caption && (
                                                <div
                                                    className={classNames(
                                                        'absolute bottom-0 min-w-0 bg-theme-neutral-300/60 px-4 py-1 text-center text-sm text-theme-accent-700 transition-[background-color,min-width] duration-[calc(3*var(--image-transition-duration))] clip-inset-[--image-outline-width] clip-inset-t-0 group-hover:min-w-full group-hover:bg-theme-neutral-300',
                                                        isIndexEven ? 'left-0' : 'right-0',
                                                    )}
                                                >
                                                    {caption}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div
                                        className={classNames(
                                            'mrkdwn -mt-1 text-pretty text-justify leading-normal',
                                            imgUrl ? 'flex-1' : 'mr-auto basis-4/5',
                                            isIndexEven ? 'order-1' : 'order-2',
                                            idx === 0
                                                ? 'first-letter:-ml-0.5 first-letter:pr-px first-letter:align-text-bottom first-letter:text-[2rem] first-letter:italic first-letter:leading-[2rem] first-letter:text-theme-secondary-600 first-line:italic first-line:text-theme-secondary-50'
                                                : '',
                                        )}
                                    >
                                        <Markdown remarkPlugins={[remarkBreaks]}>{text}</Markdown>
                                    </div>

                                    <br />
                                </div>
                            );
                        })}
                    </div>

                    <RemainingImages images={images} textBlocks={textBlocks} setLightboxTo={setLightboxTo} />
                </div>

                <Lightbox
                    open={Number.isInteger(lightboxTo)}
                    index={lightboxTo ?? 0}
                    close={() => setLightboxTo(null)}
                    slides={images?.map(({ imgUrl, caption }) => ({ src: imgUrl, title: caption }))}
                    plugins={[Captions]}
                />
            </div>
        </div>
    );
};

const ToolsUsed: FC<{ tools: Post['toolsUsed'] }> = ({ tools }) => {
    const toolsSorted_Memo = useMemo(() => {
        if (tools) {
            return [...tools].sort((a, b) => a.length - b.length);
        } else return null;
    }, [tools]);

    return toolsSorted_Memo ? (
        <div className='group/menu absolute right-0 mt-8 flex cursor-pointer flex-col items-end justify-start'>
            <div className='mb-1 text-xs lowercase italic leading-none text-theme-primary-50'>Built with:</div>
            <div
                className='grid max-w-[50%] select-none grid-rows-[1fr_repeat(var(--tools-count),0.5fr)] gap-y-px border-r-2 border-r-theme-primary-50/20 py-px transition-[max-width,border-right-color,grid-template-rows,row-gap] delay-[500ms,500ms,0ms] duration-[--tools-transition-duration] [--tools-transition-duration:250ms] group-hover/menu:max-w-full group-hover/menu:grid-rows-[1fr_repeat(var(--tools-count),1fr)] group-hover/menu:gap-y-0.5 group-hover/menu:border-r-transparent group-hover/menu:delay-[0ms,0ms,500ms]'
                /* Using length -1 in variable --tools-count in order to have last element at full size, for 'stacked' look */
                style={{ '--tools-count': toolsSorted_Memo.length - 1 } as CSSProperties}
            >
                {toolsSorted_Memo.map((tool, idx) => {
                    return (
                        <a
                            key={tool + idx}
                            className='group/link inline-block overflow-hidden whitespace-nowrap rounded-sm border border-[--border-color] border-r-transparent border-t-transparent px-2 py-1 text-center text-2xs leading-none text-[--link-all-text-color] transition-[border-right-color,border-top-color,clip-path] delay-[500ms,0ms] duration-[--tools-transition-duration] clip-inset-t-px [--border-color:theme(colors.theme.secondary.50)] [--link-all-text-color:theme(colors.theme.primary.50)] first:border-t-[--border-color] first:clip-inset-0 visited:text-[--link-all-text-color] group-hover/menu:border-r-[--border-color] group-hover/menu:border-t-[--border-color] group-hover/menu:delay-[0ms,500ms] group-hover/menu:clip-inset-0 hover:bg-theme-secondary-500/50 hover:no-underline'
                            href={ToolsUrls[tool]}
                        >
                            {/* Clip contained text for stacked look: */}
                            <div className='-translate-y-full transform-gpu transition-transform duration-[--tools-transition-duration] group-first/link:translate-y-0 group-hover/menu:translate-y-0 group-hover/menu:delay-500'>
                                {/* Need different transition delays per transform axis, so another child element: */}
                                <div className='translate-x-1/2 transform-gpu transition-[transform,clip-path] delay-500 duration-[--tools-transition-duration] clip-inset-r-1/3 group-hover/menu:translate-x-0 group-hover/menu:delay-0 group-hover/menu:clip-inset-r-0'>
                                    {tool}
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>
        </div>
    ) : null;
};

const RemainingImages: FC<{
    images: Post_Image[] | undefined;
    textBlocks: Post['textBlocks'];
    setLightboxTo: (value: React.SetStateAction<number | null>) => void;
}> = ({ images, textBlocks, setLightboxTo }) => {
    const remaining_Memo = useMemo(() => {
        if (images) {
            const usedInBlocks = textBlocks.map(({ imageIndex }) => typeof imageIndex === 'number' && imageIndex);

            return images
                .map((postImage, idx) => {
                    if (usedInBlocks.indexOf(idx) < 0) {
                        return [postImage, idx];
                    } else return null;
                })
                .filter((val) => val !== null) as [Post_Image, number][];
        } else return null;
    }, [images, textBlocks]);

    return remaining_Memo ? (
        <div className='mt-14 grid grid-cols-4 gap-4'>
            {remaining_Memo.map(([{ imgUrl }, imgIndex]) => (
                <img
                    key={imgUrl + imgIndex}
                    src={imgUrl}
                    className='size-full cursor-pointer object-cover outline outline-[length:--image-outline-width] -outline-offset-[--image-outline-width] outline-neutral-600 transition-[outline-color] duration-[--image-transition-duration] hover:outline-theme-primary-400'
                    onClick={() => setLightboxTo(imgIndex)}
                />
            ))}
        </div>
    ) : null;
};
