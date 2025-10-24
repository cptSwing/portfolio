import { classNames } from 'cpts-javascript-utilities';
import { FC } from 'react';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import isNumber from '../lib/isNumber';
import { Post_Showcase, Post_Showcase_Image, Post } from '../types/types';
import constructThumbnailUrl from '../lib/constructThumbnailUrl';

const PostContents: FC<{
    textBlocks: Post['textBlocks'];
    showcases?: Post_Showcase[];
    cardImage?: Post['cardImage'];
    cardImagePosition: Post['cardImagePosition'];
    setLightBoxSlide: (showcaseIndex: number) => void;
}> = ({ textBlocks, showcases, cardImage, cardImagePosition, setLightBoxSlide }) =>
    textBlocks.map(({ text, showcaseIndex }, blockIndex) => {
        const showcase = showcases && isNumber(showcaseIndex) ? showcases[showcaseIndex!] : undefined;
        return (
            <TextImageBlock
                key={`${blockIndex}-${showcaseIndex}`}
                text={text}
                blockIndex={blockIndex}
                showcase={showcase}
                cardImage={cardImage}
                cardImagePosition={cardImagePosition}
                lightboxCallback={() => isNumber(showcaseIndex) && setLightBoxSlide(showcaseIndex!)}
            />
        );
    });

export default PostContents;

const TextImageBlock: FC<{
    text: string;
    blockIndex: number;
    showcase?: Post_Showcase;
    cardImage?: string;
    cardImagePosition: Post['cardImagePosition'];
    lightboxCallback: () => void;
}> = ({ text, blockIndex, showcase, cardImage, cardImagePosition, lightboxCallback }) => {
    const isFirst = blockIndex === 0;
    const isEvenIndex = blockIndex % 2 === 0;

    return (
        <div className="flow-root sm:my-4 sm:text-xs md:my-8 md:text-sm">
            {isFirst && cardImage ? (
                <CardImageClipped cardImage={cardImage} cardImagePosition={cardImagePosition} />
            ) : showcase ? (
                <Showcase showcase={showcase} isEvenIndex={isEvenIndex} lightboxCallback={lightboxCallback} />
            ) : null}

            <Markdown
                components={{
                    p: ({ children }) => (
                        <p
                            className={classNames(
                                'whitespace-normal text-pretty text-left last-of-type:mb-0 sm:mb-4 md:mb-5',
                                isFirst
                                    ? 'first-of-type:first-letter:-ml-0.5 first-of-type:first-letter:align-text-bottom first-of-type:first-letter:text-[1.5rem] first-of-type:first-letter:leading-[1.475rem] first-of-type:first-letter:text-red-800'
                                    : '',
                            )}
                        >
                            {children}
                        </p>
                    ),
                }}
                remarkPlugins={[remarkBreaks]}
            >
                {text}
            </Markdown>
        </div>
    );
};

// TODO adjust scale per screen size
const CardImageClipped: FC<{ cardImage: string; cardImagePosition: Post['cardImagePosition'] }> = ({ cardImage, cardImagePosition }) => {
    return (
        <div className="relative float-right h-[calc(var(--hexagon-clip-path-height)*var(--post-contents-card-image-scale))] w-[calc(var(--hexagon-clip-path-width)*var(--post-contents-card-image-scale))] [--post-contents-card-image-scale:2.5] [shape-outside:circle(calc(var(--hexagon-clip-path-width)/2*var(--post-contents-card-image-scale)))]">
            <div className="aspect-hex-flat w-[--hexagon-clip-path-width] origin-top-left matrix-scale-[--post-contents-card-image-scale] [clip-path:--hexagon-clip-path-full] after:absolute after:left-0 after:top-0 after:size-full after:bg-theme-primary-lighter after:matrix-scale-[1.07] after:[clip-path:--hexagon-clip-path-full-wider-stroke]">
                <img src={cardImage} alt=" " className="size-full object-cover" style={{ objectPosition: cardImagePosition }} />
            </div>
        </div>
    );
};

const Showcase: FC<{
    showcase: Post_Showcase;
    isEvenIndex: boolean;
    lightboxCallback: () => void;
}> = ({ showcase, isEvenIndex, lightboxCallback }) => {
    const showcaseHasImage = 'imgUrl' in showcase;

    return showcaseHasImage ? (
        <InlineImageButton showcase={showcase} isEvenIndex={isEvenIndex} lightboxCallback={lightboxCallback} />
    ) : (
        <iframe
            src={showcase.youtubeUrl.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/')}
            title="YouTube video player"
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
            allowFullScreen
            className={classNames(
                'aspect-video w-[55%] outline outline-2 outline-offset-2 outline-theme-primary-lighter hover-active:outline-theme-primary/50',
                isEvenIndex ? 'float-right sm:ml-4 md:ml-6' : 'float-left sm:mr-4 md:mr-6',
            )}
        />
    );
};

const InlineImageButton: FC<{ showcase: Post_Showcase_Image; isEvenIndex: boolean; lightboxCallback: () => void }> = ({
    showcase,
    isEvenIndex,
    lightboxCallback,
}) => {
    return (
        <button
            onClick={showcase ? handleClick : undefined}
            className={classNames(
                'group relative aspect-video w-[55%] outline outline-2 outline-offset-2 outline-theme-primary-lighter hover-active:outline-theme-primary/50',
                isEvenIndex ? 'float-right sm:ml-4 md:ml-6' : 'float-left sm:mr-4 md:mr-6',
                showcase ? ' ' : 'pointer-events-none',
            )}
        >
            <img
                src={showcase.hasThumbnail === false ? showcase.imgUrl : constructThumbnailUrl(showcase.imgUrl)}
                alt={showcase.caption}
                className="size-full object-cover"
            />
            {showcase.caption && (
                <span
                    className={classNames(
                        'absolute bottom-0 left-0 z-10 h-4 w-full bg-theme-secondary/30 font-lato text-xs font-bold text-theme-primary-darker group-hover-active:bg-theme-secondary',
                        isEvenIndex ? 'pr-1.5 text-right' : 'pl-1.5 text-left',
                    )}
                >
                    {showcase.caption}
                </span>
            )}
        </button>
    );

    function handleClick() {
        if ((showcase as Post_Showcase_Image).imgUrl) {
            lightboxCallback();
        }
    }
};
