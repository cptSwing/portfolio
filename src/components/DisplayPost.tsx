import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FC, useCallback, useMemo, useState } from 'react';
import Markdown from 'react-markdown';
import { useParams, Link } from 'react-router-dom';
import remarkBreaks from 'remark-breaks';
import Lightbox, { SlideImage } from 'yet-another-react-lightbox';
import { Captions } from 'yet-another-react-lightbox/plugins';
import 'yet-another-react-lightbox/styles.css';
import classNames from '../lib/classNames';
import parseDateString from '../lib/parseDateString';
import { DataBase, Post, Post_ShowCase, Post_ShowCase_Image, Post_ShowCase_Youtube } from '../types/types';
import testDb from '../queries/testDb.json';

const testDbTyped = testDb as DataBase;

const DisplayPost = () => {
    const { catId, postId } = useParams();

    const activeData_Memo = useMemo(() => {
        const activeCat = Object.values(testDbTyped).find((category) => category.id.toString() === catId);
        let activePost: Post | undefined = undefined;
        const postIds = activeCat?.posts.map((post) => {
            if (post.id.toString() === postId) {
                activePost = post;
            }

            return post.id;
        });

        return [activePost, postIds] as [Post | undefined, number[]];
    }, [catId, postId]);

    const [activePost_Memo, postIds_Memo] = activeData_Memo;
    const { title, subTitle, /* toolsUsed, */ showCases, textBlocks, date, id } = activePost_Memo ?? {};

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
        (showCaseIndex: number) => {
            filteredImages_Memo && setLightboxTo(filteredImages_Memo.findIndex((slide) => slide.scIndx === showCaseIndex));
        },
        [filteredImages_Memo],
    );

    return postIds_Memo ? (
        <div className='absolute left-0 top-0 size-full bg-theme-text-background px-[6%] pb-4 pt-12 text-theme-text transition-[clip-path] clip-inset-r-[--clip-post] clip-inset-t-[-10%]'>
            <header className='pointer-events-none absolute -top-5 left-0 right-0 z-10 mx-auto flex items-start justify-center text-center'>
                {/* Floating Title: */}
                <h2 className='select-none px-4 text-3xl text-theme-text-background drop-shadow-lg before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:bg-theme-secondary before:clip-inset-t-[30%]'>
                    {title}
                </h2>

                <nav className='pointer-events-auto absolute right-0 flex'>
                    {/* Previous Post */}
                    <button>
                        <Link
                            to={(() => {
                                const currentIndex = postIds_Memo.findIndex((val) => val === id);
                                const previousInArray = postIds_Memo[currentIndex - 1 >= 0 ? currentIndex - 1 : postIds_Memo.length - 1];
                                return `/${catId}/${previousInArray}`;
                            })()}
                        >
                            <ChevronLeftIcon
                                className='h-6 scale-75 cursor-pointer stroke-green-400 opacity-50 transition-[stroke,opacity] duration-75 hover-active:stroke-green-700 hover-active:opacity-100' /* stroke-[--color-bars-no-post] */
                            />
                        </Link>
                    </button>

                    {/* Next Post */}
                    <button>
                        <Link
                            to={(() => {
                                const currentIndex = postIds_Memo.findIndex((val) => val === id);
                                const nextInArray = postIds_Memo[currentIndex + 1 < postIds_Memo.length ? currentIndex + 1 : 0];
                                return `/${catId}/${nextInArray}`;
                            })()}
                        >
                            <ChevronRightIcon
                                className='h-6 scale-75 cursor-pointer stroke-green-400 opacity-50 transition-[stroke,opacity] duration-75 hover-active:stroke-green-700 hover-active:opacity-100' /* stroke-[--color-bars-no-post] */
                            />
                        </Link>
                    </button>

                    {/* Close */}
                    <button>
                        <Link to={`/${catId}`}>
                            <XMarkIcon className='h-6 cursor-pointer stroke-green-400 transition-[stroke] duration-75 hover-active:stroke-green-700' />
                        </Link>
                    </button>
                </nav>
            </header>

            <main className='scroll-gutter-both flex h-full origin-center flex-col overflow-y-scroll pl-[2%] pr-[3%] duration-300 scrollbar-thin'>
                {textBlocks ? (
                    <div className='flex flex-col'>
                        {/* (Sub-)Header, date, "Built with" */}
                        <h4 className='h-fit leading-none'>
                            <span className='text-left'>{subTitle}</span>
                            <span className='text-right text-[--bg-color] no-underline'>
                                {day && `${day}.`}
                                {month && `${month}.`}
                                {year && `${year}`}
                            </span>
                        </h4>

                        {/* Text/Image Blocks */}
                        {textBlocks?.map(({ text, useShowCaseIndex }, idx) => {
                            const showCase = showCases && typeof useShowCaseIndex === 'number' ? showCases[useShowCaseIndex] : undefined;
                            return (
                                <TextImageBlock
                                    key={`${idx}-${useShowCaseIndex}`}
                                    text={text}
                                    blockIndex={idx}
                                    showCase={showCase}
                                    lightboxCallback={() => typeof useShowCaseIndex === 'number' && setLightBoxSlide_Cb(useShowCaseIndex)}
                                />
                            );
                        })}

                        {/* Gallery below text */}
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
            </main>
        </div>
    ) : (
        <></>
    );
};

export default DisplayPost;

const TextImageBlock: FC<{ text: string; blockIndex: number; showCase?: Post_ShowCase; lightboxCallback: () => void }> = ({
    text,
    blockIndex,
    showCase,
    lightboxCallback,
}) => {
    const isBlockIndexEven = blockIndex % 2 === 0;

    return (
        <div className='my-4'>
            {showCase && (
                <div
                    className={classNames(
                        'group relative aspect-video max-h-64 w-2/5 cursor-pointer overflow-hidden bg-cover bg-top drop-shadow-md',
                        isBlockIndexEven ? 'float-right ml-4' : 'float-left mr-4',
                    )}
                    onClick={() => (showCase as Post_ShowCase_Image).imgUrl && lightboxCallback()}
                >
                    {(showCase as Post_ShowCase_Youtube).youtubeUrl ? (
                        <iframe
                            src={(showCase as Post_ShowCase_Youtube).youtubeUrl.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/')}
                            title='YouTube video player'
                            referrerPolicy='strict-origin-when-cross-origin'
                            allowFullScreen
                            className='size-full skew-x-[calc(var(--clip-shape-skew-angle)*-1)] scale-105'
                        />
                    ) : (
                        <img src={(showCase as Post_ShowCase_Image).imgUrl} className='skew-x-[calc(var(--clip-shape-skew-angle)*-1)] scale-105' />
                    )}
                    {showCase.caption && (
                        <div className='absolute bottom-0 max-h-full w-full bg-neutral-500/60 px-4 text-center text-sm text-neutral-50 transition-[background-color,max-height,padding] mask-edges-x-2/5 group-hover-active:bg-neutral-500 group-hover-active:py-2 sm:max-h-0 sm:pb-0 sm:pt-2 sm:group-hover-active:max-h-full'>
                            {showCase.caption}
                        </div>
                    )}
                </div>
            )}

            <Markdown
                components={{
                    p: ({ children }) => (
                        <p
                            className={classNames(
                                'text-pretty text-justify leading-tight tracking-wide sm:leading-normal' /* skew-x-[calc(var(--clip-shape-skew-angle)*-1)] */,
                                blockIndex === 0
                                    ? 'first-of-type:first-letter:-ml-0.5 first-of-type:first-letter:align-text-bottom first-of-type:first-letter:text-[2rem] first-of-type:first-letter:leading-[1.84rem] first-of-type:first-letter:text-red-800'
                                    : '',
                            )}
                        >
                            {children}
                        </p>
                    ),
                    h5: ({ children }) => <h5 className='w-fit'>{children}</h5>,
                }}
                remarkPlugins={[remarkBreaks]}
            >
                {text}
            </Markdown>
        </div>
    );
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
        <div className='grid grid-cols-2 gap-2 pb-5 pt-10 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 2xl:grid-cols-5'>
            {remaining_Memo.map((remain) => {
                const [imageShowCase, imageIndex] = remain || [];

                return imageShowCase && typeof imageIndex === 'number' ? (
                    <div
                        key={imageShowCase.imgUrl + imageIndex}
                        className='max-h-48 w-full overflow-hidden border border-transparent drop-shadow-sm hover-active:border-red-800'
                    >
                        <img
                            src={imageShowCase.imgUrl}
                            className='skew-x-[calc(var(--clip-shape-skew-angle)*-1)] scale-105 cursor-pointer object-cover'
                            onClick={() => setLightBoxSlide(imageIndex)}
                        />
                    </div>
                ) : null;
            })}
        </div>
    );
};
