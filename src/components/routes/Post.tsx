import { CSSProperties, FC, useCallback, useContext, useMemo, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import Lightbox, { SlideImage } from 'yet-another-react-lightbox';
import { Captions, Counter } from 'yet-another-react-lightbox/plugins';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import { classNames, parseDateString } from 'cpts-javascript-utilities';
import { Post as Post_T, Post_ShowCase, Post_ShowCase_Image, Post_ShowCase_Youtube } from '../../types/types';
import { getHexagonalClipPath } from '../../lib/shapeFunctions';
import PostDetails from '../PostDetails';
import GetChildSize from '../utilityComponents/GetChildSize';
import GetChildSizeContext from '../../contexts/GetChildSizeContext';
import usePostNavigation from '../../hooks/usePostNavigation';
import useMountTransition from '../../hooks/useMountTransition';
import { useZustand } from '../../lib/zustand';

const emptyPost: Post_T = {
    id: -1,
    title: '',
    date: '',
    textBlocks: [],
};

const Post: FC<{ show: boolean }> = ({ show }) => {
    const post = useZustand((store) => store.values.routeData.content.post) ?? emptyPost;

    const postRef = useRef<HTMLDivElement | null>(null);
    const shouldMount = useMountTransition(postRef, show, ['!clip-inset-x-0']);

    const { title, subTitle, stack, clients, viewLive, viewSource, showCases, textBlocks, date } = post;
    usePostNavigation();

    const date_Memo = useMemo(() => parseDateString(date ?? ''), [date]);

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

    return shouldMount ? (
        <div
            ref={postRef}
            className="absolute top-0 mx-auto h-full w-[86.66%] bg-theme-text-background px-[5%] pb-4 text-theme-text transition-[clip-path] duration-[--ui-animation-menu-transition-duration] clip-inset-t-[-10%] clip-inset-x-[100%] sm:size-full sm:px-[4.7%] sm:pt-10 md:px-[4.95%] lg:px-[5%] lg:pt-12 2xl:px-[4.2%]"
        >
            <header className="pointer-events-none absolute -top-3 left-0 right-0 z-10 mx-auto flex items-start justify-center text-center">
                <GetChildSize context={GetChildSizeContext}>
                    <FloatingHeader title={title} />
                </GetChildSize>
            </header>

            <main className="scroll-gutter-both flex size-full origin-center flex-col overflow-y-scroll scrollbar-thin sm:pr-[2%] xl:pr-[1.5%]">
                {/* (Sub-)Header, date, "Stack" etc  */}
                <div>
                    <span className="block sm:text-lg md:text-xl lg:text-2xl">{subTitle}</span>
                    <div className="flex flex-wrap items-center justify-between sm:my-1 sm:gap-y-0.5 lg:my-2 lg:gap-y-1">
                        <GetChildSize context={GetChildSizeContext}>
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
    ) : null;
};

export default Post;

const FloatingHeader: FC<{ title: string | undefined }> = ({ title }) => {
    const parentSize = useContext(GetChildSizeContext);
    const clipPath_Memo = useMemo(() => getHexagonalClipPath(0.6, parentSize, { multipliers: { y: 0.9 }, shape: 'bottom' }), [parentSize]);

    return (
        <span
            className="select-none px-[4%] font-fjalla-one font-semibold text-theme-text-background drop-shadow-lg before:absolute before:left-0 before:top-1.5 before:-z-10 before:h-[90%] before:w-full before:bg-theme-primary before:[clip-path:--post-title-clip-path] sm:text-2xl sm:tracking-wider lg:text-3xl lg:tracking-wide"
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
            className="block bg-theme-primary-lighter py-1 pl-2 pr-4 font-lato text-sm leading-none text-theme-primary-darker"
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
        <div className="first-of-type:mt-0 sm:my-3 sm:text-xs md:my-5 md:text-sm">
            {showCase && (
                <div
                    className={classNames('group max-h-64 w-full max-w-[40%]', isBlockIndexEven ? 'float-right sm:ml-4 md:ml-5' : 'float-left sm:mr-4 md:mr-5')}
                >
                    {(showCase as Post_ShowCase_Youtube).youtubeUrl ? (
                        <iframe
                            src={(showCase as Post_ShowCase_Youtube).youtubeUrl.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/')}
                            title="YouTube video player"
                            referrerPolicy="strict-origin-when-cross-origin"
                            loading="lazy"
                            allowFullScreen
                            className="aspect-video size-full shadow-md shadow-theme-primary-darker/10 transition-[box-shadow] duration-75 group-hover-active:shadow-theme-primary-darker/20"
                        />
                    ) : (
                        <button
                            onClick={handleClick}
                            className="relative transform-gpu shadow-md shadow-theme-primary-darker/10 transition-[box-shadow,transform] duration-75 group-hover-active:scale-[1.01] group-hover-active:shadow-theme-primary-darker/20 group-hover-active:brightness-105"
                        >
                            <img src={constructThumbsUrl((showCase as Post_ShowCase_Image).imgUrl)} alt={showCase.caption} className="size-full object-cover" />
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
                                'text-pretty text-justify sm:mb-4 md:mb-5',
                                blockIndex === 0
                                    ? 'first-of-type:first-letter:-ml-0.5 first-of-type:first-letter:align-text-bottom first-of-type:first-letter:text-[1.5rem] first-of-type:first-letter:leading-[1.475rem] first-of-type:first-letter:text-red-800'
                                    : '',
                            )}
                        >
                            {children}
                        </p>
                    ),
                    h5: ({ children }) => <h5 className="w-fit">{children}</h5>,
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
    textBlocks: Post_T['textBlocks'];
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
        <div className="grid items-start gap-3 pb-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {remaining_Memo.map((remain) => {
                const [showCase, imageIndex] = remain || [];

                function handleClick() {
                    imageIndex && setLightBoxSlide(imageIndex);
                }

                if (!showCase || typeof imageIndex != 'number') {
                    return null;
                } else {
                    return (
                        <button
                            key={showCase.imgUrl + imageIndex}
                            className="group max-h-48 w-full transform-gpu overflow-hidden shadow-md shadow-theme-primary-darker/10 transition-[transform,box-shadow] duration-75 hover-active:scale-[1.01] hover-active:shadow-theme-primary-darker/20 hover-active:brightness-110"
                            onClick={handleClick}
                        >
                            <img src={constructThumbsUrl(showCase.imgUrl)} alt={showCase.caption} className="object-cover" />
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
