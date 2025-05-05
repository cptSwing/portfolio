import { FC } from 'react';
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
            {/* Blurred Image */}
            <div ref={blurElementRef} className='absolute size-full rounded-[--card-border-radius] transition-[opacity,filter] will-change-transform'>
                <LoadImage imgUrl={imgUrl} />
            </div>

            {/* Original Image */}
            <LoadImage
                imgUrl={imgUrl}
                altText={altText}
                additionalClassNames={classNames(
                    'drop-shadow-md outline outline-1 transition-[outline-offset,outline-color] delay-[--card-title-anim-delay] duration-[--card-title-anim-duration]',
                    'hover-active:-outline-offset-1 hover-active:outline-[--color-primary-inactive-cat-bg] hover-active:delay-0 hover-active:duration-[--card-image-anim-duration-hover]',
                    isAtFront
                        ? '-outline-offset-1 outline-[--color-primary-inactive-cat-bg]'
                        : 'outline-offset-[length:--card-titles-inset-padding] outline-transparent',
                )}
            />
        </>
    );
};

export default MotionBlurImage;

const LoadImage: FC<{ imgUrl: string; altText?: string; additionalClassNames?: string }> = ({ imgUrl, altText, additionalClassNames = '' }) => {
    return (
        <img
            // TODO add fixed image sizes here?
            className={'absolute size-full rounded-[--card-border-radius] object-cover object-center' + ' ' + additionalClassNames}
            src={imgUrl}
            alt={altText}
        />
    );
};
