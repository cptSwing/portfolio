import { ChevronLeftIcon, ChevronRightIcon, CodeBracketSquareIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FC, useCallback, useMemo, useState } from 'react';
import Markdown from 'react-markdown';
import { useParams, useNavigate, Link } from 'react-router-dom';
import remarkBreaks from 'remark-breaks';
import Lightbox, { SlideImage } from 'yet-another-react-lightbox';
import { Captions } from 'yet-another-react-lightbox/plugins';
import 'yet-another-react-lightbox/styles.css';
import classNames from '../lib/classNames';
import parseDateString from '../lib/parseDateString';
import { DataBase, Post, Post_ShowCase, Post_ShowCase_Image, Post_ShowCase_Youtube } from '../types/types';
import testDb from '../queries/testDb.json';
import useAnimationOnMount from '../hooks/useAnimationOnMount';

const testDbTyped = testDb as DataBase;

const DisplayPost = () => {
    const { catId, postId } = useParams();
    const navigate = useNavigate();

    const activeData_Memo = useMemo(() => {
        const activeCat = Object.values(testDbTyped).find((category) => category.id.toString() === catId);
        let activePost: Post | undefined = undefined;
        const allPostIds = activeCat?.posts.map((post) => {
            if (post.id.toString() === postId) {
                activePost = post;
            }

            return post.id;
        });

        return [activePost, allPostIds] as [Post | undefined, number[]];
    }, [catId, postId]);

    const [activePost_Memo, postIds_Memo] = activeData_Memo;
    const { title, subTitle, /* toolsUsed, */ showCases, textBlocks, codeLink, date, id } = activePost_Memo ?? {};

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

    return (
        <main className='relative flex size-full skew-x-[--clip-shape-angle-rad] flex-col overflow-hidden bg-[--theme-bg-lighter] px-[calc(var(--clip-shape-tan-post)-1rem)] duration-300'>
            <header className='pointer-events-none absolute left-0 right-0 top-0 z-10 mx-auto flex w-full items-end justify-center text-center'>
                {/* Floating Title: */}
                <h2 className='absolute translate-y-[calc(50%+(var(--bar-height)/2))] select-none px-3.5 text-[--theme-primary-50] drop-shadow-sm before:absolute before:left-0 before:-z-10 before:h-full before:w-full before:bg-[--color-secondary-active-cat] before:clip-inset-b-[5%] before:clip-inset-t-[0.65rem] sm:translate-y-1/3 sm:px-8 sm:drop-shadow-lg sm:before:w-full sm:before:clip-inset-b-[0%] sm:before:clip-inset-t-[30%]'>
                    {title}
                </h2>

                <Menu hasImages={showCases ? true : false} codeLink={codeLink} setLightboxTo={setLightboxTo} />

                {/* Previous Post */}
                <div
                    className='group/left pointer-events-auto fixed top-[calc(var(--content-height)+var(--header-height))] -translate-x-full translate-y-1/2 cursor-pointer active:-translate-x-[105%] sm:bottom-1/2 sm:left-[--clip-shape-width-post-left] sm:right-auto sm:top-1/2 sm:translate-y-0'
                    onClick={() => {
                        if (typeof id === 'number') {
                            const currentIndex = postIds_Memo.findIndex((val) => val === id);
                            const previousInArray = postIds_Memo[currentIndex - 1 >= 0 ? currentIndex - 1 : postIds_Memo.length - 1];
                            navigate(`/${catId}/${previousInArray}`);
                        }
                    }}
                >
                    <ChevronLeftIcon
                        className='h-[--header-height] stroke-green-800 opacity-50 group-hover/left:opacity-100 group-active/left:opacity-100 sm:h-16 sm:scale-x-75' /* stroke-[--color-bars-no-post] */
                    />
                </div>
                {/* Next Post */}
                <div
                    className='group/right pointer-events-auto fixed top-[calc(var(--content-height)+var(--header-height))] translate-x-full translate-y-1/2 cursor-pointer active:translate-x-[105%] sm:bottom-1/2 sm:left-auto sm:right-[calc(100vw-var(--clip-shape-width-post-right)+var(--clip-shape-tan-post))] sm:top-1/2 sm:translate-y-0'
                    onClick={() => {
                        if (typeof id === 'number') {
                            const currentIndex = postIds_Memo.findIndex((val) => val === id);
                            const nextInArray = postIds_Memo[currentIndex + 1 < postIds_Memo.length ? currentIndex + 1 : 0];
                            navigate(`/${catId}/${nextInArray}`);
                        }
                    }}
                >
                    <ChevronRightIcon
                        className='h-[--header-height] stroke-green-800 opacity-50 group-hover/right:opacity-100 group-active/right:opacity-100 sm:h-16 sm:scale-x-75' /* stroke-[--color-bars-no-post] */
                    />
                </div>
            </header>

            {textBlocks ? (
                // Skew Wrapper for skewed scroll-bar  [-webkit-font-smoothing:subpixel-antialiased]
                <div className='scroll-gutter-both origin-center overflow-y-auto scrollbar-thin [--scrollbar-thumb:--color-bars-post]' /*   */>
                    <div className='relative flex size-full flex-col px-3 [--image-outline-width:theme(outlineWidth[2])] [--image-transition-duration:theme(transitionDuration.500)] sm:py-6 xl:py-8'>
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
                </div>
            ) : (
                <></>
            )}
        </main>
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
                            className='size-full skew-x-[calc(var(--clip-shape-angle-rad)*-1)] scale-105'
                        />
                    ) : (
                        <img src={(showCase as Post_ShowCase_Image).imgUrl} className='skew-x-[calc(var(--clip-shape-angle-rad)*-1)] scale-105' />
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
                                'text-pretty text-justify leading-tight tracking-wide sm:leading-normal' /* skew-x-[calc(var(--clip-shape-angle-rad)*-1)] */,
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
                            className='skew-x-[calc(var(--clip-shape-angle-rad)*-1)] scale-105 cursor-pointer object-cover'
                            onClick={() => setLightBoxSlide(imageIndex)}
                        />
                    </div>
                ) : null;
            })}
        </div>
    );
};

const Menu: FC<{
    hasImages: boolean;
    codeLink: Post['codeLink'];
    setLightboxTo: React.Dispatch<React.SetStateAction<number | null>>;
}> = ({ hasImages, codeLink, setLightboxTo }) => {
    const { catId } = useParams();

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
        <menu className='pointer-events-auto mb-2 ml-auto flex h-8 items-center justify-end rounded-tl bg-transparent sm:mb-0 sm:h-6 sm:rounded-tl-sm sm:rounded-tr-sm sm:bg-[--color-bars-post]'>
            {hasImages && (
                <button
                    type='button'
                    className='h-full cursor-pointer px-1.5 py-0.5 text-sm uppercase transition-colors duration-75 before:absolute before:-top-full before:right-0 before:-z-10 before:hidden before:translate-y-full before:pt-2 before:leading-none before:text-[--theme-secondary-50] before:transition-transform before:duration-100 hover:before:translate-y-0 hover:before:content-["Gallery"] active:before:translate-y-0 active:before:transition-none active:before:content-["Gallery"] sm:px-1 sm:pb-0 sm:before:block sm:before:pt-2'
                    onClick={() => setLightboxTo(0)}
                >
                    <PhotoIcon className='aspect-square h-full stroke-[--color-bars-no-post] hover:stroke-[--theme-accent-800] active:stroke-[--theme-accent-800]' />
                </button>
            )}

            {codeLink && (
                <>
                    <div className='h-3/5 w-0.5 bg-[--theme-primary-600] sm:-mb-0.5' />
                    <a
                        className='group inline-block h-full cursor-pointer px-1.5 py-0.5 transition-colors duration-75 before:absolute before:-top-full before:right-0 before:-z-10 before:hidden before:translate-y-full before:text-nowrap before:pt-2 before:text-sm before:uppercase before:leading-none before:text-[--theme-secondary-50] before:transition-transform before:duration-100 after:content-none hover:before:translate-y-0 hover:before:content-["View_Code"] sm:px-1 sm:pb-0 sm:before:block sm:before:pt-2'
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
                    </a>
                </>
            )}

            {/* TODO fade out instead of instantly closing */}
            {(hasImages || codeLink) && <div className='h-3/5 w-0.5 bg-[--theme-primary-600] sm:-mb-0.5' />}
            <Link
                to={`/${catId}`}
                className='h-full cursor-pointer px-1 py-0.5 text-sm uppercase transition-colors duration-75 before:absolute before:-top-full before:right-0 before:-z-10 before:hidden before:translate-y-full before:pt-2 before:leading-none before:text-[--theme-secondary-50] before:transition-transform before:duration-100 hover:before:translate-y-0 hover:before:content-["Close"] sm:px-0.5 sm:pb-0 sm:before:block sm:before:pt-2'
            >
                <XMarkIcon className='aspect-square h-full stroke-[--color-bars-no-post] hover:stroke-[--theme-accent-800] active:stroke-[--theme-accent-800]' />
            </Link>
        </menu>
    );
};
