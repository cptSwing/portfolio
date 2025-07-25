import { CSSProperties, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
import { DataBase, PostType, Post_ShowCase, Post_ShowCase_Image, Post_ShowCase_Youtube } from '../../types/types';
import testDb from '../../queries/testDb.json';
import { useZustand } from '../../lib/zustand';
import { getHexagonalClipPath } from '../../config/hexagonData';
import PostDetails from '../PostDetails';
import GetChildSize from '../GetChildSize';
import GetChildSizeContext from '../../contexts/GetChildSizeContext';

const testDbTyped = testDb as DataBase;
const store_setPostNavState = useZustand.getState().methods.store_setPostNavState;

const Post = () => {
    const { catId, postId } = useParams();
    const navigate = useNavigate();

    const activeCategory_Memo = useMemo(() => Object.values(testDbTyped).find((category) => category.id.toString() === catId), [catId]);
    const activePost_Memo = useMemo(
        () => activeCategory_Memo && activeCategory_Memo.posts.find((post) => post.id.toString() === postId),
        [activeCategory_Memo, postId],
    );

    const { title, subTitle, stack, clients, viewLive, viewSource, showCases, textBlocks, date, id } = activePost_Memo ?? {};
    const date_Memo = useMemo(() => parseDateString(date ?? ''), [date]);

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
                <GetChildSize Context={GetChildSizeContext}>
                    <FloatingHeader title={title} />
                </GetChildSize>
            </header>

            <main className='scroll-gutter-both flex size-full origin-center flex-col overflow-y-scroll pr-[1.5%] scrollbar-thin'>
                {/* (Sub-)Header, date, "Built with"  */}
                <div>
                    <span className='block text-2xl'>{subTitle}</span>
                    <div className='my-2 flex flex-wrap items-center justify-between gap-y-1'>
                        <GetChildSize Context={GetChildSizeContext}>
                            <PostDate date={date_Memo} />
                        </GetChildSize>
                        <PostDetails stack={stack} clients={clients} viewLive={viewLive} viewSource={viewSource} />
                    </div>
                </div>

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

export default Post;

const FloatingHeader: FC<{ title: string | undefined }> = ({ title }) => {
    const parentSize = useContext(GetChildSizeContext);
    const clipPath_Memo = useMemo(() => getHexagonalClipPath(0.6, parentSize, { multipliers: { y: 0.8 }, shape: 'bottom' }), [parentSize]);

    return (
        <span
            className='select-none px-6 text-[3vh] font-bold leading-none text-theme-text-background drop-shadow-lg before:absolute before:left-0 before:top-[0.75vh] before:-z-10 before:h-4/5 before:w-full before:bg-theme-primary before:[clip-path:--post-title-clip-path]'
            style={
                {
                    '--post-title-clip-path': clipPath_Memo,
                } as CSSProperties
            }
        >
            {title}
        </span>
    );
};

const PostDate: FC<{ date: { year?: string; month?: string; day?: string } }> = ({ date: { year, month, day } }) => {
    const parentSize = useContext(GetChildSizeContext);
    const clipPath_Memo = useMemo(() => getHexagonalClipPath(1, parentSize, { shape: 'top-right' }), [parentSize]);

    return (
        <span
            className='block bg-theme-primary-lighter py-1 pl-2 pr-4 text-sm font-semibold leading-none text-theme-primary-darker'
            style={{ clipPath: clipPath_Memo }}
        >
            {day && `${day}.`}
            {month && `${month}.`}
            {year && `${year}`}
        </span>
    );
};

const TextImageBlock: FC<{ text: string; blockIndex: number; showCase?: Post_ShowCase; lightboxCallback: () => void }> = ({
    text,
    blockIndex,
    showCase,
    lightboxCallback,
}) => {
    const isBlockIndexEven = blockIndex % 2 === 0;
    const handleClick = () => (showCase as Post_ShowCase_Image).imgUrl && lightboxCallback();

    return (
        <div className='my-4 first-of-type:mt-0'>
            {showCase && (
                <div className={classNames('group max-h-64 w-full max-w-[40%]', isBlockIndexEven ? 'float-right ml-4' : 'float-left mr-4')}>
                    {(showCase as Post_ShowCase_Youtube).youtubeUrl ? (
                        <iframe
                            src={(showCase as Post_ShowCase_Youtube).youtubeUrl.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/')}
                            title='YouTube video player'
                            referrerPolicy='strict-origin-when-cross-origin'
                            loading='lazy'
                            allowFullScreen
                            className='aspect-video size-full shadow-md shadow-theme-primary-darker/10 transition-[box-shadow] duration-75 group-hover-active:shadow-theme-primary-darker/20'
                        />
                    ) : (
                        <button
                            onClick={handleClick}
                            className='relative shadow-md shadow-theme-primary-darker/10 transition-[box-shadow] duration-75 group-hover-active:shadow-theme-primary-darker/20'
                        >
                            <img
                                src={constructThumbsUrl((showCase as Post_ShowCase_Image).imgUrl)}
                                alt={showCase.caption}
                                className='size-full object-cover transition-transform duration-75 hover-active:scale-[1.01]'
                            />
                            {showCase.caption && (
                                <div
                                    className={classNames(
                                        'pointer-events-none absolute top-full w-full p-1 text-xs text-neutral-600 opacity-50',
                                        isBlockIndexEven ? 'text-right' : 'text-left',
                                    )}
                                >
                                    {showCase.caption}
                                </div>
                            )}
                        </button>
                    )}
                </div>
            )}

            <Markdown
                components={{
                    p: ({ children }) => (
                        <p
                            className={classNames(
                                'mb-3 text-pretty text-justify text-sm leading-relaxed tracking-normal',
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
    textBlocks: PostType['textBlocks'];
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
        <div className='grid grid-cols-5 items-start gap-3 pb-5 pt-10'>
            {remaining_Memo.map((remain) => {
                const [showCase, imageIndex] = remain || [];

                if (!showCase || typeof imageIndex != 'number') {
                    return null;
                } else {
                    return (
                        <button
                            key={showCase.imgUrl + imageIndex}
                            className='group max-h-48 w-full overflow-hidden shadow-md shadow-theme-primary-darker/10 transition-[transform,box-shadow] duration-75 hover-active:scale-[1.03] hover-active:shadow-theme-primary-darker/20 hover-active:brightness-110'
                            onClick={() => handleClick(imageIndex)}
                            onKeyDown={() => handleClick(imageIndex)}
                        >
                            <img src={constructThumbsUrl(showCase.imgUrl)} alt={showCase.caption} className='object-cover' />
                        </button>
                    );
                }
            })}
        </div>
    );
};

function constructThumbsUrl(url: string) {
    const splitStrings = url.split('.');
    return splitStrings[0] + '_thumb.' + splitStrings[1];
}
