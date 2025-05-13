import { CSSProperties, FC } from 'react';
import classNames from '../lib/classNames';
import { placeholders } from '../config/config.json';
import { useZustand } from '../lib/zustand';

const MotionBlurImage: FC<{
    isAtFront: boolean;
    imgUrl?: string;
    altText: string;
    blurElementRef: React.MutableRefObject<HTMLDivElement | null>;
}> = ({ imgUrl = placeholders.cardImage, altText, blurElementRef }) => {
    const applyFlipMotionBlur = useZustand(({ values }) => values.debug.applyFlipMotionBlur);

    return (
        <>
            {/* Clipped/Skewed Parent */}
            {applyFlipMotionBlur && (
                <div ref={blurElementRef} className='absolute size-full opacity-0 transition-opacity duration-[--card-image-anim-hover-duration]'>
                    {/* Blurred Parent (& Child in ::after)*/}
                    <div
                        className={classNames(
                            'size-full scale-x-[--motion-blur-parent-scale-x] scale-y-[--motion-blur-parent-scale-y] blur-[--motion-blur-range] transition-[filter] duration-[--card-image-anim-duration]',
                            'after:absolute after:size-full after:scale-x-[--motion-blur-child-scale-x] after:scale-y-[--motion-blur-child-scale-y] after:bg-cover after:bg-center after:[background-image:var(--motion-blur-image-url)]',
                        )}
                        style={{ '--motion-blur-image-url': `url("${imgUrl}")` } as CSSProperties}
                    />
                </div>
            )}

            {/* Original Image */}
            <img
                className='absolute size-full skew-x-[calc(var(--clip-shape-angle-rad)*-1)] scale-110 object-cover object-center drop-shadow-md'
                src={imgUrl}
                alt={altText}
            />
        </>
    );
};

export default MotionBlurImage;
