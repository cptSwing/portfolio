import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import Markdown from 'react-markdown';
import { useParams, useNavigate } from 'react-router-dom';
import remarkBreaks from 'remark-breaks';
import Lightbox, { SlideImage } from 'yet-another-react-lightbox';
import { Captions, Counter } from 'yet-another-react-lightbox/plugins';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import classNames from '../../lib/classNames';
import parseDateString from '../../lib/parseDateString';
import { DataBase, Post, Post_ShowCase, Post_ShowCase_Image, Post_ShowCase_Youtube } from '../../types/types';
import testDb from '../../queries/testDb.json';
import { useZustand } from '../../lib/zustand';

const testDbTyped = testDb as DataBase;
const store_setPostNavState = useZustand.getState().methods.store_setPostNavState;

const DisplayPost = () => {
    const { catId, postId } = useParams();
    const navigate = useNavigate();

    const activeCategory_Memo = useMemo(() => Object.values(testDbTyped).find((category) => category.id.toString() === catId), [catId]);
    const activePost_Memo = useMemo(
        () => activeCategory_Memo && activeCategory_Memo.posts.find((post) => post.id.toString() === postId),
        [activeCategory_Memo, postId],
    );

    const { title, subTitle, /* toolsUsed, */ showCases, textBlocks, date, id } = activePost_Memo ?? {};

    /* Nav menu logic */
    const postNavState = useZustand((store) => store.values.postNavState);
    useEffect(() => {
        if (postNavState && typeof id === 'number' && activeCategory_Memo?.posts.length) {
            const postIds = activeCategory_Memo.posts.map((post) => post.id);
            const currentIndex = postIds.findIndex((val) => val === id);
            const previousInArray = postIds[currentIndex - 1 >= 0 ? currentIndex - 1 : postIds.length - 1];
            const nextInArray = postIds[currentIndex + 1 < postIds.length ? currentIndex + 1 : 0];

            switch (postNavState) {
                case 'prev':
                    store_setPostNavState(null);
                    navigate(`/${catId}/${previousInArray}`);
                    break;
                case 'next':
                    store_setPostNavState(null);
                    navigate(`/${catId}/${nextInArray}`);
                    break;
                case 'close':
                    store_setPostNavState(null);
                    navigate(`/${catId}`);
                    break;
                default:
                    break;
            }
        }
    }, [activeCategory_Memo, catId, id, navigate, postNavState]);

    const filteredImages_Memo = useMemo(
        () =>
            showCases &&
            (showCases
                .map((showCase, idx) => {
                    if ('imgUrl' in showCase) {
                        return {
                            src: showCase.imgUrl,
                            title: <div style={{ textAlign: 'center' }}>{showCase.caption}</div>,
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
        <div className='absolute left-0 top-0 size-full bg-theme-text-background px-[6%] pb-4 pt-12 text-theme-text transition-[clip-path] clip-inset-r-[--clip-post] clip-inset-t-[-10%]'>
            <header className='pointer-events-none absolute -top-3 left-0 right-0 z-10 mx-auto flex items-start justify-center text-center'>
                {/* Floating Title: */}
                <h2 className='select-none px-4 text-3xl leading-none text-theme-text-background drop-shadow-lg before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:bg-theme-secondary before:clip-inset-t-[25%]'>
                    {title}
                </h2>
            </header>

            <main className='scroll-gutter-both flex size-full origin-center flex-col overflow-y-scroll pr-[1.5%] scrollbar-thin'>
                {/* (Sub-)Header, date, "Built with"  */}
                <h4 className='leading-none'>
                    <span className='text-left'>{subTitle}</span>
                    <span className='text-right text-theme-primary-darker no-underline'>
                        {day && `${day}.`}
                        {month && `${month}.`}
                        {year && `${year}`}
                    </span>
                </h4>

                {textBlocks && (
                    <>
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
                    </>
                )}

                <Lightbox
                    open={Number.isInteger(lightboxTo)}
                    index={lightboxTo ?? 0}
                    close={() => setLightboxTo(null)}
                    slides={filteredImages_Memo}
                    plugins={[Captions, Counter]}
                    captions={{ descriptionTextAlign: 'center' }}
                />
            </main>
        </div>
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

    const handleClick = () => (showCase as Post_ShowCase_Image).imgUrl && lightboxCallback();

    return (
        <div className='my-4'>
            {showCase && (
                <div
                    className={classNames(
                        'group relative aspect-video max-h-64 w-2/5 cursor-pointer drop-shadow-md',
                        isBlockIndexEven ? 'float-right ml-4' : 'float-left mr-4',
                    )}
                >
                    {(showCase as Post_ShowCase_Youtube).youtubeUrl ? (
                        <iframe
                            src={(showCase as Post_ShowCase_Youtube).youtubeUrl.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/')}
                            title='YouTube video player'
                            referrerPolicy='strict-origin-when-cross-origin'
                            allowFullScreen
                            className='size-full'
                        />
                    ) : (
                        <button onClick={handleClick}>
                            <img src={constructThumbsUrl((showCase as Post_ShowCase_Image).imgUrl)} alt={showCase.caption} className='size-full object-cover' />
                        </button>
                    )}
                    {showCase.caption && (
                        <div className='pointer-events-none absolute bottom-0 max-h-full w-full bg-neutral-400 p-1 text-center text-xs text-neutral-50 opacity-30 transition-[background-color,max-height,padding] group-hover-active:opacity-100'>
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
                                'text-pretty text-justify text-sm leading-relaxed tracking-normal',
                                blockIndex === 0
                                    ? 'first-of-type:first-letter:-ml-0.5 first-of-type:first-letter:align-text-bottom first-of-type:first-letter:text-[1.5rem] first-of-type:first-letter:leading-[1.475rem] first-of-type:first-letter:text-red-800'
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

    const handleClick = (imageIndex: number) => setLightBoxSlide(imageIndex);

    return (
        <div className='grid grid-cols-2 gap-2 pb-5 pt-10 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 2xl:grid-cols-5'>
            {remaining_Memo.map((remain) => {
                const [showCase, imageIndex] = remain || [];

                if (!showCase || typeof imageIndex != 'number') return;

                return (
                    <button
                        key={showCase.imgUrl + imageIndex}
                        className='max-h-48 w-full overflow-hidden drop-shadow-sm hover-active:brightness-125'
                        onClick={() => handleClick(imageIndex)}
                        onKeyDown={() => handleClick(imageIndex)}
                    >
                        <img
                            src={constructThumbsUrl(showCase.imgUrl)}
                            alt={showCase.caption}
                            className='skew-x-[calc(var(--clip-shape-skew-angle)*-1)] scale-105 cursor-pointer object-cover'
                        />
                    </button>
                );
            })}
        </div>
    );
};

function constructThumbsUrl(url: string) {
    const splitStrings = url.split('.');
    return splitStrings[0] + '_thumb.' + splitStrings[1];
}
