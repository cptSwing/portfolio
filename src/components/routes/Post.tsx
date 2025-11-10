import { CSSProperties, FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Lightbox, { SlideImage } from 'yet-another-react-lightbox';
import { Captions, Counter } from 'yet-another-react-lightbox/plugins';
// import 'yet-another-react-lightbox/styles.css';
// import 'yet-another-react-lightbox/plugins/captions.css';
// import 'yet-another-react-lightbox/plugins/counter.css';
import { parseDateString } from 'cpts-javascript-utilities';
import { Post_Showcase_Image, Post as Post_T } from '../../types/types';
import { getHexagonalClipPath } from '../../lib/shapeFunctions';
import PostDetails from '../PostDetails';
import GetChildSize from '../utilityComponents/GetChildSize';
import GetChildSizeContext from '../../contexts/GetChildSizeContext';
import usePostIndexNavigation from '../../hooks/usePostIndexNavigation';
import useMountTransition from '../../hooks/useMountTransition';
import { useZustand } from '../../lib/zustand';
import PostContents from '../PostContents';
import constructThumbnailUrl from '../../lib/constructThumbnailUrl';

const emptyPost: Post_T = {
    id: -1,
    title: '',
    date: '',
    textBlocks: [],
};

const Post: FC<{ show: boolean }> = ({ show }) => {
    const post = useZustand((store) => store.values.routeData.content.post) ?? emptyPost;
    const { title, cardImage, cardImagePosition, subTitle, stack, clients, liveViews, source, showcases, textBlocks, date } = post;

    const postRef = useRef<HTMLDivElement | null>(null);
    const shouldMount = useMountTransition(postRef, show, ['!clip-inset-[-10%]']);
    usePostIndexNavigation(show);

    const [lightboxImages, setLightboxImages] = useState<LightboxSlideImage[]>();
    const [remainingImages, setRemainingImages] = useState<[Post_Showcase_Image, number][]>();

    useEffect(() => {
        if (showcases?.length) {
            const lightboxImgs: LightboxSlideImage[] = [];
            const remainingImgs: [Post_Showcase_Image, number][] = [];

            showcases.forEach((showcase, showcaseIndex) => {
                if ('imgUrl' in showcase) {
                    lightboxImgs.push({
                        src: showcase.imgUrl,
                        title: <div style={{ textAlign: 'center' }}>{showcase.caption}</div>,
                        scIndx: showcaseIndex,
                    });

                    if (!textBlocks.find((textBlock) => showcaseIndex === textBlock.showcaseIndex)) {
                        remainingImgs.push([showcase, showcaseIndex]);
                    }
                }
            });

            if (lightboxImgs.length) setLightboxImages(lightboxImgs);
            if (remainingImgs.length) setRemainingImages(remainingImgs);
        }

        return () => {
            setLightboxImages(undefined);
            setRemainingImages(undefined);
        };
    }, [showcases, textBlocks]);

    const [lightboxTo, setLightboxTo] = useState<number | null>(null);

    /* Lightbox uses SlideImage Type, so pick correct SlideImage index from Post_Showcase index */
    const setLightBoxSlide_Cb = useCallback(
        (showcaseIndex: number) => {
            lightboxImages && setLightboxTo(lightboxImages.findIndex((slide) => slide.scIndx === showcaseIndex));
        },
        [lightboxImages],
    );

    return shouldMount ? (
        <div
            ref={postRef}
            className="fixed bottom-[5dvh] left-[2dvw] right-[2dvw] top-[5dvh] bg-theme-text-background px-[4.75%] py-[1%] text-theme-text transition-[clip-path] duration-[calc(var(--ui-animation-menu-transition-duration)*1.5)] clip-inset-x-[45%] sm:absolute sm:bottom-[unset] sm:left-[unset] sm:right-[unset] sm:top-[unset] sm:size-full"
        >
            <header className="pointer-events-none absolute -top-3 left-0 right-0 z-10 mx-auto flex items-start justify-center text-center">
                <GetChildSize context={GetChildSizeContext}>
                    <FloatingHeader title={title} />
                </GetChildSize>
            </header>

            <main className="scroll-gutter-both flex size-full origin-center flex-col overflow-y-scroll pr-[2%] pt-[5%] scrollbar-thin">
                {/* (Sub-)Header, date, "Stack" etc  */}
                <div>
                    <div className="my-2 flex h-auto flex-wrap items-end justify-between font-lato text-xs font-semibold leading-none tracking-tight text-theme-primary-darker sm:text-3xs md:text-2xs xl:text-xs">
                        <GetChildSize context={GetChildSizeContext}>
                            <PostDate date={parseDateString(date ?? '')} />
                        </GetChildSize>
                        <PostDetails stack={stack} clients={clients} liveViews={liveViews} source={source} />
                    </div>
                    <span className="block font-fjalla-one sm:text-lg sm:tracking-normal md:text-xl lg:text-2xl">{subTitle}</span>
                </div>

                <PostContents
                    textBlocks={textBlocks}
                    showcases={showcases}
                    cardImage={cardImage}
                    cardImagePosition={cardImagePosition}
                    setLightBoxSlide={setLightBoxSlide_Cb}
                />

                {/* Gallery below text */}
                {remainingImages && <RemainingImageGallery remainingImages={remainingImages} setLightBoxSlide={setLightBoxSlide_Cb} />}

                <Lightbox
                    open={Number.isInteger(lightboxTo)}
                    index={lightboxTo ?? 0}
                    close={() => setLightboxTo(null)}
                    slides={lightboxImages}
                    plugins={[Captions, Counter]}
                    captions={{ descriptionTextAlign: 'center' }}
                />
            </main>
        </div>
    ) : null;
};

export default Post;

const FloatingHeader: FC<{ title: string | undefined }> = ({ title }) => {
    const containerSize = useContext(GetChildSizeContext);
    const clipPath_Memo = useMemo(() => getHexagonalClipPath(0.6, containerSize, { multipliers: { y: 0.9 }, shape: 'bottom' }), [containerSize]);

    return (
        <div
            className="before-glassmorphic-backdrop relative select-none px-[4%] font-fjalla-one text-2xl font-semibold text-white before:absolute before:!top-1.5 before:left-[-10%] before:-z-10 before:!h-[90%] before:!w-[120%] before:bg-theme-primary-darker/15 before:[--glassmorphic-backdrop-blur:4px] before:[--glassmorphic-backdrop-saturate:2.5] before:[clip-path:--post-title-clip-path] sm:tracking-wider lg:text-4xl lg:tracking-wide"
            style={
                {
                    '--post-title-clip-path': clipPath_Memo,
                } as CSSProperties
            }
        >
            {title}
        </div>
    );
};

const PostDate: FC<{ date: { year?: string; month?: string; day?: string } }> = ({ date: { year, month, day } }) => {
    const containerSize = useContext(GetChildSizeContext);
    const clipPath_Memo = useMemo(() => getHexagonalClipPath(1, containerSize, { shape: 'top-right' }), [containerSize]);

    return (
        <span className="flex h-4 items-center justify-center bg-theme-primary-lighter pl-2 pr-4" style={{ clipPath: clipPath_Memo }}>
            {day && `${day}.`}
            {month && `${month}.`}
            {year && `${year}`}
        </span>
    );
};

const RemainingImageGallery: FC<{
    remainingImages: [Post_Showcase_Image, number][];
    setLightBoxSlide: (showcaseIndex: number) => void;
}> = ({ remainingImages, setLightBoxSlide }) => (
    <div className="mt-12 grid gap-3 sm:grid-cols-2 sm:items-start md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {remainingImages.map(([{ imgUrl, caption, hasThumbnail }, imageIndex]) => {
            return (
                <button
                    key={imgUrl + imageIndex}
                    className="group max-h-48 w-full transform-gpu overflow-hidden transition-transform duration-75 hover-active:scale-[1.01] hover-active:brightness-110"
                    onClick={handleClick}
                >
                    <img src={hasThumbnail === false ? imgUrl : constructThumbnailUrl(imgUrl)} alt={caption} className="size-full object-cover" />
                </button>
            );

            function handleClick() {
                setLightBoxSlide(imageIndex);
            }
        })}
    </div>
);

/* Local Types */

type LightboxSlideImage = SlideImage & {
    scIndx: number;
};
