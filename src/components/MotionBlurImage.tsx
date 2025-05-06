import { CSSProperties, FC } from 'react';
import classNames from '../lib/classNames';
import { placeholders } from '../config/config.json';

const MotionBlurImage: FC<{
    isAtFront: boolean;
    imgUrl?: string;
    altText: string;
    blurElementRef: React.MutableRefObject<HTMLDivElement | null>;
}> = ({ isAtFront, imgUrl = placeholders.cardImage, altText, blurElementRef }) => {
    return (
        <>
            {/* Clipped/Skewed Parent */}
            <div
                ref={blurElementRef}
                className='absolute size-full opacity-0 transition-opacity duration-[--motion-range-opacity-duration] [--motion-range-opacity-duration:150ms]'
            >
                {/* Blurred Parent & Child (in :after)*/}
                <div
                    className={classNames(
                        'size-full scale-x-[--motion-blur-parent-scale-x] scale-y-[--motion-blur-parent-scale-y] blur-[--motion-blur-range] transition-[filter] duration-300',
                        'after:absolute after:size-full after:scale-x-[--motion-blur-child-scale-x] after:scale-y-[--motion-blur-child-scale-y] after:bg-cover after:bg-center after:[background-image:var(--motion-blur-image-url)]',
                    )}
                    style={{ '--motion-blur-image-url': `url("${imgUrl}")` } as CSSProperties}
                />
            </div>

            {/* Original Image */}
            <img
                className={classNames(
                    'absolute size-full rounded-[--card-border-radius] object-cover object-center outline outline-1 drop-shadow-md transition-[outline-offset,outline-color] delay-[--card-title-anim-delay] duration-[--card-title-anim-duration]',
                    'hover-active:-outline-offset-1 hover-active:outline-[--color-primary-inactive-cat-bg] hover-active:delay-0 hover-active:duration-[--card-image-anim-duration-hover]',
                    isAtFront
                        ? '-outline-offset-1 outline-[--color-primary-inactive-cat-bg]'
                        : 'outline-offset-[length:--card-titles-inset-padding] outline-transparent',
                )}
                src={imgUrl}
                alt={altText}
            />
        </>
    );
};

export default MotionBlurImage;
